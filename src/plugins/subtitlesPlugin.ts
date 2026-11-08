import { ClipForgePlugin, FrameContext } from '../types/plugin';
import { Clip } from '../types/editor';

export const subtitlesPlugin: ClipForgePlugin = {
  id: 'skill-viral-captions',
  name: 'Viral Karaoke Altyazı Motoru',
  version: '1.0.0',
  description: 'Alex Hormozi ve MrBeast tarzı kelime kelime vurgulanan, yaylanan dinamik altyazı motoru.',
  author: 'ClipForge Core',
  category: 'animation',
  enabled: true,

  customDrawElement: (clip: Clip, context: FrameContext): boolean => {
    // Only handle text clips marked with animation: 'kinetic-pop' or custom subtitle badge
    if (clip.type !== 'text' || !clip.text) return false;
    if (clip.name !== 'Viral Altyazı' && !clip.badge?.includes('karaoke')) return false;

    const { ctx, width, height, currentTime } = context;
    const progress = Math.max(0, Math.min(1, (currentTime - clip.startTime) / clip.duration));
    const words = clip.text.split(' ');
    if (words.length === 0) return false;

    const activeIndex = Math.min(words.length - 1, Math.floor(progress * words.length));

    ctx.save();
    const posX = (clip.x / 100) * width;
    const posY = (clip.y / 100) * height;

    ctx.translate(posX, posY);

    const fontSize = clip.fontSize || 32;
    ctx.font = `900 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure total width to center properly
    const spaceWidth = ctx.measureText(' ').width;
    const wordWidths = words.map((w) => ctx.measureText(w).width);
    const totalWidth = wordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * spaceWidth;

    let currentX = -totalWidth / 2;

    words.forEach((word, index) => {
      const wWidth = wordWidths[index];
      const isCurrent = index === activeIndex;

      ctx.save();
      const wordCenterX = currentX + wWidth / 2;
      ctx.translate(wordCenterX, 0);

      if (isCurrent) {
        // Pop bounce animation on the active word
        const wordLocalProgress = (progress * words.length) - index;
        const popScale = 1.15 + 0.1 * Math.sin(wordLocalProgress * Math.PI);
        ctx.scale(popScale, popScale);

        // Highlight background box
        const padX = 8;
        const padY = 4;
        ctx.fillStyle = '#f59e0b'; // energetic vibrant amber/gold
        ctx.beginPath();
        ctx.roundRect(-wWidth / 2 - padX, -fontSize / 2 - padY, wWidth + padX * 2, fontSize + padY * 2, 6);
        ctx.fill();

        // Drop shadow for highlight
        ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#000000'; // high contrast black text on gold box
      } else {
        // Inactive words
        ctx.fillStyle = index < activeIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
      }

      ctx.fillText(word, 0, 0);
      ctx.restore();

      currentX += wWidth + spaceWidth;
    });

    ctx.restore();
    return true; // handled custom render
  }
};
