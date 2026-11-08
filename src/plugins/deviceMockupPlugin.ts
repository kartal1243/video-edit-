import { ClipForgePlugin, FrameContext } from '../types/plugin';
import { Clip } from '../types/editor';

export const deviceMockupPlugin: ClipForgePlugin = {
  id: 'skill-device-mockups',
  name: 'Gelişmiş Cihaz & Terminal Vitrinleri',
  version: '1.0.0',
  description: 'iPhone 16 Pro çerçevesi, macOS Terminal CLI penceresi ve 3D izometrik vitrin modelleri.',
  author: 'ClipForge Core',
  category: 'animation',
  enabled: true,

  customDrawElement: (clip: Clip, context: FrameContext): boolean => {
    if (clip.type !== 'mockup') return false;

    const { ctx, width, height, currentTime } = context;
    const progress = Math.max(0, Math.min(1, (currentTime - clip.startTime) / clip.duration));

    // Terminal CLI window mockup
    if (clip.mockupType === 'chrome' || clip.badge?.includes('terminal') || clip.name.toLowerCase().includes('terminal')) {
      const w = (clip.width / 100) * width;
      const h = (clip.height / 100) * height;
      const posX = (clip.x / 100) * width;
      const posY = (clip.y / 100) * height;

      ctx.save();
      ctx.translate(posX, posY);

      const x = -w / 2;
      const y = -h / 2;
      const radius = 10;

      // Drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;

      // Window background
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // Border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Header
      const headerH = 32;
      ctx.beginPath();
      ctx.roundRect(x, y, w, headerH, [radius, radius, 0, 0]);
      ctx.fillStyle = '#020617';
      ctx.fill();

      // Window dots
      ['#ef4444', '#f59e0b', '#10b981'].forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(x + 16 + i * 14, y + headerH / 2, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });

      // Terminal title
      ctx.font = '11px var(--font-mono, monospace)';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('bash — 80x24', 0, y + headerH / 2 + 3);

      // Terminal Content
      const lines = [
        '❯ git clone https://github.com/kartal1243/video-edit-.git',
        '✔ Proje başarıyla klonlandı.',
        '❯ npm install && npm run dev',
        '🚀 Server hazır: http://localhost:5173',
        '⚡ Yapay zeka ile video motoru devrede...'
      ];

      const visibleLines = Math.min(lines.length, Math.floor(progress * (lines.length + 1)));

      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';

      lines.slice(0, visibleLines).forEach((line, i) => {
        const lineY = y + headerH + 24 + i * 22;
        if (line.startsWith('❯')) {
          ctx.fillStyle = '#38bdf8';
        } else if (line.startsWith('✔') || line.startsWith('🚀')) {
          ctx.fillStyle = '#4ade80';
        } else {
          ctx.fillStyle = '#e2e8f0';
        }
        ctx.fillText(line, x + 20, lineY);
      });

      // Blinking cursor
      if (Math.floor(currentTime * 3) % 2 === 0 && visibleLines < lines.length) {
        const cursorY = y + headerH + 24 + visibleLines * 22;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 20, cursorY - 12, 8, 14);
      }

      ctx.restore();
      return true;
    }

    return false;
  }
};
