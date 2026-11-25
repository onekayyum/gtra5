import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { TRAILER_CHAPTERS } from '../data/viceData';
import { MediaImage } from './MediaImage';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDirectPlay: () => void;
}

export function TrailerModal({
  isOpen,
  onClose,
  onLaunchDirectPlay,
}: TrailerModalProps) {
  const [chapterIndex, setChapterIndex] = useState(0);

  if (!isOpen) return null;

  const activeChapter = TRAILER_CHAPTERS[chapterIndex] ?? TRAILER_CHAPTERS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Grand Theft Auto VI Official Cloud Showcase"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-5xl vice-modal-surface rounded-lg overflow-hidden border border-white/15">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div>
            <p className="tabular-telemetry text-[11px] uppercase text-[#06b6d4]">
              Grand Theft Auto VI · Direct Cloud Showcase
            </p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-white mt-0.5">
              {activeChapter.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close showcase modal"
            className="w-9 h-9 rounded flex items-center justify-center bg-[#181824] border border-white/10 text-[#94a3b8] hover:text-white hover:border-[#06b6d4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main 16:9 Cinema Frame */}
        <div className="relative aspect-video bg-[#0a0a0f] overflow-hidden">
          <MediaImage
            src={activeChapter.image}
            alt={activeChapter.title}
            className="w-full h-full object-cover animate-cinematic-pan"
            fallbackTitle={activeChapter.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/25 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="tabular-telemetry text-xs text-[#4cd7f6]">
                {activeChapter.resolution} · {activeChapter.duration}
              </p>
              <p className="text-sm md:text-base text-[#e4e1e9] mt-1.5">
                {activeChapter.caption}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchDirectPlay();
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-sm tracking-[0.1em] hover:brightness-110 hover:scale-[1.02] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              Launch Direct Play
            </button>
          </div>
        </div>

        {/* Chapter Switcher */}
        <div className="p-4 md:p-5 bg-[#0a0a0f]/80 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-3">
          {TRAILER_CHAPTERS.map((ch, idx) => {
            const active = idx === chapterIndex;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChapterIndex(idx)}
                className={`text-left p-3.5 rounded transition-all duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#181824] border border-[#e0247d]/60'
                    : 'bg-[#12121a] border border-white/[0.07] hover:border-[#06b6d4]/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] tabular-telemetry text-[#94a3b8]">
                  <span>0{idx + 1} · CHAPTER</span>
                  <span>{ch.duration}</span>
                </div>
                <p className="font-display text-lg font-semibold uppercase tracking-[0.03em] text-white mt-1">
                  {ch.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
