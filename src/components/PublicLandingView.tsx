import React, { useRef, useEffect } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useAppContent } from '../context/ContentContext';

interface PublicLandingViewProps {
  onOpenLogin: () => void;
  onOpenAdminLogin: () => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ 
  onOpenLogin,
  onOpenAdminLogin
}) => {
  const { content } = useAppContent();

  const logoUrl = content.general?.logoUrl && content.general.logoUrl.trim() !== '' 
    ? content.general.logoUrl 
    : '/phimatics-logo.svg';
  const appName = content.general?.appName || 'PhiMatiCs Classes';

  // Secret 8-tap gesture detection on the PhiMatiCs Classes logo for faculty / admin quick access
  const tapTimestampsRef = useRef<number[]>([]);
  const resetTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleLogoTap = (e: React.MouseEvent) => {
    e.stopPropagation();

    const now = Date.now();

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const recentTaps = tapTimestampsRef.current.filter(t => now - t < 5000);
    recentTaps.push(now);
    tapTimestampsRef.current = recentTaps;

    if (recentTaps.length >= 8) {
      tapTimestampsRef.current = [];
      onOpenAdminLogin();
      return;
    }

    const firstTapTime = recentTaps[0];
    const timeRemaining = Math.max(0, 5000 - (now - firstTapTime));
    resetTimerRef.current = setTimeout(() => {
      tapTimestampsRef.current = [];
    }, timeRemaining + 20);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-teal-100 selection:text-slate-900">
      {/* Refined Academic Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              onClick={handleLogoTap}
              className="w-9 h-9 rounded-xl bg-[#0B132B] p-1.5 border border-slate-800 flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0"
              title={appName}
            >
              <img
                src={logoUrl}
                alt={appName}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight block leading-tight">
                {appName}
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight block leading-none mt-0.5">
                The Learning App
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="hidden sm:inline">Institutional Portal</span>
            <span className="sm:hidden">Portal</span>
          </div>
        </div>
      </header>

      {/* Central Academic Hero Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm sm:shadow-md p-6 sm:p-8 text-center">
            
            {/* Existing Official Emblem with Secret Faculty Gesture */}
            <div className="flex justify-center mb-5">
              <div 
                onClick={handleLogoTap}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B132B] p-3 shadow-xs border border-slate-800 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                title={appName}
              >
                <img
                  src={logoUrl}
                  alt={appName}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs font-bold tracking-widest text-teal-800 uppercase">
              THE LEARNING APP · GRADES 1–12
            </p>

            {/* Brand Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1.5 leading-tight">
              {appName}
            </h1>

            {/* Main Headline */}
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight mt-4">
              Learn. Practise. Improve. Achieve.
            </h2>

            {/* Supporting Text */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
              Your learning space for academic resources, practice, and student progress.
            </p>

            {/* Access Label */}
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>Private Institutional Access</span>
            </div>

            {/* Restrained Midnight Navy Sign In Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full h-12 px-6 rounded-xl bg-[#0B132B] hover:bg-[#142145] active:bg-[#070D1D] text-white font-semibold text-sm sm:text-base transition-colors shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <span>Sign In</span>
                <LogIn className="w-4 h-4 text-teal-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Institutional Footer */}
      <footer className="w-full border-t border-slate-200/70 bg-white/50 py-4 px-4 text-center">
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Secure access for authorised students and administrators.
        </p>
      </footer>
    </div>
  );
};
