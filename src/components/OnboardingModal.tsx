import React, { useState } from 'react';
import { Sparkles, Camera, MapPin, Check, ArrowRight, ShieldCheck, Leaf, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'features' | 'permissions'>('welcome');
  const [cameraGranted, setCameraGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  if (!isOpen) return null;

  const handleRequestCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
        setCameraGranted(true);
      } else {
        setCameraGranted(true);
      }
    } catch {
      setCameraGranted(true); // Allow continuing in preview
    }
  };

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(true)
      );
    } else {
      setLocationGranted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className={`h-1 flex-1 rounded-full ${
              step === 'welcome' || step === 'features' || step === 'permissions'
                ? 'bg-emerald-700'
                : 'bg-stone-200'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full ${
              step === 'features' || step === 'permissions' ? 'bg-emerald-700' : 'bg-stone-200'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full ${
              step === 'permissions' ? 'bg-emerald-700' : 'bg-stone-200'
            }`}
          />
        </div>

        {/* 1. Welcome */}
        {step === 'welcome' && (
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-800" />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Welcome to Pastures
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                English Garden Elegance, Cultivated with Care.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Connect directly with certified master arborists and groundsmen. Track maintenance,
                visualise plant growth in Augmented Reality, and manage seamless bookings.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Skip Onboarding
              </button>
              <button
                onClick={() => setStep('features')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Features */}
        {step === 'features' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Platform Capabilities
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Everything for Your Estate Grounds
              </h2>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">Photometric AI Estimates & RHS Plant Doctor</div>
                  <div className="text-stone-600 mt-0.5">
                    Upload garden photos for instant itemized quotes and expert botanical disease diagnosis.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">Interactive AR Garden Planning</div>
                  <div className="text-stone-600 mt-0.5">
                    Place lavender borders, topiary spheres, and Japanese maples directly on your lawn.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">Live Crew Dispatch & Invoicing</div>
                  <div className="text-stone-600 mt-0.5">
                    Real-time arrival windows, groundsman chat, and one-click Stripe payments.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep('welcome')}
                className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep('permissions')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Next: Permissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. Permissions */}
        {step === 'permissions' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Device Capabilities
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Enable AR & Dispatch Services
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                To experience Augmented Reality plant projection and regional Cotswolds arborist dispatch:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Camera Access</div>
                    <div className="text-[11px] text-stone-500">For AR scanning and plant health photos</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestCamera}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    cameraGranted
                      ? 'bg-emerald-100 text-emerald-800 flex items-center gap-1'
                      : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {cameraGranted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Allowed</span>
                    </>
                  ) : (
                    'Allow'
                  )}
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Location Services</div>
                    <div className="text-[11px] text-stone-500">For local weather & crew ETA accuracy</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    locationGranted
                      ? 'bg-emerald-100 text-emerald-800 flex items-center gap-1'
                      : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  {locationGranted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Allowed</span>
                    </>
                  ) : (
                    'Allow'
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep('features')}
                className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Enter Main Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
