import React, { useState } from 'react';
import { PluginRegistry } from '../../services/pluginRegistry';
import { ClipForgePlugin } from '../../types/plugin';
import { 
  Puzzle, 
  X, 
  CheckCircle2, 
  Code, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface PluginManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginManagerModal: React.FC<PluginManagerModalProps> = ({ isOpen, onClose }) => {
  const [plugins, setPlugins] = useState<ClipForgePlugin[]>(PluginRegistry.getAll());
  const [activeTab, setActiveTab] = useState<'installed' | 'sdk'>('installed');

  if (!isOpen) return null;

  const handleTogglePlugin = (pluginId: string, currentEnabled: boolean) => {
    PluginRegistry.setEnabled(pluginId, !currentEnabled);
    setPlugins([...PluginRegistry.getAll()]);
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
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Puzzle size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Düzenleme Yetenekleri & Eklenti Merkezi (Plugin Hub)
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Dışarıdaki video düzenleme becerilerini ve özel görsel efekt filtrelerini tek bir çatı altında yönetin.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          padding: '8px 18px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveTab('installed')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              color: activeTab === 'installed' ? '#ffffff' : 'var(--text-muted)',
              backgroundColor: activeTab === 'installed' ? 'var(--bg-surface-elevated)' : 'transparent'
            }}
          >
            Yüklü Yetenekler ({plugins.length})
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              color: activeTab === 'sdk' ? '#ffffff' : 'var(--text-muted)',
              backgroundColor: activeTab === 'sdk' ? 'var(--bg-surface-elevated)' : 'transparent'
            }}
          >
            Özel Eklenti Geliştirme (SDK)
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'installed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid',
                    borderColor: plugin.enabled ? 'rgba(139, 92, 246, 0.4)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                        {plugin.name}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(236, 72, 153, 0.15)',
                        color: '#f472b6',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        v{plugin.version}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Yazar: {plugin.author}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {plugin.description}
                    </p>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', color: plugin.enabled ? '#4ade80' : 'var(--text-muted)' }}>
                      {plugin.enabled ? 'Aktif' : 'Pasif'}
                    </span>
                    <input
                      type="checkbox"
                      checked={plugin.enabled}
                      onChange={() => handleTogglePlugin(plugin.id, plugin.enabled)}
                      style={{ accentColor: 'var(--accent-emerald)', cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sdk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  Kendi Video Becerini (Plugin) Nasıl Yazarsın?
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  ClipForge mimarisi, her video çerçevesinde (per-frame) çalışan kancalar (hooks) sunar. Bir nesne oluşturup `PluginRegistry.register(myPlugin)` demeniz yeterlidir:
                </p>

                <pre style={{
                  backgroundColor: '#05070c',
                  color: '#38bdf8',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  lineHeight: 1.5
                }}>
{`import { ClipForgePlugin, FrameContext } from './types/plugin';

export const myCustomFilterPlugin: ClipForgePlugin = {
  id: 'my-neon-glow',
  name: 'Neon Glow Efekti',
  version: '1.0.0',
  description: 'Tüm başlıklara dinamik titreşen neon ışık katar.',
  category: 'filter',
  author: 'Geliştirici',
  enabled: true,

  afterRenderFrame: ({ ctx, width, height, currentTime }) => {
    // Özel per-frame canvas çiziminiz
  }
};`}
                </pre>
              </div>
            </div>
          )}
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
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
