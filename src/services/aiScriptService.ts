import { GeneratedScene, PromoRequest, Clip, Track } from '../types/editor';

export class AIScriptService {
  /**
   * Generates a multi-scene storyboard based on site details
   */
  static generateStoryboard(config: PromoRequest): GeneratedScene[] {
    const isTurkish = config.voiceLanguage.startsWith('tr');
    const name = config.siteName.trim() || (isTurkish ? 'Yeni Girişim' : 'NextGen App');
    const url = config.siteUrl.replace(/^https?:\/\//, '').trim() || (isTurkish ? 'siteniz.com' : 'yoursite.com');
    const desc = config.description.trim() || (isTurkish ? 'Yapay zeka ile sitelerinizi otomatik tanıtın' : 'AI powered automated workflow platform');

    const totalDuration = config.durationPreset || 15;
    // Split into 5 scenes: Hook (20%), Reveal (25%), Feature (25%), Proof (15%), CTA (15%)
    const hookDur = Math.round(totalDuration * 0.2);
    const revealDur = Math.round(totalDuration * 0.25);
    const featDur = Math.round(totalDuration * 0.25);
    const proofDur = Math.round(totalDuration * 0.15);
    const ctaDur = totalDuration - (hookDur + revealDur + featDur + proofDur);

    if (isTurkish) {
      return [
        {
          type: 'hook',
          title: `Artık Eski Yöntemleri Unutun! ⚡`,
          subtitle: `${desc.slice(0, 60)}...`,
          narration: `Sitenizi öne çıkarmak hiç bu kadar kolay olmamıştı.`,
          duration: hookDur,
          highlightCard: {
            tag: 'Zaman Kaybına Son',
            value: '10 Kat Daha Hızlı',
            icon: '⚡'
          }
        },
        {
          type: 'reveal',
          title: `${name}`,
          subtitle: `Geleceğin çözümü şimdi yayında: ${url}`,
          narration: `${name} ile tüm süreçlerinizi yapay zeka ile otomatikleştirin.`,
          duration: revealDur,
          mockupTheme: config.style === 'clean-minimal' ? 'light' : 'dark'
        },
        {
          type: 'feature',
          title: `Güçlü ve Akıllı Özellikler 🚀`,
          subtitle: `Tek tıkla entegrasyon, anlık analizler ve tam otomasyon`,
          narration: `Sadece birkaç saniyede harika sonuçlar üretin ve fark yaratın.`,
          duration: featDur,
          highlightCard: {
            tag: 'Yapay Zeka Destekli',
            value: '%100 Otonom',
            icon: '🤖'
          }
        },
        {
          type: 'proof',
          title: `Etkileyici Sonuçlar 📈`,
          subtitle: `Binlerce kullanıcı ve %99.8 memnuniyet oranı`,
          narration: `Geliştiricilerin ve işletmelerin 1 numaralı tercihi.`,
          duration: proofDur,
          highlightCard: {
            tag: 'Kullanıcı Memnuniyeti',
            value: '⭐ 4.9 / 5.0',
            icon: '🏆'
          }
        },
        {
          type: 'cta',
          title: `Hemen Şimdi Keşfedin! 🔥`,
          subtitle: `${url} adresinden ücretsiz deneyin`,
          narration: `Şimdi ${url} adresini ziyaret edin ve ücretsiz başlayın.`,
          duration: ctaDur,
          highlightCard: {
            tag: 'Sınırlı Fırsat',
            value: 'Ücretsiz Başla',
            icon: '👉'
          }
        }
      ];
    } else {
      // English version
      return [
        {
          type: 'hook',
          title: `Tired of slow, painful workflows? ⚡`,
          subtitle: `${desc.slice(0, 60)}...`,
          narration: `Showcasing your product has never been this effortless.`,
          duration: hookDur,
          highlightCard: {
            tag: 'Save Hours',
            value: '10x Faster',
            icon: '⚡'
          }
        },
        {
          type: 'reveal',
          title: `${name}`,
          subtitle: `Meet the next generation: ${url}`,
          narration: `Meet ${name}. The all-in-one AI platform built for the future.`,
          duration: revealDur,
          mockupTheme: config.style === 'clean-minimal' ? 'light' : 'dark'
        },
        {
          type: 'feature',
          title: `Engineered for High Performance 🚀`,
          subtitle: `One-click setup, instant analytics and modern UI`,
          narration: `Automate tasks, craft stunning assets, and scale effortlessly.`,
          duration: featDur,
          highlightCard: {
            tag: 'AI Powered',
            value: '100% Autonomous',
            icon: '🤖'
          }
        },
        {
          type: 'proof',
          title: `Loved by Thousands Worldwide 📈`,
          subtitle: `99.9% Uptime with industry-leading satisfaction`,
          narration: `Trusted by modern creators, developers and startups globally.`,
          duration: proofDur,
          highlightCard: {
            tag: 'Customer Rating',
            value: '⭐ 4.9 / 5.0',
            icon: '🏆'
          }
        },
        {
          type: 'cta',
          title: `Get Started Free Today! 🔥`,
          subtitle: `Visit ${url} and unlock your potential`,
          narration: `Head over to ${url} now and start building for free.`,
          duration: ctaDur,
          highlightCard: {
            tag: 'Instant Access',
            value: 'Try for Free',
            icon: '👉'
          }
        }
      ];
    }
  }

  /**
   * Converts generated scenes into timeline tracks & clips
   */
  static buildProjectClips(
    scenes: GeneratedScene[], 
    config: PromoRequest, 
    tracks: Track[]
  ): Clip[] {
    const clips: Clip[] = [];
    let currentTime = 0;

    const visualTrack = tracks.find(t => t.type === 'video') || tracks[0];
    const textTrack = tracks.find(t => t.type === 'text') || tracks[1];
    const overlayTrack = tracks.find(t => t.type === 'overlay') || tracks[2];
    const audioTrack = tracks.find(t => t.type === 'audio') || tracks[3];

    scenes.forEach((scene, index) => {
      const dur = scene.duration;

      // 1. Visual / Mockup Clip
      clips.push({
        id: `visual-${index}-${Date.now()}`,
        name: `Sahne ${index + 1}: ${scene.type.toUpperCase()}`,
        type: scene.type === 'reveal' ? 'mockup' : 'overlay',
        trackId: visualTrack.id,
        startTime: currentTime,
        duration: dur,
        x: 50,
        y: 50,
        width: 80,
        height: 60,
        rotation: 0,
        opacity: 1,
        scale: 1,
        zIndex: 1,
        mockupType: scene.type === 'reveal' ? 'safari' : 'card',
        mockupUrl: config.siteUrl || 'https://example.com',
        badge: scene.highlightCard?.tag,
        subBadge: scene.highlightCard?.value,
        theme: scene.mockupTheme || (config.style === 'clean-minimal' ? 'light' : 'dark'),
        kenBurns: true,
        src: config.customScreenshotUrl || ''
      });

      // 2. Animated Headline Text Clip
      clips.push({
        id: `text-title-${index}-${Date.now()}`,
        name: `Başlık: ${scene.title.slice(0, 15)}...`,
        type: 'text',
        trackId: textTrack.id,
        startTime: currentTime,
        duration: dur,
        x: 50,
        y: 20,
        width: 90,
        height: 15,
        rotation: 0,
        opacity: 1,
        scale: 1,
        zIndex: 10,
        text: scene.title,
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        animation: index === 0 ? 'kinetic-pop' : 'slide-up'
      });

      // 3. Subtitle / Value Text Clip
      clips.push({
        id: `text-sub-${index}-${Date.now()}`,
        name: `Alt Başlık: ${scene.subtitle.slice(0, 15)}...`,
        type: 'text',
        trackId: textTrack.id,
        startTime: currentTime + 0.3,
        duration: dur - 0.3,
        x: 50,
        y: 84,
        width: 85,
        height: 10,
        rotation: 0,
        opacity: 0.9,
        scale: 1,
        zIndex: 10,
        text: scene.subtitle,
        fontSize: 18,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
        animation: 'fade'
      });

      // 4. Highlight Card Badge (if present)
      if (scene.highlightCard) {
        clips.push({
          id: `badge-${index}-${Date.now()}`,
          name: `Rozet: ${scene.highlightCard.value}`,
          type: 'overlay',
          trackId: overlayTrack.id,
          startTime: currentTime + 0.5,
          duration: dur - 0.5,
          x: 50,
          y: 72,
          width: 40,
          height: 8,
          rotation: 0,
          opacity: 1,
          scale: 1,
          zIndex: 8,
          badge: `${scene.highlightCard.icon} ${scene.highlightCard.tag}: ${scene.highlightCard.value}`
        });
      }

      // 5. Voiceover Audio Clip (if enabled)
      if (config.includeVoiceover) {
        clips.push({
          id: `voice-${index}-${Date.now()}`,
          name: `AI Ses: Sahne ${index + 1}`,
          type: 'audio',
          trackId: audioTrack.id,
          startTime: currentTime + 0.2,
          duration: Math.min(dur - 0.4, 4.5),
          audioType: 'voiceover',
          volume: 0.95,
          synthesizedVoiceText: scene.narration,
          x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 1, scale: 1, zIndex: 0
        });
      }

      currentTime += dur;
    });

    // 6. Background Music Clip (if enabled)
    if (config.includeBGM) {
      clips.push({
        id: `bgm-main-${Date.now()}`,
        name: `Müzik: ${config.bgmGenre.toUpperCase()} Ritim`,
        type: 'audio',
        trackId: audioTrack.id,
        startTime: 0,
        duration: currentTime,
        audioType: 'music',
        synthGenre: config.bgmGenre,
        volume: 0.35, // ducked under voiceover
        x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 1, scale: 1, zIndex: 0
      });
    }

    return clips;
  }
}
