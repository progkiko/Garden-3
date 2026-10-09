import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { User, MapPin, CreditCard, Sliders, ShieldCheck, LogOut, Check, Plus, Trash2 } from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'addresses' | 'payments' | 'preferences' | 'privacy'>('details');

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [postcode, setPostcode] = useState(currentUser.postcode);
  const [petSafeOnly, setPetSafeOnly] = useState(currentUser.gardenSpecs?.petSafeOnly ?? true);
  const [organicMulch, setOrganicMulch] = useState(currentUser.gardenSpecs?.organicMulch ?? true);
  const [gateCode, setGateCode] = useState(currentUser.gardenSpecs?.gateAccessCode ?? '4821');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email,
      phone,
      address,
      postcode,
      gardenSpecs: {
        lawnAreaM2: currentUser.gardenSpecs?.lawnAreaM2 || 180,
        hasHedges: true,
        hasTrees: true,
        petSafeOnly,
        organicMulch,
        gateAccessCode: gateCode,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Account Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Client & Estate Profile
          </h1>
        </div>

        <button
          onClick={onLogout}
          className="px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-semibold overflow-x-auto">
        {[
          { id: 'details', label: 'Personal Details' },
          { id: 'addresses', label: 'Saved Addresses' },
          { id: 'payments', label: 'Payment Methods' },
          { id: 'preferences', label: 'Preferences' },
          { id: 'privacy', label: 'Privacy & GDPR' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
              activeTab === t.id ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Profile preferences saved successfully.</span>
        </div>
      )}

      {/* 1. PERSONAL DETAILS */}
      {activeTab === 'details' && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-stone-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-stone-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-stone-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-stone-700">Role Authority</label>
              <input
                type="text"
                disabled
                value="Estate Owner (Client)"
                className="w-full px-3 py-2 border border-stone-200 rounded-md bg-stone-50 text-stone-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Save Details
            </button>
          </div>
        </form>
      )}

      {/* 2. SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Primary Estate Grounds
                </span>
                <div className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                  High Meadow House
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Default
              </span>
            </div>

            <div className="text-xs text-stone-600 space-y-1">
              <div>{address}</div>
              <div className="font-mono">{postcode}</div>
              <div className="text-stone-500 mt-2">
                Gate Entry Code: <strong className="text-stone-800 font-mono">{gateCode}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-dashed border-stone-300 rounded-2xl cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Secondary Property / Country Cottage</span>
          </button>
        </div>
      )}

      {/* 3. PAYMENT METHODS */}
      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Payment Methods on File
          </h3>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center font-mono font-bold">
                VISA
              </div>
              <div>
                <div className="font-bold text-stone-900">Visa ending in 4242</div>
                <div className="text-stone-500">Expires 11/28 · Stripe Verified</div>
              </div>
            </div>
            <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
              Default
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 border border-stone-300 flex items-center justify-center font-bold">
                Pay
              </div>
              <div>
                <div className="font-bold text-stone-900">Apple Pay</div>
                <div className="text-stone-500">Instant biometric checkout</div>
              </div>
            </div>
            <span className="text-stone-500 text-xs">Active</span>
          </div>
        </div>
      )}

      {/* 4. PREFERENCES */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-xs text-xs">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Groundskeeper Visit Preferences
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-stone-50 rounded-xl border border-stone-200">
              <input
                type="checkbox"
                checked={petSafeOnly}
                onChange={(e) => setPetSafeOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-700 rounded"
              />
              <div>
                <div className="font-bold text-stone-900">100% Pet-Safe Treatments Only</div>
                <div className="text-stone-500">Zero synthetic chemical weedkillers harmful to dogs or cats</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-stone-50 rounded-xl border border-stone-200">
              <input
                type="checkbox"
                checked={organicMulch}
                onChange={(e) => setOrganicMulch(e.target.checked)}
                className="w-4 h-4 accent-emerald-700 rounded"
              />
              <div>
                <div className="font-bold text-stone-900">Organic Mushroom Compost & Bark Dressing</div>
                <div className="text-stone-500">Use sustainably sourced British peat-free mulch</div>
              </div>
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-stone-700">Side Gate Lock / Security Access Code</label>
            <input
              type="text"
              value={gateCode}
              onChange={(e) => setGateCode(e.target.value)}
              className="w-full sm:w-48 px-3 py-1.5 border border-stone-300 rounded-md font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            Update Preferences
          </button>
        </form>
      )}

      {/* 5. PRIVACY & GDPR */}
      {activeTab === 'privacy' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs text-xs text-stone-700">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Privacy & Data Sovereignty
          </h3>
          <p className="leading-relaxed">
            Pastures Gardening processes data under UK GDPR standards. We never share estate addresses or camera scans with third parties.
          </p>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-stone-300 hover:bg-stone-50 rounded-lg font-medium cursor-pointer"
            >
              Export Estate Dossier (JSON)
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg font-medium cursor-pointer"
            >
              Request Account Deletion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
