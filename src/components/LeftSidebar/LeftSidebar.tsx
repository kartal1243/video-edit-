import React, { useState } from 'react';
import { Clip, ClipType, SynthGenre } from '../../types/editor';
import { AudioSynthService } from '../../services/audioSynth';
import { 
  Sparkles, 
  FolderPlus, 
  Type, 
  Layout, 
  Music, 
  Volume2, 
  Plus, 
  Play,
  Upload
} from 'lucide-react';

interface LeftSidebarProps {
  onAddClip: (clip: Partial<Clip>) => void;
  onOpenAIWizard: () => void;
  onUploadMedia: (file: File) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onAddClip,
  onOpenAIWizard,
  onUploadMedia
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'media' | 'text' | 'elements' | 'audio'>('ai');

  const tabs = [
    { id: 'ai', label: 'AI Araçları', icon: <Sparkles size={16} /> },
    { id: 'media', label: 'Medya', icon: <FolderPlus size={16} /> },
    { id: 'text', label: 'Metin', icon: <Type size={16} /> },
    { id: 'elements', label: 'Mockup', icon: <Layout size={16} /> },
    { id: 'audio', label: 'Ses & Müzik', icon: <Music size={16} /> }
  ] as const;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadMedia(e.target.files[0]);
    }
  };

  return (
    <div style={{
      width: '320px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-main)',
        padding: '6px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 2px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '10px',
              fontWeight: 600,
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              backgroundColor: activeTab === tab.id ? 'var(--bg-surface-elevated)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* TAB 1: AI TOOLS */}
        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Promo Generator Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#60a5fa" />
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                  1-Tıkla Site Tanıtım Videosu
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Sitenizin adını ve sloganını girin; yapay zeka sahneleri, animasyonlu mockupları, seslendirmeyi ve fon müziğini anında hazırlasın.
              </p>
              <button
                onClick={onOpenAIWizard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--accent-blue)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                }}
              >
                <Sparkles size={14} />
                Sihirbazı Başlat
              </button>
            </div>

            {/* AI Voiceover Generator quick block */}
            <div style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
                🎙️ Hızlı AI Seslendirme Ekle
              </span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Doğrudan zaman çizelgesine konuşma sentezi ekleyin.
              </p>
              <button
                onClick={() => {
                  onAddClip({
                    type: 'audio',
                    audioType: 'voiceover',
                    name: 'AI Seslendirme',
                    duration: 4,
                    synthesizedVoiceText: 'Sitemiz ile işlerinizi hızlandırın ve zaman kazanın.',
                    volume: 0.95
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Plus size={14} />
                Seslendirme Bloğu Ekle
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA UPLOAD */}
        {activeTab === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '24px 16px',
              border: '2px dashed var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-main)',
              cursor: 'pointer',
              textAlign: 'center'
            }}>
              <Upload size={24} color="var(--accent-blue)" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  Video, Resim veya Ses Yükleyin
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  MP4, WebM, PNG, JPG, MP3 desteklenir
                </span>
              </div>
              <input
                type="file"
                accept="video/*,image/*,audio/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              İpuçları
            </span>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              border: '1px solid var(--border-subtle)'
            }}>
              Web sitenizin ana sayfa ekran görüntüsünü yükleyip 3D Mockup vitrini olarak kullanabilirsiniz.
            </div>
          </div>
        )}

        {/* TAB 3: TEXT PRESETS */}
        {activeTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              HAZIR METİN ŞABLONLARI
            </span>

            {/* Kinetic Pop Title */}
            <div
              onClick={() => onAddClip({
                type: 'text',
                name: 'Kinetic Başlık',
                text: 'Yeni Nesil Teknoloji 🚀',
                fontSize: 36,
                fontWeight: '800',
                color: '#ffffff',
                animation: 'kinetic-pop',
                x: 50,
                y: 30,
                duration: 4
              })}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  Kinetic Pop Başlık
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Canlı yaylanan dikkat çekici başlık
                </span>
              </div>
              <Plus size={16} color="var(--accent-blue)" />
            </div>

            {/* Typewriter Subtitle */}
            <div
              onClick={() => onAddClip({
                type: 'text',
                name: 'Daktilo Yazısı',
                text: 'Saniyeler içinde harika videolar üretin...',
                fontSize: 20,
                fontWeight: '600',
                color: '#94a3b8',
                animation: 'typewriter',
                x: 50,
                y: 75,
                duration: 4
              })}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  Daktilo Alt Yazı
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Karakter karakter yazılan metin
                </span>
              </div>
              <Plus size={16} color="var(--accent-blue)" />
            </div>

            {/* Glowing CTA Button */}
            <div
              onClick={() => onAddClip({
                type: 'text',
                name: 'CTA Buton',
                text: 'Hemen Ücretsiz Dene 🔥',
                fontSize: 22,
                fontWeight: '800',
                color: '#ffffff',
                backgroundColor: '#2563eb',
                animation: 'glow',
                x: 50,
                y: 80,
                duration: 4
              })}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  CTA Dönüşüm Butonu
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Arka planı renkli aksiyon butonu
                </span>
              </div>
              <Plus size={16} color="var(--accent-blue)" />
            </div>
          </div>
        )}

        {/* TAB 4: MOCKUPS & ELEMENTS */}
        {activeTab === 'elements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              SİTE & MOCKUP ÖĞELERİ
            </span>

            {/* Safari Window Mockup */}
            <div
              onClick={() => onAddClip({
                type: 'mockup',
                name: 'Safari Tarayıcı Vitrini',
                mockupType: 'safari',
                mockupUrl: 'https://siteniz.com',
                theme: 'dark',
                width: 75,
                height: 55,
                x: 50,
                y: 50,
                duration: 5,
                kenBurns: true
              })}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  Safari Tarayıcı Vitrini
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  macOS pencere butonları & URL çubuğu
                </span>
              </div>
              <Plus size={16} color="var(--accent-blue)" />
            </div>

            {/* Stat Pill Badge */}
            <div
              onClick={() => onAddClip({
                type: 'overlay',
                name: 'İstatistik Rozeti',
                badge: '⚡ 10 Kat Daha Hızlı Süreç',
                x: 50,
                y: 70,
                duration: 4
              })}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                  Metrik & İstatistik Rozeti
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Cam efektli canlı rozet
                </span>
              </div>
              <Plus size={16} color="var(--accent-blue)" />
            </div>
          </div>
        )}

        {/* TAB 5: AUDIO & MUSIC */}
        {activeTab === 'audio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              ARKA PLAN MÜZİKLERİ (SYNTH)
            </span>

            {[
              { genre: 'tech' as SynthGenre, name: 'Modern Tech House', desc: 'Fütüristik elektronik synth bas' },
              { genre: 'energetic' as SynthGenre, name: 'Enerjik Ritim', desc: 'Dinamik, dikkat çeken vuruşlar' },
              { genre: 'ambient' as SynthGenre, name: 'Kurumsal Ambient', desc: 'Sakin, profesyonel fon akorları' },
              { genre: 'lofi' as SynthGenre, name: 'Lo-Fi Chill', desc: 'Sıcak ve samimi klavye sesleri' }
            ].map((m) => (
              <div
                key={m.genre}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                    {m.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {m.desc}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => AudioSynthService.startBGM(m.genre, 0.4)}
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-secondary)'
                    }}
                    title="Dinle"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => {
                      onAddClip({
                        type: 'audio',
                        audioType: 'music',
                        synthGenre: m.genre,
                        name: `Müzik: ${m.name}`,
                        duration: 15,
                        volume: 0.35
                      });
                    }}
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent-blue)',
                      color: '#ffffff'
                    }}
                    title="Zaman Çizelgesine Ekle"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}

            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '8px' }}>
              SES EFEKTLERİ (SFX)
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => AudioSynthService.playWhoosh()}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                💨 Whoosh
              </button>
              <button
                onClick={() => AudioSynthService.playPop()}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                🎈 Pop
              </button>
              <button
                onClick={() => AudioSynthService.playDing()}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                🔔 Ding (CTA)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
