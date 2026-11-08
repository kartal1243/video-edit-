import React from 'react';
import { AspectRatio } from '../../types/editor';
import { 
  Sparkles, 
  Download, 
  Camera, 
  LayoutTemplate, 
  Tv, 
  Smartphone, 
  Square,
  Video
} from 'lucide-react';

interface HeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onOpenAIWizard: () => void;
  onOpenTemplates: () => void;
  onCaptureThumbnail: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onProjectNameChange,
  aspectRatio,
  onAspectRatioChange,
  onOpenAIWizard,
  onOpenTemplates,
  onCaptureThumbnail,
  onOpenExport
}) => {
  return (
    <header style={{
      height: '56px',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      gap: '16px'
    }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <Video size={18} color="#3b82f6" />
          <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px', color: '#f8fafc' }}>
            ClipForge <span style={{ color: '#3b82f6' }}>AI</span>
          </span>
        </div>

        <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-strong)' }} />

        {/* Project Name Input */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Proje Adı"
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            width: '200px'
          }}
          onFocus={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
          onBlur={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        />
      </div>

      {/* Middle: Aspect Ratio Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-main)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        gap: '2px'
      }}>
        <button
          onClick={() => onAspectRatioChange('16:9')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            color: aspectRatio === '16:9' ? '#ffffff' : 'var(--text-muted)',
            backgroundColor: aspectRatio === '16:9' ? 'var(--bg-surface-elevated)' : 'transparent',
            transition: 'all 0.15s ease'
          }}
          title="16:9 (Yatay - YouTube / Web)"
        >
          <Tv size={14} />
          16:9
        </button>

        <button
          onClick={() => onAspectRatioChange('9:16')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            color: aspectRatio === '9:16' ? '#ffffff' : 'var(--text-muted)',
            backgroundColor: aspectRatio === '9:16' ? 'var(--bg-surface-elevated)' : 'transparent',
            transition: 'all 0.15s ease'
          }}
          title="9:16 (Dikey - Reels / TikTok / Shorts)"
        >
          <Smartphone size={14} />
          9:16
        </button>

        <button
          onClick={() => onAspectRatioChange('1:1')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            color: aspectRatio === '1:1' ? '#ffffff' : 'var(--text-muted)',
            backgroundColor: aspectRatio === '1:1' ? 'var(--bg-surface-elevated)' : 'transparent',
            transition: 'all 0.15s ease'
          }}
          title="1:1 (Kare - Instagram / LinkedIn)"
        >
          <Square size={14} />
          1:1
        </button>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Templates button */}
        <button
          onClick={onOpenTemplates}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <LayoutTemplate size={15} />
          Şablonlar
        </button>

        {/* Instant Thumbnail snapshot */}
        <button
          onClick={onCaptureThumbnail}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.15s ease'
          }}
          title="O anki kareyi PNG kapak resmi olarak kaydet"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Camera size={15} />
          Kapak Resmi
        </button>

        {/* AI Promo Wizard Button */}
        <button
          onClick={onOpenAIWizard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Sparkles size={16} />
          AI Site Tanıtımı Üret
        </button>

        {/* Export Video Button */}
        <button
          onClick={onOpenExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 700,
            backgroundColor: 'var(--accent-emerald)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Download size={16} />
          Videoyu İndir
        </button>
      </div>
    </header>
  );
};
