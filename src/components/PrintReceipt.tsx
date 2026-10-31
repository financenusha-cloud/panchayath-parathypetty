'use client';

import React, { useState } from 'react';
import { GrievanceLetter } from '@/types/grievance';
import { KeralaEmblem } from './KeralaEmblem';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  ArrowRight, 
  Calendar, 
  UserCheck, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  grievance: GrievanceLetter;
}

export function PrintReceipt({ grievance }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(grievance.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = new Date(grievance.submittedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const slaDeadlineFormatted = new Date(grievance.slaDeadline).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-kerala-900 via-kerala-800 to-kerala-900 p-6 text-white text-center relative overflow-hidden">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-gold-400/40">
            <CheckCircle className="w-10 h-10 text-gold-300 animate-bounce" />
          </div>
        </div>
        <h2 className="text-xl font-bold tracking-tight">പരാതി വിജയകരമായി സമർപ്പിച്ചു!</h2>
        <p className="text-xs text-kerala-100 mt-1">
          Grievance Lodged & Dispatched Promptly to Panchayat Authority
        </p>
      </div>

      {/* Main Slip */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Token Box */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Official Grievance Token ID (പരാതി നമ്പർ)
            </p>
            <p className="text-2xl font-mono font-black text-slate-900 tracking-wide mt-0.5">
              {grievance.trackingNumber}
            </p>
            <p className="text-[11px] text-slate-500">Save this token to track redressal progress</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 shadow-sm transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
            <span>{copied ? 'Copied Token!' : 'Copy Token'}</span>
          </button>
        </div>

        {/* Dispatch Confirmation Card */}
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <span>Promptly Dispatched to Officer In-Tray</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-700">
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Designated Officer</p>
              <p className="font-bold text-slate-900">{grievance.addressedToName}</p>
              <p className="text-xs text-slate-600">{grievance.addressedDepartment}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Panchayat & Ward</p>
              <p className="font-bold text-slate-900">{grievance.panchayat}</p>
              <p className="text-xs text-slate-600">Ward No. {grievance.wardNumber} ({grievance.wardName})</p>
            </div>
          </div>
        </div>

        {/* SLA Guarantee */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Kerala Right to Service Act Guarantee (സേവനാവകാശ നിയമം 2012)</p>
            <p className="text-[11px] text-blue-800 mt-0.5">
              The designated authority is legally mandated to initiate site inspection or action report on or before <strong className="underline">{slaDeadlineFormatted}</strong> (7 working days).
            </p>
          </div>
        </div>

        {/* SMS Notification Confirmation */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
          <MessageSquare className="w-4 h-4 text-kerala-700 shrink-0" />
          <span>
            Automated SMS alert dispatched to registered mobile: <strong className="font-mono text-slate-900">{grievance.citizenPhone}</strong>
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/track?token=${grievance.trackingNumber}`}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-semibold text-sm shadow transition"
          >
            <span>Track Progress Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
}
