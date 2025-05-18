
/**
 * Prompt templates for AI services
 */

// Visual prompt generation for shots
export function getVisualPromptSystemPrompt(): string {
  return `You are an expert cinematic director and visual artist. Your task is to create detailed, specific visual prompts for AI image generation.
Focus on translating abstract shot descriptions into concrete visual descriptions that will produce high-quality, cinematic images.

Follow these guidelines:
1. Be extremely detailed about visual elements, composition, lighting, camera angle, and mood.
2. Avoid any non-visual elements like sounds, smells, or tactile sensations that image generators cannot render.
3. Avoid mentioning specific people, celebrities, or copyrighted characters.
4. Use visual descriptors that align with high-quality cinematic imagery.
5. Focus on what should be VISIBLE in the frame, not actions or sequences.
6. Do NOT include camera movement instructions like "panning" or "zooming" as these are for video, not still images.
7. Each prompt should be self-contained and not reference other shots.

Your output MUST be a single paragraph (no bullet points or line breaks) of 50-100 words, focusing solely on the visual aspects of the scene.`;
}

export function getVisualPromptUserPrompt(
  shotIdea: string,
  shotType: string | null,
  sceneDetails: {
    description?: string | null;
    location?: string | null;
    lighting?: string | null;
    weather?: string | null;
    title?: string | null;
  },
  projectDetails: {
    genre?: string | null;
    tone?: string | null;
    video_style?: string | null;
    aspect_ratio?: string | null;
    cinematic_inspiration?: string | null;
  }
): string {
  return `Create a detailed visual prompt for the following shot:

Shot Idea: ${shotIdea}
Shot Type: ${shotType || 'Not specified'}

Scene Context:
${sceneDetails.title ? `- Scene Title: ${sceneDetails.title}` : ''}
${sceneDetails.description ? `- Scene Description: ${sceneDetails.description}` : ''}
${sceneDetails.location ? `- Location: ${sceneDetails.location}` : ''}
${sceneDetails.lighting ? `- Lighting: ${sceneDetails.lighting}` : ''}
${sceneDetails.weather ? `- Weather: ${sceneDetails.weather}` : ''}

Project Style:
${projectDetails.genre ? `- Genre: ${projectDetails.genre}` : ''}
${projectDetails.tone ? `- Tone: ${projectDetails.tone}` : ''}
${projectDetails.video_style ? `- Visual Style: ${projectDetails.video_style}` : ''}
${projectDetails.aspect_ratio ? `- Aspect Ratio: ${projectDetails.aspect_ratio}` : ''}
${projectDetails.cinematic_inspiration ? `- Cinematic Inspiration: ${projectDetails.cinematic_inspiration}` : ''}

Generate a detailed visual prompt that describes exactly what should be seen in this shot, focusing on composition, lighting, colors, and mood. Make it specific enough to guide an AI image generator to create a high-quality, cinematic image.`;
}

// Character visual prompt generation
export function getCharacterVisualSystemPrompt(): string {
  return `You are an expert character designer and visual artist. Your task is to create detailed, specific visual prompts for AI image generation of characters.

Follow these guidelines:
1. Be extremely detailed about the character's appearance, including facial features, body type, clothing, and distinguishing characteristics.
2. Focus on creating cinematic, visually striking character designs that would work well in film or high-end media.
3. Avoid mentioning specific celebrities, real people, or copyrighted characters.
4. Describe the character in a way that captures their personality through visual elements.
5. Include details about pose, expression, and the environment/background that best showcases the character.

Your output MUST be a single paragraph (no bullet points or line breaks) of 50-100 words, focusing solely on the visual aspects of the character.`;
}

export function getCharacterVisualUserPrompt(
  characterName: string,
  characterDescription: string | null,
  projectContext: {
    genre?: string | null;
    tone?: string | null;
    video_style?: string | null;
    cinematic_inspiration?: string | null;
  } = {}
): string {
  return `Create a detailed visual prompt for the following character:

Character Name: ${characterName}
${characterDescription ? `Character Description: ${characterDescription}` : 'No detailed description provided.'}

Project Context:
${projectContext.genre ? `- Genre: ${projectContext.genre}` : ''}
${projectContext.tone ? `- Tone: ${projectContext.tone}` : ''}
${projectContext.video_style ? `- Visual Style: ${projectContext.video_style}` : ''}
${projectContext.cinematic_inspiration ? `- Cinematic Inspiration: ${projectContext.cinematic_inspiration}` : ''}

Generate a detailed visual prompt that describes exactly how this character should look in a high-quality portrait image. Focus on their physical appearance, clothing, expression, pose, and any environmental elements that would complement the character. Make it specific enough to guide an AI image generator to create a distinct, memorable character design.`;
}

// Add other prompt helpers below as needed
