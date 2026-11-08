import { AspectRatio, Clip } from '../types/editor';
import { CanvasRenderer } from '../utils/canvasRenderers';

export interface RenderOptions {
  width: number;
  height: number;
  fps: number;
  duration: number;
  aspectRatio: AspectRatio;
  clips: Clip[];
  mediaCache: Map<string, HTMLImageElement | HTMLVideoElement>;
  onProgress?: (progress: number, currentTime: number) => void;
}

export class ExportEngine {
  /**
   * Renders the project canvas to a downloadable video Blob
   */
  static async renderToVideo(options: RenderOptions): Promise<Blob> {
    const { width, height, fps, duration, clips, aspectRatio, mediaCache, onProgress } = options;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // Setup MediaStream
    const stream = canvas.captureStream(fps);

    // Determine supported mime type
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    const recordedChunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 6_000_000 // 6 Mbps high quality
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    return new Promise<Blob>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: mimeType });
        resolve(videoBlob);
      };

      mediaRecorder.onerror = (e) => {
        reject(e);
      };

      mediaRecorder.start();

      // Render frame by frame
      const totalFrames = Math.ceil(duration * fps);
      let currentFrame = 0;

      const renderNextFrame = () => {
        if (currentFrame >= totalFrames) {
          setTimeout(() => {
            mediaRecorder.stop();
          }, 300);
          return;
        }

        const currentTime = currentFrame / fps;
        CanvasRenderer.renderFrame(ctx, width, height, currentTime, clips, aspectRatio, mediaCache);

        if (onProgress) {
          const pct = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
          onProgress(pct, currentTime);
        }

        currentFrame++;
        // Use requestAnimationFrame for smooth frame pump
        requestAnimationFrame(renderNextFrame);
      };

      renderNextFrame();
    });
  }

  /**
   * Download a blob directly to user's device
   */
  static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /**
   * Captures the current canvas as a high-resolution PNG thumbnail
   */
  static exportThumbnail(canvas: HTMLCanvasElement, filename: string = 'promo-thumbnail.png'): void {
    canvas.toBlob((blob) => {
      if (blob) {
        this.downloadFile(blob, filename);
      }
    }, 'image/png');
  }
}
