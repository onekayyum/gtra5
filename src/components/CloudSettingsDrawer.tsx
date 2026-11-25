import { useState } from 'react';
import { Check, RotateCcw, Server, Sliders, X } from 'lucide-react';
import { DATACENTER_REGIONS, DEFAULT_STREAM_CONFIG } from '../data/viceData';
import {
  DatacenterId,
  StreamFps,
  StreamResolution,
  StreamSessionConfig,
} from '../types/portal';

interface CloudSettingsDrawerProps {
  isOpen: boolean;
  config: StreamSessionConfig;
  onChange: (next: StreamSessionConfig) => void;
  onClose: () => void;
}

const RESOLUTIONS: StreamResolution[] = ['4K', '1440P', '1080P'];
const FPS_OPTIONS: StreamFps[] = [60, 120];

export function CloudSettingsDrawer({
  isOpen,
  config,
  onChange,
  onClose,
}: CloudSettingsDrawerProps) {
  const [endpointDraft, setEndpointDraft] = useState(config.streamEndpointUrl);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const update = <K extends keyof StreamSessionConfig>(
    key: K,
    value: StreamSessionConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  const handleSaveEndpoint = () => {
    onChange({ ...config, streamEndpointUrl: endpointDraft.trim() });
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 2000);
  };

  const handleReset = () => {
    setEndpointDraft('');
    onChange(DEFAULT_STREAM_CONFIG);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="GTA 6 Cloud Stream Settings"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-md h-full vice-modal-surface border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-[#e0247d]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-white leading-none">
                Cloud Stream Settings
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                GTA 6 Browser Player · Zero Local Storage Required
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cloud stream settings"
            className="w-9 h-9 rounded flex items-center justify-center bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          {/* Resolution */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-display uppercase tracking-[0.08em] text-sm font-bold text-white">
                Target Resolution
              </label>
              <span className="tabular-telemetry text-xs text-[#06b6d4]">
                {config.resolution} STREAM
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {RESOLUTIONS.map((res) => {
                const active = config.resolution === res;
                return (
                  <button
                    key={res}
                    type="button"
                    onClick={() => update('resolution', res)}
                    className={`py-2.5 rounded text-xs font-semibold tabular-telemetry transition-all duration-150 cursor-pointer ${
                      active
                        ? 'vice-sunset-gradient text-white vice-magenta-bloom'
                        : 'bg-[#12121a] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4]'
                    }`}
                  >
                    {res}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Framerate */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-display uppercase tracking-[0.08em] text-sm font-bold text-white">
                Frame Rate Cap
              </label>
              <span className="tabular-telemetry text-xs text-[#06b6d4]">
                {config.fps} FPS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FPS_OPTIONS.map((fps) => {
                const active = config.fps === fps;
                return (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => update('fps', fps)}
                    className={`py-2.5 rounded text-xs font-semibold tabular-telemetry transition-all duration-150 cursor-pointer ${
                      active
                        ? 'vice-sunset-gradient text-white vice-magenta-bloom'
                        : 'bg-[#12121a] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4]'
                    }`}
                  >
                    {fps} FPS
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bitrate Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="bitrate-slider"
                className="font-display uppercase tracking-[0.08em] text-sm font-bold text-white"
              >
                Max Video Bitrate
              </label>
              <span className="tabular-telemetry text-xs text-[#ffb1c8]">
                {config.bitrateMbps} Mbps
              </span>
            </div>
            <input
              id="bitrate-slider"
              type="range"
              min={15}
              max={75}
              step={1}
              value={config.bitrateMbps}
              onChange={(e) => update('bitrateMbps', Number(e.target.value))}
              className="w-full accent-[#e0247d] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] tabular-telemetry text-[#64748b] mt-1">
              <span>15 Mbps</span>
              <span>45 Mbps</span>
              <span>75 Mbps</span>
            </div>
          </div>

          {/* Datacenter Region */}
          <div>
            <label
              htmlFor="datacenter-select"
              className="block font-display uppercase tracking-[0.08em] text-sm font-bold text-white mb-2.5"
            >
              Cloud Datacenter Region
            </label>
            <select
              id="datacenter-select"
              value={config.datacenter}
              onChange={(e) => update('datacenter', e.target.value as DatacenterId)}
              className="w-full h-11 px-3.5 rounded bg-[#12121a] border border-white/15 text-sm text-white focus:border-[#06b6d4] focus:outline-none cursor-pointer"
            >
              {DATACENTER_REGIONS.map((region) => (
                <option key={region.id} value={region.id} className="bg-[#12121a] text-white">
                  {region.name} ({region.basePingMs}ms)
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-1">
            {[
              {
                key: 'hdr10' as const,
                title: 'HDR10 Wide Color Gamut',
                desc: 'Preserve sunset neon luminance on OLED displays',
              },
              {
                key: 'lowLatencyMode' as const,
                title: 'Ultra-Low Latency Transport',
                desc: 'Prioritize sub-20ms frame pacing over buffer depth',
              },
              {
                key: 'spatialAudio' as const,
                title: 'Spatial 3D Surround Audio',
                desc: 'Binaural Vice City street acoustics in browser',
              },
              {
                key: 'showTelemetryHud' as const,
                title: 'Direct Play Telemetry HUD',
                desc: 'Keep ping, bitrate, and region dock visible in player',
              },
            ].map((item) => {
              const checked = config[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-2.5 border-b border-white/[0.06]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={item.title}
                    onClick={() => update(item.key, !checked)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-150 shrink-0 cursor-pointer ${
                      checked
                        ? 'vice-sunset-bar vice-magenta-bloom'
                        : 'bg-[#181824] border border-white/15'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform duration-150 ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Controller Deadzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="deadzone-slider"
                className="font-display uppercase tracking-[0.08em] text-sm font-bold text-white"
              >
                Gamepad Stick Deadzone
              </label>
              <span className="tabular-telemetry text-xs text-[#06b6d4]">
                {config.controllerDeadzone}%
              </span>
            </div>
            <input
              id="deadzone-slider"
              type="range"
              min={0}
              max={30}
              step={1}
              value={config.controllerDeadzone}
              onChange={(e) => update('controllerDeadzone', Number(e.target.value))}
              className="w-full accent-[#06b6d4] cursor-pointer"
            />
          </div>

          {/* Server / Stream Integration Hook */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-[#06b6d4]" aria-hidden="true" />
              <label
                htmlFor="stream-endpoint"
                className="font-display uppercase tracking-[0.08em] text-sm font-bold text-white"
              >
                Custom Stream Server URL
              </label>
            </div>
            <p className="text-xs text-[#94a3b8] mb-3 leading-relaxed">
              Ready for your backend: paste a live MP4, WebM, or streaming media URL to mount
              directly inside the Live Player viewport. Leave empty for the built-in cinematic
              preview.
            </p>
            <div className="flex gap-2">
              <input
                id="stream-endpoint"
                type="url"
                value={endpointDraft}
                onChange={(e) => setEndpointDraft(e.target.value)}
                placeholder="https://your-server.example/gta6-stream.mp4"
                className="flex-1 h-10 px-3 rounded bg-[#12121a] border border-white/15 text-xs tabular-telemetry text-white placeholder:text-[#64748b] focus:border-[#06b6d4] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveEndpoint}
                className="px-4 h-10 rounded bg-[#181824] border border-[#06b6d4]/60 text-xs font-display font-bold uppercase tracking-[0.08em] text-[#4cd7f6] hover:bg-[#06b6d4]/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
              >
                {savedToast ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Applied
                  </>
                ) : (
                  'Bind URL'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 chamfer-6 vice-sunset-gradient text-white font-display font-bold uppercase text-sm tracking-[0.1em] hover:brightness-110 transition-all cursor-pointer"
          >
            Save & Return
          </button>
        </div>
      </aside>
    </div>
  );
}
