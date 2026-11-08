import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project, Clip, Track, AspectRatio, PromoRequest } from './types/editor';
import { AIScriptService } from './services/aiScriptService';
import { AudioSynthService } from './services/audioSynth';
import { SpeechService } from './services/speechService';
import { Header } from './components/Header/Header';
import { CanvasViewport } from './components/Canvas/CanvasViewport';
import { Timeline } from './components/Timeline/Timeline';
import { Inspector } from './components/Inspector/Inspector';
import { LeftSidebar } from './components/LeftSidebar/LeftSidebar';
import { AIPromoWizardModal } from './components/Modals/AIPromoWizardModal';
import { ExportModal } from './components/Modals/ExportModal';
import { TemplatePickerModal } from './components/Modals/TemplatePickerModal';
import { PRESET_TEMPLATES } from './constants/templates';
import { ExportEngine } from './services/exportEngine';

const DEFAULT_TRACKS: Track[] = [
  { id: 'track-visuals', name: 'Görsel & Mockup', type: 'video' },
  { id: 'track-text', name: 'Metin & Başlık', type: 'text' },
  { id: 'track-overlays', name: 'Rozet & İstatistik', type: 'overlay' },
  { id: 'track-audio', name: 'Müzik & AI Ses', type: 'audio' }
];

export const App: React.FC = () => {
  // Project State
  const [projectName, setProjectName] = useState<string>('SaaS Tanıtım Videosu');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<number>(15);
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [clips, setClips] = useState<Clip[]>([]);

  // Playback State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  // Modals
  const [isAIWizardOpen, setIsAIWizardOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(false);

  // References & Caches
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaCacheRef = useRef<Map<string, HTMLImageElement | HTMLVideoElement>>(new Map());
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const activeVoiceoverRef = useRef<string | null>(null);

  // Initialize with the SaaS default template
  useEffect(() => {
    const defaultTemplate = PRESET_TEMPLATES[0];
    loadPromoFromConfig(defaultTemplate.config);
  }, []);

  // Helper to load promo from config
  const loadPromoFromConfig = (config: PromoRequest) => {
    const scenes = AIScriptService.generateStoryboard(config);
    const newClips = AIScriptService.buildProjectClips(scenes, config, DEFAULT_TRACKS);
    setClips(newClips);
    setDuration(config.durationPreset);
    setAspectRatio(config.aspectRatio);
    setProjectName(`${config.siteName} Tanıtım`);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedClipId(null);
  };

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();

      // Check if project has BGM clip
      const bgmClip = clips.find((c) => c.type === 'audio' && c.audioType === 'music');
      if (bgmClip && bgmClip.synthGenre) {
        AudioSynthService.startBGM(bgmClip.synthGenre, bgmClip.volume ?? 0.35);
      }

      const updatePlayhead = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const nextTime = prev + delta;
          if (nextTime >= duration) {
            setIsPlaying(false);
            AudioSynthService.stopBGM();
            SpeechService.stop();
            return 0;
          }
          return nextTime;
        });

        animationFrameRef.current = requestAnimationFrame(updatePlayhead);
      };

      animationFrameRef.current = requestAnimationFrame(updatePlayhead);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      AudioSynthService.stopBGM();
      SpeechService.stop();
      activeVoiceoverRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      AudioSynthService.stopBGM();
      SpeechService.stop();
    };
  }, [isPlaying, duration, clips]);

  // Voiceover playback sync with playhead
  useEffect(() => {
    if (!isPlaying) return;

    // Check voiceover clips at current time
    const currentVoiceClip = clips.find(
      (c) =>
        c.type === 'audio' &&
        c.audioType === 'voiceover' &&
        currentTime >= c.startTime &&
        currentTime <= c.startTime + c.duration
    );

    if (currentVoiceClip && currentVoiceClip.synthesizedVoiceText) {
      if (activeVoiceoverRef.current !== currentVoiceClip.id) {
        activeVoiceoverRef.current = currentVoiceClip.id;
        SpeechService.speak(
          currentVoiceClip.synthesizedVoiceText,
          'tr-TR',
          1.05,
          1.0
        );
      }
    } else {
      if (activeVoiceoverRef.current) {
        SpeechService.stop();
        activeVoiceoverRef.current = null;
      }
    }
  }, [currentTime, isPlaying, clips]);

  // Keyboard Shortcuts (Space to play/pause, S to split, Delete to remove)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'KeyS' && selectedClipId) {
        e.preventDefault();
        handleSplitClip(selectedClipId, currentTime);
      } else if ((e.code === 'Delete' || e.code === 'Backspace') && selectedClipId) {
        e.preventDefault();
        handleDeleteClip(selectedClipId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipId, currentTime]);

  // Split Clip
  const handleSplitClip = (clipId: string, splitTime: number) => {
    setClips((prevClips) => {
      const clip = prevClips.find((c) => c.id === clipId);
      if (!clip) return prevClips;

      if (splitTime <= clip.startTime || splitTime >= clip.startTime + clip.duration) {
        return prevClips;
      }

      const dur1 = splitTime - clip.startTime;
      const dur2 = clip.duration - dur1;

      const clip1: Clip = { ...clip, duration: dur1 };
      const clip2: Clip = {
        ...clip,
        id: `${clip.id}-split-${Date.now()}`,
        name: `${clip.name} (Parça 2)`,
        startTime: splitTime,
        duration: dur2
      };

      return prevClips.map((c) => (c.id === clipId ? clip1 : c)).concat(clip2);
    });
  };

  // Duplicate Clip
  const handleDuplicateClip = (clipId: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    const newClip: Clip = {
      ...clip,
      id: `clip-dup-${Date.now()}`,
      name: `${clip.name} (Kopya)`,
      startTime: Math.min(duration - 1, clip.startTime + clip.duration + 0.2)
    };

    setClips((prev) => [...prev, newClip]);
    setSelectedClipId(newClip.id);
  };

  // Delete Clip
  const handleDeleteClip = (clipId: string) => {
    setClips((prev) => prev.filter((c) => c.id !== clipId));
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  // Update Clip
  const handleUpdateClip = (updatedClip: Clip) => {
    setClips((prev) => prev.map((c) => (c.id === updatedClip.id ? updatedClip : c)));
  };

  // Add Clip from LeftSidebar
  const handleAddClip = (partial: Partial<Clip>) => {
    let targetTrack = tracks[0];
    if (partial.type === 'text') targetTrack = tracks[1];
    else if (partial.type === 'overlay') targetTrack = tracks[2];
    else if (partial.type === 'audio') targetTrack = tracks[3];

    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      name: partial.name || 'Yeni Klip',
      type: partial.type || 'text',
      trackId: targetTrack.id,
      startTime: currentTime,
      duration: partial.duration || 4,
      x: partial.x ?? 50,
      y: partial.y ?? 50,
      width: partial.width ?? 60,
      height: partial.height ?? 30,
      rotation: partial.rotation ?? 0,
      opacity: partial.opacity ?? 1,
      scale: partial.scale ?? 1,
      zIndex: partial.zIndex ?? 5,
      ...partial
    };

    setClips((prev) => [...prev, newClip]);
    setSelectedClipId(newClip.id);
  };

  // Upload Media
  const handleUploadMedia = (file: File) => {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const isAudio = file.type.startsWith('audio');

    if (isImage) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        mediaCacheRef.current.set(url, img);
        handleAddClip({
          name: file.name.slice(0, 18),
          type: 'image',
          src: url,
          duration: 5,
          width: 70,
          height: 60,
          kenBurns: true
        });
      };
    } else if (isVideo) {
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        mediaCacheRef.current.set(url, video);
        handleAddClip({
          name: file.name.slice(0, 18),
          type: 'video',
          src: url,
          duration: Math.min(15, video.duration || 5),
          width: 80,
          height: 60
        });
      };
    } else if (isAudio) {
      handleAddClip({
        name: file.name.slice(0, 18),
        type: 'audio',
        audioType: 'music',
        src: url,
        duration: 15,
        volume: 0.8
      });
    }
  };

  const selectedClip = clips.find((c) => c.id === selectedClipId) || null;

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        projectName={projectName}
        onProjectNameChange={setProjectName}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        onOpenAIWizard={() => setIsAIWizardOpen(true)}
        onOpenTemplates={() => setIsTemplatePickerOpen(true)}
        onCaptureThumbnail={() => {
          if (canvasRef.current) {
            ExportEngine.exportThumbnail(
              canvasRef.current,
              `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cover.png`
            );
          }
        }}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Studio Body */}
      <div className="workspace-container">
        {/* Left Sidebar */}
        <LeftSidebar
          onAddClip={handleAddClip}
          onOpenAIWizard={() => setIsAIWizardOpen(true)}
          onUploadMedia={handleUploadMedia}
        />

        {/* Center Canvas Viewport */}
        <div className="stage-container">
          <CanvasViewport
            aspectRatio={aspectRatio}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            clips={clips}
            selectedClipId={selectedClipId}
            onSelectClip={setSelectedClipId}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            canvasRef={canvasRef}
            mediaCache={mediaCacheRef.current}
          />
        </div>

        {/* Right Inspector */}
        <div className="inspector-panel">
          <Inspector
            clip={selectedClip}
            onUpdateClip={handleUpdateClip}
            projectDuration={duration}
          />
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="timeline-container">
        <Timeline
          duration={duration}
          currentTime={currentTime}
          isPlaying={isPlaying}
          tracks={tracks}
          clips={clips}
          selectedClipId={selectedClipId}
          onSelectClip={setSelectedClipId}
          onSeek={(time) => {
            setCurrentTime(time);
            if (isPlaying) {
              setIsPlaying(false);
            }
          }}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onSplitClip={handleSplitClip}
          onDuplicateClip={handleDuplicateClip}
          onDeleteClip={handleDeleteClip}
          onUpdateClip={handleUpdateClip}
        />
      </div>

      {/* Modals */}
      <AIPromoWizardModal
        isOpen={isAIWizardOpen}
        onClose={() => setIsAIWizardOpen(false)}
        onGenerate={loadPromoFromConfig}
        defaultAspectRatio={aspectRatio}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        aspectRatio={aspectRatio}
        duration={duration}
        clips={clips}
        mediaCache={mediaCacheRef.current}
        projectName={projectName}
        canvasRef={canvasRef}
      />

      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelectTemplate={loadPromoFromConfig}
      />
    </div>
  );
};

export default App;
