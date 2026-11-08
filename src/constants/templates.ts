import { PromoRequest } from '../types/editor';

export interface PresetTemplate {
  id: string;
  title: string;
  description: string;
  tag: string;
  badge: string;
  config: PromoRequest;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'saas-modern',
    title: 'Modern SaaS & Yapay Zeka Lansmanı',
    description: 'Koyu tema, 3D tarayıcı mockup, etkileyici istatistikler ve güçlü kanca.',
    tag: 'SaaS / AI',
    badge: '16:9 4K',
    config: {
      siteName: 'DevPulse AI',
      siteUrl: 'https://devpulse.ai',
      description: 'Yapay zeka ile sunucularınızı ve web sitelerinizi anlık izleyin, çöküşleri anında önleyin.',
      category: 'saas',
      style: 'modern-dark',
      durationPreset: 15,
      aspectRatio: '16:9',
      includeVoiceover: true,
      voiceLanguage: 'tr-TR',
      includeBGM: true,
      bgmGenre: 'tech'
    }
  },
  {
    id: 'ecommerce-drop',
    title: 'E-Ticaret & Kampanya Tanıtımı',
    description: 'Yüksek enerjili, indirim rozetleri ve dönüşüm odaklı harekete geçirici mesaj.',
    tag: 'E-Ticaret',
    badge: '16:9 & 9:16',
    config: {
      siteName: 'ModaStore',
      siteUrl: 'https://modastore.co',
      description: 'Yeni sezon koleksiyonu yayında. İlk siparişe özel %50 indirim ve aynı gün ücretsiz kargo!',
      category: 'ecommerce',
      style: 'bold-marketing',
      durationPreset: 15,
      aspectRatio: '16:9',
      includeVoiceover: true,
      voiceLanguage: 'tr-TR',
      includeBGM: true,
      bgmGenre: 'energetic'
    }
  },
  {
    id: 'mobile-reels',
    title: 'Viral Reels & TikTok Tanıtımı (9:16)',
    description: 'Dikey formatta, hızlı kinetic yazılar ve akıllı telefon mockup vitrini.',
    tag: 'Reels / Shorts',
    badge: '9:16 Dikey',
    config: {
      siteName: 'FitTrack Pro',
      siteUrl: 'https://fittrack.app',
      description: 'Yapay zeka antrenörün cebinde. Günlük kalori ve egzersiz takibi artık saniyeler sürüyor.',
      category: 'app',
      style: 'cyberpunk',
      durationPreset: 15,
      aspectRatio: '9:16',
      includeVoiceover: true,
      voiceLanguage: 'tr-TR',
      includeBGM: true,
      bgmGenre: 'energetic'
    }
  },
  {
    id: 'minimal-agency',
    title: 'Minimalist Ajans & Portfolyo',
    description: 'Apple stili sade estetik, zarif tipografi ve premium marka duruşu.',
    tag: 'Ajans / Portfolyo',
    badge: 'Minimal 1:1',
    config: {
      siteName: 'Aura Digital Studio',
      siteUrl: 'https://aurastudio.design',
      description: 'Ödüllü dijital ürünler, estetik web siteleri ve unutulmaz kullanıcı deneyimleri tasarlıyoruz.',
      category: 'agency',
      style: 'clean-minimal',
      durationPreset: 15,
      aspectRatio: '1:1',
      includeVoiceover: true,
      voiceLanguage: 'tr-TR',
      includeBGM: true,
      bgmGenre: 'lofi'
    }
  }
];
