import {
  Pause,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { RADIO_STATIONS } from '../data/viceData';
import { RadioStation } from '../types/portal';

interface ViceRadioViewProps {
  activeStation: RadioStation;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  activeTrackIndex: number;
  visualizerBars: number[];
  onSelectStation: (stationId: string) => void;
  onTogglePlay: () => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  onSelectTrack: (idx: number) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export function ViceRadioView({
  activeStation,
  isPlaying,
  volume,
  isMuted,
  activeTrackIndex,
  visualizerBars,
  onSelectStation,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
}: ViceRadioViewProps) {
  const currentTrack =
    activeStation.tracks[activeTrackIndex] ?? activeStation.tracks[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="tabular-telemetry text-xs uppercase text-[#f97316]">
              Grand Theft Auto VI · In-Browser FM Broadcast Deck
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] text-white mt-1">
              Vice Radio FM
            </h1>
          </div>
          <p className="text-sm text-[#94a3b8] max-w-md">
            Live Web Audio synth frequencies across Leonida. Tune any station and keep it playing
            while exploring the Vice Map or Character Dossiers.
          </p>
        </div>

        {/* 12-Column Layout: Main Receiver Console (7 cols) + Station Dial Deck (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Active FM Receiver & Visualizer */}
          <section className="lg:col-span-7 vice-raised-card rounded-lg p-6 lg:p-8 flex flex-col justify-between">
            <div>
              {/* Frequency Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded bg-[#12121a] border border-white/10 flex items-center justify-center">
                    <Radio
                      className="w-5 h-5"
                      style={{ color: activeStation.moodColor }}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="tabular-telemetry text-xs text-[#94a3b8]">
                      {activeStation.genre} · Host: {activeStation.host}
                    </p>
                    <h2 className="font-display text-3xl lg:text-4xl font-extrabold uppercase tracking-[0.03em] text-white">
                      {activeStation.name}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className="font-display text-4xl font-extrabold tracking-[0.04em]"
                    style={{ color: activeStation.moodColor }}
                  >
                    {activeStation.frequency}
                  </p>
                  <p className="tabular-telemetry text-[11px] uppercase text-[#4cd7f6]">
                    {isPlaying ? 'LIVE AUDIO SYNTH ACTIVE' : 'TUNER STANDBY'}
                  </p>
                </div>
              </div>

              {/* Real-time 16-bar Frequency Visualizer */}
              <div className="mt-6 rounded-lg bg-[#0a0a0f] border border-white/[0.08] p-5">
                <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36">
                  {visualizerBars.map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full flex items-end"
                      aria-hidden="true"
                    >
                      <div
                        style={{
                          height: `${height}%`,
                          background:
                            idx % 3 === 0
                              ? 'linear-gradient(180deg, #4cd7f6 0%, #06b6d4 100%)'
                              : 'linear-gradient(180deg, #f97316 0%, #e0247d 100%)',
                        }}
                        className="w-full rounded-t-sm transition-all duration-75"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs tabular-telemetry text-[#94a3b8]">
                  <span>
                    NOW PLAYING:{' '}
                    <span className="text-white font-semibold">{currentTrack.title}</span> —{' '}
                    {currentTrack.artist}
                  </span>
                  <span>
                    {activeStation.tempoBpm} BPM · {currentTrack.duration}
                  </span>
                </div>
              </div>

              {/* Transport & Volume Controls */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onPrevTrack}
                    aria-label="Previous track"
                    className="w-10 h-10 rounded bg-[#12121a] border border-white/10 hover:border-[#06b6d4] text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="inline-flex items-center gap-2 px-6 h-11 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-sm tracking-[0.1em] hover:brightness-110 transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                        Pause Broadcast
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                        Tune & Play
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onNextTrack}
                    aria-label="Next track"
                    className="w-10 h-10 rounded bg-[#12121a] border border-white/10 hover:border-[#06b6d4] text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onToggleMute}
                    aria-label={isMuted ? 'Unmute Vice Radio' : 'Mute Vice Radio'}
                    className="w-9 h-9 rounded bg-[#12121a] border border-white/10 hover:border-[#06b6d4] text-white flex items-center justify-center cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-[#94a3b8]" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    aria-label="Vice Radio volume"
                    min={0}
                    max={1}
                    step={0.02}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-28 sm:w-36 accent-[#e0247d] cursor-pointer"
                  />
                  <span className="tabular-telemetry text-xs text-[#94a3b8] w-9 text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Station Track Queue */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <p className="font-display text-sm font-bold uppercase tracking-[0.08em] text-[#94a3b8] mb-3">
                Station Rotation
              </p>
              <div className="space-y-1.5">
                {activeStation.tracks.map((track, idx) => {
                  const active = idx === activeTrackIndex;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => onSelectTrack(idx)}
                      className={`w-full px-4 py-3 rounded flex items-center justify-between gap-4 text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#e0247d]/15 border border-[#e0247d]/60'
                          : 'bg-[#12121a] border border-white/[0.05] hover:border-[#06b6d4]/50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">{track.artist}</p>
                      </div>
                      <span className="tabular-telemetry text-xs text-[#94a3b8] shrink-0">
                        {track.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right Column: All Vice City FM Stations */}
          <aside className="lg:col-span-5 flex flex-col gap-3.5">
            {RADIO_STATIONS.map((station) => {
              const selected = station.id === activeStation.id;
              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => onSelectStation(station.id)}
                  className={`text-left p-5 rounded-lg transition-all duration-150 cursor-pointer flex-1 flex flex-col justify-between ${
                    selected
                      ? 'bg-[#181824] border border-[#e0247d] vice-magenta-bloom'
                      : 'bg-[#12121a] border border-white/[0.08] hover:border-[#06b6d4]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="tabular-telemetry text-xs text-[#94a3b8]">
                        {station.genre}
                      </p>
                      <h3 className="font-display text-2xl font-bold uppercase tracking-[0.03em] text-white mt-1">
                        {station.name}
                      </h3>
                    </div>
                    <span
                      className="font-display text-2xl font-extrabold tracking-[0.04em] shrink-0"
                      style={{ color: station.moodColor }}
                    >
                      {station.frequency}
                    </span>
                  </div>

                  <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
                    {station.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[11px] tabular-telemetry text-[#94a3b8]">
                    <span>Host: {station.host}</span>
                    <span className={selected ? 'text-[#4cd7f6]' : 'text-[#64748b]'}>
                      {selected ? (isPlaying ? 'ON AIR' : 'TUNED') : 'SWITCH FREQUENCY'}
                    </span>
                  </div>
                </button>
              );
            })}
          </aside>
        </div>
      </div>
    </div>
  );
}
