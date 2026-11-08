import { ClipForgePlugin, FrameContext } from '../types/plugin';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export const particlesPlugin: ClipForgePlugin = {
  id: 'skill-ambient-particles',
  name: 'Sinematik Işık & Parçacık Efekti',
  version: '1.0.0',
  description: 'Videoya sinematik derinlik katan yüzen ışık tozu ve dönüşüm sahnelerinde konfeti patlaması.',
  author: 'ClipForge Core',
  category: 'filter',
  enabled: true,

  afterRenderFrame: (context: FrameContext): void => {
    const { ctx, width, height, currentTime, duration } = context;

    ctx.save();
    const particleCount = 28;
    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#34d399'];

    for (let i = 0; i < particleCount; i++) {
      // Deterministic particle motion using sinusoids based on index and time
      const seed = i * 137.5;
      const speed = 0.4 + (i % 5) * 0.15;
      const t = currentTime * speed + seed;

      const px = ((Math.sin(t * 0.5) * 0.5 + 0.5) * width + (i * 47) % width) % width;
      const py = ((Math.cos(t * 0.4) * 0.5 + 0.5) * height + (i * 89) % height) % height;
      const size = 1.5 + (i % 3) * 1.5;
      const alpha = 0.15 + 0.25 * Math.sin(t + i);

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = Math.max(0, Math.min(0.6, alpha));
      ctx.shadowColor = colors[i % colors.length];
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    // End-of-video celebration sparkles (last 2 seconds)
    if (currentTime >= duration - 2.5) {
      const burstProgress = (currentTime - (duration - 2.5)) / 2.5;
      for (let j = 0; j < 18; j++) {
        const angle = (j / 18) * Math.PI * 2;
        const dist = burstProgress * width * 0.35;
        const cx = width / 2 + Math.cos(angle) * dist;
        const cy = height * 0.45 + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.globalAlpha = Math.max(0, 1 - burstProgress);
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fill();
      }
    }

    ctx.restore();
  }
};
