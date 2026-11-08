import { Clip, AspectRatio } from './editor';

export interface FrameContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  currentTime: number;
  duration: number;
  fps: number;
  aspectRatio: AspectRatio;
  activeClips: Clip[];
}

export interface ClipForgePlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'animation' | 'transition' | 'filter' | 'audio' | 'ai' | 'export';
  enabled: boolean;

  // Lifecycle Hooks
  initialize?: () => void | Promise<void>;
  beforeRenderFrame?: (context: FrameContext) => void;
  afterRenderFrame?: (context: FrameContext) => void;
  customDrawElement?: (element: Clip, context: FrameContext) => boolean; // return true if handled
  destroy?: () => void;
}
