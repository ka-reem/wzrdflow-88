export type ModelType = 
  | 'google/gemini-flash-1.5'
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-5-haiku'
  | 'anthropic/claude-3-haiku'
  | 'google/gemini-pro-1.5'
  | 'google/gemini-flash-1.5-8b'
  | 'meta-llama/llama-3.2-1b-instruct'
  | 'meta-llama/llama-3.2-3b-instruct'
  | 'meta-llama/llama-3.1-8b-instruct'
  | 'meta-llama/llama-3.1-70b-instruct'
  | 'openai/gpt-4o-mini'
  | 'groq/llama-3.3-70b-versatile'
  | 'groq/gemma2-9b-it'
  | 'groq/llama3-8b-8192'
  | 'groq/llama3-70b-8192'
  | 'groq/llama-3.1-8b-instant';

export const models: { value: ModelType; label: string }[] = [
  { value: 'google/gemini-flash-1.5', label: 'google/gemini-flash-1.5' },
  { value: 'anthropic/claude-3.5-sonnet', label: 'anthropic/claude-3.5-sonnet' },
  { value: 'anthropic/claude-3-5-haiku', label: 'anthropic/claude-3-5-haiku' },
  { value: 'anthropic/claude-3-haiku', label: 'anthropic/claude-3-haiku' },
  { value: 'google/gemini-pro-1.5', label: 'google/gemini-pro-1.5' },
  { value: 'google/gemini-flash-1.5-8b', label: 'google/gemini-flash-1.5-8b' },
  { value: 'meta-llama/llama-3.2-1b-instruct', label: 'meta-llama/llama-3.2-1b-instruct' },
  { value: 'meta-llama/llama-3.2-3b-instruct', label: 'meta-llama/llama-3.2-3b-instruct' },
  { value: 'meta-llama/llama-3.1-8b-instruct', label: 'meta-llama/llama-3.1-8b-instruct' },
  { value: 'meta-llama/llama-3.1-70b-instruct', label: 'meta-llama/llama-3.1-70b-instruct' },
  { value: 'openai/gpt-4o-mini', label: 'openai/gpt-4o-mini' },
  { value: 'groq/llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile (Groq)' },
  { value: 'groq/gemma2-9b-it', label: 'Gemma 2 9B (Groq)' },
  { value: 'groq/llama3-8b-8192', label: 'Llama 3 8B (Groq)' },
  { value: 'groq/llama3-70b-8192', label: 'Llama 3 70B (Groq)' },
  { value: 'groq/llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant (Groq)' },
];
