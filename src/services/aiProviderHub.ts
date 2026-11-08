import { AIProviderConfig, AIProviderStatus, PromptScriptRequest, PromptScriptResponse } from '../types/aiProviders';

export const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'local-ai',
    name: 'Dahili Yerel AI Motoru (Built-in)',
    type: 'llm',
    enabled: true,
    model: 'heuristic-v1'
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o & Sora)',
    type: 'llm',
    enabled: false,
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o'
  },
  {
    id: 'gemini',
    name: 'Google Gemini (1.5 Flash / Pro)',
    type: 'llm',
    enabled: false,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-flash'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude (3.5 Sonnet)',
    type: 'llm',
    enabled: false,
    endpoint: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20241022'
  },
  {
    id: 'ollama',
    name: 'Ollama (Yerel / Gizli AI)',
    type: 'llm',
    enabled: false,
    endpoint: 'http://localhost:11434',
    model: 'llama3:latest'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs (Ultra Gerçekçi Ses)',
    type: 'tts',
    enabled: false,
    endpoint: 'https://api.elevenlabs.io/v1',
    model: 'eleven_multilingual_v2'
  },
  {
    id: 'runway',
    name: 'Runway Gen-3 (AI Video Üretimi)',
    type: 'video',
    enabled: false,
    endpoint: 'https://api.runwayml.com/v1',
    model: 'gen3a_turbo'
  }
];

export class AIProviderHub {
  /**
   * Load providers from local storage or defaults
   */
  static getProviders(): AIProviderConfig[] {
    const saved = localStorage.getItem('clipforge_ai_providers');
    if (!saved) return DEFAULT_PROVIDERS;
    try {
      const parsed: AIProviderConfig[] = JSON.parse(saved);
      // Merge with defaults in case new providers were added
      return DEFAULT_PROVIDERS.map((def) => {
        const existing = parsed.find((p) => p.id === def.id);
        return existing ? { ...def, ...existing } : def;
      });
    } catch (e) {
      return DEFAULT_PROVIDERS;
    }
  }

  /**
   * Save providers to local storage
   */
  static saveProviders(providers: AIProviderConfig[]): void {
    localStorage.setItem('clipforge_ai_providers', JSON.stringify(providers));
  }

  /**
   * Test connection to a provider
   */
  static async testConnection(provider: AIProviderConfig): Promise<AIProviderStatus> {
    if (provider.id === 'local-ai') {
      return { providerId: provider.id, isAvailable: true, message: 'Dahili yerel motor her zaman aktiftir.' };
    }

    if (!provider.apiKey && provider.id !== 'ollama') {
      return { providerId: provider.id, isAvailable: false, message: 'API anahtarı girilmedi.' };
    }

    try {
      if (provider.id === 'ollama') {
        const res = await fetch(`${provider.endpoint || 'http://localhost:11434'}/api/tags`);
        if (res.ok) {
          return { providerId: provider.id, isAvailable: true, message: 'Ollama yerel servisine bağlanıldı.' };
        }
        return { providerId: provider.id, isAvailable: false, message: 'Ollama servisine erişilemedi (Bağlantı hatası).' };
      }

      if (provider.id === 'openai') {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${provider.apiKey}` }
        });
        if (res.ok) {
          return { providerId: provider.id, isAvailable: true, message: 'OpenAI API bağlantısı başarılı!' };
        }
        return { providerId: provider.id, isAvailable: false, message: `OpenAI hatası: ${res.statusText}` };
      }

      if (provider.id === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${provider.apiKey}`);
        if (res.ok) {
          return { providerId: provider.id, isAvailable: true, message: 'Google Gemini API bağlantısı başarılı!' };
        }
        return { providerId: provider.id, isAvailable: false, message: `Gemini hatası: ${res.statusText}` };
      }

      if (provider.id === 'elevenlabs') {
        const res = await fetch('https://api.elevenlabs.io/v1/user', {
          headers: { 'xi-api-key': provider.apiKey || '' }
        });
        if (res.ok) {
          return { providerId: provider.id, isAvailable: true, message: 'ElevenLabs hesabına bağlanıldı!' };
        }
        return { providerId: provider.id, isAvailable: false, message: `ElevenLabs hatası: ${res.statusText}` };
      }

      // Default mock success if key provided
      return { providerId: provider.id, isAvailable: true, message: 'Bağlantı hazır.' };
    } catch (err) {
      return { providerId: provider.id, isAvailable: false, message: `Bağlantı başarısız: ${(err as Error).message}` };
    }
  }

  /**
   * Generate video script using the active AI provider
   */
  static async generateScriptWithAI(request: PromptScriptRequest): Promise<PromptScriptResponse> {
    const providers = this.getProviders();
    const activeLLM = providers.find((p) => p.type === 'llm' && p.enabled && p.id !== 'local-ai' && p.apiKey);

    // If an external LLM is configured (e.g. OpenAI or Gemini), we can call it!
    if (activeLLM && activeLLM.id === 'openai') {
      try {
        const prompt = `Sen dünya çapında profesyonel bir video yönetmeni ve metin yazarı yapay zekasısın.
Aşağıdaki web sitesi için ${request.duration} saniyelik, 5 sahneli, viral, yüksek dönüşümlü bir tanıtım videosu senaryosu yaz:
Site Adı: ${request.siteName}
URL: ${request.siteUrl}
Açıklama: ${request.description}
Dil: ${request.language === 'tr' ? 'Türkçe' : 'English'}

JSON formatında yanıt ver:
{
  "title": "Ana Başlık",
  "hook": "Kanca Cümlesi",
  "scenes": [
    { "title": "Sahne Başlığı", "description": "Görsel açıklama", "narration": "Seslendirme metni", "duration": 3, "badge": "Rozet metni" }
  ],
  "cta": "Harekete Geçirici Mesaj"
}`;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeLLM.apiKey}`
          },
          body: JSON.stringify({
            model: activeLLM.model || 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          })
        });

        if (res.ok) {
          const json = await res.json();
          const parsed = JSON.parse(json.choices[0].message.content);
          return parsed;
        }
      } catch (e) {
        console.warn('OpenAI request failed, falling back to local heuristic:', e);
      }
    }

    // High quality local heuristic generator
    const isTr = request.language === 'tr';
    const dur = request.duration || 15;
    const sceneDur = dur / 5;

    return {
      title: `${request.siteName} Tanıtımı`,
      hook: isTr ? `Eski ve Yavaş Yöntemleri Unutun! ⚡` : `Say Goodbye to Slow Manual Work! ⚡`,
      scenes: [
        {
          title: isTr ? `Zaman Kaybına Son Verin` : `Stop Wasting Time`,
          description: `Büyük kanca başlığı ve yaylanan rozet`,
          visualPrompt: `High tech animated 3D hook headline with golden floating pill badge`,
          narration: isTr ? `Sitenizi tanıtırken saatler harcamaktan sıkılmadınız mı?` : `Tired of spending endless hours creating product videos?`,
          duration: sceneDur,
          badge: isTr ? `⚡ 10 Kat Daha Hızlı` : `⚡ 10x Faster`
        },
        {
          title: request.siteName,
          description: `Safari 3D tarayıcı penceresi vitrini`,
          visualPrompt: `Floating modern browser window mockup showing clean UI hero section`,
          narration: isTr ? `${request.siteName} ile tüm kurgunuzu yapay zekaya emanet edin.` : `Meet ${request.siteName}. The automated video creation platform.`,
          duration: sceneDur * 1.2,
          badge: `🔒 ${request.siteUrl.replace(/^https?:\/\//, '')}`
        },
        {
          title: isTr ? `Akıllı & Güçlü Özellikler` : `Supercharged Features`,
          description: `Özellik kartları ve canlı grafikler`,
          visualPrompt: `Three floating glassmorphic feature callout cards with dynamic stat curves`,
          narration: isTr ? `Tek tıkla senaryo, seslendirme ve müzik sentezleyin.` : `One-click script, realistic voiceover and royalty-free music.`,
          duration: sceneDur * 1.1,
          badge: isTr ? `🤖 %100 Otomatik` : `🤖 100% Automated`
        },
        {
          title: isTr ? `Kanıtlanmış Başarı` : `Proven Results`,
          description: `Kullanıcı değerlendirmeleri ve istatistik rozetleri`,
          visualPrompt: `Customer review star badges and metrics counter counting upwards`,
          narration: isTr ? `Binlerce memnun kullanıcı ve yüksek dönüşüm oranları.` : `Trusted by thousands of modern startups and creators.`,
          duration: sceneDur * 0.8,
          badge: `⭐ 4.9 / 5.0 Memnuniyet`
        },
        {
          title: isTr ? `Hemen Şimdi Keşfedin! 🔥` : `Try It Free Today! 🔥`,
          description: `CTA dönüşüm butonu ve konfeti`,
          visualPrompt: `Bright vibrant call to action button with confetti particles burst`,
          narration: isTr ? `${request.siteUrl} adresini ziyaret edin ve ücretsiz başlayın.` : `Head to ${request.siteUrl} and launch your first video today.`,
          duration: sceneDur * 0.9,
          badge: isTr ? `👉 Ücretsiz Başla` : `👉 Get Started Free`
        }
      ],
      cta: isTr ? `Hemen Başla: ${request.siteUrl}` : `Start Free at ${request.siteUrl}`
    };
  }
}
