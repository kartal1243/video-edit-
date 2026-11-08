import React, { useState } from 'react';
import { PromoRequest, AspectRatio, SynthGenre } from '../../types/editor';
import { AIScriptService } from '../../services/aiScriptService';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  X, 
  Globe, 
  Volume2, 
  Music, 
  Clock, 
  Tv, 
  Smartphone, 
  Square,
  Upload
} from 'lucide-react';

interface AIPromoWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: PromoRequest) => void;
  defaultAspectRatio: AspectRatio;
}

export const AIPromoWizardModal: React.FC<AIPromoWizardModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  defaultAspectRatio
}) => {
  const [siteName, setSiteName] = useState('DevPulse AI');
  const [siteUrl, setSiteUrl] = useState('https://devpulse.ai');
  const [description, setDescription] = useState(
    'Yapay zeka ile sunucu ve web sitesi kesintilerini anlık tespit edin, %99.9 kesintisiz uptime sağlayın.'
  );
  const [category, setCategory] = useState<PromoRequest['category']>('saas');
  const [style, setStyle] = useState<PromoRequest['style']>('modern-dark');
  const [durationPreset, setDurationPreset] = useState<15 | 30 | 45>(15);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(defaultAspectRatio);
  const [includeVoiceover, setIncludeVoiceover] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState<'tr-TR' | 'en-US'>('tr-TR');
  const [includeBGM, setIncludeBGM] = useState(true);
  const [bgmGenre, setBgmGenre] = useState<SynthGenre>('tech');
  const [customScreenshotUrl, setCustomScreenshotUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomScreenshotUrl(url);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    const config: PromoRequest = {
      siteName,
      siteUrl,
      description,
      category,
      style,
      durationPreset,
      aspectRatio,
      includeVoiceover,
      voiceLanguage,
      includeBGM,
      bgmGenre,
      customScreenshotUrl: customScreenshotUrl || undefined
    };

    setTimeout(() => {
      onGenerate(config);
      setIsGenerating(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
      onClose();
    }, 600);
  };

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
        maxWidth: '650px',
        maxHeight: '90vh',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                AI ile Site Tanıtım Videosu Üret
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Siteniz için otomatik kanca, senaryo, 3D mockup, seslendirme ve müzik üretin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Site Name & URL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Web Sitesi veya Ürün Adı
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Örn: SaaSify, ButikShop"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Site URL / Adresi
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  style={{ width: '100%', paddingLeft: '32px' }}
                />
                <Globe size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              </div>
            </div>
          </div>

          {/* Tagline / Value Proposition */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Sitenin Temel Vaadi ve Özellikleri (Açıklama)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Siteniz ne işe yarıyor? Kullanıcıya ne kazandırıyor? (Yapay zeka bunu analiz ederek 5 sahnelik etkileyici video senaryosuna dönüştürür)"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Category & Style */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Sektör / Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PromoRequest['category'])}
                style={{ width: '100%' }}
              >
                <option value="saas">SaaS & Bulut Yazılım</option>
                <option value="ecommerce">E-Ticaret & Alışveriş</option>
                <option value="portfolio">Portfolyo & Ajans</option>
                <option value="app">Mobil Uygulama / AI Aracı</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Görsel Tema & Tarz
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as PromoRequest['style'])}
                style={{ width: '100%' }}
              >
                <option value="modern-dark">Modern Koyu Fütüristik</option>
                <option value="clean-minimal">Sade Apple Minimal</option>
                <option value="bold-marketing">Dinamik Pazarlama</option>
                <option value="cyberpunk">Cyberpunk / Neon</option>
              </select>
            </div>
          </div>

          {/* Aspect Ratio & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Video Formatı
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { r: '16:9' as AspectRatio, icon: <Tv size={14} />, label: '16:9' },
                  { r: '9:16' as AspectRatio, icon: <Smartphone size={14} />, label: '9:16' },
                  { r: '1:1' as AspectRatio, icon: <Square size={14} />, label: '1:1' }
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setAspectRatio(item.r)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: aspectRatio === item.r ? 'var(--accent-blue)' : 'var(--border-strong)',
                      backgroundColor: aspectRatio === item.r ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-main)',
                      color: aspectRatio === item.r ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Video Süresi
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { d: 15 as const, label: '15s (Hızlı)' },
                  { d: 30 as const, label: '30s (Standart)' },
                  { d: 45 as const, label: '45s (Detaylı)' }
                ].map((item) => (
                  <button
                    key={item.d}
                    type="button"
                    onClick={() => setDurationPreset(item.d)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: durationPreset === item.d ? 'var(--accent-blue)' : 'var(--border-strong)',
                      backgroundColor: durationPreset === item.d ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-main)',
                      color: durationPreset === item.d ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voiceover & Background Music Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            backgroundColor: 'var(--bg-main)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Voiceover */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Volume2 size={14} color="#10b981" />
                  AI Seslendirme
                </span>
                <input
                  type="checkbox"
                  checked={includeVoiceover}
                  onChange={(e) => setIncludeVoiceover(e.target.checked)}
                  style={{ accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                />
              </div>
              <select
                disabled={!includeVoiceover}
                value={voiceLanguage}
                onChange={(e) => setVoiceLanguage(e.target.value as 'tr-TR' | 'en-US')}
                style={{ width: '100%', opacity: includeVoiceover ? 1 : 0.5 }}
              >
                <option value="tr-TR">Türkçe (Doğal Telaffuz)</option>
                <option value="en-US">İngilizce (Global Global)</option>
              </select>
            </div>

            {/* BGM */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Music size={14} color="#3b82f6" />
                  Fon Müziği (Synth)
                </span>
                <input
                  type="checkbox"
                  checked={includeBGM}
                  onChange={(e) => setIncludeBGM(e.target.checked)}
                  style={{ accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                />
              </div>
              <select
                disabled={!includeBGM}
                value={bgmGenre}
                onChange={(e) => setBgmGenre(e.target.value as SynthGenre)}
                style={{ width: '100%', opacity: includeBGM ? 1 : 0.5 }}
              >
                <option value="tech">Modern Tech</option>
                <option value="energetic">Enerjik Beat</option>
                <option value="ambient">Ambient Kurumsal</option>
                <option value="lofi">Lo-Fi Chill</option>
              </select>
            </div>
          </div>

          {/* Optional: Upload site screenshot */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Site Ekran Görüntüsü (Opsiyonel)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-strong)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}>
                <Upload size={14} />
                {customScreenshotUrl ? 'Görsel Seçildi ✓' : 'Ekran Görüntüsü Yükle'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Yüklenmezse şık bir yapay zeka SaaS dashboard mockup'ı oluşturulur.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
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
            İptal
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#ffffff',
              boxShadow: '0 2px 12px rgba(37, 99, 235, 0.4)',
              cursor: isGenerating ? 'wait' : 'pointer',
              opacity: isGenerating ? 0.7 : 1
            }}
          >
            <Sparkles size={16} />
            {isGenerating ? 'Senaryo ve Video Üretiliyor...' : 'Yapay Zeka ile Tanıtım Videosu Üret 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};
