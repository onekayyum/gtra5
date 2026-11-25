export type PortalView = 'home' | 'player' | 'map' | 'characters' | 'radio';

export type StreamResolution = '4K' | '1440P' | '1080P';
export type StreamFps = 60 | 120;
export type DatacenterId = 'US-EAST-MIA' | 'US-WEST-LAX' | 'EU-WEST-FRA' | 'AP-EAST-TYO';

export interface DatacenterRegion {
  id: DatacenterId;
  name: string;
  city: string;
  basePingMs: number;
  capacityLabel: string;
  tier: string;
}

export interface StreamSessionConfig {
  resolution: StreamResolution;
  fps: StreamFps;
  hdr10: boolean;
  bitrateMbps: number;
  datacenter: DatacenterId;
  lowLatencyMode: boolean;
  spatialAudio: boolean;
  showTelemetryHud: boolean;
  showControllerOverlay: boolean;
  controllerDeadzone: number;
  /**
   * Developer integration hook: paste any HLS/MP4/WebRTC media URL to mount
   * directly into the Live Player viewport when connecting your own server.
   */
  streamEndpointUrl: string;
}

export type MapCategory = 'All' | 'Districts' | 'Nightlife' | 'Heist Hubs' | 'Coastal';

export interface ViceLocation {
  id: string;
  name: string;
  region: string;
  category: Exclude<MapCategory, 'All'>;
  coordinates: string;
  x: number; // percentage 0..100 on tactical SVG map
  y: number; // percentage 0..100 on tactical SVG map
  heatLevel: string;
  atmosphere: string;
  summary: string;
  highlights: string[];
  previewImage: string;
}

export interface CharacterStat {
  label: string;
  value: number; // 0..100
}

export interface ViceCharacter {
  id: string;
  name: string;
  alias: string;
  role: string;
  homeDistrict: string;
  portrait: string;
  accentColor: 'magenta' | 'tangerine' | 'cyan';
  tagline: string;
  bio: string;
  signatureVehicle: string;
  specialty: string;
  stats: CharacterStat[];
}

export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export interface RadioStation {
  id: string;
  frequency: string;
  name: string;
  genre: string;
  host: string;
  tagline: string;
  moodColor: string;
  baseChordHz: number[];
  tempoBpm: number;
  tracks: RadioTrack[];
}
