import { Clip, AspectRatio } from '../types/editor';
import { PluginRegistry } from '../services/pluginRegistry';
import { FrameContext } from '../types/plugin';

export class CanvasRenderer {
  /**
   * Main render function called on every animation frame or export frame
   */
  static renderFrame(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentTime: number,
    clips: Clip[],
    aspectRatio: AspectRatio,
    mediaCache: Map<string, HTMLImageElement | HTMLVideoElement>
  ): void {
    // 1. Clear background
    ctx.clearRect(0, 0, width, height);

    // 2. Draw cinematic background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0a0d14');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Subtle animated ambient particles / glow
    this.drawAmbientGlow(ctx, width, height, currentTime);

    // 4. Sort clips by zIndex
    const activeClips = clips
      .filter(c => currentTime >= c.startTime && currentTime <= (c.startTime + c.duration))
      .sort((a, b) => a.zIndex - b.zIndex);

    const frameContext: FrameContext = {
      ctx,
      width,
      height,
      currentTime,
      duration: clips.reduce((acc, c) => Math.max(acc, c.startTime + c.duration), 15),
      fps: 30,
      aspectRatio,
      activeClips
    };

    // Plugin Hook: Before Render
    PluginRegistry.runBeforeRender(frameContext);

    // 5. Draw active clips
    for (const clip of activeClips) {
      // Check if custom plugin handles this element
      if (PluginRegistry.tryCustomDraw(clip, frameContext)) {
        continue;
      }

      const clipProgress = (currentTime - clip.startTime) / clip.duration;
      ctx.save();

      // Common transforms
      const posX = (clip.x / 100) * width;
      const posY = (clip.y / 100) * height;
      const clipW = (clip.width / 100) * width;
      const clipH = (clip.height / 100) * height;

      ctx.translate(posX, posY);
      ctx.rotate((clip.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, Math.min(1, clip.opacity));

      if (clip.type === 'mockup') {
        this.drawMockup(ctx, clipW, clipH, clip, clipProgress, currentTime, mediaCache);
      } else if (clip.type === 'text') {
        this.drawText(ctx, clip, clipProgress, width, height);
      } else if (clip.type === 'overlay') {
        this.drawOverlayBadge(ctx, clipW, clipH, clip, clipProgress);
      } else if (clip.type === 'image' || clip.type === 'video') {
        this.drawImageOrVideo(ctx, clipW, clipH, clip, clipProgress, mediaCache);
      }

      ctx.restore();
    }

    // Plugin Hook: After Render
    PluginRegistry.runAfterRender(frameContext);

    // 6. Cinematic subtle vignette
    this.drawVignette(ctx, width, height);
  }

  private static drawAmbientGlow(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ): void {
    ctx.save();
    const glowX = width * 0.5 + Math.sin(time * 0.8) * (width * 0.2);
    const glowY = height * 0.4 + Math.cos(time * 0.6) * (height * 0.15);
    const radGrad = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, width * 0.6);
    radGrad.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
    radGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  private static drawMockup(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    clip: Clip,
    progress: number,
    time: number,
    mediaCache: Map<string, HTMLImageElement | HTMLVideoElement>
  ): void {
    // Smooth entrance scale
    let scale = clip.scale || 1;
    if (progress < 0.15) {
      const enter = progress / 0.15;
      scale *= 0.85 + 0.15 * Math.sin(enter * Math.PI * 0.5);
    }
    // Subtle breathing float
    const floatY = Math.sin(time * 2) * 6;

    ctx.translate(0, floatY);
    ctx.scale(scale, scale);

    const x = -w / 2;
    const y = -h / 2;
    const radius = 12;
    const isDark = clip.theme !== 'light';

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    // Window container
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Window border
    ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Browser Chrome Header
    const headerH = 34;
    ctx.beginPath();
    ctx.roundRect(x, y, w, headerH, [radius, radius, 0, 0]);
    ctx.fillStyle = isDark ? '#0f172a' : '#f1f5f9';
    ctx.fill();

    // 3 Dots (Mac style)
    const dotColors = ['#ef4444', '#f59e0b', '#10b981'];
    dotColors.forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(x + 16 + i * 14, y + headerH / 2, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Address Bar
    const addrW = Math.min(w * 0.6, 260);
    const addrH = 20;
    const addrX = x + (w - addrW) / 2;
    const addrY = y + (headerH - addrH) / 2;

    ctx.beginPath();
    ctx.roundRect(addrX, addrY, addrW, addrH, 5);
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.fill();

    // URL Text
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayUrl = (clip.mockupUrl || 'https://yoursite.com').replace(/^https?:\/\//, '');
    ctx.fillText(`🔒 https://${displayUrl}`, addrX + addrW / 2, addrY + addrH / 2 + 1);

    // Content Body Area
    const bodyY = y + headerH;
    const bodyH = h - headerH;

    // Clip to body area
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, bodyY, w, bodyH, [0, 0, radius, radius]);
    ctx.clip();

    const mediaImg = clip.src ? mediaCache.get(clip.src) : null;
    if (mediaImg && mediaImg instanceof HTMLImageElement && mediaImg.complete && mediaImg.naturalWidth > 0) {
      // Ken burns zoom if enabled
      let imgScale = 1;
      if (clip.kenBurns) {
        imgScale = 1 + progress * 0.08;
      }
      const iw = w * imgScale;
      const ih = bodyH * imgScale;
      const ix = x + (w - iw) / 2;
      const iy = bodyY + (bodyH - ih) / 2;
      ctx.drawImage(mediaImg, ix, iy, iw, ih);
    } else {
      // Procedural gorgeous SaaS mockup preview!
      this.drawProceduralMockupContent(ctx, x, bodyY, w, bodyH, isDark, clip);
    }

    ctx.restore();
  }

  private static drawProceduralMockupContent(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isDark: boolean,
    clip: Clip
  ): void {
    // Hero background
    const heroGrad = ctx.createLinearGradient(x, y, x, y + h);
    heroGrad.addColorStop(0, isDark ? '#090d16' : '#f8fafc');
    heroGrad.addColorStop(1, isDark ? '#131b2e' : '#eef2ff');
    ctx.fillStyle = heroGrad;
    ctx.fillRect(x, y, w, h);

    // Simulated Top Navbar
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(x + 20, y + 15, 60, 10);
    ctx.fillRect(x + 90, y + 16, 30, 8);
    ctx.fillRect(x + 130, y + 16, 30, 8);
    ctx.fillRect(x + 170, y + 16, 30, 8);

    // CTA in nav
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(x + w - 70, y + 12, 50, 16, 4);
    ctx.fill();

    // Large Hero Title
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(clip.name || 'NextGen Platform', x + w / 2, y + h * 0.3);

    // Hero Subtitle lines
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Hızlı, akıllı ve modern çözümler ile sitenizi büyütün.', x + w / 2, y + h * 0.3 + 22);

    // Center Hero Feature Card
    const cardW = w * 0.8;
    const cardH = h * 0.35;
    const cardX = x + (w - cardW) / 2;
    const cardY = y + h * 0.48;

    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 8);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Mini chart inside card
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cardX + 20, cardY + cardH - 15);
    ctx.lineTo(cardX + cardW * 0.25, cardY + cardH * 0.6);
    ctx.lineTo(cardX + cardW * 0.5, cardY + cardH * 0.4);
    ctx.lineTo(cardX + cardW * 0.75, cardY + cardH * 0.5);
    ctx.lineTo(cardX + cardW - 20, cardY + 20);
    ctx.stroke();

    // Highlight metrics
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('▲ +328% Verimlilik', cardX + 15, cardY + 22);
  }

  private static drawText(
    ctx: CanvasRenderingContext2D,
    clip: Clip,
    progress: number,
    width: number,
    height: number
  ): void {
    const rawText = clip.text || '';
    if (!rawText) return;

    let displayText = rawText;
    let animOffset = 0;
    let scale = clip.scale || 1;

    // Animation effects
    switch (clip.animation) {
      case 'typewriter': {
        const charCount = Math.floor(rawText.length * Math.min(1, progress * 1.5));
        displayText = rawText.slice(0, charCount);
        break;
      }
      case 'kinetic-pop': {
        if (progress < 0.2) {
          const t = progress / 0.2;
          // elastic spring pop
          scale = 0.5 + 0.5 * Math.sin(t * Math.PI * 0.5);
          if (t < 0.7) scale *= 1.1;
        }
        break;
      }
      case 'slide-up': {
        if (progress < 0.25) {
          const t = progress / 0.25;
          animOffset = (1 - t) * 25;
        }
        break;
      }
      case 'glow': {
        ctx.shadowColor = clip.color || '#38bdf8';
        ctx.shadowBlur = 15 + Math.sin(progress * 10) * 8;
        break;
      }
      default:
        break;
    }

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(0, animOffset);

    // Background badge box if requested
    if (clip.backgroundColor) {
      ctx.font = `${clip.fontWeight || '700'} ${clip.fontSize || 24}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      const metrics = ctx.measureText(displayText);
      const padX = 16;
      const padY = 8;
      ctx.fillStyle = clip.backgroundColor;
      ctx.beginPath();
      ctx.roundRect(-metrics.width / 2 - padX, -clip.fontSize! / 2 - padY, metrics.width + padX * 2, clip.fontSize! + padY * 2, 8);
      ctx.fill();
    }

    ctx.font = `${clip.fontWeight || '700'} ${clip.fontSize || 28}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = clip.color || '#ffffff';
    ctx.textAlign = clip.textAlign || 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(displayText, 0, 0);

    ctx.restore();
  }

  private static drawOverlayBadge(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    clip: Clip,
    progress: number
  ): void {
    if (!clip.badge) return;

    // Pop scale in
    let scale = clip.scale || 1;
    if (progress < 0.2) {
      scale *= Math.min(1, (progress / 0.2) * 1.05);
    }

    ctx.scale(scale, scale);

    const padX = 18;
    const badgeH = 34;

    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    const textWidth = ctx.measureText(clip.badge).width;
    const badgeW = Math.max(textWidth + padX * 2, 120);

    const bx = -badgeW / 2;
    const by = -badgeH / 2;

    // Glassmorphic badge background
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 17);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();

    // Glowing border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Badge text
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(clip.badge, 0, 0);
  }

  private static drawImageOrVideo(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    clip: Clip,
    progress: number,
    mediaCache: Map<string, HTMLImageElement | HTMLVideoElement>
  ): void {
    if (!clip.src) return;
    const media = mediaCache.get(clip.src);
    if (!media) return;

    let scale = clip.scale || 1;
    if (clip.kenBurns) {
      scale *= 1 + progress * 0.12;
    }
    ctx.scale(scale, scale);

    // Apply visual filters if present
    if (clip.filters) {
      const f = clip.filters;
      ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px)`;
    }

    const ix = -w / 2;
    const iy = -h / 2;

    try {
      ctx.drawImage(media, ix, iy, w, h);
    } catch (e) {
      // media not ready or failed to draw
    }

    ctx.filter = 'none';
  }

  private static drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    const radius = Math.max(width, height) * 0.7;
    const vigGrad = ctx.createRadialGradient(width / 2, height / 2, radius * 0.5, width / 2, height / 2, radius);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
