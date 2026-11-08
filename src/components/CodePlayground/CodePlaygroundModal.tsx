import React, { useState } from 'react';
import { CodeEngine } from '../../services/codeEngine';
import { Clip, Track, AspectRatio } from '../../types/editor';
import { 
  Code2, 
  Play, 
  X, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Terminal,
  FileCode
} from 'lucide-react';

interface CodePlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: Clip[];
  duration: number;
  aspectRatio: AspectRatio;
  projectName: string;
  onApplyCode: (newClips: Clip[], newDuration: number, newRatio: AspectRatio, newName: string) => void;
}

export const CodePlaygroundModal: React.FC<CodePlaygroundModalProps> = ({
  isOpen,
  onClose,
  clips,
  duration,
  aspectRatio,
  projectName,
  onApplyCode
}) => {
  const templates = CodeEngine.getTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0].id);
  const [code, setCode] = useState<string>(templates[0].code);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const t = templates.find((item) => item.id === id);
    if (t) {
      setCode(t.code);
      setError(null);
    }
  };

  const handleExportCurrentToCode = () => {
    const generatedCode = CodeEngine.clipsToCode(clips, duration, aspectRatio, projectName);
    setCode(generatedCode);
    setError(null);
  };

  const handleRunCode = () => {
    setError(null);
    const result = CodeEngine.executeCode(code);
    if (!result.success || !result.spec || !result.clips) {
      setError(result.error || 'Bilinmeyen bir hata oluştu.');
      return;
    }

    onApplyCode(
      result.clips,
      result.spec.duration,
      result.spec.aspectRatio,
      result.spec.name || 'Kod ile Üretilen Video'
    );
    onClose();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        height: '85vh',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.9)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Code2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Kodla Video Üretim Laboratuvarı (Code Playground)
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Videolarınızı bildirimsel JavaScript/JSON kompozisyonu ile programlayın ve anında çalıştırın.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Template selector */}
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '5px 10px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-strong)'
              }}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCurrentToCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
              title="Mevcut zaman çizelgesini koda dönüştür"
            >
              <FileCode size={13} />
              Zaman Çizelgesini Koda Aktar
            </button>

            <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#05070c',
              color: '#38bdf8',
              fontFamily: '"JetBrains Mono", Consolas, monospace',
              fontSize: '13px',
              lineHeight: 1.6,
              padding: '18px',
              border: 'none',
              resize: 'none',
              outline: 'none',
              borderRadius: 0
            }}
          />

          {/* Copy Floating Button */}
          <button
            onClick={handleCopyCode}
            style={{
              position: 'absolute',
              top: '14px',
              right: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              backdropFilter: 'blur(4px)'
            }}
          >
            {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
            {copied ? 'Kopyalandı' : 'Kodu Kopyala'}
          </button>
        </div>

        {/* Error Warning */}
        {error && (
          <div style={{
            padding: '10px 18px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderTop: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ef4444',
            fontSize: '12px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            💡 İpucu: Remotion ve JSON uyumlu declarative video spesifikasyonudur.
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              Vazgeç
            </button>

            <button
              onClick={handleRunCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.35)'
              }}
            >
              <Play size={15} style={{ fill: '#ffffff' }} />
              Kodu Çalıştır ve Videoyu Yükle 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
