import { Pause, Radio } from 'lucide-react';
import { RadioStation } from '../types/portal';

interface MiniRadioBarProps {
  station: RadioStation;
  trackTitle: string;
  onTogglePlay: () => void;
  onOpenRadio: () => void;
}

export function MiniRadioBar({
  station,
  trackTitle,
  onTogglePlay,
  onOpenRadio,
}: MiniRadioBarProps) {
  return (
    <div className="fixed bottom-5 right-5 z-30 vice-hud-plate chamfer-6 px-4 py-2.5 flex items-center gap-3.5 border border-[#e0247d]/50 vice-magenta-bloom max-w-[92vw]">
      <Radio
        className="w-4 h-4 shrink-0"
        style={{ color: station.moodColor }}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={onOpenRadio}
        className="text-left min-w-0 cursor-pointer"
      >
        <p className="tabular-telemetry text-[10px] uppercase text-[#4cd7f6] leading-none">
          {station.frequency} · {station.name}
        </p>
        <p className="text-xs font-medium text-white truncate max-w-[180px] mt-1">
          {trackTitle}
        </p>
      </button>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label="Pause Vice Radio"
        className="w-8 h-8 rounded bg-[#181824] border border-white/15 hover:border-[#06b6d4] text-white flex items-center justify-center shrink-0 cursor-pointer"
      >
        <Pause className="w-3.5 h-3.5 fill-current" />
      </button>
    </div>
  );
}
