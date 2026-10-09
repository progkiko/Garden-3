import React, { useState, useEffect } from 'react';
import { Sprout, ArrowRight, ShieldCheck, Compass, Sparkles, LogIn } from 'lucide-react';

interface SplashScreenProps {
  onEnterApp: () => void;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnterApp,
  onOpenOnboarding,
  onOpenAuth,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-stone-950 text-white overflow-hidden selection:bg-emerald-600 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-800 via-stone-900 to-black pointer-events-none" />
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Bar with Dismiss */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-widest uppercase font-mono text-[10px] text-emerald-400">
            Cotswolds & South West · Est. 2018
          </span>
        </div>
        <button
          onClick={onEnterApp}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 border border-stone-800 hover:border-stone-700"
        >
          <span>Skip to App</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Botanical Crest & Headline */}
      <div className={`relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-400 shadow-2xl backdrop-blur-md mx-auto">
          <Sprout className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
        </div>

        <div className="space-y-3">
          <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-emerald-400 font-mono">
            Royal Horticultural Society Certified
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Pastures Gardening & Landscaping
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Architectural estate landscaping, precision cylinder striping, AR botanical tracking, and automated photometric estimation.
          </p>
        </div>

        {/* 3 Entry Gateways */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left max-w-2xl mx-auto">
          {/* Option 1: Explore Dashboard */}
          <button
            onClick={onEnterApp}
            className="p-4 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Enter Dashboard
              </div>
              <div className="text-[11px] text-stone-300 mt-1 leading-snug">
                Access scheduled visits, garden zones, and billing ledger.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <span>Launch Now</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option 2: Onboarding Tour */}
          <button
            onClick={onOpenOnboarding}
            className="p-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Onboarding Tour
              </div>
              <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                Walkthrough of AR simulator, RHS care, and app permissions.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-stone-300">
              <span>Start 3-Step Tour</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option 3: Sign In / Switch Role */}
          <button
            onClick={onOpenAuth}
            className="p-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center mb-3">
                <LogIn className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Authentication
              </div>
              <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                Sign in, create account, reset password, or verify email.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-stone-300">
              <span>Manage Account</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Footer Credentials */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Full Public Liability Insurance (£5M) · BALI Registered Contractor</span>
        </div>
        <div>
          <span>High Meadow House, Chipping Campden, Gloucestershire</span>
        </div>
      </div>
    </div>
  );
};
