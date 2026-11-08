import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Healthcheck and FFmpeg detection
app.get('/api/status', async (req, res) => {
  try {
    const { stdout } = await execAsync('ffmpeg -version');
    const versionLine = stdout.split('\n')[0];
    res.json({
      status: 'online',
      ffmpeg: true,
      ffmpegVersion: versionLine,
      message: 'ClipForge AI Backend is ready for server-side video rendering.'
    });
  } catch (err) {
    res.json({
      status: 'online',
      ffmpeg: false,
      message: 'FFmpeg is not available in system path.'
    });
  }
});

// AI Script Generator Endpoint
app.post('/api/generate-script', (req, res) => {
  const { siteName, siteUrl, description, style, durationPreset, language } = req.body;
  const isTr = language ? language.startsWith('tr') : true;

  const hook = isTr
    ? `${siteName} ile Eski Yöntemlere Son Verin! ⚡`
    : `Stop Wasting Time with Outdated Tools! ⚡`;
  const reveal = isTr
    ? `Geleceğin çözümü ${siteUrl} adresinde yayında.`
    : `The modern solution is live at ${siteUrl}.`;
  const cta = isTr
    ? `Hemen Ücretsiz Başlayın: ${siteUrl}`
    : `Get Started Free at ${siteUrl}`;

  res.json({
    success: true,
    data: {
      hook,
      reveal,
      cta,
      duration: durationPreset || 15
    }
  });
});

app.listen(PORT, () => {
  console.log(`🎬 ClipForge AI Server running on http://localhost:${PORT}`);
});
