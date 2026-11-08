import React, { useState } from 'react';
import { AspectRatio, Clip } from '../../types/editor';
import { ExportEngine } from '../../services/exportEngine';
import confetti from 'canvas-confetti';
import { 
  Download, 
  X, 
  CheckCircle2, 
  Film, 
  Sliders, 
  Camera, 
  Loader2 
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: AspectRatio;
  duration: number;
  clips: Clip[];
  mediaCache: Map<string, HTMLImageElement | HTMLVideoElement>;
  projectName: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  aspectRatio,
  duration,
  clips,
  mediaCache,
  projectName,
  canvasRef
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [fps, setFps] = useState<number>(30);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderedBlob, setRenderedBlob] = useState<Blob | null>(null);

  if (!isOpen) return null;

  const getExportDimensions = () => {
    let baseW = resolution === '1080p' ? 1920 : 1280;
    let baseH = resolution === '1080p' ? 1080 : 720;

    if (aspectRatio === '9:16') {
      return { width: baseH, height: baseW };
    }
    if (aspectRatio === '1:1') {
      return { width: baseH, height: baseH };
    }
    return { width: baseW, height: baseH };
  };

  const handleStartRender = async () => {
    setIsRendering(true);
    setProgress(0);
    setRenderedBlob(null);

    const dims = getExportDimensions();

    try {
      const blob = await ExportEngine.renderToVideo({
        width: dims.width,
        height: dims.height,
        fps,
        duration,
        aspectRatio,
        clips,
        mediaCache,
        onProgress: (pct) => setProgress(pct)
      });

      setRenderedBlob(blob);
      setIsRendering(false);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      // Auto trigger download
      const cleanName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'clipforge-promo';
      ExportEngine.downloadFile(blob, `${cleanName}.webm`);
    } catch (err) {
      console.error('Render error:', err);
      setIsRendering(false);
      alert('Render esnasında bir hata oluştu: ' + (err as Error).message);
    }
  };

  const handleDownloadThumbnail = () => {
    if (canvasRef.current) {
      const cleanName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'clipforge-promo';
      ExportEngine.exportThumbnail(canvasRef.current, `${cleanName}-thumbnail.png`);
    }
  };

  const dims = getExportDimensions();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Videoyu Dışa Aktar & İndir
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isRendering}
            style={{ color: 'var(--text-muted)', cursor: isRendering ? 'not-allowed' : 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Settings info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            backgroundColor: 'var(--bg-main)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                Çözünürlük
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {dims.width} × {dims.height} ({resolution})
              </span>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                Toplam Süre
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {duration.toFixed(1)} Saniye
              </span>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Kalite / Çözünürlük
              </label>
              <select
                disabled={isRendering}
                value={resolution}
                onChange={(e) => setResolution(e.target.value as '1080p' | '720p')}
                style={{ width: '100%' }}
              >
                <option value="1080p">1080p Full HD (Net Kalite)</option>
                <option value="720p">720p HD (Hızlı Render)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Kare Hızı (FPS)
              </label>
              <select
                disabled={isRendering}
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                <option value={30}>30 FPS (Standart Web)</option>
                <option value={60}>60 FPS (Ultra Akıcı)</option>
              </select>
            </div>
          </div>

          {/* Progress Bar (when rendering) */}
          {isRendering && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '14px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Loader2 size={14} className="animate-spin" />
                  Kareler Render Ediliyor...
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                  %{progress}
                </span>
              </div>
              <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: 'var(--accent-emerald)',
                  transition: 'width 0.1s linear'
                }} />
              </div>
            </div>
          )}

          {/* Render Completed Card */}
          {renderedBlob && !isRendering && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-md)'
            }}>
              <CheckCircle2 size={20} color="var(--accent-emerald)" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  Render Başarıyla Tamamlandı!
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Video tarayıcınız tarafından indirildi ({(renderedBlob.size / (1024 * 1024)).toFixed(2)} MB).
                </span>
              </div>
            </div>
          )}

          {/* Instant Thumbnail Export Button */}
          <button
            onClick={handleDownloadThumbnail}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-strong)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}
          >
            <Camera size={14} />
            Kapak Resmi / Thumbnail İndir (PNG)
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            disabled={isRendering}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}
          >
            Kapat
          </button>

          <button
            onClick={handleStartRender}
            disabled={isRendering}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: 'var(--accent-emerald)',
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
              opacity: isRendering ? 0.6 : 1,
              cursor: isRendering ? 'wait' : 'pointer'
            }}
          >
            <Download size={16} />
            {isRendering ? 'Render Ediliyor...' : renderedBlob ? 'Tekrar İndir' : 'Videoyu Render Et ve İndir'}
          </button>
        </div>
      </div>
    </div>
  );
};
