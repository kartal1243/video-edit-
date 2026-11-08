import React from 'react';
import { Clip, TextAnimation, SynthGenre } from '../../types/editor';
import { SpeechService } from '../../services/speechService';
import { 
  Sliders, 
  Volume2, 
  Type, 
  Sparkles, 
  Layout, 
  Play,
  Layers
} from 'lucide-react';

interface InspectorProps {
  clip: Clip | null;
  onUpdateClip: (clip: Clip) => void;
  projectDuration: number;
}

export const Inspector: React.FC<InspectorProps> = ({
  clip,
  onUpdateClip,
  projectDuration
}) => {
  if (!clip) {
    return (
      <div style={{
        padding: '24px 18px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '12px'
      }}>
        <Layers size={36} color="var(--border-strong)" />
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
          Öğe Seçilmedi
        </h4>
        <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
          Özelliklerini düzenlemek için zaman çizelgesindeki veya önizlemedeki herhangi bir klibe tıklayın.
        </p>
      </div>
    );
  }

  const handleNumChange = (field: keyof Clip, val: number) => {
    onUpdateClip({ ...clip, [field]: val });
  };

  const handleStringChange = (field: keyof Clip, val: string) => {
    onUpdateClip({ ...clip, [field]: val });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-subtle)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Sliders size={16} color="var(--accent-blue)" />
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Klip Özellikleri
        </span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Clip Name & Timing */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            KLİP BAŞLIĞI
          </label>
          <input
            type="text"
            value={clip.name}
            onChange={(e) => handleStringChange('name', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              BAŞLANGIÇ (SN)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max={projectDuration}
              value={clip.startTime}
              onChange={(e) => handleNumChange('startTime', parseFloat(e.target.value) || 0)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              SÜRE (SN)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="60"
              value={clip.duration}
              onChange={(e) => handleNumChange('duration', parseFloat(e.target.value) || 1)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Text Clip Controls */}
        {clip.type === 'text' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'var(--bg-main)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={14} color="#a855f7" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#e9d5ff' }}>
                Metin & Animasyon
              </span>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Metin İçeriği
              </label>
              <textarea
                rows={2}
                value={clip.text || ''}
                onChange={(e) => handleStringChange('text', e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yazı Boyutu</span>
                <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{clip.fontSize || 28}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="72"
                value={clip.fontSize || 28}
                onChange={(e) => handleNumChange('fontSize', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Yazı Rengi
                </label>
                <input
                  type="color"
                  value={clip.color || '#ffffff'}
                  onChange={(e) => handleStringChange('color', e.target.value)}
                  style={{ width: '100%', height: '32px', padding: '2px', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Animasyon
                </label>
                <select
                  value={clip.animation || 'none'}
                  onChange={(e) => handleStringChange('animation', e.target.value as TextAnimation)}
                  style={{ width: '100%' }}
                >
                  <option value="none">Sabit</option>
                  <option value="kinetic-pop">Kinetic Pop (Canlı Yay)</option>
                  <option value="slide-up">Aşağıdan Kayma</option>
                  <option value="typewriter">Daktilo Yazı</option>
                  <option value="glow">Parlayan Işık</option>
                  <option value="fade">Yumuşak Geçiş</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Mockup Controls */}
        {clip.type === 'mockup' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'var(--bg-main)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layout size={14} color="#3b82f6" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#bfdbfe' }}>
                Web Sitesi Mockup Vitrini
              </span>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Site Adresi (URL)
              </label>
              <input
                type="text"
                value={clip.mockupUrl || ''}
                onChange={(e) => handleStringChange('mockupUrl', e.target.value)}
                placeholder="https://siteniz.com"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Tema
                </label>
                <select
                  value={clip.theme || 'dark'}
                  onChange={(e) => handleStringChange('theme', e.target.value as 'dark' | 'light')}
                  style={{ width: '100%' }}
                >
                  <option value="dark">Karanlık (Dark)</option>
                  <option value="light">Aydınlık (Light)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Ken Burns Zoom
                </label>
                <button
                  onClick={() => onUpdateClip({ ...clip, kenBurns: !clip.kenBurns })}
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: clip.kenBurns ? 'var(--accent-blue)' : 'var(--bg-surface-elevated)',
                    color: '#ffffff',
                    border: '1px solid var(--border-strong)'
                  }}
                >
                  {clip.kenBurns ? 'Aktif' : 'Pasif'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audio Controls */}
        {clip.type === 'audio' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'var(--bg-main)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Volume2 size={14} color="#10b981" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#a7f3d0' }}>
                Ses & Müzik Ayarları
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ses Seviyesi</span>
                <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                  {Math.round((clip.volume ?? 0.8) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={clip.volume ?? 0.8}
                onChange={(e) => handleNumChange('volume', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
              />
            </div>

            {clip.audioType === 'voiceover' && (
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  AI Seslendirme Metni
                </label>
                <textarea
                  rows={2}
                  value={clip.synthesizedVoiceText || ''}
                  onChange={(e) => handleStringChange('synthesizedVoiceText', e.target.value)}
                  style={{ width: '100%' }}
                />
                <button
                  onClick={() => {
                    if (clip.synthesizedVoiceText) {
                      SpeechService.speak(clip.synthesizedVoiceText, 'tr-TR');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--accent-emerald)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Play size={12} />
                  Sesi Önizle
                </button>
              </div>
            )}

            {clip.audioType === 'music' && (
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Müzik Türü (Synth)
                </label>
                <select
                  value={clip.synthGenre || 'tech'}
                  onChange={(e) => handleStringChange('synthGenre', e.target.value as SynthGenre)}
                  style={{ width: '100%' }}
                >
                  <option value="tech">Modern Tech (Elektronik)</option>
                  <option value="energetic">Enerjik (Dinamik Beat)</option>
                  <option value="ambient">Ambient (Sakin Kurumsal)</option>
                  <option value="lofi">Lo-Fi (Sıcak Akorlar)</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Visual Transform & Scale (for visual clips) */}
        {clip.type !== 'audio' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--accent-blue)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Boyut & Konumlandırma
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ölçek (Büyüklük)</span>
                <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{clip.scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.05"
                value={clip.scale}
                onChange={(e) => handleNumChange('scale', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Konum X (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={clip.x}
                  onChange={(e) => handleNumChange('x', parseInt(e.target.value) || 0)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Konum Y (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={clip.y}
                  onChange={(e) => handleNumChange('y', parseInt(e.target.value) || 0)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
