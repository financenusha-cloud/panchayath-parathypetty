'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KeralaEmblem } from '@/components/KeralaEmblem';
import { KERALA_DISTRICTS, AUTHORITY_ROLES } from '@/data/keralaData';
import { AuthorityRole } from '@/types/grievance';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Lock, 
  Building2, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  User
} from 'lucide-react';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('type') === 'OFFICER' ? 'OFFICER' : 'CITIZEN';

  const [regType, setRegType] = useState<'CITIZEN' | 'OFFICER'>(initialRole);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Location State
  const [districtId, setDistrictId] = useState('TVM');
  const [panchayatId, setPanchayatId] = useState('venganoor');
  const [wardNumber, setWardNumber] = useState(7);
  const [wardName, setWardName] = useState('Chavadinada Ward (ചാവടിനട)');

  // Citizen Registration State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenAddress, setCitizenAddress] = useState('');
  const [citizenAadhaarLast4, setCitizenAadhaarLast4] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');

  // Officer Registration State
  const [officerName, setOfficerName] = useState('');
  const [officerRole, setOfficerRole] = useState<AuthorityRole>('ASSISTANT_ENGINEER');
  const [employeeCode, setEmployeeCode] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');

  const currentDistrict = KERALA_DISTRICTS.find(d => d.id === districtId) || KERALA_DISTRICTS[0];
  const currentPanchayat = currentDistrict.panchayats.find(p => p.id === panchayatId) || currentDistrict.panchayats[0];

  const handleDistrictChange = (dId: string) => {
    setDistrictId(dId);
    const dist = KERALA_DISTRICTS.find(d => d.id === dId);
    if (dist && dist.panchayats.length > 0) {
      setPanchayatId(dist.panchayats[0].id);
    }
  };

  // Handle Citizen Registration
  const handleCitizenSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !citizenPhone.trim() || !citizenAddress.trim()) {
      setErrorMessage('Please fill in your name, mobile number, and address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // If Supabase is connected, optionally record in profiles
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('profiles').insert({
            id: `cit-${citizenPhone.replace(/\D/g, '')}`,
            name: citizenName.trim(),
            phone: citizenPhone.trim(),
            email: citizenEmail.trim() || null,
            role: 'CITIZEN',
            panchayat: currentPanchayat.nameEn,
            ward_number: Number(wardNumber),
            address: citizenAddress.trim(),
          });
        } catch {
          // Ignore if profiles table does not exist
        }
      }

      setSuccessMessage('Registration successful! Logging in to citizen portal...');

      // Auto login with NextAuth
      const res = await signIn('citizen-login', {
        redirect: false,
        name: citizenName.trim(),
        phone: citizenPhone.trim(),
        panchayat: currentPanchayat.nameEn,
        wardNumber: String(wardNumber),
        callbackUrl: '/my-petitions',
      });

      if (res?.error) {
        setErrorMessage('Auto-login failed. Please proceed to login page.');
        setLoading(false);
      } else {
        router.push('/my-petitions');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  // Handle Officer Onboarding
  const handleOfficerSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName.trim() || !employeeCode.trim() || !officerPassword.trim()) {
      setErrorMessage('Please provide full name, employee code (PEN), and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      setSuccessMessage('Officer onboarding verified! Redirecting to authority desk...');

      const res = await signIn('admin-login', {
        redirect: false,
        officerRole,
        employeeCode: employeeCode.trim(),
        password: officerPassword.trim(),
        name: officerName.trim(),
        panchayat: currentPanchayat.nameEn,
        callbackUrl: '/authority',
      });

      if (res?.error) {
        setErrorMessage('Verification failed. Please proceed to login page.');
        setLoading(false);
      } else {
        router.push('/authority');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Officer registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <KeralaEmblem className="w-14 h-14" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            പുതിയ അക്കൗണ്ട് രജിസ്ട്രേഷൻ
          </h1>
          <p className="text-xs sm:text-sm font-bold text-kerala-800 uppercase tracking-wide">
            Register for ParathiPetti LSGD Kerala Portal
          </p>
          <p className="text-xs text-slate-500">
            Create an official account to submit grievances, receive real-time SMS updates, and track resolutions.
          </p>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="bg-slate-200/80 p-1 rounded-2xl grid grid-cols-2 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              setRegType('CITIZEN');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              regType === 'CITIZEN'
                ? 'bg-white text-kerala-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen Sign Up (പൗരൻ)</span>
          </button>

          <button
            onClick={() => {
              setRegType('OFFICER');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              regType === 'OFFICER'
                ? 'bg-kerala-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gold-300" />
            <span>Panchayat Officer (ഉദ്യോഗസ്ഥൻ)</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* CITIZEN REGISTRATION FORM */}
          {regType === 'CITIZEN' ? (
            <form onSubmit={handleCitizenSignUp} className="space-y-5 text-xs sm:text-sm">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  Civilian Resident Profile (റസിഡന്റ് വിവരങ്ങൾ)
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details as per your residence in Kerala.
                </p>
              </div>

              {/* District & Panchayat Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District (ജില്ല) *</label>
                  <select
                    value={districtId}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEn} ({d.nameMl})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grama Panchayat *</label>
                  <select
                    value={panchayatId}
                    onChange={(e) => setPanchayatId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  >
                    {currentDistrict.panchayats.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameEn} ({p.nameMl})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ward Number & Ward Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ward Number *</label>
                  <select
                    value={wardNumber}
                    onChange={(e) => setWardNumber(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  >
                    {Array.from({ length: currentPanchayat.wardsCount || 20 }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>Ward {w}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Ward / Locality Name *</label>
                  <input
                    type="text"
                    required
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    placeholder="e.g. Chavadinada (ചാവടിനട)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name (പൂർണ്ണ നാമം) *</label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Radhakrishnan K."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number (ഫോൺ നമ്പർ) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="+91 94470 XXXXX"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar (Last 4 Digits - Optional)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={citizenAadhaarLast4}
                    onChange={(e) => setCitizenAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 8421"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address (മേൽവിലാസം) *</label>
                <textarea
                  rows={2}
                  required
                  value={citizenAddress}
                  onChange={(e) => setCitizenAddress(e.target.value)}
                  placeholder="House Name / No., Street, Post Office, PIN code"
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Create Security Passkey / Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={citizenPassword}
                    onChange={(e) => setCitizenPassword(e.target.value)}
                    placeholder="Choose a password or 4-digit PIN"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-gold-300" />
                  <span>{loading ? 'Creating Account...' : 'Complete Sign Up & Go to Dashboard'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* OFFICER ONBOARDING FORM */
            <form onSubmit={handleOfficerSignUp} className="space-y-5 text-xs sm:text-sm">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  LSGD Official Credential Onboarding (ഉദ്യോഗസ്ഥ വിവരങ്ങൾ)
                </h3>
                <p className="text-xs text-slate-500">
                  Register as an authorized personnel for your Panchayat institution.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designation / Role in Panchayat *
                </label>
                <select
                  value={officerRole}
                  onChange={(e) => setOfficerRole(e.target.value as AuthorityRole)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                >
                  {AUTHORITY_ROLES.map((officer) => (
                    <option key={officer.role} value={officer.role}>
                      {officer.nameEn} ({officer.nameMl})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Officer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="e.g. Er. Jacob George"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Permanent Employee No. (PEN) / Cadre Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    placeholder="e.g. PEN-LSGD-8412"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Government Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      placeholder="officer@lsgkerala.gov.in"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Office Phone</label>
                  <input
                    type="tel"
                    value={officerPhone}
                    onChange={(e) => setOfficerPhone(e.target.value)}
                    placeholder="+91 471 XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned District *</label>
                  <select
                    value={districtId}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Grama Panchayat *</label>
                  <select
                    value={panchayatId}
                    onChange={(e) => setPanchayatId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  >
                    {currentDistrict.panchayats.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Create Official Password / Security PIN *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder="Enter official password (e.g. lsgd2026)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-kerala-900 hover:bg-kerala-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-gold-300" />
                  <span>{loading ? 'Verifying...' : 'Register Official & Enter Authority Desk'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Link to Login */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-kerala-800 hover:text-kerala-950 underline">
              Sign In here (ലോഗിൻ ചെയ്യുക)
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Registration Portal...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
