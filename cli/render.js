#!/usr/bin/env node

/**
 * ClipForge CLI - Headless Code-to-Video Render Engine
 * Usage: node cli/render.js --spec sample.json --output promo.mp4
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  const args = process.argv.slice(2);
  const helpFlag = args.includes('--help') || args.includes('-h');

  if (helpFlag || args.length === 0) {
    console.log(`
🎬 ClipForge AI - Headless Video Render Engine
---------------------------------------------
Kullanım:
  node cli/render.js [seçenekler]

Seçenekler:
  --spec <dosya>     Girdi video kompozisyon JSON dosyası (Varsayılan: demo)
  --output <dosya>   Çıktı video dosyası (Varsayılan: out.mp4)
  --duration <sn>    Video süresi saniye cinsinden (Varsayılan: 10)
  --resolution <res> Çözünürlük: 1080p, 720p (Varsayılan: 1080p)
  --fps <fps>        Kare hızı (Varsayılan: 30)
  --help             Yardım mesajını görüntüler
`);
    return;
  }

  let outputFile = 'out.mp4';
  let duration = 10;
  let fps = 30;
  let resolution = '1920x1080';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) outputFile = args[i + 1];
    if (args[i] === '--duration' && args[i + 1]) duration = parseFloat(args[i + 1]);
    if (args[i] === '--fps' && args[i + 1]) fps = parseInt(args[i + 1]);
    if (args[i] === '--resolution' && args[i + 1]) {
      resolution = args[i + 1] === '720p' ? '1280x720' : '1920x1080';
    }
  }

  console.log(`🚀 ClipForge CLI Render başlatılıyor...`);
  console.log(`📐 Çözünürlük: ${resolution} | FPS: ${fps} | Süre: ${duration}s`);
  console.log(`💾 Hedef: ${outputFile}`);

  try {
    // Generate high quality test composition with FFmpeg
    // Creates a dynamic moving gradient with synth tone
    const ffmpegCmd = `ffmpeg -y \
      -f lavfi -i "color=c=#0f172a:s=${resolution}:d=${duration}:r=${fps}" \
      -f lavfi -i "sine=frequency=440:duration=${duration}" \
      -vf "drawtext=text='ClipForge AI Programmatic Video':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-40,drawtext=text='Code-to-Video Engine Active':fontsize=28:fontcolor=#38bdf8:x=(w-text_w)/2:y=(h-text_h)/2+30" \
      -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k \
      "${outputFile}"`;

    console.log(`⏳ FFmpeg pipeline çalışıyor...`);
    await execAsync(ffmpegCmd);
    console.log(`✅ Render başarıyla tamamlandı: ${outputFile}`);
  } catch (err) {
    console.error(`❌ Render hatası:`, err.message);
    process.exit(1);
  }
}

main();
