import { useCallback, useEffect, useRef, useState } from 'react';
import { RadioStation } from '../types/portal';

interface ViceRadioEngine {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  activeTrackIndex: number;
  visualizerBars: number[];
  togglePlay: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  selectTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const DEFAULT_BARS = [18, 32, 48, 28, 62, 44, 72, 38, 56, 30, 46, 24, 52, 36, 40, 22];

export function useViceRadioAudio(station: RadioStation): ViceRadioEngine {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.55);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(DEFAULT_BARS);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const stepIntervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const stepCountRef = useRef(0);

  const stopAudioNodes = useCallback(() => {
    if (stepIntervalRef.current !== null) {
      window.clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.suspend().catch(() => {});
    }
  }, []);

  const ensureContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextCtor();
      const masterGain = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      masterGain.gain.value = isMuted ? 0 : volume * 0.25;
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, [isMuted, volume]);

  const triggerSynthStep = useCallback(
    (chordHz: number[], stepIndex: number) => {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      const now = ctx.currentTime;

      // Warm analog bass pulse on quarter steps
      if (stepIndex % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassFilter = ctx.createBiquadFilter();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sawtooth';
        const bassRoot = chordHz[0] * (stepIndex % 8 >= 4 ? 1.122 : 1);
        bassOsc.frequency.setValueAtTime(bassRoot, now);
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(420, now);
        bassFilter.frequency.exponentialRampToValueAtTime(140, now + 0.22);
        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.45, now + 0.02);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(master);
        bassOsc.start(now);
        bassOsc.stop(now + 0.28);
      }

      // Vice arpeggio shimmer note
      const arpOsc = ctx.createOscillator();
      const arpFilter = ctx.createBiquadFilter();
      const arpGain = ctx.createGain();
      arpOsc.type = 'triangle';
      const note = chordHz[(stepIndex + (stepIndex % 3)) % chordHz.length] * 2;
      arpOsc.frequency.setValueAtTime(note, now);
      arpFilter.type = 'bandpass';
      arpFilter.frequency.setValueAtTime(1200, now);
      arpGain.gain.setValueAtTime(0.001, now);
      arpGain.gain.linearRampToValueAtTime(0.24, now + 0.015);
      arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      arpOsc.connect(arpFilter);
      arpFilter.connect(arpGain);
      arpGain.connect(master);
      arpOsc.start(now);
      arpOsc.stop(now + 0.24);
    },
    []
  );

  useEffect(() => {
    setActiveTrackIndex(0);
  }, [station.id]);

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        isMuted ? 0 : volume * 0.25,
        audioCtxRef.current.currentTime,
        0.04
      );
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!isPlaying) {
      stopAudioNodes();
      setVisualizerBars(DEFAULT_BARS.map((v) => Math.max(12, Math.round(v * 0.45))));
      return;
    }

    ensureContext();
    const stepMs = Math.round((60 / station.tempoBpm / 2) * 1000);
    stepCountRef.current = 0;

    triggerSynthStep(station.baseChordHz, 0);
    stepIntervalRef.current = window.setInterval(() => {
      stepCountRef.current += 1;
      triggerSynthStep(station.baseChordHz, stepCountRef.current);
    }, stepMs);

    const dataArray = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 32);
    const updateMeters = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const bars = Array.from({ length: 16 }, (_, idx) => {
          const bin = dataArray[idx % dataArray.length] ?? 0;
          return Math.min(98, Math.max(14, Math.round((bin / 255) * 92 + 12)));
        });
        setVisualizerBars(bars);
      }
      rafRef.current = window.requestAnimationFrame(updateMeters);
    };
    rafRef.current = window.requestAnimationFrame(updateMeters);

    return () => {
      stopAudioNodes();
    };
  }, [isPlaying, station, ensureContext, stopAudioNodes, triggerSynthStep]);

  useEffect(() => {
    return () => {
      stopAudioNodes();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAudioNodes]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.max(0, Math.min(1, value)));
    if (value > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const selectTrack = useCallback((index: number) => {
    setActiveTrackIndex(index);
    setIsPlaying(true);
  }, []);

  const nextTrack = useCallback(() => {
    setActiveTrackIndex((prev) => (prev + 1) % station.tracks.length);
  }, [station.tracks.length]);

  const prevTrack = useCallback(() => {
    setActiveTrackIndex((prev) => (prev - 1 + station.tracks.length) % station.tracks.length);
  }, [station.tracks.length]);

  return {
    isPlaying,
    volume,
    isMuted,
    activeTrackIndex,
    visualizerBars,
    togglePlay,
    setVolume,
    toggleMute,
    selectTrack,
    nextTrack,
    prevTrack,
  };
}
