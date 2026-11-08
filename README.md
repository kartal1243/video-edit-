# 🎬 ClipForge AI

> **Açık Kaynak Yapay Zeka Destekli Video Editörü ve Web Siteleri İçin Tanıtım Videosu Oluşturucu**  
> *Next-generation open-source AI video editor and website promotional video studio.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Öne Çıkan Özellikler (Key Features)

### 🚀 1. 1-Tıkla AI Web Sitesi Tanıtım Videosu Üretici
- **Otomatik Senaryo ve Storyboard**: Web sitenizin adını ve vaadini girin; yapay zeka 5 aşamalı kanca (Hook), vitrin reveal, öne çıkan özellikler, sosyal kanıt ve CTA (Call to Action) sahnelerini saniyeler içinde oluştursun.
- **3D Animasyonlu Tarayıcı & Cihaz Mockup'ları**: Safari macOS penceresi, URL çubuğu, gerçek zamanlı dalgalanma efekti ve Ken Burns sinematik kamera yaklaşımı.
- **Doğal AI Seslendirme**: Web Speech API ile Türkçe ve İngilizce senkronize seslendirme.
- **Prosedürel Fon Müziği**: Web Audio API ile sıfır telif hakkı riski olan dinamik Modern Tech, Enerjik, Ambient ve Lo-Fi synth ritimleri (konuşma esnasında otomatik ses kısma / audio ducking desteğiyle).

### 🎬 2. Profesyonel Çok Kanallı Zaman Çizelgesi (Multi-Track Timeline)
- **4 Bağımsız Kanal**: Görsel & Mockup, Metin & Başlıklar, Rozet & İstatistikler, Ses & Müzik.
- **Hassas Kontroller**: Oynatma kafası (playhead) ile anlık gezinme, `S` tuşu ile klibi istediğiniz milisaniyeden bölme (split/cut), çoğaltma ve silme.
- **Zaman Ölçeği (Zoom)**: 20px ile 120px arasında zaman çizelgesini genişletip daraltabilme.

### 🎨 3. Çoklu Format & En Boy Oranı Desteği
- 🖥️ **16:9 Yatay**: Web siteleri, YouTube, masaüstü landing page kahraman videoları.
- 📱 **9:16 Dikey**: Instagram Reels, TikTok, YouTube Shorts viral formatları.
- 🔲 **1:1 Kare**: LinkedIn ve Instagram akış paylaşımları.

### 💾 4. Tarayıcı İçi ve Sunucu Destekli Render (Export)
- **İstemci Tarafı (Client-Side) Render**: WebCodecs & `MediaRecorder` ile doğrudan tarayıcınızda 1080p Full HD WebM/MP4 render alma.
- **Anlık Kapak Resmi (Thumbnail)**: Tek tıkla o anki karenin yüksek kaliteli PNG görselini indirme.
- **FFmpeg Sunucu Entegrasyonu**: Yerel `/usr/bin/ffmpeg` komut satırı destekli Node.js Express backend (`server/index.js`).

---

## 🛠️ Mimari ve Klasör Yapısı

```bash
video-edit-/
├── src/
│   ├── types/
│   │   └── editor.ts               # Video, klip, kanal ve şablon tipleri
│   ├── services/
│   │   ├── aiScriptService.ts      # Yapay zeka senaryo ve sahne üretim motoru
│   │   ├── speechService.ts        # Web Speech ses sentezleme motoru
│   │   ├── audioSynth.ts           # Web Audio API prosedürel synth müzik ve SFX
│   │   └── exportEngine.ts         # Canvas MediaRecorder 1080p video render motoru
│   ├── components/
│   │   ├── Header/                 # Üst gezinme, en boy oranı ve butonlar
│   │   ├── Canvas/                 # Gerçek zamanlı yüksek performanslı canvas önizleme
│   │   ├── Timeline/               # Çok kanallı zaman çizelgesi, kesme/bölme araçları
│   │   ├── Inspector/              # Sağ klip özellikleri paneli (yazı, efekt, mockup)
│   │   ├── LeftSidebar/            # AI araçları, medya yükleme, metin ve müzik sekmeleri
│   │   └── Modals/
│   │       ├── AIPromoWizardModal.tsx  # 1-Tıkla tanıtım videosu sihirbazı
│   │       ├── ExportModal.tsx         # Video render ve çözünürlük modalı
│   │       └── TemplatePickerModal.tsx # Hazır SaaS ve e-ticaret şablonları
│   ├── constants/
│   │   └── templates.ts            # Hazır şablon koleksiyonu
│   ├── utils/
│   │   └── canvasRenderers.ts      # Safari mockupları, kinetic yazı ve efekt çizimleri
│   ├── App.tsx                     # Ana editör orkestrasyonu ve durum yönetimi
│   └── index.css                   # Stüdyo tasarım sistemi ve CSS değişkenleri
├── server/
│   └── index.js                    # FFmpeg ve AI script Express backend API'si
├── package.json
└── vite.config.ts
```

---

## 🚀 Hızlı Başlangıç (Quickstart)

### Gereksinimler
- **Node.js** >= 18
- **npm**, **pnpm** veya **yarn**
- (Opsiyonel) **FFmpeg** (Sunucu tarafı render için)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kartal1243/video-edit-.git
cd video-edit-
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirici Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama otomatik olarak `http://localhost:5173` adresinde açılacaktır.

### 4. (Opsiyonel) FFmpeg Sunucusunu Başlatın
```bash
npm run server
```
Arka plan API'si `http://localhost:3001` portunda çalışacaktır.

---

## ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
| :--- | :--- |
| `Boşluk (Space)` | Oynat / Durdur |
| `S` | Seçili klibi oynatma kafasının olduğu yerden kes (Split) |
| `Delete` / `Backspace` | Seçili klibi sil |
| `Ctrl + D` | Seçili klibi çoğalt |

---

## 📄 Lisans (License)

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak sunulmuştur. Dilediğiniz gibi geliştirebilir, kendi siteleriniz veya projeleriniz için kullanabilirsiniz.
