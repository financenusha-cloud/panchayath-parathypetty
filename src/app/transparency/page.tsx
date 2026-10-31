'use client';

import React from 'react';
import { KeralaEmblem } from '@/components/KeralaEmblem';
import { 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  Scale, 
  AlertCircle, 
  BookOpen, 
  Download, 
  PhoneCall, 
  Building2 
} from 'lucide-react';
import Link from 'next/link';

export default function TransparencyPage() {
  const serviceCharters = [
    {
      serviceEn: 'Urgent Sanitation & Plastic Waste Nuisance',
      serviceMl: 'മാലിന്യ നിർമ്മാർജ്ജനവും പൊതുശല്യവും',
      authorityEn: 'Health Inspector / JHI',
      authorityMl: 'ഹെൽത്ത് ഇൻസ്പെക്ടർ',
      slaDays: '2 Days (48 Hours)',
      penaltyEn: '₹250/day on designated officer for unexplained delay',
    },
    {
      serviceEn: 'Pothole & Damaged Culvert Emergency Inspection',
      serviceMl: 'റോഡ് തകർച്ച & കലുങ്ക് പരിശോധന',
      authorityEn: 'Assistant Engineer (LSGD Works)',
      authorityMl: 'അസിസ്റ്റന്റ് എഞ്ചിനീയർ',
      slaDays: '7 Working Days',
      penaltyEn: 'Report to Panchayat Secretary & Executive Engineer',
    },
    {
      serviceEn: 'Defunct Street Lights Replacement',
      serviceMl: 'തെരുവ് വിളക്ക് അറ്റകുറ്റപ്പണി',
      authorityEn: 'Ward Member / Electricity Overseer',
      authorityMl: 'വാർഡ് മെമ്പർ & ഇലക്ട്രീഷ്യൻ',
      slaDays: '3 Working Days',
      penaltyEn: 'Replacement from Panchayat Annual Maintenance Grant',
    },
    {
      serviceEn: 'Life Mission Housing Scheme Verification',
      serviceMl: 'ലൈഫ് മിഷൻ ഭവന പരിശോധന',
      authorityEn: 'Village Extension Officer (VEO)',
      authorityMl: 'വില്ലേജ് എക്സ്റ്റൻഷൻ ഓഫീസർ',
      slaDays: '7 Working Days',
      penaltyEn: 'Direct review by Block Development Officer (BDO)',
    },
    {
      serviceEn: 'Crop Damage / Flood Relief Assessment',
      serviceMl: 'വിളനാശ നഷ്ടപരിഹാര പരിശോധന',
      authorityEn: 'Agricultural Officer (Krishi Bhavan)',
      authorityMl: 'കൃഷി ഓഫീസർ',
      slaDays: '5 Working Days',
      penaltyEn: 'Forwarding to District Disaster Management Authority (DDMA)',
    },
    {
      serviceEn: 'Trade License & Building Permit Grievances',
      serviceMl: 'വ്യാപാര ലൈസൻസ് & പെർമിറ്റ് പരാതികൾ',
      authorityEn: 'Panchayat Secretary (Executive Officer)',
      authorityMl: 'പഞ്ചായത്ത് സെക്രട്ടറി',
      slaDays: '7 Working Days',
      penaltyEn: 'Appellate hearing before Grama Panchayat President',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-kerala-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6">
        <KeralaEmblem className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30">
            <Scale className="w-4 h-4 text-gold-300" />
            <span>കേരള സേവനാവകാശ നിയമം 2012 • Kerala Right to Services Act</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Citizen Charter & Public Accountability
          </h1>
          <p className="text-xs sm:text-sm text-kerala-200 max-w-2xl leading-relaxed">
            Every citizen residing in a Kerala Grama Panchayat has the statutory right to receive public services and grievance redressal within time-bound deadlines.
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-kerala-100 text-kerala-800 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">7-Day Statutory SLA</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every grievance letter logged on ParathiPetti is time-stamped. Designated officers must conduct site inspection and log action within 7 days.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">First Appellate Redressal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            If an officer fails to respond, the petition automatically escalates to the Grama Panchayat President and Deputy Director of Panchayats (DDP).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Action Taken Report (ATR)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No grievance can be disposed of without a verifiable Action Taken Report containing inspection notes and official order reference numbers.
          </p>
        </div>
      </div>

      {/* Citizen Service Charter Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Panchayat Service Timelines & Designated Authorities
            </h2>
            <p className="text-xs text-slate-500">
              Statutory timeline as per Kerala Local Self Government Department Charter
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download PDF Charter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-4">Subject / Service (സേവനം)</th>
                <th className="py-3 px-4">Competent Authority (ഉദ്യോഗസ്ഥൻ)</th>
                <th className="py-3 px-4">Guaranteed SLA</th>
                <th className="py-3 px-4">Accountability Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceCharters.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.serviceEn}</p>
                    <p className="text-xs text-kerala-800 font-medium">{item.serviceMl}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{item.authorityEn}</p>
                    <p className="text-xs text-slate-500">{item.authorityMl}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded bg-amber-50 text-amber-900 font-bold font-mono text-xs border border-amber-200">
                      {item.slaDays}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {item.penaltyEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appellate & Ombudsman Notice */}
      <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-bold text-slate-900 text-base">
            LSGD Ombudsman & Vigilance Wing (തദ്ദേശ സ്വയംഭരണ ഓംബുഡ്സ്മാൻ)
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            If you experience deliberate denial of service or corruption from any Panchayat personnel, you may directly petition the Honorable Ombudsman for Local Self Government Institutions, Thiruvananthapuram.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/file-grievance?authority=SECRETARY"
            className="px-5 py-2.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-xs shadow transition"
          >
            Lodge Official Petition
          </Link>
        </div>
      </div>

    </div>
  );
}
