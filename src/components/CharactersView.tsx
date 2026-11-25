import { Check, Play } from 'lucide-react';
import { VICE_CHARACTERS } from '../data/viceData';
import { MediaImage } from './MediaImage';

interface CharactersViewProps {
  activeCharacterId: string;
  onSelectCharacter: (id: string) => void;
  onLaunchAsCharacter: (id: string) => void;
}

export function CharactersView({
  activeCharacterId,
  onSelectCharacter,
  onLaunchAsCharacter,
}: CharactersViewProps) {
  const activeCharacter =
    VICE_CHARACTERS.find((c) => c.id === activeCharacterId) ?? VICE_CHARACTERS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="tabular-telemetry text-xs uppercase text-[#e0247d]">
              Grand Theft Auto VI · Leonida Crew Dossiers
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] text-white mt-1">
              Characters & Profiles
            </h1>
          </div>
          <p className="text-sm text-[#94a3b8] max-w-md">
            Select your active protagonist or underground contact for your upcoming GTA 6 cloud
            streaming session.
          </p>
        </div>

        {/* 12-Column Asymmetric Layout: 3 Portrait Selectors (7 cols) + Active Dossier (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cinematic Character Selector Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VICE_CHARACTERS.map((char) => {
              const isSelected = char.id === activeCharacter.id;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => onSelectCharacter(char.id)}
                  className={`group relative aspect-[3/4] sm:aspect-auto sm:min-h-[470px] rounded-lg overflow-hidden text-left transition-all duration-200 cursor-pointer flex flex-col justify-end ${
                    isSelected
                      ? 'border border-[#e0247d] vice-magenta-bloom scale-[1.01]'
                      : 'border border-white/[0.08] hover:border-[#e0247d]/70 hover:scale-[1.015]'
                  }`}
                >
                  <div className="absolute inset-0">
                    <MediaImage
                      src={char.portrait}
                      alt={`${char.name} — ${char.role}`}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
                      fallbackTitle={char.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/35 to-transparent" />
                  </div>

                  <div className="relative z-10 p-5">
                    <p className="tabular-telemetry text-[11px] uppercase text-[#ffb1c8]">
                      {char.role}
                      {isSelected ? ' · ACTIVE' : ''}
                    </p>
                    <h2 className="font-display text-3xl font-extrabold uppercase tracking-[0.03em] text-white mt-1">
                      {char.name}
                    </h2>
                    <p className="text-xs text-[#94a3b8] mt-1">{char.alias}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Character Full Dossier */}
          <aside className="lg:col-span-5 vice-raised-card rounded-lg p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 text-xs tabular-telemetry text-[#4cd7f6]">
                <span>{activeCharacter.role}</span>
                <span>{activeCharacter.homeDistrict}</span>
              </div>

              <h2 className="font-display text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] text-white mt-2">
                {activeCharacter.name}
              </h2>
              <p className="text-sm font-medium text-[#ffb1c8] mt-1">
                “{activeCharacter.tagline}”
              </p>

              <p className="text-sm text-[#e4e1e9]/90 mt-5 leading-relaxed">
                {activeCharacter.bio}
              </p>

              {/* Key Loadout Metadata (Unboxed, clean dividers) */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#94a3b8]">Primary Specialty</p>
                  <p className="text-sm font-medium text-white mt-1">
                    {activeCharacter.specialty}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94a3b8]">Signature Ride</p>
                  <p className="text-sm font-medium text-white mt-1">
                    {activeCharacter.signatureVehicle}
                  </p>
                </div>
              </div>

              {/* Attribute Bars with Tabular Numerals */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-3.5">
                <p className="font-display text-sm font-bold uppercase tracking-[0.08em] text-[#94a3b8]">
                  Operational Profile
                </p>
                {activeCharacter.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#e4e1e9]">{stat.label}</span>
                      <span className="tabular-telemetry text-[#4cd7f6] font-semibold">
                        {stat.value} / 100
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded bg-[#0a0a0f] overflow-hidden">
                      <div
                        style={{ width: `${stat.value}%` }}
                        className="h-full vice-sunset-bar transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onLaunchAsCharacter(activeCharacter.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-sm tracking-[0.1em] hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                Play as {activeCharacter.name}
              </button>

              <div className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded bg-[#12121a] border border-[#06b6d4]/40 tabular-telemetry text-xs text-[#4cd7f6] whitespace-nowrap">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Session Bound
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
