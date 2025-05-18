
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { StorylineResponseData, AnalysisResponseData, SceneInfo } from './types.ts';

/**
 * Database operations for storyline generation
 */

interface SaveResult {
  storyline_id: string;
  scene_count: number;
  character_count: number;
  characters: any[]; 
  updatedSettings: Record<string, any>;
  inserted_shot_ids: string[];
}

interface SceneWithId extends Omit<SceneInfo, 'shot_ideas'> {
  id: string;
  shot_ideas?: string[];
}

export async function saveStorylineData(
  supabaseClient: any,
  project_id: string,
  storylineData: StorylineResponseData,
  isSelected: boolean,
  analysisData: AnalysisResponseData | null,
  isAlternative: boolean
): Promise<SaveResult> {
  // Results to return
  const results: SaveResult = {
    storyline_id: '',
    scene_count: 0,
    character_count: 0,
    characters: [],
    updatedSettings: {} as Record<string, any>,
    inserted_shot_ids: []
  };

  // If generating the initial selected storyline, deselect others first
  if (isSelected) {
    console.log(`Setting storyline as selected. Deselecting others for project ${project_id}...`);
    const { error: deselectError } = await supabaseClient
      .from('storylines')
      .update({ is_selected: false })
      .eq('project_id', project_id)
      .eq('is_selected', true);
      
    if (deselectError) {
      console.warn('Failed to deselect previous storylines:', deselectError.message);
    }
  }

  // Insert the new storyline
  console.log(`Inserting storyline (is_selected: ${isSelected})...`);
  const { data: storyline, error: storylineError } = await supabaseClient
    .from('storylines')
    .insert({
      project_id: project_id,
      title: storylineData.primary_storyline.title,
      description: storylineData.primary_storyline.description,
      full_story: storylineData.primary_storyline.full_story,
      tags: storylineData.primary_storyline.tags,
      is_selected: isSelected,
      generated_by: 'claude-3-5-sonnet'
    })
    .select()
    .single();

  if (storylineError) {
    console.error('Error inserting storyline:', storylineError);
    throw new Error(`Failed to save storyline: ${storylineError.message}`);
  }
  
  console.log(`Storyline ${storyline.id} inserted successfully.`);
  results.storyline_id = storyline.id;

  // Insert scenes if not an alternative
  let scenes: SceneWithId[] = [];
  if (!isAlternative && storylineData.scene_breakdown && Array.isArray(storylineData.scene_breakdown)) {
    console.log(`Inserting ${storylineData.scene_breakdown.length} scenes for storyline ${storyline.id}...`);
    const scenesToInsert = storylineData.scene_breakdown.map(scene => ({
      project_id: project_id,
      storyline_id: storyline.id,
      scene_number: scene.scene_number,
      title: scene.title,
      description: scene.description,
      location: scene.location || null,
      lighting: scene.lighting || null,
      weather: scene.weather || null
    }));

    const { data: insertedScenes, error: scenesError } = await supabaseClient
      .from('scenes')
      .insert(scenesToInsert)
      .select('id, scene_number, description, title');

    if (scenesError) {
      console.error('Error inserting scenes:', scenesError);
      // Continue anyway, as the main operation succeeded
    } else if (insertedScenes) {
      // Map the inserted scenes back with their shot_ideas
      scenes = insertedScenes.map((scene, index) => ({
        ...scene,
        shot_ideas: storylineData.scene_breakdown?.[index]?.shot_ideas || []
      }));
      
      results.scene_count = scenes.length;
      console.log(`${results.scene_count} scenes inserted successfully.`);
      
      // --- UPDATED: Create shots from shot_ideas ---
      if (scenes.length > 0) {
        console.log(`Creating shots based on ideas for ${scenes.length} scenes...`);
        const shotsToInsert: any[] = [];
        
        scenes.forEach(scene => {
          // Use shot_ideas if available, otherwise create a default shot
          const ideas = scene.shot_ideas && scene.shot_ideas.length > 0
            ? scene.shot_ideas
            : [`Scene ${scene.scene_number}: ${scene.description?.substring(0, 80) || scene.title || 'Initial shot'}`];
          
          // Create a shot for each idea
          ideas.forEach((idea, index) => {
            shotsToInsert.push({
              scene_id: scene.id,
              project_id: project_id,
              shot_number: index + 1,
              shot_type: getShotTypeFromIdea(idea),
              prompt_idea: idea,
              image_status: 'pending'
            });
          });
        });
        
        if (shotsToInsert.length > 0) {
          const { data: newShots, error: shotsError } = await supabaseClient
            .from('shots')
            .insert(shotsToInsert)
            .select('id');
            
          if (shotsError) {
            console.error('Error inserting shots:', shotsError);
          } else if (newShots) {
            results.inserted_shot_ids = newShots.map(s => s.id);
            console.log(`Created ${results.inserted_shot_ids.length} shots from ideas.`);
          }
        }
      }
      // --- END UPDATED ---
    }
  }

  // Insert characters if analysis provided them
  if (!isAlternative && analysisData?.characters && analysisData.characters.length > 0) {
    console.log(`Inserting ${analysisData.characters.length} characters from analysis...`);
    const charactersToInsert = analysisData.characters.map(char => ({
      project_id: project_id,
      name: char.name,
      description: char.description
    }));

    const { data: insertedCharacters, error: charactersError } = await supabaseClient
      .from('characters')
      .insert(charactersToInsert)
      .select('id, name');

    if (charactersError) {
      console.error('Error inserting characters:', charactersError);
      // Continue anyway, as this is an optional enhancement
    } else {
      results.characters = insertedCharacters || [];
      results.character_count = results.characters.length;
      console.log(`${results.character_count} characters inserted successfully.`);
    }
  }

  // Prepare project updates if this is the selected storyline
  if (isSelected) {
    results.updatedSettings = {
      selected_storyline_id: storyline.id
    };
    
    // Only update genre/tone if analysis provided them and project doesn't have them
    const { data: currentProject, error: currentProjError } = await supabaseClient
      .from('projects')
      .select('genre, tone')
      .eq('id', project_id)
      .single();
      
    if (currentProjError) {
      console.warn('Could not fetch current project settings:', currentProjError.message);
    } else {
      if (analysisData?.potential_genre && !currentProject.genre) {
        results.updatedSettings.genre = analysisData.potential_genre;
      }
      
      if (analysisData?.potential_tone && !currentProject.tone) {
        results.updatedSettings.tone = analysisData.potential_tone;
      }
    }
  }

  return results;
}

/**
 * Helper function to guess shot type from the idea description
 */
function getShotTypeFromIdea(idea: string): string {
  const lowerIdea = idea.toLowerCase();
  
  if (lowerIdea.includes('close-up') || lowerIdea.includes('closeup')) {
    return 'close-up';
  } else if (lowerIdea.includes('wide shot') || lowerIdea.includes('establishing')) {
    return 'wide';
  } else if (lowerIdea.includes('over the shoulder') || lowerIdea.includes('over-the-shoulder')) {
    return 'over-shoulder';
  } else if (lowerIdea.includes('aerial') || lowerIdea.includes('drone')) {
    return 'aerial';
  } else if (lowerIdea.includes('tracking')) {
    return 'tracking';
  } else if (lowerIdea.includes('medium')) {
    return 'medium';
  }
  
  // Default to medium if no specific type is detected
  return 'medium';
}

export async function updateProjectSettings(
  supabaseClient: any,
  project_id: string,
  settings: Record<string, any>
) {
  if (Object.keys(settings).length > 0) {
    console.log('Updating project with:', settings);
    const { error: projectUpdateError } = await supabaseClient
      .from('projects')
      .update(settings)
      .eq('id', project_id);

    if (projectUpdateError) {
      console.warn('Error updating project:', projectUpdateError.message);
      return false;
    }
    return true;
  }
  return false; // No updates needed
}

export async function triggerCharacterImageGeneration(
  supabaseClient: any,
  project_id: string,
  characters: any[]
) {
  if (characters.length > 0) {
    console.log(`Queueing image generation for ${characters.length} characters...`);
    for (const char of characters) {
      try {
        // Invoke the character image generation function asynchronously
        const { error: invokeError } = await supabaseClient.functions.invoke(
          'generate-character-image',
          {
            body: { character_id: char.id, project_id: project_id }
          }
        );
        
        if (invokeError) {
          console.error(`Failed to invoke generate-character-image for ${char.name} (${char.id}):`, invokeError.message);
        } else {
          console.log(`Successfully invoked image generation for ${char.name} (${char.id}).`);
        }
      } catch (invocationError) {
        console.error(`Caught error during invocation for ${char.name} (${char.id}):`, invocationError.message);
      }
    }
  }
}

export async function triggerShotVisualPromptGeneration(
  supabaseClient: any,
  shotIds: string[]
) {
  if (shotIds && shotIds.length > 0) {
    console.log(`Triggering visual prompt generation for ${shotIds.length} shots...`);
    
    for (const shotId of shotIds) {
      try {
        const { error } = await supabaseClient.functions.invoke('generate-visual-prompt', {
          body: { shot_id: shotId }
        });
        
        if (error) {
          console.error(`Error invoking visual prompt generation for shot ${shotId}:`, error.message);
        } else {
          console.log(`Visual prompt generation successfully invoked for shot ${shotId}.`);
        }
      } catch (invokeError) {
        console.error(`Caught error during visual prompt invocation for shot ${shotId}:`, invokeError.message);
      }
    }
  }
}
