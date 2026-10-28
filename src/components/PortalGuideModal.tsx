import React from 'react';
import {
  X,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Users,
  Calendar,
  CreditCard,
  Truck,
  Sparkles,
  ArrowRight,
  Lock,
  Compass,
} from 'lucide-react';
import { PasturesLogo } from './PasturesLogo';

interface PortalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClientPortal: () => void;
  onSelectProviderPortal: () => void;
}

export const PortalGuideModal: React.FC<PortalGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectClientPortal,
  onSelectProviderPortal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-stone-200 text-stone-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 border-b border-stone-100 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>Pastures Platform Navigation & Security Guide</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Welcome to Pastures Gardening
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Pastures provides a dual-portal architecture separating private estate client services from groundskeeping contractor operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {/* Column 1: Client Portal */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Estate Owner Portal
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                  Client Estate View
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Designed for property owners like Eleanor Vance to manage appointments, review quotes, and monitor grounds health.
              </p>

              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Book grounds visits & select time windows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Interactive garden moisture & plant index</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Review and settle Stripe invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Localized weather care alerts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectClientPortal();
                onClose();
              }}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Switch to Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Column 2: Service Provider Portal */}
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900 text-white space-y-4 flex flex-col justify-between shadow-md">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Staff & Contractor Hub
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  Service Provider Portal
                </h3>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Dedicated operational command for groundskeepers, arborists, and operations directors. Secured with staff PIN credentials.
              </p>

              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Daily crew roster & job checklists</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Fleet dispatch & vehicle tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Fast on-site quote builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tax invoicing & revenue ledgers</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectProviderPortal();
                onClose();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>Staff Login & Provider Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security & Access Tip */}
        <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
          <Lock className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <div>
            <strong className="text-stone-900">Security Isolation: </strong>
            <span>
              Homeowner financial statements and property gate access codes remain protected. To switch between portals at any time, use the Portal Switcher in the top navigation bar.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
