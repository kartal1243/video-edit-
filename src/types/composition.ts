import { AspectRatio, Clip, Track } from './editor';

/**
 * Keyframe definition for smooth programmatic animation
 */
export interface Keyframe<T = number> {
  time: number; // in seconds
  value: T;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
}

/**
 * Animated Property with keyframe interpolation
 */
export interface AnimatedProp<T = number> {
  initial: T;
  keyframes?: Keyframe<T>[];
}

/**
 * Declarative Scene definition in code
 */
export interface CodeSceneSpec {
  id: string;
  duration: number; // in seconds
  transition?: 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'glitch' | 'none';
  background?: {
    color?: string;
    gradient?: [string, string];
    particles?: boolean;
    grid?: boolean;
  };
  elements: CodeElementSpec[];
}

/**
 * Elements inside a programmatic scene
 */
export interface CodeElementSpec {
  id: string;
  type: 'text' | 'mockup' | 'image' | 'video' | 'badge' | 'counter' | 'custom-canvas';
  start?: number; // relative to scene start
  duration?: number;
  x?: number; // 0-100%
  y?: number; // 0-100%
  scale?: number | AnimatedProp<number>;
  opacity?: number | AnimatedProp<number>;
  rotation?: number | AnimatedProp<number>;
  zIndex?: number;

  // Text specific
  text?: string;
  fontSize?: number;
  color?: string;
  animation?: 'kinetic-pop' | 'typewriter' | 'glow' | 'slide-up' | 'none';

  // Mockup specific
  mockupType?: 'safari' | 'chrome' | 'iphone' | 'terminal';
  url?: string;
  title?: string;
  theme?: 'dark' | 'light';

  // Counter specific
  fromNumber?: number;
  toNumber?: number;
  prefix?: string;
  suffix?: string;

  // Custom programmatic render hook (executed per frame)
  customRenderCode?: string;
}

/**
 * Root Composition Specification (Remotion/JSON style)
 */
export interface VideoCompositionSpec {
  version: string;
  name: string;
  fps: number;
  aspectRatio: AspectRatio;
  duration: number; // total duration in seconds
  audio?: {
    bgm?: {
      genre: 'tech' | 'ambient' | 'energetic' | 'lofi';
      volume: number;
    };
    voiceover?: {
      text: string;
      language: 'tr-TR' | 'en-US';
      rate?: number;
    }[];
  };
  scenes: CodeSceneSpec[];
}

/**
 * Evaluated Code Result
 */
export interface CodeExecutionResult {
  success: boolean;
  spec?: VideoCompositionSpec;
  clips?: Clip[];
  tracks?: Track[];
  error?: string;
  logs?: string[];
}
