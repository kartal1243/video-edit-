export type AIProviderType = 'llm' | 'tts' | 'video' | 'image' | 'music';

export interface AIProviderConfig {
  id: string;
  name: string;
  type: AIProviderType;
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  model?: string;
  options?: Record<string, unknown>;
}

export interface AIProviderStatus {
  providerId: string;
  isAvailable: boolean;
  lastChecked?: number;
  message?: string;
}

export interface PromptScriptRequest {
  siteName: string;
  siteUrl: string;
  description: string;
  targetAudience?: string;
  duration: number;
  tone: 'professional' | 'energetic' | 'minimal' | 'viral' | 'tech';
  language: 'tr' | 'en';
}

export interface PromptScriptResponse {
  title: string;
  hook: string;
  scenes: {
    title: string;
    description: string;
    narration: string;
    visualPrompt: string;
    duration: number;
    badge?: string;
  }[];
  cta: string;
}
