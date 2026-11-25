import { useState } from 'react';
import { Menu, Play, X } from 'lucide-react';
import { PortalView } from '../types/portal';

interface TopNavProps {
  activeView: PortalView;
  onNavigate: (view: PortalView) => void;
  onLaunchDirectPlay: () => void;
}

const NAV_ITEMS: { id: PortalView; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'player', label: 'Live Player' },
  { id: 'map', label: 'Vice Map' },
  { id: 'characters', label: 'Characters' },
  { id: 'radio', label: 'Vice Radio' },
];

export function TopNav({ activeView, onNavigate, onLaunchDirectPlay }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (view: PortalView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 vice-hud-plate border-b border-white/[0.08]">
      <div className="max-w-[1600px] mx-auto h-full px-5 md:px-8 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-display text-2xl font-extrabold uppercase tracking-[0.05em] text-white hover:text-[#ffb1c8] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Grand Theft Auto VI
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[2px] transition-opacity duration-150 ${
                    isActive
                      ? 'opacity-100 bg-[#e0247d]'
                      : 'opacity-0 bg-white/40'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary CTA (+ mobile menu toggle below md) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onLaunchDirectPlay();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-sm tracking-[0.1em] hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            Launch Direct Play
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded bg-[#181824] border border-white/10 text-white hover:border-[#06b6d4] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden vice-modal-surface border-b border-white/10 px-5 py-4 space-y-2">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#e0247d]/15 text-white border border-[#e0247d]/40'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onLaunchDirectPlay();
            }}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 chamfer-6 vice-sunset-gradient vice-magenta-bloom text-white font-display font-bold uppercase text-sm tracking-[0.1em] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            Launch Direct Play
          </button>
        </div>
      )}
    </header>
  );
}
