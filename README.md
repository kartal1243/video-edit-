# 🎬 ClipForge AI

> **Açık Kaynak Kod Odaklı Video Editörü, Yapay Zeka Sağlayıcı Merkezi ve Genişletilebilir Eklenti Sistemi**  
> *Next-generation open-source programmatic code-to-video editor, multi-AI connector hub, and extensible video editing skill ecosystem.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Ana Yetenekler & Mimari (Core Systems)

ClipForge AI, klasik timeline video editörlerini modern yazılım geliştirme araçlarıyla birleştirir. Sürekli geliştirilebilir, modüler ve geleceğin yapay zeka servislerine bağlanabilir şekilde tasarlanmıştır:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ClipForge AI Studio                           │
├──────────────────┬───────────────────────┬─────────────────────────────┤
│  🎨 Visual Studio│ 💻 Code Playground    │ 🤖 Multi-AI Provider Hub    │
│  - Timeline Kurgu│ - Remotion-style DSL  │ - OpenAI (GPT-4o & Sora)    │
│  - Canvas Viewport│ - JSON/JS Compositions│ - Google Gemini 1.5 Flash   │
│  - Saniye/Kare Kes│ - Çift Yönlü Senkron  │ - Anthropic Claude 3.5      │
│  - Multi-track   │ - Canlı Hata Denetimi │ - Ollama (Yerel Gizli AI)   │
│                  │                       │ - ElevenLabs TTS            │
├──────────────────┴───────────────────────┴─────────────────────────────┤
│                    🧩 Extensible Plugin / Skill Engine                 │
│  - Viral Karaoke Subtitle Motoru (Alex Hormozi / MrBeast Style)        │
│  - Sinematik Işık & Parçacık (Particles) Filtresi                      │
│  - Gelişmiş Safari, iPhone 16 Pro & Terminal CLI Mockup Vitrinleri     │
│  - Prosedürel Web Audio Synthesizer (Telif Hakkı Sıfır BGM & SFX)      │
├────────────────────────────────────────────────────────────────────────┤
│                    💾 Çift Modlu Render & Export                       │
│  - İstemci Tarafı WebCodecs / MediaRecorder (1080p WebM/MP4)           │
│  - Headless Node.js CLI & FFmpeg Motoru (node cli/render.js)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 💻 1. Kodla Video Yapma (Code-to-Video Engine)
Videolarınızı declarative (bildirimsel) kod yazarak oluşturabilirsiniz:
- **Canlı Playground**: Stüdyo içindeki "Kodla Video" butonuna basarak anında kompozisyon kodunu çalıştırabilir, zaman çizelgesindeki videoları koda aktarabilir ya da kodu zaman çizelgesine dönüştürebilirsiniz.
- **Hazır Şablonlar**: SaaS Landing Promo, Terminal Developer Vitrini, Viral Dikey Reels (9:16).

```javascript
// Örnek: 15 Saniyelik Tanıtım Kompozisyonu
export default {
  version: "1.0",
  name: "Geleceğin SaaS Platformu",
  fps: 30,
  aspectRatio: "16:9",
  duration: 15,
  audio: {
    bgm: { genre: "tech", volume: 0.35 },
    voiceover: [
      { text: "Sitelerinizi saniyeler içinde otomatik tanıtın.", language: "tr-TR" }
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
      duration: 12,
      elements: [
        {
          id: "browser-mockup",
          type: "mockup",
          mockupType: "safari",
          url: "https://clipforge.ai",
          theme: "dark",
          x: 50,
          y: 50
        }
      ]
    }
  ]
};
```

---

### 🤖 2. Harici Yapay Zeka Bağlantıları (AI Hub)
ClipForge AI, tek bir modele bağımlı değildir. İstediğiniz yapay zekaya tek tıkla bağlanabilirsiniz:
- **OpenAI**: GPT-4o ile ultra yaratıcı senaryolar, OpenAI TTS ve Sora video kancaları.
- **Google Gemini**: Gemini 1.5 Flash ve Pro ile yüksek hızlı multimodal analiz.
- **Anthropic Claude**: Claude 3.5 Sonnet ile edebi ve dönüşüm odaklı kanca metinleri.
- **Ollama**: %100 çevrimdışı, yerel ve gizli çalışan açık kaynak LLM'ler (`http://localhost:11434`).
- **ElevenLabs**: İnsan doğallığında klonlanmış ve ultra gerçekçi seslendirmeler.
- **Dahili Yerel Motor**: Hiçbir API anahtarı olmadan sıfır maliyetle anında çalışan dahili kural motoru.

---

### 🧩 3. Genişletilebilir Eklenti & Beceri Mimarisi (Plugin SDK)
Kendi video efektinizi, animasyonunuzu veya geçişinizi yazıp sisteme kolayca kaydedebilirsiniz:

```typescript
import { ClipForgePlugin, FrameContext } from './types/plugin';

export const myCustomPlugin: ClipForgePlugin = {
  id: 'my-custom-effect',
  name: 'Özel Işık Efekti',
  version: '1.0.0',
  description: 'Videoların üzerine dinamik parıltı ekler.',
  category: 'filter',
  author: 'Geliştirici',
  enabled: true,

  afterRenderFrame: ({ ctx, width, height, currentTime }) => {
    // Her karede çalışan yüksek hızlı Canvas 2D çizimi
  }
};
```

---

### 🖥️ 4. Komut Satırından Video Üretimi (Headless CLI)
Geliştiriciler ve sunucular için terminalden anında video render alabilen CLI motoru:

```bash
# Hızlı test videosu üret (FFmpeg ile)
npm run cli -- --duration 5 --output tanitim.mp4

# Özel kompozisyon JSON dosyası ile render alma
node cli/render.js --spec examples/saas-promo.json --output cikti.mp4 --fps 60
```

---

## 🚀 Kurulum & Çalıştırma (Getting Started)

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kartal1243/video-edit-.git
cd video-edit-
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirici Arayüzünü Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresine giderek stüdyoyu kullanmaya başlayın.

### 4. (Opsiyonel) Express Arka Plan Servisini Başlatın
```bash
npm run server
```

---

## ⌨️ Kısayol Tuşları (Shortcuts)

| Kısayol | İşlev |
| :--- | :--- |
| `Boşluk (Space)` | Önizlemeyi Oynat / Durdur |
| `S` | Klibi oynatma imlecinin olduğu yerden böl (Split/Cut) |
| `Delete` / `Backspace` | Seçili klibi sil |
| `Ctrl + D` | Seçili klibi çoğalt |

---

## 📄 Lisans (License)

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak yayımlanmıştır. Dilediğiniz gibi ticari veya kişisel projelerinizde kullanabilir, forklayabilir ve katkıda bulunabilirsiniz.
