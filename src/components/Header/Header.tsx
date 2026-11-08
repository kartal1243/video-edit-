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
  Video,
  Code2,
  Bot,
  Puzzle
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
  onOpenCodePlayground: () => void;
  onOpenAIHub: () => void;
  onOpenPluginManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onProjectNameChange,
  aspectRatio,
  onAspectRatioChange,
  onOpenAIWizard,
  onOpenTemplates,
  onCaptureThumbnail,
  onOpenExport,
  onOpenCodePlayground,
  onOpenAIHub,
  onOpenPluginManager
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
      gap: '12px'
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
            width: '180px'
          }}
          onFocus={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
          onBlur={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        />
      </div>

      {/* Center: Aspect Ratio & Mode Switchers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Aspect Ratio Switcher */}
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

        {/* Code Playground Trigger */}
        <button
          onClick={onOpenCodePlayground}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            transition: 'all 0.15s ease'
          }}
          title="Videoyu JavaScript/JSON kodu ile programlayın"
        >
          <Code2 size={15} />
          Kodla Video
        </button>

        {/* AI Hub Trigger */}
        <button
          onClick={onOpenAIHub}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            transition: 'all 0.15s ease'
          }}
          title="OpenAI, Gemini, Claude, ElevenLabs & Ollama bağlantıları"
        >
          <Bot size={15} />
          AI Hub
        </button>

        {/* Plugin Manager Trigger */}
        <button
          onClick={onOpenPluginManager}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: 'rgba(236, 72, 153, 0.15)',
            color: '#f472b6',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            transition: 'all 0.15s ease'
          }}
          title="Altyazı, parçacık ve mockup eklentilerini yönetin"
        >
          <Puzzle size={15} />
          Beceriler
        </button>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Templates button */}
        <button
          onClick={onOpenTemplates}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 11px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.15s ease'
          }}
        >
          <LayoutTemplate size={14} />
          Şablonlar
        </button>

        {/* Instant Thumbnail snapshot */}
        <button
          onClick={onCaptureThumbnail}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 11px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.15s ease'
          }}
          title="O anki kareyi PNG kapak resmi olarak kaydet"
        >
          <Camera size={14} />
          Kapak
        </button>

        {/* AI Promo Wizard Button */}
        <button
          onClick={onOpenAIWizard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 13px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={15} />
          AI Site Tanıtımı
        </button>

        {/* Export Video Button */}
        <button
          onClick={onOpenExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 13px',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: 'var(--accent-emerald)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <Download size={15} />
          İndir
        </button>
      </div>
    </header>
  );
};
