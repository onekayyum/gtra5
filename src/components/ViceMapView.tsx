import { useMemo, useRef, useState } from 'react';
import {
  Crosshair,
  MapPin,
  Minus,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { ASSETS, VICE_LOCATIONS } from '../data/viceData';
import { MapCategory } from '../types/portal';
import { MediaImage } from './MediaImage';

interface ViceMapViewProps {
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  onLaunchAtLocation: (id: string) => void;
}

const CATEGORIES: MapCategory[] = [
  'All',
  'Districts',
  'Nightlife',
  'Heist Hubs',
  'Coastal',
];

export function ViceMapView({
  selectedLocationId,
  onSelectLocation,
  onLaunchAtLocation,
}: ViceMapViewProps) {
  const [category, setCategory] = useState<MapCategory>('All');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const filteredLocations = useMemo(() => {
    if (category === 'All') return VICE_LOCATIONS;
    return VICE_LOCATIONS.filter((loc) => loc.category === category);
  }, [category]);

  const selectedLocation = useMemo(() => {
    return (
      VICE_LOCATIONS.find((l) => l.id === selectedLocationId) ??
      filteredLocations[0] ??
      VICE_LOCATIONS[0]
    );
  }, [selectedLocationId, filteredLocations]);

  const handleZoomIn = () => setZoom((z) => Math.min(2.2, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, Number((z - 0.25).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragOriginRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragOriginRef.current.x;
    const dy = e.clientY - dragOriginRef.current.y;
    const limit = 180 * zoom;
    setPan({
      x: Math.max(-limit, Math.min(limit, dragOriginRef.current.panX + dx)),
      y: Math.max(-limit, Math.min(limit, dragOriginRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  const getPinColor = (cat: Exclude<MapCategory, 'All'>, active: boolean) => {
    if (active) return 'bg-[#e0247d] border-white vice-magenta-bloom';
    switch (cat) {
      case 'Coastal':
        return 'bg-[#06b6d4] border-[#0a0a0f]';
      case 'Heist Hubs':
        return 'bg-[#f97316] border-[#0a0a0f]';
      case 'Nightlife':
        return 'bg-[#ec4899] border-[#0a0a0f]';
      default:
        return 'bg-[#ffb1c8] border-[#0a0a0f]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-16">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header + Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
          <div>
            <p className="tabular-telemetry text-xs uppercase text-[#06b6d4]">
              Grand Theft Auto VI · State of Leonida Tactical Atlas
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-extrabold uppercase tracking-[0.03em] text-white mt-1">
              Interactive Vice Map
            </h1>
          </div>

          {/* Interactive Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#12121a] border border-white/[0.08]">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'vice-sunset-gradient text-white'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 12-Column Split: Tactical Map Canvas (8) + Location Briefing (4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Map Canvas */}
          <div className="lg:col-span-8 relative min-h-[460px] lg:min-h-[640px] rounded-lg overflow-hidden bg-[#0e0e15] border border-white/10 flex flex-col">
            {/* Top Map Telemetry Strip */}
            <div className="relative z-20 px-4 py-3 vice-hud-plate border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 tabular-telemetry text-xs text-[#4cd7f6]">
                <Crosshair className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{selectedLocation.coordinates}</span>
                <span aria-hidden="true" className="text-white/25">
                  /
                </span>
                <span className="text-[#e4e1e9] uppercase">{selectedLocation.region}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  aria-label="Zoom out map"
                  className="w-8 h-8 rounded bg-[#181824] border border-white/10 hover:border-[#06b6d4] text-white flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="tabular-telemetry text-xs text-[#94a3b8] px-2">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  aria-label="Zoom in map"
                  className="w-8 h-8 rounded bg-[#181824] border border-white/10 hover:border-[#06b6d4] text-white flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetView}
                  aria-label="Reset map view"
                  className="ml-1 px-2.5 h-8 rounded bg-[#181824] border border-white/10 hover:border-[#06b6d4] text-xs text-[#94a3b8] hover:text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* Pannable & Zoomable Tactical Map Plane */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`relative flex-1 overflow-hidden ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              <div
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="absolute inset-0 origin-center"
              >
                {/* Atmospheric dark aerial texture */}
                <MediaImage
                  src={ASSETS.viceBeachAerial}
                  alt="Leonida satellite terrain texture"
                  className="w-full h-full object-cover opacity-20 saturate-50 mix-blend-luminosity"
                />

                {/* Vector Leonida & Vice City Tactical Coastline + Highways SVG */}
                <svg
                  viewBox="0 0 1000 700"
                  className="absolute inset-0 w-full h-full"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="viceGrid"
                      width="50"
                      height="50"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 50 0 L 0 0 0 50"
                        fill="none"
                        stroke="rgba(255,255,255,0.045)"
                        strokeWidth="1"
                      />
                    </pattern>
                    <linearGradient id="causewayGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#e0247d" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>

                  <rect width="1000" height="700" fill="url(#viceGrid)" />

                  {/* Mainland Leonida landmass */}
                  <path
                    d="M 40 40 L 630 40 L 665 180 L 610 290 L 640 390 L 570 480 L 490 540 L 360 565 L 220 520 L 140 440 L 80 320 Z"
                    fill="rgba(24, 24, 36, 0.78)"
                    stroke="rgba(6, 182, 212, 0.38)"
                    strokeWidth="2"
                  />

                  {/* Grassrivers wetland contours */}
                  <path
                    d="M 150 130 Q 260 110 340 190 T 270 300 Q 170 280 150 130 Z"
                    fill="rgba(6, 182, 212, 0.08)"
                    stroke="rgba(6, 182, 212, 0.28)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />

                  {/* Vice Beach Barrier Island */}
                  <path
                    d="M 745 160 L 810 175 L 855 340 L 835 450 L 775 465 L 740 320 Z"
                    fill="rgba(28, 22, 38, 0.85)"
                    stroke="rgba(224, 36, 125, 0.55)"
                    strokeWidth="2"
                  />

                  {/* Starfish Island */}
                  <ellipse
                    cx="688"
                    cy="332"
                    rx="34"
                    ry="22"
                    fill="rgba(28, 22, 38, 0.88)"
                    stroke="rgba(249, 115, 22, 0.5)"
                    strokeWidth="1.5"
                  />

                  {/* Leonida Keys Archipelago */}
                  <path
                    d="M 595 555 Q 675 560 720 605 Q 685 635 620 610 Z"
                    fill="rgba(24, 24, 36, 0.85)"
                    stroke="rgba(6, 182, 212, 0.55)"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M 745 618 Q 795 612 835 642 Q 795 662 745 645 Z"
                    fill="rgba(24, 24, 36, 0.82)"
                    stroke="rgba(6, 182, 212, 0.45)"
                    strokeWidth="1.5"
                  />

                  {/* Major Expressways & Bayfront Causeways */}
                  <path
                    d="M 240 365 L 420 440 L 560 270 L 780 310"
                    fill="none"
                    stroke="url(#causewayGlow)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 560 270 L 580 430 L 680 575"
                    fill="none"
                    stroke="rgba(224, 36, 125, 0.55)"
                    strokeWidth="2.5"
                    strokeDasharray="8 5"
                  />
                  <path
                    d="M 280 185 L 440 245 L 560 270"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="2"
                  />

                  {/* Subtle Region Typography */}
                  <text
                    x="185"
                    y="150"
                    fill="rgba(148,163,184,0.45)"
                    fontSize="14"
                    fontFamily="Barlow Condensed"
                    letterSpacing="4"
                  >
                    GRASSRIVERS
                  </text>
                  <text
                    x="470"
                    y="220"
                    fill="rgba(255,255,255,0.45)"
                    fontSize="16"
                    fontFamily="Barlow Condensed"
                    letterSpacing="5"
                  >
                    VICE METRO
                  </text>
                  <text
                    x="742"
                    y="142"
                    fill="rgba(255,177,200,0.55)"
                    fontSize="14"
                    fontFamily="Barlow Condensed"
                    letterSpacing="4"
                  >
                    VICE BEACH
                  </text>
                  <text
                    x="600"
                    y="660"
                    fill="rgba(76,215,246,0.5)"
                    fontSize="14"
                    fontFamily="Barlow Condensed"
                    letterSpacing="4"
                  >
                    LEONIDA KEYS
                  </text>
                </svg>

                {/* Interactive Drop Zone Markers */}
                {filteredLocations.map((loc) => {
                  const isSelected = loc.id === selectedLocation.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => onSelectLocation(loc.id)}
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer focus:outline-none"
                      aria-label={`Select ${loc.name} on Vice Map`}
                    >
                      <span
                        className={`relative flex items-center justify-center rounded-full border-2 transition-transform duration-150 ${
                          isSelected
                            ? 'w-6 h-6 scale-110'
                            : 'w-4 h-4 group-hover:scale-125'
                        } ${getPinColor(loc.category, isSelected)}`}
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span
                        className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-display font-bold uppercase tracking-[0.06em] whitespace-nowrap transition-colors ${
                          isSelected
                            ? 'bg-[#0a0a0f]/95 text-white border border-[#e0247d]'
                            : 'bg-[#0a0a0f]/80 text-[#e4e1e9] border border-white/10 group-hover:border-[#06b6d4]'
                        }`}
                      >
                        {loc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Legend Bar */}
            <div className="relative z-20 px-4 py-2.5 bg-[#0e0e13]/90 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[11px] tabular-telemetry text-[#94a3b8]">
              <span>Drag to pan · Select any marker to inspect spawn zone</span>
              <span>{filteredLocations.length} Active Drop Points Shown</span>
            </div>
          </div>

          {/* Right Panel: Selected Location Briefing & Quick List */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <article className="vice-raised-card rounded-lg overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-[#0a0a0f]">
                <MediaImage
                  src={selectedLocation.previewImage}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                  fallbackTitle={selectedLocation.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181824] via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#4cd7f6] tabular-telemetry">
                  <span>{selectedLocation.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedLocation.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#ffb1c8]">{selectedLocation.heatLevel}</span>
                </div>

                <h2 className="font-display text-3xl font-bold uppercase tracking-[0.03em] text-white mt-2">
                  {selectedLocation.name}
                </h2>
                <p className="tabular-telemetry text-xs text-[#94a3b8] mt-1">
                  {selectedLocation.coordinates} · {selectedLocation.atmosphere}
                </p>

                <p className="text-sm text-[#e4e1e9]/90 mt-4 leading-relaxed">
                  {selectedLocation.summary}
                </p>

                <div className="mt-5 pt-4 border-t border-white/[0.08]">
                  <p className="text-xs font-medium text-[#94a3b8] mb-2">
                    Key Landmarks
                  </p>
                  <p className="text-xs text-white leading-relaxed">
                    {selectedLocation.highlights.join(' · ')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onLaunchAtLocation(selectedLocation.id)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-sm tracking-[0.1em] hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  Launch at {selectedLocation.name}
                </button>
              </div>
            </article>

            {/* Compact Scrollable Index of Filtered Drop Zones */}
            <div className="vice-hud-plate rounded-lg p-4 flex-1">
              <p className="font-display text-sm font-bold uppercase tracking-[0.08em] text-[#94a3b8] mb-3">
                Drop Zone Index
              </p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredLocations.map((loc) => {
                  const active = loc.id === selectedLocation.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => onSelectLocation(loc.id)}
                      className={`w-full text-left px-3 py-2.5 rounded flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#e0247d]/15 border border-[#e0247d]/60 text-white'
                          : 'bg-[#12121a] border border-transparent hover:border-white/15 text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <MapPin
                          className={`w-3.5 h-3.5 shrink-0 ${
                            active ? 'text-[#e0247d]' : 'text-[#64748b]'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium truncate">{loc.name}</span>
                      </span>
                      <span className="tabular-telemetry text-[11px] text-[#64748b] shrink-0">
                        {loc.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
