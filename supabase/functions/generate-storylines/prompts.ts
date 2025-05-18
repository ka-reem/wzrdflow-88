
/**
 * Prompt templates for Claude API
 */

export function getStorylineSystemPrompt(isAlternative: boolean): string {
  return `You are a professional screenwriter and AI assistant specialized in creative storytelling and video production planning. 
Your task is to generate ONE compelling storyline based on the provided project details.
**YOUR RESPONSE MUST BE VALID JSON.**

Follow these instructions precisely:
1.  **Storyline Generation:** Create ONE unique storyline. Do NOT provide multiple options unless specifically asked for an alternative.
    *   The storyline should align with the provided concept, genre, tone, and format.
    *   It must have a clear beginning, middle, and end.
${!isAlternative ? `
2.  **Scene Breakdown:** Based ONLY on the storyline you generated, create a detailed scene breakdown.
    *   Number the scenes sequentially starting from 1.
    *   Generate between 5 and 10 scenes, appropriate for the story's length and format.
    *   For each scene, provide: \`scene_number\`, \`title\`, \`description\`, optional \`location\`, \`lighting\`, \`weather\`.
    *   **Crucially, for each scene, also include a \`shot_ideas\` array containing 2-4 brief descriptions (max 25 words each) for potential key shots within that scene (e.g., "Establishing shot of the location", "Close-up on the character's reaction", "Medium shot showing the interaction").**
` : '' }
3.  **Output Format:** Your entire response MUST be a single JSON object and nothing else. Do NOT include any text outside the JSON structure. The JSON structure must be exactly:

{
  "primary_storyline": {
    "title": "Storyline Title",
    "description": "One-paragraph summary (max 200 characters).",
    "tags": ["relevant", "keyword", "tags"],
    "full_story": "Detailed story outline (3-5 paragraphs)."
  }${!isAlternative ? `,
  "scene_breakdown": [
    {
      "scene_number": 1,
      "title": "Scene 1 Title",
      "description": "Detailed scene description...",
      "location": "Location details...",
      "lighting": "Lighting details...",
      "weather": "Weather details...",
      "shot_ideas": [
        "Brief description for shot 1...",
        "Brief description for shot 2...",
        "Brief description for shot 3..."
      ]
    }
  ]` : '' }
}

Ensure the \`description\` in \`primary_storyline\` is concise (max 200 chars). Make \`full_story\` comprehensive. Tags should be relevant keywords.${!isAlternative ? ' Ensure all fields in the `scene_breakdown` array adhere to the specified types, including the new `shot_ideas` array.' : ''}`;
}

export function getStorylineUserPrompt(project: any, isAlternative: boolean): string {
  return `${isAlternative ? 'Please generate a *different* storyline based on the same project details provided previously. Ensure it offers a distinct take or variation. Do NOT include a scene breakdown unless explicitly asked.\n\n' : 'Generate a storyline and scene breakdown for the following project:\n\n'}Project Title: ${project.title || 'Untitled Project'}
Concept/Input: ${project.concept_text || 'No concept provided. Create something imaginative based on other details.'}
Genre: ${project.genre || 'Not specified'}
Tone: ${project.tone || 'Not specified'}
Format: ${project.format || 'Not specified'}
${project.format === 'custom' && project.custom_format_description ? `Custom Format Details: ${project.custom_format_description}\n` : ''}${project.special_requests ? `Special Requests: ${project.special_requests}\n` : ''}${project.product_name ? `Product/Service: ${project.product_name}\n` : ''}${project.target_audience ? `Target Audience: ${project.target_audience}\n` : ''}${project.main_message ? `Main Message: ${project.main_message}\n` : ''}${project.call_to_action ? `Call to Action: ${project.call_to_action}\n` : ''}
Generate ONE storyline ${!isAlternative ? 'and its corresponding scene breakdown ' : ''}in the specified JSON format.

REMEMBER: Your ENTIRE response must be a valid JSON object with no text or explanation before or after it. No markdown, no code blocks, JUST the raw JSON.`;
}

export function getAnalysisSystemPrompt(): string {
  return `Analyze the provided story text. Identify the main characters (max 5) and provide a brief description for each (1-2 sentences based *only* on the text). Optionally, list relevant setting/style keywords (max 10), potential genre, and potential tone if strongly implied. Output MUST be a single JSON object matching this exact structure:

{
  "characters": [ { "name": "...", "description": "..." } ],
  "setting_keywords": [ "...", "..." ],
  "potential_genre": "...",
  "potential_tone": "..."
}

If no characters are found, return an empty array for "characters". If optional fields cannot be determined, omit them or set them to null.`;
}

export function getAnalysisUserPrompt(fullStoryText: string): string {
  return `Analyze the following story:\n\n${fullStoryText}`;
}
