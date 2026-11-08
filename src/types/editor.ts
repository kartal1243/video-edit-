export type ClipType = 'video' | 'image' | 'text' | 'mockup' | 'audio' | 'overlay';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export type TextAnimation = 
  | 'none' 
  | 'fade' 
  | 'slide-up' 
  | 'kinetic-pop' 
  | 'typewriter' 
  | 'glow' 
  | 'bounce';

export type MockupType = 
  | 'safari' 
  | 'chrome' 
  | 'iphone' 
  | 'card' 
  | 'isometric';

export type AudioType = 'music' | 'voiceover' | 'sfx';
export type SynthGenre = 'tech' | 'ambient' | 'energetic' | 'lofi';

export interface VisualFilters {
  brightness: number; // 0 - 200, default 100
  contrast: number;   // 0 - 200, default 100
  saturation: number; // 0 - 200, default 100
  blur: number;       // 0 - 20, default 0
  vignette: number;   // 0 - 1, default 0
}

export interface Clip {
  id: string;
  name: string;
  type: ClipType;
  trackId: string;
  startTime: number; // in seconds
  duration: number;  // in seconds
  offset?: number;   // start offset for video/audio

  // Visual layout properties (percentages 0-100 or coordinates)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  scale: number;
  zIndex: number;

  // Visual filters
  filters?: VisualFilters;

  // Video / Image specific
  src?: string;
  fit?: 'cover' | 'contain';
  kenBurns?: boolean; // dynamic slow zoom

  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  animation?: TextAnimation;
  letterSpacing?: number;

  // Mockup specific
  mockupType?: MockupType;
  mockupUrl?: string;
  badge?: string;
  subBadge?: string;
  theme?: 'dark' | 'light';

  // Audio specific
  audioType?: AudioType;
  volume?: number; // 0 to 1
  synthesizedVoiceText?: string;
  synthGenre?: SynthGenre;
  audioBuffer?: AudioBuffer;
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'text' | 'overlay' | 'audio';
  isMuted?: boolean;
  isLocked?: boolean;
}

export interface Project {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  duration: number; // in seconds
  fps: number;
  tracks: Track[];
  clips: Clip[];
}

export interface PromoRequest {
  siteName: string;
  siteUrl: string;
  description: string;
  category: 'saas' | 'ecommerce' | 'portfolio' | 'agency' | 'app';
  style: 'modern-dark' | 'clean-minimal' | 'bold-marketing' | 'cyberpunk';
  durationPreset: 15 | 30 | 45;
  aspectRatio: AspectRatio;
  includeVoiceover: boolean;
  voiceLanguage: 'tr-TR' | 'en-US';
  includeBGM: boolean;
  bgmGenre: SynthGenre;
  customScreenshotUrl?: string;
}

export interface GeneratedScene {
  title: string;
  subtitle: string;
  narration: string;
  highlightCard?: {
    tag: string;
    value: string;
    icon: string;
  };
  duration: number;
  type: 'hook' | 'reveal' | 'feature' | 'proof' | 'cta';
  mockupTheme?: 'dark' | 'light';
}
