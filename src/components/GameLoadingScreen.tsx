import { useCallback, useEffect, useRef, useState } from 'react';

interface GameLoadingScreenProps {
  onComplete: () => void;
}

const LOADING_VIDEO_SRC = '/src/assets/video/loading.mp4';

export function GameLoadingScreen({ onComplete }: GameLoadingScreenProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const completedRef = useRef(false);
  const [fadingOut, setFadingOut] = useState(false);

  const finishLoading = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setFadingOut(true);
    window.setTimeout(() => {
      onComplete();
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to muted autoplay if browser policy blocks unmuted playback
          if (!videoRef.current) return;
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {
            finishLoading();
          });
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishLoading();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finishLoading]);

  const handleScreenClick = () => {
    const video = videoRef.current;
    if (video && video.muted) {
      video.muted = false;
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[100] w-screen h-screen bg-black overflow-hidden select-none transition-opacity duration-350 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src={LOADING_VIDEO_SRC}
        autoPlay
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onEnded={finishLoading}
        onError={finishLoading}
        className="w-full h-full object-cover block"
      />
    </div>
  );
}
