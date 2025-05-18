
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Loader2 } from 'lucide-react';
import { type ProjectData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from './ProjectContext';

interface StorylineTabProps {
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
}

interface Storyline {
  id: string;
  title: string;
  description: string;
  tags: string[];
  full_story: string;
  is_selected: boolean;
}

const StorylineTab = ({ projectData, updateProjectData }: StorylineTabProps) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [selectedStoryline, setSelectedStoryline] = useState<Storyline | null>(null);
  const [alternativeStorylines, setAlternativeStorylines] = useState<Storyline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { projectId: contextProjectId, saveProjectData } = useProject();
  const navigate = useNavigate();
  const params = useParams();
  
  // Determine the project ID to use (URL param takes precedence)
  const currentProjectId = params.id || contextProjectId;

  // Fetch storylines when component mounts or when project ID changes
  useEffect(() => {
    if (currentProjectId) {
      fetchStorylines();
    } else {
      // If no project ID, clear state and stop loading
      setSelectedStoryline(null);
      setAlternativeStorylines([]);
      setIsLoading(false);
    }
  }, [currentProjectId]);

  const fetchStorylines = async () => {
    if (!currentProjectId) return;

    setIsLoading(true);
    try {
      // Fetch selected storyline
      const { data: selectedData, error: selectedError } = await supabase
        .from('storylines')
        .select('*')
        .eq('project_id', currentProjectId)
        .eq('is_selected', true)
        .maybeSingle(); // Use maybeSingle to handle not found gracefully

      if (selectedError && selectedError.code !== 'PGRST116') { // Ignore 'not found' error
        throw selectedError;
      }

      // Fetch alternative storylines
      const { data: alternativesData, error: alternativesError } = await supabase
        .from('storylines')
        .select('*')
        .eq('project_id', currentProjectId)
        .eq('is_selected', false)
        .order('created_at', { ascending: false });

      if (alternativesError) {
        throw alternativesError;
      }

      // Update states based on fetched data
      if (selectedData) {
        setSelectedStoryline(selectedData);
        setCharacterCount(selectedData.full_story?.length || 0);
      } else {
        setSelectedStoryline(null);
        setCharacterCount(0);
      }

      setAlternativeStorylines(alternativesData || []);
      
    } catch (error: any) {
      console.error("Error fetching storylines:", error);
      toast.error(`Failed to load storylines: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorylineChange = async (storylineToSelect: Storyline) => {
    if (!currentProjectId || !storylineToSelect || storylineToSelect.is_selected) return;

    const previousSelected = selectedStoryline; // Store previous for UI update

    try {
      // Optimistic UI update
      setSelectedStoryline(storylineToSelect);
      setCharacterCount(storylineToSelect.full_story?.length || 0);
      setAlternativeStorylines(prev => 
        prev.filter(s => s.id !== storylineToSelect.id)
          .concat(previousSelected ? [{ ...previousSelected, is_selected: false }] : [])
      );

      // Update the is_selected flag in the database
      const { error: selectError } = await supabase
        .from('storylines')
        .update({ is_selected: true })
        .eq('id', storylineToSelect.id);

      if (selectError) {
        throw selectError;
      }

      // Deselect the previous selected storyline if exists
      if (previousSelected) {
        const { error: deselectError } = await supabase
          .from('storylines')
          .update({ is_selected: false })
          .eq('id', previousSelected.id);

        if (deselectError) {
          console.warn('Error deselecting previous storyline:', deselectError);
          // Continue anyway as the main operation succeeded
        }
      }

      // Update the project's selected_storyline_id
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({ selected_storyline_id: storylineToSelect.id })
        .eq('id', currentProjectId);

      if (projectUpdateError) {
        console.warn('Error updating project selected storyline:', projectUpdateError);
        // Continue anyway as the main operation succeeded
      }

      toast.success("Storyline selected");

    } catch (error: any) {
      console.error("Error changing selected storyline:", error);
      toast.error(`Failed to select storyline: ${error.message}`);
      
      // Revert UI changes on error
      setSelectedStoryline(previousSelected);
      setCharacterCount(previousSelected?.full_story?.length || 0);
      setAlternativeStorylines(prev => 
        prev.filter(s => s.id !== previousSelected?.id)
          .concat(storylineToSelect ? [storylineToSelect] : [])
      );
    }
  };

  const handleGenerateMore = async () => {
    // Ensure we have a project ID
    let effectiveProjectId = currentProjectId;
    
    // If no projectId, try to save the project first
    if (!effectiveProjectId) {
      toast.info("Saving project before generating...");
      try {
        const savedId = await saveProjectData();
        if (!savedId) {
          toast.error("Cannot generate storylines: Failed to save project");
          return;
        }
        effectiveProjectId = savedId;
      } catch (error: any) {
        console.error("Error saving project:", error);
        toast.error("Cannot generate storylines: Failed to save project");
        return;
      }
    }

    if (!effectiveProjectId || !user) {
      toast.error("Cannot generate storylines: missing project ID or user not logged in");
      return;
    }

    try {
      setIsGenerating(true);
      
      // Call our edge function with a flag to generate alternative storylines
      const { data, error } = await supabase.functions.invoke('generate-storylines', {
        body: { 
          project_id: effectiveProjectId,
          generate_alternative: true // Add flag to indicate this is for an alternative storyline
        }
      });
      
      if (error) {
        throw new Error(error.message || "Function invocation failed");
      }
      
      // Check the success flag from the response
      if (data && data.success) {
        toast.success(`Generated a new alternative storyline`);
        await fetchStorylines(); // Refresh storylines list
      } else {
        throw new Error(data?.error || data?.message || 'Failed to generate alternative storyline');
      }
    } catch (error: any) {
      console.error("Error generating alternative storyline:", error);
      toast.error(`Failed to generate alternative: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Project title and tags */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{projectData.title || 'Untitled Project'}</h1>
          <div className="flex gap-2 flex-wrap">
            {projectData.format && (
              <Badge className="bg-black text-white hover:bg-zinc-800">
                {projectData.format === 'custom' 
                  ? projectData.customFormat 
                  : projectData.format.charAt(0).toUpperCase() + projectData.format.slice(1)}
              </Badge>
            )}
            {projectData.genre && (
              <Badge className="bg-black text-white hover:bg-zinc-800">{projectData.genre}</Badge>
            )}
            {projectData.tone && (
              <Badge className="bg-black text-white hover:bg-zinc-800">{projectData.tone}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alternative Storylines - Now on the left */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold uppercase">Alternative Storylines</h2>
              
              <Button 
                variant="outline" 
                className="bg-blue-950 border-blue-900 text-blue-400 hover:bg-blue-900"
                onClick={handleGenerateMore}
                disabled={isGenerating || isLoading || !currentProjectId}
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate alternative
                  </>
                )}
              </Button>
            </div>
            
            {isLoading && !selectedStoryline && alternativeStorylines.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : alternativeStorylines.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">
                <p>No alternative storylines yet.</p>
                <p className="mt-2 text-sm">Click "Generate alternative" to create different storyline options based on your concept.</p>
              </div>
            ) : (
              alternativeStorylines.map((storyline) => (
                <Card 
                  key={storyline.id}
                  className="bg-black border-zinc-800 p-4 cursor-pointer hover:border-zinc-700 transition-colors"
                  onClick={() => handleStorylineChange(storyline)}
                >
                  <h3 className="font-medium mb-2">{storyline.title}</h3>
                  <p className="text-sm text-zinc-400 mb-3 line-clamp-3">{storyline.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {storyline.tags && storyline.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        className="bg-zinc-900 text-xs text-zinc-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Main Storyline Editor - Now spans 2 columns */}
          <div className="md:col-span-2">
            <div className="bg-black rounded-lg border border-zinc-800 p-6 min-h-[400px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-zinc-400">Loading your storyline...</span>
                </div>
              ) : selectedStoryline ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-white">{selectedStoryline.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedStoryline.tags && selectedStoryline.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        className="bg-zinc-900 text-zinc-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300 whitespace-pre-line">
                      {selectedStoryline.full_story}
                    </p>
                  </div>
                  <div className="mt-4 text-right text-sm text-zinc-500">
                    {characterCount} characters
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-zinc-400 h-full flex flex-col justify-center items-center">
                  <p className="text-xl font-medium mb-2">No storyline available</p>
                  <p className="mb-8 text-sm">A storyline should have been generated during project setup.</p>
                  <Button 
                    variant="outline" 
                    className="bg-blue-950 border-blue-900 text-blue-400 hover:bg-blue-900"
                    onClick={handleGenerateMore}
                    disabled={isGenerating || !currentProjectId}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate a storyline now
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorylineTab;
