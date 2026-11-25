import { useState } from 'react';
import { Film } from 'lucide-react';

interface MediaImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function MediaImage({ src, alt, className = '', fallbackTitle }: MediaImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#181824] via-[#12121a] to-[#0a0a0f] border border-white/10 text-center p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded flex items-center justify-center bg-[#e0247d]/15 border border-[#e0247d]/40 mb-3">
          <Film className="w-5 h-5 text-[#ffb1c8]" aria-hidden="true" />
        </div>
        <p className="font-display uppercase tracking-[0.06em] text-lg font-bold text-white">
          {fallbackTitle ?? 'Grand Theft Auto VI'}
        </p>
        <p className="text-xs text-[#94a3b8] mt-1">Vice Horizon Cloud Media Surface</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
