import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  X,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Truck,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { StaffAccount, ProviderStaffSession, UserProfile } from '../types';
import { STAFF_ACCOUNTS } from '../data/mockData';
import { PasturesLogo } from './PasturesLogo';

interface ProviderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (staff: StaffAccount, session: ProviderStaffSession) => void;
  targetDestination?: string;
}

export const ProviderAuthModal: React.FC<ProviderAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  targetDestination = 'Provider Hub',
}) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount>(STAFF_ACCOUNTS[0]);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('8492');
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectStaff = (staff: StaffAccount) => {
    setSelectedStaff(staff);
    setEnteredPin('');
    setErrorMsg(null);
  };

  const handleAutofillPin = (pin: string) => {
    setEnteredPin(pin);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (enteredPin.trim() !== selectedStaff.pin) {
      setErrorMsg(`Invalid Security PIN for ${selectedStaff.name}. (Hint: Use ${selectedStaff.pin})`);
      return;
    }

    if (!requires2FA && selectedStaff.role === 'admin') {
      // Require 2FA confirmation for admin tier
      setRequires2FA(true);
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setAuthSuccess(true);

      const session: ProviderStaffSession = {
        staffId: selectedStaff.id,
        name: selectedStaff.name,
        email: selectedStaff.email,
        role: selectedStaff.role,
        badgeNumber: selectedStaff.badgeNumber,
        authenticatedAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        securityClearance: selectedStaff.securityClearance,
      };

      setTimeout(() => {
        onAuthenticate(selectedStaff, session);
        setAuthSuccess(false);
        setRequires2FA(false);
        setEnteredPin('');
        onClose();
      }, 900);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          title="Return to Client View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative z-10 space-y-3 border-b border-stone-800 pb-5">
          <div className="flex items-center gap-3">
            <PasturesLogo variant="mark-only" size="sm" theme="light" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Security Clearance Required</span>
                </span>
                <span className="text-stone-500 text-[11px]">TLS 256-Bit</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                Service Provider Portal Access
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Restricted to Pastures groundskeeping contractors, arborists, and operations dispatch. Verify staff credentials to access {targetDestination}.
          </p>
        </div>

        {/* Success State Animation */}
        {authSuccess ? (
          <div className="py-12 text-center space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Identity Verified
            </h3>
            <p className="text-xs text-emerald-300">
              Welcome, {selectedStaff.name}. Loading secure contractor workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 mt-5 space-y-5">
            {/* Step 1: Select Staff Identity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-stone-300">Select Staff / Contractor Identity</label>
                <span className="text-[11px] text-stone-400">Badge Verified</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {STAFF_ACCOUNTS.map((staff) => {
                  const isSelected = selectedStaff.id === staff.id;
                  return (
                    <button
                      type="button"
                      key={staff.id}
                      onClick={() => handleSelectStaff(staff)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                          : 'bg-stone-800/60 border-stone-700/80 text-stone-300 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          {staff.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{staff.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-700 text-stone-300 rounded">
                              {staff.badgeNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400">{staff.title}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            staff.role === 'admin'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {staff.securityClearance.split(' ')[0]} {staff.securityClearance.split(' ')[1]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Security PIN Challenge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enter 4-Digit Security PIN</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAutofillPin(selectedStaff.pin)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Quick Autofill ({selectedStaff.pin})
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  required
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Enter 4-digit PIN..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 3: Two-Factor Dispatch Verification (For High-Security clearance) */}
            {requires2FA && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Operations 2FA Security Token</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Operations Director role grants access to financial ledgers and contractor payout records. Enter the 4-digit mobile dispatch token.
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={4}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-32 bg-stone-900 border border-amber-500/60 rounded-lg px-3 py-1.5 font-mono text-center text-sm font-bold text-amber-200"
                  />
                  <span className="text-[11px] text-stone-400">Token auto-generated for testing</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isVerifying || !enteredPin.trim()}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {requires2FA
                        ? 'Confirm 2FA & Access Operations Ledger'
                        : `Authenticate as ${selectedStaff.name.split(' ')[0]}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-medium text-stone-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Cancel & Return to Client Portal
              </button>
            </div>

            {/* Security Notice Footer */}
            <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                <span>Authorized personnel only</span>
              </span>
              <span>All access attempts logged</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
