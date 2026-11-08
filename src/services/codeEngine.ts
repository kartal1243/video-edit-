import { VideoCompositionSpec, CodeExecutionResult, CodeSceneSpec } from '../types/composition';
import { Clip, Track, AspectRatio } from '../types/editor';

export class CodeEngine {
  /**
   * Default starter templates for code-driven videos
   */
  static getTemplates(): { id: string; name: string; description: string; code: string }[] {
    return [
      {
        id: 'saas-code',
        name: 'Modern SaaS Tanıtımı (Kod ile)',
        description: '5 sahneli, Safari mockup vitrini, kinetic başlıklar ve canlı sayaç içeren kod örneği.',
        code: `// ClipForge Video Composition Specification
export default {
  version: "1.0",
  name: "Geleceğin SaaS Platformu",
  fps: 30,
  aspectRatio: "16:9",
  duration: 15,
  audio: {
    bgm: { genre: "tech", volume: 0.35 },
    voiceover: [
      { text: "Sitelerinizi saniyeler içinde otomatik tanıtın.", language: "tr-TR" },
      { text: "Yapay zeka ile tüm kurgu ve seslendirme hazır.", language: "tr-TR" }
    ]
  },
  scenes: [
    {
      id: "scene-1",
      duration: 3,
      elements: [
        {
          id: "hook-text",
          type: "text",
          text: "Eski Yöntemleri Unutun! ⚡",
          fontSize: 38,
          color: "#ffffff",
          animation: "kinetic-pop",
          x: 50,
          y: 45
        }
      ]
    },
    {
      id: "scene-2",
      duration: 4.5,
      elements: [
        {
          id: "browser-mockup",
          type: "mockup",
          mockupType: "safari",
          url: "https://clipforge.ai",
          title: "ClipForge Studio",
          theme: "dark",
          x: 50,
          y: 52
        },
        {
          id: "scene-title",
          type: "text",
          text: "ClipForge AI Yayında 🚀",
          fontSize: 32,
          color: "#38bdf8",
          animation: "slide-up",
          x: 50,
          y: 18
        }
      ]
    },
    {
      id: "scene-3",
      duration: 4,
      elements: [
        {
          id: "stat-badge",
          type: "badge",
          text: "⚡ %300 Daha Hızlı Kurgu",
          x: 50,
          y: 40
        },
        {
          id: "sub-text",
          type: "text",
          text: "Yapay Zeka & Kod Odaklı Kurgu Motoru",
          fontSize: 24,
          color: "#94a3b8",
          animation: "typewriter",
          x: 50,
          y: 55
        }
      ]
    },
    {
      id: "scene-4",
      duration: 3.5,
      elements: [
        {
          id: "cta-title",
          type: "text",
          text: "Hemen Açık Kaynak İndir 🔥",
          fontSize: 36,
          color: "#ffffff",
          animation: "glow",
          x: 50,
          y: 40
        },
        {
          id: "cta-badge",
          type: "badge",
          text: "👉 github.com/kartal1243/video-edit-",
          x: 50,
          y: 60
        }
      ]
    }
  ]
};`
      },
      {
        id: 'terminal-code',
        name: 'Terminal CLI Developer Vitrini',
        description: 'Geliştirici araçları için otomatik yazılan terminal penceresi ve komut satırı.',
        code: `export default {
  version: "1.0",
  name: "CLI Developer Showcase",
  fps: 30,
  aspectRatio: "16:9",
  duration: 12,
  audio: {
    bgm: { genre: "energetic", volume: 0.3 }
  },
  scenes: [
    {
      id: "cli-scene",
      duration: 12,
      elements: [
        {
          id: "terminal-window",
          type: "mockup",
          mockupType: "chrome",
          title: "terminal",
          x: 50,
          y: 52
        },
        {
          id: "cli-header",
          type: "text",
          text: "Tek Komutla Kurgula 💻",
          fontSize: 34,
          color: "#4ade80",
          animation: "kinetic-pop",
          x: 50,
          y: 16
        }
      ]
    }
  ]
};`
      },
      {
        id: 'reels-code',
        name: 'Dikey Viral Shorts / Reels (9:16)',
        description: 'TikTok ve Instagram Reels için dikey formatlı dinamik video kurgusu.',
        code: `export default {
  version: "1.0",
  name: "Viral Reels Showcase",
  fps: 30,
  aspectRatio: "9:16",
  duration: 10,
  audio: {
    bgm: { genre: "energetic", volume: 0.4 }
  },
  scenes: [
    {
      id: "viral-scene-1",
      duration: 5,
      elements: [
        {
          id: "reels-title",
          type: "text",
          text: "DUR VE İZLE! 🛑",
          fontSize: 42,
          color: "#f59e0b",
          animation: "kinetic-pop",
          x: 50,
          y: 35
        },
        {
          id: "reels-sub",
          type: "text",
          text: "Videolarını Kodla Yönet",
          fontSize: 26,
          color: "#ffffff",
          animation: "typewriter",
          x: 50,
          y: 50
        }
      ]
    },
    {
      id: "viral-scene-2",
      duration: 5,
      elements: [
        {
          id: "reels-cta",
          type: "text",
          text: "Kodu Profilde Bulabilirsin 🔥",
          fontSize: 32,
          color: "#ffffff",
          animation: "glow",
          x: 50,
          y: 45
        }
      ]
    }
  ]
};`
      }
    ];
  }

  /**
   * Safely execute and parse code into a VideoCompositionSpec
   */
  static executeCode(code: string): CodeExecutionResult {
    try {
      // Clean export statements or function wrappers
      let executable = code.trim();
      executable = executable.replace(/export\s+default\s+/, 'return ');

      // Use safe Function constructor
      const evaluateFn = new Function(executable);
      const spec = evaluateFn() as VideoCompositionSpec;

      if (!spec || !spec.scenes || !Array.isArray(spec.scenes)) {
        return {
          success: false,
          error: 'Kod geçerli bir VideoCompositionSpec nesnesi döndürmelidir (scenes dizisi bulunamadı).'
        };
      }

      const tracks: Track[] = [
        { id: 'track-visuals', name: 'Görsel & Mockup', type: 'video' },
        { id: 'track-text', name: 'Metin & Başlık', type: 'text' },
        { id: 'track-overlays', name: 'Rozet & İstatistik', type: 'overlay' },
        { id: 'track-audio', name: 'Müzik & AI Ses', type: 'audio' }
      ];

      const clips = this.specToClips(spec, tracks);

      return {
        success: true,
        spec,
        clips,
        tracks
      };
    } catch (err) {
      return {
        success: false,
        error: `Kod çalıştırma hatası: ${(err as Error).message}`
      };
    }
  }

  /**
   * Convert composition spec to Timeline clips
   */
  static specToClips(spec: VideoCompositionSpec, tracks: Track[]): Clip[] {
    const clips: Clip[] = [];
    let currentTime = 0;

    const visualTrack = tracks.find((t) => t.type === 'video') || tracks[0];
    const textTrack = tracks.find((t) => t.type === 'text') || tracks[1];
    const overlayTrack = tracks.find((t) => t.type === 'overlay') || tracks[2];
    const audioTrack = tracks.find((t) => t.type === 'audio') || tracks[3];

    spec.scenes.forEach((scene, sceneIndex) => {
      const sceneDur = scene.duration || 4;

      scene.elements.forEach((el, elIndex) => {
        const clipStart = currentTime + (el.start || 0);
        const clipDur = el.duration || sceneDur;

        if (el.type === 'text') {
          clips.push({
            id: `code-text-${sceneIndex}-${elIndex}`,
            name: `Metin: ${(el.text || '').slice(0, 16)}`,
            type: 'text',
            trackId: textTrack.id,
            startTime: clipStart,
            duration: clipDur,
            x: el.x ?? 50,
            y: el.y ?? 50,
            width: 80,
            height: 20,
            rotation: 0,
            opacity: 1,
            scale: typeof el.scale === 'number' ? el.scale : 1,
            zIndex: el.zIndex ?? 10,
            text: el.text || '',
            fontSize: el.fontSize || 32,
            color: el.color || '#ffffff',
            animation: el.animation || 'slide-up'
          });
        } else if (el.type === 'mockup') {
          clips.push({
            id: `code-mockup-${sceneIndex}-${elIndex}`,
            name: `Mockup: ${el.title || el.mockupType || 'Safari'}`,
            type: 'mockup',
            trackId: visualTrack.id,
            startTime: clipStart,
            duration: clipDur,
            x: el.x ?? 50,
            y: el.y ?? 50,
            width: 75,
            height: 55,
            rotation: 0,
            opacity: 1,
            scale: typeof el.scale === 'number' ? el.scale : 1,
            zIndex: el.zIndex ?? 2,
            mockupType: el.mockupType || 'safari',
            mockupUrl: el.url || 'https://example.com',
            theme: el.theme || 'dark',
            kenBurns: true
          });
        } else if (el.type === 'badge') {
          clips.push({
            id: `code-badge-${sceneIndex}-${elIndex}`,
            name: `Rozet: ${(el.text || '').slice(0, 14)}`,
            type: 'overlay',
            trackId: overlayTrack.id,
            startTime: clipStart,
            duration: clipDur,
            x: el.x ?? 50,
            y: el.y ?? 70,
            width: 40,
            height: 8,
            rotation: 0,
            opacity: 1,
            scale: 1,
            zIndex: el.zIndex ?? 8,
            badge: el.text || '⚡ Özellik'
          });
        }
      });

      currentTime += sceneDur;
    });

    // Add audio if defined
    if (spec.audio?.bgm) {
      clips.push({
        id: `code-bgm-${Date.now()}`,
        name: `BGM: ${spec.audio.bgm.genre.toUpperCase()}`,
        type: 'audio',
        trackId: audioTrack.id,
        startTime: 0,
        duration: currentTime,
        audioType: 'music',
        synthGenre: spec.audio.bgm.genre,
        volume: spec.audio.bgm.volume || 0.35,
        x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 1, scale: 1, zIndex: 0
      });
    }

    if (spec.audio?.voiceover) {
      spec.audio.voiceover.forEach((vo, vIdx) => {
        clips.push({
          id: `code-vo-${vIdx}`,
          name: `AI Ses: ${vIdx + 1}`,
          type: 'audio',
          trackId: audioTrack.id,
          startTime: vIdx * 5,
          duration: 4.5,
          audioType: 'voiceover',
          synthesizedVoiceText: vo.text,
          volume: 0.95,
          x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 1, scale: 1, zIndex: 0
        });
      });
    }

    return clips;
  }

  /**
   * Convert timeline clips back to readable JavaScript code
   */
  static clipsToCode(clips: Clip[], duration: number, aspectRatio: AspectRatio, projectName: string): string {
    const bgmClip = clips.find((c) => c.type === 'audio' && c.audioType === 'music');
    const voiceClips = clips.filter((c) => c.type === 'audio' && c.audioType === 'voiceover');
    const visualClips = clips.filter((c) => c.type !== 'audio');

    return `// ClipForge Programmatic Composition
export default {
  version: "1.0",
  name: ${JSON.stringify(projectName)},
  fps: 30,
  aspectRatio: ${JSON.stringify(aspectRatio)},
  duration: ${duration.toFixed(1)},
  audio: {
    bgm: {
      genre: ${JSON.stringify(bgmClip?.synthGenre || 'tech')},
      volume: ${(bgmClip?.volume ?? 0.35).toFixed(2)}
    },
    voiceover: [
${voiceClips.map((v) => `      { text: ${JSON.stringify(v.synthesizedVoiceText || '')}, language: "tr-TR" }`).join(',\n')}
    ]
  },
  scenes: [
    {
      id: "main-scene",
      duration: ${duration.toFixed(1)},
      elements: [
${visualClips.map((c) => `        {
          id: ${JSON.stringify(c.id)},
          type: ${JSON.stringify(c.type === 'overlay' ? 'badge' : c.type)},
          start: ${c.startTime.toFixed(1)},
          duration: ${c.duration.toFixed(1)},
          x: ${c.x},
          y: ${c.y},
          scale: ${c.scale.toFixed(2)},
          ${c.text ? `text: ${JSON.stringify(c.text)},` : ''}
          ${c.fontSize ? `fontSize: ${c.fontSize},` : ''}
          ${c.color ? `color: ${JSON.stringify(c.color)},` : ''}
          ${c.animation ? `animation: ${JSON.stringify(c.animation)},` : ''}
          ${c.mockupType ? `mockupType: ${JSON.stringify(c.mockupType)},` : ''}
          ${c.mockupUrl ? `url: ${JSON.stringify(c.mockupUrl)},` : ''}
          ${c.badge ? `text: ${JSON.stringify(c.badge)},` : ''}
        }`).join(',\n')}
      ]
    }
  ]
};`;
  }
}
