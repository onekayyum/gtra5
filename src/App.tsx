import { useEffect, useMemo, useState } from 'react';
import { CloudSettingsDrawer } from './components/CloudSettingsDrawer';
import { CharactersView } from './components/CharactersView';
import { GameLoadingScreen } from './components/GameLoadingScreen';
import { HomeLauncher } from './components/HomeLauncher';
import { LivePlayerView } from './components/LivePlayerView';
import { MiniRadioBar } from './components/MiniRadioBar';
import { TopNav } from './components/TopNav';
import { TrailerModal } from './components/TrailerModal';
import { ViceMapView } from './components/ViceMapView';
import { ViceRadioView } from './components/ViceRadioView';
import {
  DEFAULT_STREAM_CONFIG,
  RADIO_STATIONS,
  VICE_CHARACTERS,
  VICE_LOCATIONS,
} from './data/viceData';
import { useViceRadioAudio } from './hooks/useViceRadioAudio';
import { DatacenterId, PortalView, StreamSessionConfig } from './types/portal';

const CONFIG_STORAGE_KEY = 'vice_horizon_stream_config_v1';

function loadSavedConfig(): StreamSessionConfig {
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_STREAM_CONFIG;
    const parsed = JSON.parse(raw) as Partial<StreamSessionConfig>;
    return { ...DEFAULT_STREAM_CONFIG, ...parsed };
  } catch {
    return DEFAULT_STREAM_CONFIG;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<PortalView>('home');
  const [streamConfig, setStreamConfig] = useState<StreamSessionConfig>(loadSavedConfig);
  const [activeCharacterId, setActiveCharacterId] = useState<string>(VICE_CHARACTERS[0].id);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(VICE_LOCATIONS[0].id);
  const [activeStationId, setActiveStationId] = useState<string>(RADIO_STATIONS[0].id);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [launchKey, setLaunchKey] = useState(0);

  const activeStation = useMemo(
    () => RADIO_STATIONS.find((s) => s.id === activeStationId) ?? RADIO_STATIONS[0],
    [activeStationId]
  );

  const radio = useViceRadioAudio(activeStation);

  useEffect(() => {
    try {
      window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(streamConfig));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [streamConfig]);

  const triggerGameStart = () => {
    if (radio.isPlaying) {
      radio.togglePlay();
    }
    setActiveView('player');
    setLaunchKey((k) => k + 1);
    setIsGameLoading(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateTo = (view: PortalView) => {
    if (view === 'player') {
      triggerGameStart();
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchDirectPlay = () => {
    triggerGameStart();
  };

  const handleLaunchAtLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    triggerGameStart();
  };

  const handleLaunchAsCharacter = (characterId: string) => {
    setActiveCharacterId(characterId);
    triggerGameStart();
  };

  const handleSelectDatacenter = (datacenter: DatacenterId) => {
    setStreamConfig((prev) => ({ ...prev, datacenter }));
  };

  const activeTrack =
    activeStation.tracks[radio.activeTrackIndex] ?? activeStation.tracks[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9]">
      <TopNav
        activeView={activeView}
        onNavigate={navigateTo}
        onLaunchDirectPlay={handleLaunchDirectPlay}
      />

      <main>
        {activeView === 'home' && (
          <HomeLauncher
            config={streamConfig}
            activeCharacterId={activeCharacterId}
            selectedLocationId={selectedLocationId}
            activeStation={activeStation}
            isRadioPlaying={radio.isPlaying}
            onNavigate={navigateTo}
            onLaunchDirectPlay={handleLaunchDirectPlay}
            onOpenTrailer={() => setIsTrailerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onSelectDatacenter={handleSelectDatacenter}
            onToggleRadio={radio.togglePlay}
          />
        )}

        {activeView === 'player' && (
          <LivePlayerView
            config={streamConfig}
            activeCharacterId={activeCharacterId}
            selectedLocationId={selectedLocationId}
            isLoadingScreenActive={isGameLoading}
            onUpdateConfig={setStreamConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onNavigate={navigateTo}
          />
        )}

        {activeView === 'map' && (
          <ViceMapView
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
            onLaunchAtLocation={handleLaunchAtLocation}
          />
        )}

        {activeView === 'characters' && (
          <CharactersView
            activeCharacterId={activeCharacterId}
            onSelectCharacter={setActiveCharacterId}
            onLaunchAsCharacter={handleLaunchAsCharacter}
          />
        )}

        {activeView === 'radio' && (
          <ViceRadioView
            activeStation={activeStation}
            isPlaying={radio.isPlaying}
            volume={radio.volume}
            isMuted={radio.isMuted}
            activeTrackIndex={radio.activeTrackIndex}
            visualizerBars={radio.visualizerBars}
            onSelectStation={setActiveStationId}
            onTogglePlay={radio.togglePlay}
            onVolumeChange={radio.setVolume}
            onToggleMute={radio.toggleMute}
            onSelectTrack={radio.selectTrack}
            onNextTrack={radio.nextTrack}
            onPrevTrack={radio.prevTrack}
          />
        )}
      </main>

      {/* Persistent Compact Radio Controller on non-player/non-radio views */}
      {radio.isPlaying && activeView !== 'radio' && activeView !== 'player' && (
        <MiniRadioBar
          station={activeStation}
          trackTitle={activeTrack.title}
          onTogglePlay={radio.togglePlay}
          onOpenRadio={() => navigateTo('radio')}
        />
      )}

      {/* Cloud Stream Settings Drawer */}
      <CloudSettingsDrawer
        isOpen={isSettingsOpen}
        config={streamConfig}
        onChange={setStreamConfig}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Official Cloud Showcase / Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onLaunchDirectPlay={handleLaunchDirectPlay}
      />

      {/* Full-Screen Frameless Game Loading Screen Video */}
      {isGameLoading && (
        <GameLoadingScreen
          key={launchKey}
          onComplete={() => setIsGameLoading(false)}
        />
      )}
    </div>
  );
}
