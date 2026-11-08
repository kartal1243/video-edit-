import React, { useRef, useState } from 'react';
import { Clip, Track } from '../../types/editor';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Scissors, 
  Copy, 
  Trash2, 
  ZoomIn, 
  ZoomOut,
  Video,
  Type,
  Layers,
  Music
} from 'lucide-react';

interface TimelineProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  tracks: Track[];
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onSplitClip: (clipId: string, splitTime: number) => void;
  onDuplicateClip: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
  onUpdateClip: (clip: Clip) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  isPlaying,
  tracks,
  clips,
  selectedClipId,
  onSelectClip,
  onSeek,
  onTogglePlay,
  onSplitClip,
  onDuplicateClip,
  onDeleteClip,
  onUpdateClip
}) => {
  const [zoom, setZoom] = useState<number>(45); // px per second
  const timelineContentRef = useRef<HTMLDivElement>(null);

  const totalWidth = Math.max(duration * zoom + 200, 1000);

  // Time ticks generator
  const ticks = [];
  const tickInterval = zoom > 60 ? 1 : zoom > 30 ? 2 : 5;
  for (let t = 0; t <= duration; t += tickInterval) {
    ticks.push(t);
  }

  // Handle timeline ruler click
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineContentRef.current) return;
    const rect = timelineContentRef.current.getBoundingClientRect();
    const scrollLeft = timelineContentRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(duration, clickX / zoom));
    onSeek(newTime);
  };

  // Split selected clip
  const handleSplit = () => {
    if (!selectedClipId) return;
    onSplitClip(selectedClipId, currentTime);
  };

  const getTrackIcon = (type: Track['type']) => {
    switch (type) {
      case 'video':
        return <Video size={14} color="#3b82f6" />;
      case 'text':
        return <Type size={14} color="#a855f7" />;
      case 'overlay':
        return <Layers size={14} color="#f59e0b" />;
      case 'audio':
        return <Music size={14} color="#10b981" />;
    }
  };

  const getClipColor = (type: Clip['type'], isSelected: boolean) => {
    if (isSelected) {
      return {
        bg: 'rgba(59, 130, 246, 0.45)',
        border: '#60a5fa',
        text: '#ffffff'
      };
    }
    switch (type) {
      case 'video':
      case 'mockup':
        return { bg: 'rgba(30, 58, 138, 0.5)', border: '#3b82f6', text: '#bfdbfe' };
      case 'text':
        return { bg: 'rgba(88, 28, 135, 0.5)', border: '#a855f7', text: '#e9d5ff' };
      case 'overlay':
        return { bg: 'rgba(120, 53, 15, 0.5)', border: '#f59e0b', text: '#fde68a' };
      case 'audio':
        return { bg: 'rgba(6, 78, 59, 0.5)', border: '#10b981', text: '#a7f3d0' };
      default:
        return { bg: 'rgba(30, 41, 59, 0.8)', border: '#64748b', text: '#cbd5e1' };
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      {/* Timeline Action Bar */}
      <div style={{
        height: '42px',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        gap: '12px'
      }}>
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onSeek(0)}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)'
            }}
            title="Başa Dön"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={onTogglePlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-blue)',
              color: '#ffffff'
            }}
            title={isPlaying ? 'Durdur (Boşluk)' : 'Oynat (Boşluk)'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
          </button>

          {/* Time Display */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginLeft: '8px'
          }}>
            {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
          </div>
        </div>

        {/* Edit Tools (Split, Duplicate, Delete) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleSplit}
            disabled={!selectedClipId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: selectedClipId ? 'var(--bg-main)' : 'transparent',
              color: selectedClipId ? 'var(--text-primary)' : 'var(--text-muted)',
              border: '1px solid var(--border-strong)',
              opacity: selectedClipId ? 1 : 0.5
            }}
            title="Seçili klibi oynatma imlecinin olduğu yerden kes (S)"
          >
            <Scissors size={14} />
            Böl (Kes)
          </button>

          <button
            onClick={() => selectedClipId && onDuplicateClip(selectedClipId)}
            disabled={!selectedClipId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: selectedClipId ? 'var(--bg-main)' : 'transparent',
              color: selectedClipId ? 'var(--text-primary)' : 'var(--text-muted)',
              border: '1px solid var(--border-strong)',
              opacity: selectedClipId ? 1 : 0.5
            }}
            title="Seçili klibi çoğalt"
          >
            <Copy size={14} />
            Çoğalt
          </button>

          <button
            onClick={() => selectedClipId && onDeleteClip(selectedClipId)}
            disabled={!selectedClipId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: selectedClipId ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
              color: selectedClipId ? '#ef4444' : 'var(--text-muted)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              opacity: selectedClipId ? 1 : 0.5
            }}
            title="Seçili klibi sil"
          >
            <Trash2 size={14} />
            Sil
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setZoom(Math.max(20, zoom - 10))}
            style={{ color: 'var(--text-secondary)' }}
            title="Uzaklaş"
          >
            <ZoomOut size={15} />
          </button>
          <input
            type="range"
            min="20"
            max="120"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ width: '80px', accentColor: 'var(--accent-blue)' }}
          />
          <button
            onClick={() => setZoom(Math.min(120, zoom + 10))}
            style={{ color: 'var(--text-secondary)' }}
            title="Yakınlaş"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* Main Tracks & Timeline Canvas Area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Track Headers (Left sidebar) */}
        <div style={{
          width: '180px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 5
        }}>
          {/* Header spacer to match ruler */}
          <div style={{
            height: '24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-main)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '12px'
          }}>
            KANALLAR
          </div>

          {/* Tracks list */}
          {tracks.map((track) => (
            <div
              key={track.id}
              style={{
                height: '42px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              {getTrackIcon(track.type)}
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {track.name}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Tracks Canvas & Playhead Area */}
        <div
          ref={timelineContentRef}
          style={{
            flex: 1,
            position: 'relative',
            overflowX: 'auto',
            overflowY: 'hidden',
            backgroundColor: 'var(--bg-main)'
          }}
        >
          <div style={{ width: `${totalWidth}px`, position: 'relative' }}>
            {/* Time Ruler */}
            <div
              onClick={handleRulerClick}
              style={{
                height: '24px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-main)',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {ticks.map((t) => (
                <div
                  key={t}
                  style={{
                    position: 'absolute',
                    left: `${t * zoom}px`,
                    top: 0,
                    bottom: 0,
                    borderLeft: '1px solid var(--border-strong)',
                    paddingLeft: '4px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {t}s
                </div>
              ))}
            </div>

            {/* Tracks Body */}
            {tracks.map((track) => (
              <div
                key={track.id}
                style={{
                  height: '42px',
                  borderBottom: '1px solid var(--border-subtle)',
                  position: 'relative',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)'
                }}
              >
                {/* Clips in this track */}
                {clips
                  .filter((c) => c.trackId === track.id)
                  .map((clip) => {
                    const isSelected = clip.id === selectedClipId;
                    const styleColors = getClipColor(clip.type, isSelected);

                    return (
                      <div
                        key={clip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClip(clip.id);
                        }}
                        style={{
                          position: 'absolute',
                          left: `${clip.startTime * zoom}px`,
                          width: `${Math.max(12, clip.duration * zoom)}px`,
                          top: '4px',
                          bottom: '4px',
                          backgroundColor: styleColors.bg,
                          border: `1.5px solid ${styleColors.border}`,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 8px',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
                          zIndex: isSelected ? 4 : 2,
                          overflow: 'hidden'
                        }}
                      >
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: styleColors.text,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {clip.name}
                        </span>

                        {/* Duration label */}
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          color: 'rgba(255, 255, 255, 0.6)',
                          whiteSpace: 'nowrap'
                        }}>
                          {clip.duration.toFixed(1)}s
                        </span>
                      </div>
                    );
                  })}
              </div>
            ))}

            {/* Red Scrubbing Playhead */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${currentTime * zoom}px`,
                width: '2px',
                backgroundColor: '#ef4444',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              {/* Playhead Top Needle Handle */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-6px',
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#ef4444',
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
