import React, { useState, useEffect } from 'react';
import { ArrowRight, Sprout, ShieldCheck, LogIn } from 'lucide-react';
import { PasturesLogo } from './PasturesLogo';

interface SplashScreenProps {
  onEnterApp: () => void;
  onEnterClientPortal?: () => void;
  onEnterProviderPortal?: () => void;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnterApp,
  onEnterClientPortal,
  onEnterProviderPortal,
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

      {/* Center Botanical Crest & Headline with Authentic Logo */}
      <div className={`relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="py-2">
          <PasturesLogo variant="full" size="xl" theme="light" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold tracking-widest uppercase text-emerald-400 font-mono">
            Royal Horticultural Society Certified Grounds Care
          </div>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Architectural estate landscaping, precision cylinder striping, AR botanical tracking, and complete client & grounds operations management.
          </p>
        </div>

        {/* 3 Entry Gateways: Client Portal, Service Provider Hub, Onboarding */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left max-w-2xl mx-auto">
          {/* Option 1: Client Portal */}
          <button
            onClick={onEnterClientPortal || onEnterApp}
            className="p-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center mb-3">
                <Sprout className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Estate Client Portal
              </div>
              <div className="text-[11px] text-stone-300 mt-1 leading-snug">
                Book visits, approve quotes, track plant passport, and view invoices.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <span>Enter as Client</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option 2: Service Provider Portal */}
          <button
            onClick={onEnterProviderPortal || onEnterApp}
            className="p-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Service Provider Hub
              </div>
              <div className="text-[11px] text-stone-300 mt-1 leading-snug">
                Daily field roster, on-site checklist, quote builder, and team fleet.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <span>Enter Operations</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option 3: Sign In / Onboarding */}
          <button
            onClick={onOpenAuth}
            className="p-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center mb-3">
                <LogIn className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Account & Tour
              </div>
              <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                Sign in, switch persona, or take the interactive walkthrough.
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
