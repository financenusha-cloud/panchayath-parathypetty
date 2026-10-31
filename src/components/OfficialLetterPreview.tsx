'use client';

import React from 'react';
import { GrievanceLetter } from '@/types/grievance';
import { KeralaEmblem } from './KeralaEmblem';
import { Printer, Download, Stamp, ShieldCheck, CheckCircle } from 'lucide-react';

interface Props {
  grievance: GrievanceLetter;
  onPrint?: () => void;
}

export function OfficialLetterPreview({ grievance, onPrint }: Props) {
  const formattedDate = new Date(grievance.submittedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden text-slate-800">
      {/* Action Header */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Official LSGD Citizen Petition Form (ഔദ്യോഗിക പരാതി പത്രിക)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Official Letter</span>
          </button>
        </div>
      </div>

      {/* Petition Sheet with Kerala Government Header */}
      <div className="p-8 sm:p-12 relative bg-[#fffdfa] print:p-0">
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <KeralaEmblem className="w-96 h-96" />
        </div>

        {/* Letterhead */}
        <div className="text-center pb-6 border-b-2 border-kerala-900/80 relative">
          <div className="flex justify-center mb-2">
            <KeralaEmblem className="w-16 h-16" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-kerala-950 uppercase font-serif">
            കേരള സർക്കാർ • തദ്ദേശ സ്വയംഭരണ വകുപ്പ്
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-kerala-800">
            GOVERNMENT OF KERALA • LOCAL SELF GOVERNMENT DEPARTMENT
          </p>
          <p className="text-xs font-medium text-slate-700 mt-1">
            {grievance.panchayat} ({grievance.panchayatMl}), {grievance.district} District
          </p>
          <div className="inline-block mt-2 px-3 py-0.5 rounded bg-amber-50 border border-amber-300 text-[11px] font-mono text-amber-900 font-semibold">
            LSGD PETITION FILE NO: {grievance.trackingNumber}
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="flex flex-col sm:flex-row justify-between text-xs text-slate-600 pt-4 pb-6 border-b border-dashed border-slate-300 gap-2">
          <div>
            <span className="font-semibold text-slate-700">Ward:</span> Ward No. {grievance.wardNumber} ({grievance.wardName})
          </div>
          <div>
            <span className="font-semibold text-slate-700">Date of Submission:</span> {formattedDate}
          </div>
          <div>
            <span className="font-semibold text-slate-700">RTS Legal SLA:</span> 7 Working Days
          </div>
        </div>

        {/* Address Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs sm:text-sm">
          {/* From */}
          <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900 mb-1">പ്രേഷകൻ / From:</p>
            <p className="font-semibold text-slate-800">{grievance.citizenName}</p>
            <p className="text-slate-600 whitespace-pre-line">{grievance.citizenAddress}</p>
            <p className="text-slate-600 mt-1 font-mono">ഫോൺ / Phone: {grievance.citizenPhone}</p>
            {grievance.citizenAadhaarLast4 && (
              <p className="text-[11px] text-slate-500">Aadhaar (Last 4): XXXX-XXXX-{grievance.citizenAadhaarLast4}</p>
            )}
          </div>

          {/* To */}
          <div className="bg-kerala-50/50 p-4 rounded-lg border border-kerala-200">
            <p className="font-bold text-kerala-900 mb-1">സ്വീകർത്താവ് / Addressed To:</p>
            <p className="font-bold text-slate-900">{grievance.addressedToName}</p>
            <p className="text-kerala-800 font-medium">{grievance.addressedDepartment}</p>
            <p className="text-slate-700">{grievance.panchayat}</p>
            <p className="text-[11px] text-slate-500 mt-1">Jurisdiction: {grievance.district} District, Kerala</p>
          </div>
        </div>

        {/* Subject */}
        <div className="my-6 p-3 bg-amber-50/60 border-l-4 border-gold-600 rounded-r-md">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            വിഷയം / Subject:
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">
            {grievance.subject} ({grievance.category})
          </p>
          <p className="text-xs text-slate-600 mt-1">
            <strong>സ്ഥലം / Landmark:</strong> {grievance.locationLandmark}
          </p>
        </div>

        {/* Formal Malayalam Petition Body */}
        <div className="my-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800 font-serif">
          {grievance.formalLetterText ? (
            <div className="whitespace-pre-line p-4 bg-white rounded border border-slate-200 shadow-inner">
              {grievance.formalLetterText}
            </div>
          ) : (
            <div className="whitespace-pre-line p-4 bg-white rounded border border-slate-200 shadow-inner">
              <p className="font-bold">ബഹുമാനപ്പെട്ട ഉദ്യോഗസ്ഥൻ മുൻപാകെ,</p>
              <p className="mt-2">{grievance.description}</p>
              <p className="mt-4">
                ആയതിനാൽ ഈ വിഷയത്തിൽ അടിയന്തരമായി സ്ഥലപരിശോധന നടത്തി ആവശ്യമായ പരിഹാര നടപടികൾ സ്വീകരിക്കണമെന്ന് വിനീതമായി അഭ്യർത്ഥിക്കുന്നു.
              </p>
            </div>
          )}
        </div>

        {/* Signatures & Seal */}
        <div className="pt-8 border-t border-slate-300 mt-8 grid grid-cols-2 gap-4 items-end text-xs sm:text-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digitally Registered via ParathiPetti LSGD</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              IP & Token Timestamp: {new Date(grievance.submittedAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-600 mb-6">വിശ്വസ്തതയോടെ / Yours faithfully,</p>
            <p className="font-bold text-slate-900 underline decoration-slate-400 underline-offset-4">
              {grievance.citizenName}
            </p>
            <p className="text-xs text-slate-500">ഹർജിക്കാരൻ / Petitioner</p>
          </div>
        </div>

        {/* Resolution Seal if Resolved */}
        {grievance.status === 'RESOLVED' && (
          <div className="mt-8 p-4 bg-emerald-50/80 border-2 border-emerald-500 rounded-lg flex items-start gap-3">
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950 uppercase tracking-wide">
                OFFICIAL RESOLUTION & REDRESSAL ORDER (തീർപ്പാക്കൽ ഉത്തരവ്)
              </p>
              <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                {grievance.resolutionSummary || 'The reported grievance has been inspected and redressed in full compliance with Kerala Panchayat Raj Act statutory guidelines.'}
              </p>
              {grievance.actionTakenReport?.officialOrderNo && (
                <p className="text-xs font-mono font-bold text-emerald-800 mt-1">
                  Order Reference: {grievance.actionTakenReport.officialOrderNo}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
