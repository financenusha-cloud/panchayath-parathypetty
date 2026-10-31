'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KeralaEmblem } from '@/components/KeralaEmblem';
import { AUTHORITY_ROLES } from '@/data/keralaData';
import { AuthorityRole } from '@/types/grievance';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'OFFICER' ? 'OFFICER' : 'CITIZEN';
  const callbackUrl = searchParams.get('callbackUrl') || (initialTab === 'OFFICER' ? '/authority' : '/my-petitions');
  const errorParam = searchParams.get('error');

  const [activeTab, setActiveTab] = useState<'CITIZEN' | 'OFFICER'>(initialTab);

  // Citizen form state
  const [citizenPhone, setCitizenPhone] = useState('+91 94471 28910');
  const [citizenName, setCitizenName] = useState('Suresh Kumar G.');
  const [citizenOtp, setCitizenOtp] = useState('4821');
  const [citizenLoading, setCitizenLoading] = useState(false);

  // Officer form state
  const [selectedRole, setSelectedRole] = useState<AuthorityRole>('ASSISTANT_ENGINEER');
  const [employeeCode, setEmployeeCode] = useState('PEN-LSGD-4819');
  const [officerPassword, setOfficerPassword] = useState('lsgd2026');
  const [officerLoading, setOfficerLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(
    errorParam === 'OfficerAccessRequired'
      ? 'Access restricted. Please log in with a verified Panchayat Officer account.'
      : ''
  );

  // Handle Citizen Login
  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenPhone.trim() || !citizenName.trim()) {
      setErrorMessage('Please enter your mobile number and name.');
      return;
    }

    setCitizenLoading(true);
    setErrorMessage('');

    const res = await signIn('citizen-login', {
      redirect: false,
      phone: citizenPhone,
      name: citizenName,
      callbackUrl,
    });

    setCitizenLoading(false);

    if (res?.error) {
      setErrorMessage('Login failed. Please check your credentials.');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  // Handle Officer Login
  const handleOfficerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfficerLoading(true);
    setErrorMessage('');

    const res = await signIn('admin-login', {
      redirect: false,
      officerRole: selectedRole,
      employeeCode,
      password: officerPassword,
      callbackUrl: callbackUrl.startsWith('/authority') ? callbackUrl : '/authority',
    });

    setOfficerLoading(false);

    if (res?.error) {
      setErrorMessage('Invalid officer credentials.');
    } else {
      router.push(callbackUrl.startsWith('/authority') ? callbackUrl : '/authority');
      router.refresh();
    }
  };

  // Quick 1-click test fill for officers
  const handleQuickOfficerSelect = (role: AuthorityRole) => {
    setSelectedRole(role);
    setEmployeeCode(`PEN-LSGD-${Math.floor(1000 + Math.random() * 9000)}`);
    setOfficerPassword('lsgd2026');
  };

  // Quick 1-click test fill for citizens
  const handleQuickCitizenSelect = (name: string, phone: string) => {
    setCitizenName(name);
    setCitizenPhone(phone);
    setCitizenOtp('1234');
  };

  const currentOfficer = AUTHORITY_ROLES.find(o => o.role === selectedRole);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <KeralaEmblem className="w-14 h-14" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              പരാതിപ്പെട്ടി ലോഗിൻ
            </h1>
            <p className="text-xs text-kerala-800 font-bold uppercase tracking-wider mt-0.5">
              ParathiPetti LSGD Unified Sign-In
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Kerala Local Self Government Department Portal
            </p>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="bg-slate-200/80 p-1 rounded-2xl grid grid-cols-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              setActiveTab('CITIZEN');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'CITIZEN'
                ? 'bg-white text-kerala-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen (പൗരൻ)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('OFFICER');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'OFFICER'
                ? 'bg-kerala-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gold-300" />
            <span>Official (ഉദ്യോഗസ്ഥൻ)</span>
          </button>
        </div>

        {/* Tab 1: Citizen Login */}
        {activeTab === 'CITIZEN' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                Civilian Portal Sign-In (പൗരൻ പ്രവേശനം)
              </h2>
              <p className="text-xs text-slate-500">
                Sign in with your registered mobile to access your filed petitions, receipts, and live status.
              </p>
            </div>

            <form onSubmit={handleCitizenLogin} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name (പേര്) *
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Suresh Kumar G."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number (ഫോൺ നമ്പർ) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+91 94471 XXXXX"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  value={citizenOtp}
                  onChange={(e) => setCitizenOtp(e.target.value)}
                  placeholder="4-digit OTP (e.g. 4821)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-mono tracking-widest text-center"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Simulated OTP pre-filled for instant demonstration.
                </span>
              </div>

              <button
                type="submit"
                disabled={citizenLoading}
                className="w-full py-3 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
              >
                <span>{citizenLoading ? 'Verifying...' : 'Sign In to My Petitions'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Citizen Accounts */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                1-Click Demo Citizen Profiles:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickCitizenSelect('Suresh Kumar G.', '+91 94471 28910')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
                >
                  <p className="font-bold text-slate-800">Suresh Kumar</p>
                  <p className="text-[10px] text-slate-500">Ward 7, Venganoor</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickCitizenSelect('Mariamma Joseph', '+91 98472 55102')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition"
                >
                  <p className="font-bold text-slate-800">Mariamma Joseph</p>
                  <p className="text-[10px] text-slate-500">Ward 4, Mararikulam</p>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
              New citizen resident?{' '}
              <Link href="/signup?type=CITIZEN" className="font-bold text-kerala-800 hover:text-kerala-950 underline">
                Sign Up here (രജിസ്റ്റർ ചെയ്യുക)
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Officer / Admin Login */}
        {activeTab === 'OFFICER' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  LSGD Authorized Only
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Panchayat Authority Sign-In (ഉദ്യോഗസ്ഥ ലോഗിൻ)
              </h2>
              <p className="text-xs text-slate-500">
                Secure access to official grievance in-tray, field inspection logs, and order issuance.
              </p>
            </div>

            <form onSubmit={handleOfficerLogin} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designation / Role (പദവി) *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as AuthorityRole)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                >
                  {AUTHORITY_ROLES.map((officer) => (
                    <option key={officer.role} value={officer.role}>
                      {officer.nameEn} ({officer.nameMl})
                    </option>
                  ))}
                </select>
                {currentOfficer && (
                  <p className="text-[11px] text-kerala-800 font-medium mt-1">
                    Default Official: {currentOfficer.defaultOfficialEn} ({currentOfficer.jurisdiction})
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Permanent Employee Number (PEN / Code) *
                </label>
                <input
                  type="text"
                  required
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="e.g. PEN-LSGD-4819"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password / Passkey *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder="Enter password (default: lsgd2026)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Demo password: <strong className="font-mono text-slate-700">lsgd2026</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={officerLoading}
                className="w-full py-3 rounded-xl bg-kerala-900 hover:bg-kerala-800 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-gold-300" />
                <span>{officerLoading ? 'Authenticating...' : 'Enter Authority Dashboard'}</span>
              </button>
            </form>

            {/* Quick 1-Click Officer Switcher */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                1-Click Quick Officer Sign-In:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickOfficerSelect('PRESIDENT')}
                  className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition"
                >
                  <p className="font-bold text-amber-950">GP President</p>
                  <p className="text-[10px] text-amber-800">Adv. Radhakrishnan</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickOfficerSelect('ASSISTANT_ENGINEER')}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition"
                >
                  <p className="font-bold text-blue-950">Assistant Engineer</p>
                  <p className="text-[10px] text-blue-800">Er. Thomas V. Mathew</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickOfficerSelect('HEALTH_INSPECTOR')}
                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition"
                >
                  <p className="font-bold text-emerald-950">Health Inspector</p>
                  <p className="text-[10px] text-emerald-800">Sri. Rajesh Kumar</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickOfficerSelect('VILLAGE_EXTENSION_OFFICER')}
                  className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
                >
                  <p className="font-bold text-purple-950">VEO (Life Mission)</p>
                  <p className="text-[10px] text-purple-800">Smt. Priya Chandran</p>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
              New Panchayat Official?{' '}
              <Link href="/signup?type=OFFICER" className="font-bold text-kerala-800 hover:text-kerala-950 underline">
                Officer Onboarding (രജിസ്റ്റർ ചെയ്യുക)
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Login Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
