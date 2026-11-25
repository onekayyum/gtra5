import { ArrowUpRight, Compass, Play, Radio, Server, Sliders, Users } from 'lucide-react';
import {
  ASSETS,
  DATACENTER_REGIONS,
  VICE_CHARACTERS,
  VICE_LOCATIONS,
} from '../data/viceData';
import {
  DatacenterId,
  PortalView,
  RadioStation,
  StreamSessionConfig,
} from '../types/portal';
import { MediaImage } from './MediaImage';

interface HomeLauncherProps {
  config: StreamSessionConfig;
  activeCharacterId: string;
  selectedLocationId: string;
  activeStation: RadioStation;
  isRadioPlaying: boolean;
  onNavigate: (view: PortalView) => void;
  onLaunchDirectPlay: () => void;
  onOpenTrailer: () => void;
  onOpenSettings: () => void;
  onSelectDatacenter: (id: DatacenterId) => void;
  onToggleRadio: () => void;
}

export function HomeLauncher({
  config,
  activeCharacterId,
  selectedLocationId,
  activeStation,
  isRadioPlaying,
  onNavigate,
  onLaunchDirectPlay,
  onOpenTrailer,
  onOpenSettings,
  onSelectDatacenter,
  onToggleRadio,
}: HomeLauncherProps) {
  const activeCharacter =
    VICE_CHARACTERS.find((c) => c.id === activeCharacterId) ?? VICE_CHARACTERS[0];
  const activeLocation =
    VICE_LOCATIONS.find((l) => l.id === selectedLocationId) ?? VICE_LOCATIONS[0];
  const activeRegion =
    DATACENTER_REGIONS.find((r) => r.id === config.datacenter) ?? DATACENTER_REGIONS[0];

  const getPingTone = (ms: number) => {
    if (ms < 20) return { text: 'text-[#06b6d4]', label: 'Optimal' };
    if (ms <= 50) return { text: 'text-[#f97316]', label: 'Moderate' };
    return { text: 'text-[#e0247d]', label: 'Elevated' };
  };

  const activePing = getPingTone(activeRegion.basePingMs);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16">
      {/* HERO SECTION — Full-bleed cinematic Vice City dusk skyline */}
      <section className="relative min-h-[78vh] lg:min-h-[82vh] flex items-end overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0">
          <MediaImage
            src={ASSETS.heroSkyline}
            alt="Grand Theft Auto VI Vice City oceanfront dusk skyline"
            className="w-full h-full object-cover object-center animate-cinematic-pan"
            fallbackTitle="Grand Theft Auto VI"
          />
          {/* Measured obsidian & dusk scrims for WCAG AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 to-[#0a0a0f]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/55 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 pb-14 pt-24 lg:pb-20">
          <div className="max-w-3xl">
            <p className="tabular-telemetry text-xs uppercase tracking-[0.14em] text-[#4cd7f6] mb-4">
              Vice Horizon Cloud Streaming · Instant Browser Play · Zero Downloads
            </p>

            <h1 className="font-display font-extrabold uppercase text-[3.25rem] sm:text-[4.25rem] lg:text-[5.25rem] leading-[0.96] tracking-[0.02em] text-white">
              Grand Theft Auto VI
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#e4e1e9]/90 max-w-xl leading-relaxed">
              Stream <span className="text-white font-semibold">GTA 6</span> straight in your
              browser at up to 4K 60FPS with HDR10. Enter Vice City and the State of Leonida
              immediately—no client downloads, no local installation, no waiting.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onLaunchDirectPlay}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-base tracking-[0.1em] hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                Launch Direct Play
              </button>

              <button
                type="button"
                onClick={onOpenTrailer}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-[#12121a]/80 backdrop-blur-md border border-white/15 text-white font-display font-bold uppercase text-base tracking-[0.08em] hover:border-[#06b6d4] hover:text-[#4cd7f6] transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                Trailer / Details
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#94a3b8] hover:text-white border-b-2 border-transparent hover:border-[#e0247d] transition-colors duration-150 whitespace-nowrap cursor-pointer"
              >
                <Sliders className="w-4 h-4" aria-hidden="true" />
                Stream Settings
              </button>
            </div>
          </div>

          {/* Full-width 4-column Cloud Readiness Telemetry Strip below Hero Split */}
          <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-[#94a3b8]">Stream Profile</p>
              <p className="tabular-telemetry text-sm sm:text-base font-semibold text-white mt-1">
                {config.resolution} {config.fps}FPS · {config.hdr10 ? 'HDR10' : 'SDR'}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#94a3b8]">Active Edge Node</p>
              <p className="tabular-telemetry text-sm sm:text-base font-semibold text-white mt-1">
                {activeRegion.id}{' '}
                <span className={`${activePing.text} font-medium`}>
                  ({activeRegion.basePingMs}ms · {activePing.label})
                </span>
              </p>
            </div>

            <div>
              <p className="text-xs text-[#94a3b8]">Session Deployment</p>
              <p className="tabular-telemetry text-sm sm:text-base font-semibold text-white mt-1">
                {activeCharacter.name} · {activeLocation.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#94a3b8]">Client Footprint</p>
              <p className="tabular-telemetry text-sm sm:text-base font-semibold text-[#4cd7f6] mt-1">
                0 GB · Browser Native
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Asymmetric Media-First Portal Bento */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="tabular-telemetry text-xs uppercase text-[#e0247d]">
              01. Portal Modules
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold uppercase tracking-[0.03em] text-white mt-1">
              Prepare Your Leonida Session
            </h2>
          </div>
          <p className="text-sm text-[#94a3b8] max-w-md">
            Pick your drop zone on the Vice Map, lock in your active character, or tune Vice Radio
            before stepping straight into the cloud player.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Large Span (7 cols): Interactive Vice Map */}
          <article
            onClick={() => onNavigate('map')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('map');
              }
            }}
            className="group lg:col-span-7 relative min-h-[380px] lg:min-h-[480px] rounded-lg overflow-hidden bg-[#12121a] border border-white/[0.08] hover:border-[#e0247d]/70 transition-all duration-200 cursor-pointer flex flex-col justify-end"
          >
            <div className="absolute inset-0">
              <MediaImage
                src={ASSETS.viceBeachAerial}
                alt="Aerial view of Vice Beach and the Leonida Keys"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                fallbackTitle="Interactive Vice Map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/45 to-transparent" />
            </div>

            <div className="relative z-10 p-6 lg:p-8">
              <div className="flex items-center gap-2 text-xs text-[#4cd7f6] tabular-telemetry">
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Leonida Atlas</span>
                <span aria-hidden="true">·</span>
                <span>{VICE_LOCATIONS.length} Direct Drop Zones</span>
                <span aria-hidden="true">·</span>
                <span>{activeLocation.coordinates}</span>
              </div>

              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-[0.03em] text-white">
                    Interactive Vice Map
                  </h3>
                  <p className="text-sm text-[#e4e1e9]/85 mt-2 max-w-lg leading-relaxed">
                    Zoom across Vice Beach, Downtown Vice, Port Gellhorn, and the southern Keys.
                    Inspect district intel and launch directly into your chosen coordinates.
                  </p>
                </div>
                <span className="w-11 h-11 rounded bg-[#181824]/90 border border-white/15 group-hover:border-[#e0247d] group-hover:text-[#ffb1c8] flex items-center justify-center text-white shrink-0 transition-colors">
                  <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </article>

          {/* Right Column Stack (5 cols): Characters + Vice Radio */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Characters Card */}
            <article
              onClick={() => onNavigate('characters')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('characters');
                }
              }}
              className="group relative flex-1 min-h-[235px] rounded-lg overflow-hidden bg-[#12121a] border border-white/[0.08] hover:border-[#e0247d]/70 transition-all duration-200 cursor-pointer flex flex-col justify-end"
            >
              <div className="absolute inset-0">
                <MediaImage
                  src={activeCharacter.portrait}
                  alt={`${activeCharacter.name} character dossier portrait`}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  fallbackTitle={activeCharacter.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 to-[#0a0a0f]/10" />
              </div>

              <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 text-xs text-[#ffb1c8] tabular-telemetry">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Active Profile</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCharacter.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCharacter.role}</span>
                </div>
                <div className="mt-1.5 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase tracking-[0.03em] text-white">
                      Character Dossiers
                    </h3>
                    <p className="text-sm text-[#e4e1e9]/80 mt-1">
                      Switch between Lucia, Jason, and Dre Vance before launching your stream.
                    </p>
                  </div>
                  <span className="w-10 h-10 rounded bg-[#181824]/90 border border-white/15 group-hover:border-[#e0247d] flex items-center justify-center text-white shrink-0 transition-colors">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </article>

            {/* Vice Radio FM Card */}
            <article className="flex-1 min-h-[210px] rounded-lg vice-raised-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#f97316] tabular-telemetry">
                    <Radio className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{activeStation.frequency}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeStation.genre}</span>
                  </div>
                  <span className="tabular-telemetry text-xs text-[#94a3b8]">
                    {isRadioPlaying ? 'ON AIR' : 'STANDBY'}
                  </span>
                </div>

                <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase tracking-[0.03em] text-white mt-2">
                  {activeStation.name}
                </h3>
                <p className="text-sm text-[#94a3b8] mt-1.5 leading-relaxed">
                  {activeStation.tagline}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onToggleRadio}
                  className="px-4 py-2 rounded bg-[#12121a] border border-white/15 hover:border-[#06b6d4] text-xs font-display font-bold uppercase tracking-[0.08em] text-white transition-colors cursor-pointer"
                >
                  {isRadioPlaying ? 'Pause Station' : 'Listen Live'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('radio')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#ffb1c8] hover:text-white transition-colors cursor-pointer"
                >
                  Open FM Tuner
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Cloud Edge Datacenter Selector */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 pb-20">
        <div className="pt-12 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="tabular-telemetry text-xs uppercase text-[#06b6d4]">
                02. Low-Latency Cloud Edge
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-[0.03em] text-white mt-1">
                Select Your Streaming Region
              </h2>
            </div>
            <p className="text-sm text-[#94a3b8]">
              Pick the closest edge node for your Grand Theft Auto VI browser stream.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DATACENTER_REGIONS.map((region) => {
              const selected = region.id === config.datacenter;
              const tone = getPingTone(region.basePingMs);
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => onSelectDatacenter(region.id)}
                  className={`text-left p-5 rounded-lg transition-all duration-150 cursor-pointer ${
                    selected
                      ? 'bg-[#181824] border border-[#e0247d] vice-magenta-bloom'
                      : 'bg-[#12121a] border border-white/[0.08] hover:border-[#06b6d4]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="tabular-telemetry text-xs font-semibold text-white">
                      {region.id}
                    </span>
                    <Server
                      className={`w-4 h-4 ${selected ? 'text-[#e0247d]' : 'text-[#64748b]'}`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-display text-xl font-bold uppercase tracking-[0.03em] text-white mt-2">
                    {region.city}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs tabular-telemetry">
                    <span className={tone.text}>
                      {region.basePingMs}ms · {tone.label}
                    </span>
                    <span className="text-[#94a3b8]">{region.capacityLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#0e0e13]">
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-extrabold uppercase tracking-[0.05em] text-white">
              Grand Theft Auto VI
            </p>
            <p className="text-xs text-[#64748b] mt-1">
              Vice Horizon Online Cloud Streaming Portal · Browser Direct Play Interface
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#94a3b8]">
            <button
              type="button"
              onClick={() => onNavigate('player')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Live Player
            </button>
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vice Map
            </button>
            <button
              type="button"
              onClick={() => onNavigate('characters')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Characters
            </button>
            <button
              type="button"
              onClick={() => onNavigate('radio')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vice Radio
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cloud Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
