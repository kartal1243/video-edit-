import React, { useRef, useEffect } from 'react';
import { AspectRatio, Clip } from '../../types/editor';
import { CanvasRenderer } from '../../utils/canvasRenderers';
import { Play, Pause } from 'lucide-react';

interface CanvasViewportProps {
  aspectRatio: AspectRatio;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onTogglePlay: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mediaCache: Map<string, HTMLImageElement | HTMLVideoElement>;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  aspectRatio,
  currentTime,
  duration,
  isPlaying,
  clips,
  selectedClipId,
  onSelectClip,
  onTogglePlay,
  canvasRef,
  mediaCache
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine native render resolution based on aspect ratio
  const getDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 1080, height: 1920, ratioNum: 9 / 16 };
      case '1:1':
        return { width: 1080, height: 1080, ratioNum: 1 };
      case '16:9':
      default:
        return { width: 1920, height: 1080, ratioNum: 16 / 9 };
    }
  };

  const { width, height, ratioNum } = getDimensions();

  // Render canvas whenever currentTime, clips, or aspectRatio change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    CanvasRenderer.renderFrame(ctx, width, height, currentTime, clips, aspectRatio, mediaCache);
  }, [currentTime, clips, aspectRatio, width, height, mediaCache, canvasRef]);

  // Format time (00:00.0)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${parseFloat(secs) < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#05070c'
      }}
      onClick={() => onSelectClip(null)}
    >
      {/* Canvas Wrapper with constrained aspect ratio */}
      <div
        style={{
          position: 'relative',
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: `${ratioNum}`,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-subtle)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain'
          }}
        />

        {/* Play / Pause Center Overlay Button (Visible when paused or hovered) */}
        {!isPlaying && (
          <button
            onClick={onTogglePlay}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '2px solid rgba(59, 130, 246, 0.6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.15s ease, background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)';
              e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
            }}
          >
            <Play size={28} style={{ marginLeft: '4px' }} />
          </button>
        )}

        {/* Timecode pill badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none'
          }}
        >
          <span style={{ color: '#ffffff', fontWeight: 600 }}>{formatTime(currentTime)}</span>
          {' / '}
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
