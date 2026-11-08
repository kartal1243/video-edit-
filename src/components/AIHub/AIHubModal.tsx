import React, { useState, useEffect } from 'react';
import { AIProviderHub } from '../../services/aiProviderHub';
import { AIProviderConfig, AIProviderStatus } from '../../types/aiProviders';
import { 
  Bot, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';

interface AIHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIHubModal: React.FC<AIHubModalProps> = ({ isOpen, onClose }) => {
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [statuses, setStatuses] = useState<Record<string, AIProviderStatus>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'llm' | 'tts' | 'video'>('all');

  useEffect(() => {
    if (isOpen) {
      setProviders(AIProviderHub.getProviders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    const updated = providers.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
    setProviders(updated);
    AIProviderHub.saveProviders(updated);
  };

  const handleKeyChange = (id: string, key: string) => {
    const updated = providers.map((p) => (p.id === id ? { ...p, apiKey: key } : p));
    setProviders(updated);
    AIProviderHub.saveProviders(updated);
  };

  const handleModelChange = (id: string, model: string) => {
    const updated = providers.map((p) => (p.id === id ? { ...p, model } : p));
    setProviders(updated);
    AIProviderHub.saveProviders(updated);
  };

  const handleTest = async (provider: AIProviderConfig) => {
    setTestingId(provider.id);
    const result = await AIProviderHub.testConnection(provider);
    setStatuses((prev) => ({ ...prev, [provider.id]: result }));
    setTestingId(null);
  };

  const filteredProviders = providers.filter((p) => {
    if (activeTab === 'all') return true;
    return p.type === activeTab;
  });

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
        maxWidth: '750px',
        maxHeight: '88vh',
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
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Bot size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Yapay Zeka Sağlayıcı & API Merkezi (AI Hub)
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Harici yapay zekalara (OpenAI, Gemini, Claude, ElevenLabs, Ollama) bağlanın ve video üretimini güçlendirin.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          padding: '8px 18px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '8px'
        }}>
          {[
            { id: 'all', label: 'Tüm Sağlayıcılar' },
            { id: 'llm', label: 'Metin & Senaryo (LLM)' },
            { id: 'tts', label: 'Seslendirme (TTS)' },
            { id: 'video', label: 'Video Üretimi' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: activeTab === tab.id ? 'var(--bg-surface-elevated)' : 'transparent'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Providers List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {filteredProviders.map((provider) => {
            const status = statuses[provider.id];
            const isLocal = provider.id === 'local-ai';

            return (
              <div
                key={provider.id}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid',
                  borderColor: provider.enabled ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Provider Title & Switch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                      {provider.name}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isLocal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: isLocal ? '#34d399' : '#60a5fa'
                    }}>
                      {provider.type.toUpperCase()}
                    </span>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '11px', color: provider.enabled ? '#4ade80' : 'var(--text-muted)' }}>
                      {provider.enabled ? 'Aktif' : 'Devre Dışı'}
                    </span>
                    <input
                      type="checkbox"
                      checked={provider.enabled}
                      disabled={isLocal}
                      onChange={() => handleToggle(provider.id)}
                      style={{ accentColor: 'var(--accent-emerald)', cursor: isLocal ? 'default' : 'pointer' }}
                    />
                  </label>
                </div>

                {/* API Key & Model Config */}
                {!isLocal && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        placeholder={provider.id === 'ollama' ? 'http://localhost:11434 (Endpoint)' : 'API Anahtarı (sk-...)'}
                        value={provider.apiKey || ''}
                        onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                        style={{ width: '100%', paddingLeft: '28px', fontSize: '12px' }}
                      />
                      <Key size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '9px', top: '10px' }} />
                    </div>

                    <input
                      type="text"
                      placeholder="Model"
                      value={provider.model || ''}
                      onChange={(e) => handleModelChange(provider.id, e.target.value)}
                      style={{ width: '100%', fontSize: '12px' }}
                    />

                    <button
                      onClick={() => handleTest(provider)}
                      disabled={testingId === provider.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '7px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-strong)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <RefreshCw size={12} className={testingId === provider.id ? 'animate-spin' : ''} />
                      Test Et
                    </button>
                  </div>
                )}

                {/* Status indicator */}
                {status && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: status.isAvailable ? '#4ade80' : '#ef4444'
                  }}>
                    {status.isAvailable ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {status.message}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: 'var(--accent-blue)',
              color: '#ffffff'
            }}
          >
            Tamamlandı
          </button>
        </div>
      </div>
    </div>
  );
};
