import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { X, User, Key, Mail, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { PasturesLogo } from './PasturesLogo';

interface AuthModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  onOpenProviderLogin?: () => void;
}

export type AuthMode = 'login' | 'register' | 'forgot_password' | 'verify_email' | 'profile';

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUpdateUser,
  onOpenProviderLogin,
}) => {
  const [mode, setMode] = useState<AuthMode>('profile');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [postcode, setPostcode] = useState(currentUser.postcode);
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '1', '', '']);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      email,
      phone,
      address,
      postcode,
      role,
    };
    onUpdateUser(updated);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      email,
    };
    onUpdateUser(updated);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      address,
      postcode,
      role: 'customer',
      gardenSpecs: {
        lawnAreaM2: 120,
        hasHedges: true,
        hasTrees: false,
        petSafeOnly: true,
        organicMulch: true,
      },
    };
    onUpdateUser(updated);
    setMode('verify_email');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifySuccess(true);
    setTimeout(() => {
      setVerifySuccess(false);
      onClose();
    }, 1500);
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailSent(true);
    setTimeout(() => {
      setResetEmailSent(false);
      setMode('login');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <PasturesLogo variant="horizontal" size="sm" />
        </div>

        {/* 1. LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Authentication
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                Sign in to Pastures
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Access your estate appointments, invoices, and plant tracking.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-medium text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-[11px] text-emerald-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Sign In
            </button>

            <div className="text-center text-xs text-stone-500 pt-1">
              Don't have an estate account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>

            {onOpenProviderLogin && (
              <div className="pt-3 border-t border-stone-150">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProviderLogin();
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-emerald-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-stone-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Service Provider & Contractor Staff Login →</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* 2. REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                New Account
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                Register Property Account
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Create your estate profile to book Cotswolds arborists and groundsmen.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@estate.co.uk"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="font-medium text-stone-700">Property Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="High Meadow House"
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Postcode</label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="GL55 6HB"
                    className="w-full px-3 py-2 border border-stone-300 rounded-md uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Continue to Verification
            </button>

            <div className="text-center text-xs text-stone-500 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* 3. VERIFY EMAIL */}
        {mode === 'verify_email' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Security Verification
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                Verify Your Email
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                We sent a 6-digit confirmation code to <strong>{email}</strong>.
              </p>
            </div>

            {verifySuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-lg flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Email Verified! Loading dashboard...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otpCode];
                        newOtp[idx] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                      className="w-10 h-11 text-center font-mono font-bold text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Verify & Enter Platform
                </button>

                <div className="text-xs text-stone-500">
                  Didn't receive code?{' '}
                  <button type="button" className="text-emerald-800 font-bold hover:underline cursor-pointer">
                    Resend Code
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* 4. FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Security Recovery
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                Reset Account Password
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter your email address to receive secure OTP instructions.
              </p>
            </div>

            {resetEmailSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Password Reset Dispatched</span>
                </div>
                <p>A secure reset token has been sent to {email}. Check your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Your Registered Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Send Reset Link
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 5. PROFILE / EDIT */}
        {mode === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  User Profile & Role
                </span>
                <h2 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                  {currentUser.name}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-stone-500 hover:text-emerald-800 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-700">Telephone / Mobile</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="font-medium text-stone-700">Property Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Postcode</label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-medium text-stone-700">Active View Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  <option value="customer">Client (Bookings, Garden Map & Invoices)</option>
                  <option value="gardener">Gardener (Field Dispatch & Task Checklist)</option>
                  <option value="admin">Operations Admin (Roster & Revenue Ledger)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setMode('forgot_password')}
                className="text-stone-500 hover:text-emerald-800 cursor-pointer transition-colors"
              >
                Change Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Save Profile Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
