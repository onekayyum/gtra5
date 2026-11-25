import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Compass,
  Eye,
  EyeOff,
  Gamepad2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sliders,
  Users,
  Volume2,
  VolumeX,
  Wifi,
} from 'lucide-react';
import {
  ASSETS,
  DATACENTER_REGIONS,
  VICE_CHARACTERS,
  VICE_LOCATIONS,
} from '../data/viceData';
import {
  DatacenterId,
  PortalView,
  StreamResolution,
  StreamSessionConfig,
} from '../types/portal';
import { MediaImage } from './MediaImage';

interface LivePlayerViewProps {
  config: StreamSessionConfig;
  activeCharacterId: string;
  selectedLocationId: string;
  isLoadingScreenActive?: boolean;
  onUpdateConfig: (next: StreamSessionConfig) => void;
  onOpenSettings: () => void;
  onNavigate: (view: PortalView) => void;
}

const STREAM_FEEDS = [
  {
    id: 'causeway',
    label: 'Causeway Live Cam',
    src: ASSETS.liveStreamFrame,
    caption: 'Bayfront Causeway · Pursuit Telemetry Feed',
  },
  {
    id: 'strip',
    label: 'Vice Beach Cam',
    src: ASSETS.heroSkyline,
    caption: 'Oceanfront Strip · Dusk Lighting Feed',
  },
  {
    id: 'aerial',
    label: 'Leonida Aerial',
    src: ASSETS.viceBeachAerial,
    caption: 'Starfish Marina · Helicopter Recon Feed',
  },
];

const CONTROL_BINDINGS = [
  { key: 'W A S D', action: 'Move / Steer Vehicle' },
  { key: 'SHIFT', action: 'Sprint / Boost Throttle' },
  { key: 'SPACE', action: 'Handbrake / Vault' },
  { key: 'F / Y', action: 'Enter / Exit Vehicle' },
  { key: 'M / TAB', action: 'Open Vice Map' },
  { key: 'R / D-PAD', action: 'Cycle Vice Radio FM' },
];

export function LivePlayerView({
  config,
  activeCharacterId,
  selectedLocationId,
  isLoadingScreenActive = false,
  onUpdateConfig,
  onOpenSettings,
  onNavigate,
}: LivePlayerViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [hudVisible, setHudVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [feedIndex, setFeedIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const activeRegion = useMemo(
    () =>
      DATACENTER_REGIONS.find((r) => r.id === config.datacenter) ??
      DATACENTER_REGIONS[0],
    [config.datacenter]
  );

  const activeCharacter = useMemo(
    () =>
      VICE_CHARACTERS.find((c) => c.id === activeCharacterId) ?? VICE_CHARACTERS[0],
    [activeCharacterId]
  );

  const activeLocation = useMemo(
    () =>
      VICE_LOCATIONS.find((l) => l.id === selectedLocationId) ?? VICE_LOCATIONS[0],
    [selectedLocationId]
  );

  // Live jittered telemetry anchored to the selected cloud datacenter
  const [livePing, setLivePing] = useState(activeRegion.basePingMs);
  const [liveBitrate, setLiveBitrate] = useState(config.bitrateMbps);

  useEffect(() => {
    setVideoError(false);
  }, [config.streamEndpointUrl]);

  useEffect(() => {
    setLivePing(activeRegion.basePingMs);
  }, [activeRegion.basePingMs]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const jitter = Math.round((Math.random() - 0.5) * 4);
      setLivePing(Math.max(7, activeRegion.basePingMs + jitter));
      const rateDrift = Math.round((Math.random() - 0.5) * 3);
      setLiveBitrate(Math.max(12, config.bitrateMbps + rateDrift));
      if (isPlaying && !isLoadingScreenActive) {
        setSessionSeconds((s) => s + 1);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [activeRegion.basePingMs, config.bitrateMbps, isPlaying, isLoadingScreenActive]);

  // Sync external <video> if developer provided a streamEndpointUrl
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = isMuted;
    vid.volume = volume;
    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, isMuted, volume, config.streamEndpointUrl]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Conditional ping coloring strictly per Vice Horizon spec
  const pingMeta =
    livePing < 20
      ? { color: 'text-[#06b6d4]', border: 'border-[#06b6d4]/60', label: 'OPTIMAL' }
      : livePing <= 50
        ? { color: 'text-[#f97316]', border: 'border-[#f97316]/60', label: 'MODERATE' }
        : { color: 'text-[#e0247d]', border: 'border-[#e0247d]/60', label: 'HIGH PING' };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentFeed = STREAM_FEEDS[feedIndex] ?? STREAM_FEEDS[0];
  const hasCustomStream = Boolean(config.streamEndpointUrl.trim()) && !videoError;

  const cycleQuality = () => {
    const order: StreamResolution[] = ['4K', '1440P', '1080P'];
    const next = order[(order.indexOf(config.resolution) + 1) % order.length];
    onUpdateConfig({ ...config, resolution: next });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0f] pt-16 flex flex-col"
    >
      {/* Full-viewport Stream Stage */}
      <div className="relative flex-1 min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0a0a0f] select-none">
        {/* Stream Media Layer */}
        {hasCustomStream ? (
          <video
            ref={videoRef}
            src={config.streamEndpointUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0">
            <MediaImage
              src={currentFeed.src}
              alt={`Grand Theft Auto VI live stream — ${currentFeed.caption}`}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isPlaying ? 'animate-cinematic-pan' : 'scale-100'
              } ${config.hdr10 ? 'contrast-[1.06] saturate-[1.12]' : 'contrast-100 saturate-90'}`}
              fallbackTitle="Grand Theft Auto VI Live Stream"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/85 via-transparent to-[#0a0a0f]/55" />
          </div>
        )}

        {/* Paused Dimmer Overlay */}
        {!isPlaying && !isLoadingScreenActive && (
          <div className="absolute inset-0 z-10 bg-[#0a0a0f]/65 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <p className="tabular-telemetry text-xs uppercase text-[#4cd7f6] mb-2">
              Grand Theft Auto VI · Cloud Session Paused
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-[0.04em] text-white">
              Stream Held on {activeRegion.id}
            </h2>
            <p className="text-sm text-[#94a3b8] mt-2 max-w-md">
              Your cloud GPU slot remains reserved at {activeLocation.name}. Resume anytime to
              continue in browser.
            </p>
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="mt-6 inline-flex items-center gap-2.5 px-7 py-3.5 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-base tracking-[0.1em] hover:brightness-110 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              Resume Live Stream
            </button>
          </div>
        )}

        {/* TOP HUD OVERLAY ROW */}
        {hudVisible && !isLoadingScreenActive && (
          <div className="absolute top-5 left-5 right-5 z-20 flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 pointer-events-none">
            {/* Top-Left: Session Context Plate */}
            <div className="pointer-events-auto vice-hud-plate rounded-lg px-4 py-3 flex items-center gap-4 max-w-full">
              <div className="w-11 h-11 rounded overflow-hidden border border-[#e0247d]/60 shrink-0">
                <MediaImage
                  src={activeCharacter.portrait}
                  alt={activeCharacter.name}
                  className="w-full h-full object-cover object-top"
                  fallbackTitle={activeCharacter.name}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] tabular-telemetry text-[#94a3b8]">
                  <span className="text-white font-semibold uppercase">GTA 6</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDuration(sessionSeconds)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#ffb1c8] truncate">{activeCharacter.name}</span>
                </div>
                <p className="font-display text-lg font-bold uppercase tracking-[0.04em] text-white truncate">
                  {activeLocation.name}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  title="Change Drop Zone on Vice Map"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#181824] border border-white/10 hover:border-[#06b6d4] text-xs text-[#e4e1e9] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#06b6d4]" aria-hidden="true" />
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('characters')}
                  title="Switch Active Character"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#181824] border border-white/10 hover:border-[#e0247d] text-xs text-[#e4e1e9] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#ffb1c8]" aria-hidden="true" />
                  Crew
                </button>
              </div>
            </div>

            {/* Top-Right: Direct Play Cloud Telemetry HUD */}
            {config.showTelemetryHud && (
              <div className="pointer-events-auto vice-hud-plate chamfer-6 px-4 py-3 flex flex-wrap items-center gap-3.5">
                {/* Real-time connection dot + conditional ping color */}
                <div
                  className={`flex items-center gap-2 px-2.5 py-1 rounded bg-[#0a0a0f]/75 border ${pingMeta.border}`}
                >
                  <Wifi className={`w-3.5 h-3.5 ${pingMeta.color}`} aria-hidden="true" />
                  <span className={`tabular-telemetry text-xs font-semibold ${pingMeta.color}`}>
                    {livePing}ms · {pingMeta.label}
                  </span>
                </div>

                {/* Telemetry Chips strictly per Vice Horizon spec */}
                <div className="flex items-center gap-2 tabular-telemetry text-[11px] uppercase">
                  <span className="px-2 py-1 rounded bg-[#06b6d4]/10 border border-[#06b6d4]/70 text-[#4cd7f6]">
                    {config.resolution} {config.fps}FPS
                  </span>
                  {config.hdr10 && (
                    <span className="px-2 py-1 rounded bg-[#06b6d4]/10 border border-[#06b6d4]/70 text-[#4cd7f6]">
                      HDR10
                    </span>
                  )}
                  <span className="px-2 py-1 rounded bg-[#06b6d4]/10 border border-[#06b6d4]/70 text-[#4cd7f6]">
                    {hasCustomStream ? 'CUSTOM FEED' : 'CLOUD ACTIVE'}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-white/10 tabular-telemetry text-xs text-[#94a3b8]">
                  <span>{liveBitrate} Mbps</span>
                  <span aria-hidden="true">/</span>
                  <span className="text-white">{config.datacenter}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Endpoint Error Notice (if user pasted an unreachable stream URL) */}
        {videoError && config.streamEndpointUrl && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 vice-modal-surface border border-[#f97316]/60 rounded-lg px-4 py-3 text-xs text-[#ffdbca] flex items-center gap-3">
            <span>
              Could not load stream URL. Showing preview feed — update URL in Cloud Settings.
            </span>
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-[#4cd7f6] underline cursor-pointer whitespace-nowrap"
            >
              Configure
            </button>
          </div>
        )}

        {/* Optional Controller / Keyboard Mapping Overlay */}
        {config.showControllerOverlay && hudVisible && !isLoadingScreenActive && (
          <div className="absolute right-5 top-28 z-20 w-72 vice-hud-plate rounded-lg p-4 border border-[#06b6d4]/30">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
                Direct Play Controls
              </span>
              <span className="tabular-telemetry text-[11px] text-[#06b6d4]">
                KB + GAMEPAD
              </span>
            </div>
            <div className="space-y-2">
              {CONTROL_BINDINGS.map((binding) => (
                <div
                  key={binding.key}
                  className="flex items-center justify-between gap-3 text-xs py-1 border-b border-white/[0.06] last:border-b-0"
                >
                  <span className="tabular-telemetry text-[11px] px-2 py-0.5 rounded bg-[#0a0a0f] border border-white/15 text-[#ffb1c8]">
                    {binding.key}
                  </span>
                  <span className="text-[#e4e1e9] text-right">{binding.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM DOCKED CLOUD HUD BAR (floats 1.5rem above canvas floor) */}
        <div className="absolute bottom-6 left-5 right-5 z-20 flex items-center justify-center pointer-events-none">
          {hudVisible ? (
            <div className="pointer-events-auto w-full max-w-5xl vice-hud-plate rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3 border border-white/12">
              {/* Left Playback & Audio Group */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause stream' : 'Resume stream'}
                  className="w-10 h-10 rounded chamfer-6 vice-sunset-gradient text-white flex items-center justify-center hover:brightness-110 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted ? 'Unmute stream audio' : 'Mute stream audio'}
                  className="w-9 h-9 rounded bg-[#181824] border border-white/10 text-white hover:border-[#06b6d4] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-[#94a3b8]" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  aria-label="Stream volume"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const nextVol = Number(e.target.value);
                    setVolume(nextVol);
                    if (nextVol > 0) setIsMuted(false);
                  }}
                  className="hidden sm:block w-20 accent-[#e0247d] cursor-pointer"
                />

                {!hasCustomStream && (
                  <button
                    type="button"
                    onClick={() => setFeedIndex((i) => (i + 1) % STREAM_FEEDS.length)}
                    className="ml-1 inline-flex items-center gap-1.5 px-3 h-9 rounded bg-[#181824] border border-white/10 hover:border-[#06b6d4] text-xs text-[#e4e1e9] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#4cd7f6]" aria-hidden="true" />
                    <span className="hidden md:inline">{currentFeed.label}</span>
                    <span className="md:hidden">Cam</span>
                  </button>
                )}
              </div>

              {/* Center Quick Stream Presets */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cycleQuality}
                  className="px-3 h-9 rounded bg-[#181824] border border-white/10 hover:border-[#06b6d4] tabular-telemetry text-xs text-white transition-colors whitespace-nowrap cursor-pointer"
                  title="Cycle Stream Resolution"
                >
                  {config.resolution} · {config.fps}FPS
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...config, hdr10: !config.hdr10 })}
                  className={`px-3 h-9 rounded tabular-telemetry text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    config.hdr10
                      ? 'bg-[#06b6d4]/15 border border-[#06b6d4] text-[#4cd7f6]'
                      : 'bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white'
                  }`}
                >
                  HDR10
                </button>

                <select
                  aria-label="Cloud Datacenter Region"
                  value={config.datacenter}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      datacenter: e.target.value as DatacenterId,
                    })
                  }
                  className="hidden md:block h-9 px-2.5 rounded bg-[#181824] border border-white/10 text-xs tabular-telemetry text-white focus:border-[#06b6d4] focus:outline-none cursor-pointer"
                >
                  {DATACENTER_REGIONS.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#12121a] text-white">
                      {r.id} ({r.basePingMs}ms)
                    </option>
                  ))}
                </select>
              </div>

              {/* Right Tactical Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateConfig({
                      ...config,
                      showControllerOverlay: !config.showControllerOverlay,
                    })
                  }
                  aria-label="Toggle controller bindings overlay"
                  title="Toggle Controls Overlay"
                  className={`w-9 h-9 rounded flex items-center justify-center transition-colors cursor-pointer ${
                    config.showControllerOverlay
                      ? 'bg-[#e0247d]/20 border border-[#e0247d] text-[#ffb1c8]'
                      : 'bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4]'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenSettings}
                  aria-label="Open Cloud Stream Settings"
                  title="Cloud Stream Settings & Server URL"
                  className="w-9 h-9 rounded bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setHudVisible(false)}
                  aria-label="Hide HUD overlays"
                  title="Hide HUD Overlays"
                  className="w-9 h-9 rounded bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <EyeOff className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  className="w-9 h-9 rounded bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHudVisible(true)}
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded vice-hud-plate text-xs tabular-telemetry text-[#e4e1e9] hover:border-[#06b6d4] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#06b6d4]" aria-hidden="true" />
              Show Stream HUD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
