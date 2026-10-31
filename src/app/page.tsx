'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeralaEmblem } from '@/components/KeralaEmblem';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Users, 
  MapPin, 
  AlertCircle,
  FileCheck2,
  Wrench,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { getStoredGrievances } from '@/utils/storage';
import { GrievanceLetter } from '@/types/grievance';
import { AUTHORITY_ROLES, KERALA_DISTRICTS } from '@/data/keralaData';

export default function HomePage() {
  const router = useRouter();
  const [quickToken, setQuickToken] = useState('');
  const [grievances, setGrievances] = useState<GrievanceLetter[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('TVM');

  useEffect(() => {
    setGrievances(getStoredGrievances());
    const handleUpdate = () => setGrievances(getStoredGrievances());
    window.addEventListener('parathipetty_data_changed', handleUpdate);
    return () => window.removeEventListener('parathipetty_data_changed', handleUpdate);
  }, []);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickToken.trim()) return;
    router.push(`/track?token=${encodeURIComponent(quickToken.trim())}`);
  };

  const totalCount = grievances.length;
  const resolvedCount = grievances.filter(g => g.status === 'RESOLVED').length;
  const inProgressCount = grievances.filter(g => ['UNDER_REVIEW', 'SITE_INSPECTION', 'ACTION_IN_PROGRESS', 'ACKNOWLEDGED'].includes(g.status)).length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 92;

  const activeDistrict = KERALA_DISTRICTS.find(d => d.id === selectedDistrict) || KERALA_DISTRICTS[0];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-kerala-900 via-kerala-800 to-kerala-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Decorative Kerala motifs background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-kerala-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kerala-950/80 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span>തദ്ദേശ സ്വയംഭരണ വകുപ്പ് • സർക്കാർ സേവനം വിരൽത്തുമ്പിൽ</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-tight">
                പരാതിപ്പെട്ടി <span className="text-gold-400 font-serif">ParathiPetti</span>
              </h1>
              <p className="text-base sm:text-xl text-kerala-100 font-medium max-w-2xl mx-auto">
                Direct Civilian Grievance Redressal for all 941 Grama Panchayaths in Kerala
              </p>
            </div>

            <p className="text-xs sm:text-sm text-kerala-200/90 leading-relaxed max-w-xl mx-auto">
              Lodge your formal petition directly to the Panchayat President, Secretary, Ward Member, Assistant Engineer, Health Inspector, or VEO. Every letter is promptly delivered to the official&apos;s in-tray with guaranteed 7-day SLA resolution under the Kerala Right to Services Act.
            </p>

            {/* Quick Track Search Box */}
            <form onSubmit={handleQuickTrack} className="max-w-xl mx-auto pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-gold-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quickToken}
                    onChange={(e) => setQuickToken(e.target.value)}
                    placeholder="Enter Token ID (e.g. KL-TVM-VNG-2026-0421)"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-kerala-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-kerala-300 mt-2 text-center">
                Try sample token: <button type="button" onClick={() => setQuickToken('KL-TVM-VNG-2026-0421')} className="underline font-mono text-gold-300 hover:text-white">KL-TVM-VNG-2026-0421</button> or <button type="button" onClick={() => setQuickToken('KL-WYD-MPD-2026-0932')} className="underline font-mono text-gold-300 hover:text-white">KL-WYD-MPD-2026-0932</button>
              </p>
            </form>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/file-grievance"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-kerala-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5 text-kerala-900" />
                <span>Post a Grievance (പരാതി നൽകുക)</span>
              </Link>
              <Link
                href="/authority"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-kerala-950/80 hover:bg-kerala-950 text-white font-semibold text-sm sm:text-base border border-kerala-600 hover:border-gold-400 shadow-md transition-all duration-200"
              >
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <span>Authority Officer Portal (ഉദ്യോഗസ്ഥർക്ക്)</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-12 border-t border-kerala-700/60 bg-kerala-950/70 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-4xl font-black text-gold-400 font-mono">{totalCount}</p>
                <p className="text-xs text-kerala-200 mt-0.5">Total Petitions Lodged (ആകെ പരാതികൾ)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-black text-amber-300 font-mono">{inProgressCount}</p>
                <p className="text-xs text-kerala-200 mt-0.5">Under Inspection & Action (നടപടിയിൽ)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">{resolvedCount}</p>
                <p className="text-xs text-kerala-200 mt-0.5">Successfully Redressed (പരിഹരിച്ചവ)</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-black text-gold-300 font-mono">7 Days</p>
                <p className="text-xs text-kerala-200 mt-0.5">RTS Statutory SLA Limit (സേവനാവകാശം)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the System Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-kerala-800 uppercase tracking-wider bg-kerala-100 px-3 py-1 rounded-full">
            സുതാര്യമായ നടപടിക്രമം
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How Your Grievance is Addressed Promptly
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Every step is recorded on the public ledger with full accountability and timeline tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition relative group">
            <div className="w-12 h-12 rounded-xl bg-kerala-100 text-kerala-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-kerala-900 group-hover:text-white transition">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Civilian Lodges Petition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your District, Grama Panchayat, Ward, and address the specific authority with photos or location details.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-kerala-700">
              പൗരൻ പരാതി രേഖപ്പെടുത്തുന്നു
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition relative group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Delivered to Official In-Tray</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System instantly alerts the designated officer with a unique RTS tracking token and notifies the civilian via SMS.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-amber-700">
              ഉദ്യോഗസ്ഥന്റെ ഇൻബോക്സിലേക്ക് എത്തുന്നു
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition relative group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Site Inspection & Status Update</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authority examines the ground reality, logs field observations, and updates progress (Under Review, Inspection, or In-Progress).
            </p>
            <div className="mt-3 text-[11px] font-semibold text-blue-700">
              സ്ഥലപരിശോധനയും നടപടികളും
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-emerald-700 group-hover:text-white transition">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Resolution & Order Dispatched</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official Action Taken Report (ATR) is attached, resolution order issued, and petitioner invited to rate service satisfaction.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-emerald-700">
              ഔദ്യോഗിക പരിഹാര ഉത്തരവ്
            </div>
          </div>

        </div>
      </section>

      {/* Authority Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider bg-gold-100 px-3 py-1 rounded-full">
                പഞ്ചായത്ത് ഉദ്യോഗസ്ഥർ & ചുമതലകൾ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Whom Can You Submit Your Grievance To?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Direct access to key administrative, engineering, health, and welfare authorities in Kerala Panchayats
              </p>
            </div>

            <Link
              href="/file-grievance"
              className="inline-flex items-center gap-2 text-sm font-bold text-kerala-800 hover:text-kerala-900 underline decoration-kerala-400"
            >
              <span>Address a Specific Authority</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUTHORITY_ROLES.map((officer) => (
              <div
                key={officer.role}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-kerala-400 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-kerala-700 bg-kerala-100 px-2 py-0.5 rounded">
                    {officer.jurisdiction}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-kerala-900 transition">
                  {officer.nameEn}
                </h3>
                <p className="text-xs text-kerala-800 font-medium">{officer.nameMl}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {officer.descriptionEn}
                </p>
                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium text-[11px]">{officer.defaultOfficialEn}</span>
                  <Link
                    href={`/file-grievance?authority=${officer.role}`}
                    className="text-kerala-800 font-bold hover:underline text-[11px]"
                  >
                    Post Letter →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Petitions Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Live Grievance Redressal Feed (തത്സമയ വിവരങ്ങൾ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Real-time petition tracking across Kerala Grama Panchayaths
            </p>
          </div>
          <Link
            href="/track"
            className="text-xs sm:text-sm font-semibold text-kerala-800 hover:text-kerala-900 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {grievances.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {item.trackingNumber}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.panchayat}, Ward {item.wardNumber}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {item.subject}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Addressed to: <strong className="text-slate-800">{item.addressedToName}</strong></span>
                  <span>•</span>
                  <span>Petitioner: <strong className="text-slate-800">{item.citizenName}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/track?token=${item.trackingNumber}`}
                  className="px-4 py-2 rounded-lg bg-kerala-50 text-kerala-900 hover:bg-kerala-100 font-semibold text-xs border border-kerala-200 transition"
                >
                  Inspect Letter & Timeline →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Callout Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-gold-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Monsoon / Natural Calamity Emergency Redressal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Immediate Danger to Life or Critical Public Property?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Flooding, landslide threat, fallen high-tension electricity lines, or contaminated community drinking wells receive prioritized instant routing to the Panchayat President and Emergency Response Wing.
            </p>
          </div>
          <Link
            href="/file-grievance?urgency=EMERGENCY"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl transition"
          >
            File Emergency Grievance →
          </Link>
        </div>
      </section>

    </div>
  );
}
