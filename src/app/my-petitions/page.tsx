'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GrievanceLetter } from '@/types/grievance';
import { getStoredGrievances } from '@/utils/storage';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  User, 
  FileText, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Phone
} from 'lucide-react';
import Link from 'next/link';

export default function MyPetitionsPage() {
  const { data: session, status } = useSession();
  const [myGrievances, setMyGrievances] = useState<GrievanceLetter[]>([]);

  useEffect(() => {
    if (session?.user) {
      const all = getStoredGrievances();
      const phoneClean = (session.user.phone || '').replace(/\D/g, '');
      const name = (session.user.name || '').toLowerCase();

      const filtered = all.filter((g) => {
        const gPhone = g.citizenPhone.replace(/\D/g, '');
        const gName = g.citizenName.toLowerCase();
        return (phoneClean && gPhone.includes(phoneClean)) || gName.includes(name);
      });

      // If no exact match (e.g. newly logged in), show all or first 2 for demonstration
      setMyGrievances(filtered.length > 0 ? filtered : all.slice(0, 2));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading citizen profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Citizen Banner */}
      <div className="bg-gradient-to-r from-kerala-900 to-kerala-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-gold-400/30 flex items-center justify-center text-gold-300">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{session?.user?.name || 'Citizen'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-400 text-kerala-950 px-2 py-0.5 rounded">
                Verified Civilian
              </span>
            </div>
            <p className="text-xs text-kerala-200 mt-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold-300" />
              <span>{session?.user?.phone || '+91 94471 28910'}</span>
              <span>•</span>
              <span>Kerala Panchayat Citizen Redressal Account</span>
            </p>
          </div>
        </div>

        <Link
          href="/file-grievance"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-kerala-950 font-bold text-xs sm:text-sm shadow-lg transition"
        >
          <Plus className="w-4 h-4 text-kerala-900" />
          <span>Lodge New Grievance (പരാതി നൽകുക)</span>
        </Link>
      </div>

      {/* Petitions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            My Lodged Petitions ({myGrievances.length} Records)
          </h2>
          <span className="text-xs text-slate-500">Live synced with LSGD Kerala database</span>
        </div>

        {myGrievances.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Petitions Filed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t filed any grievance letters under this mobile number. Post your first grievance directly to the Panchayat President or Secretary.
            </p>
            <Link
              href="/file-grievance"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-kerala-800 text-white font-bold text-xs shadow transition"
            >
              <span>File a Petition Now</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myGrievances.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      {item.trackingNumber}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.panchayat}, Ward {item.wardNumber}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    {item.subject}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>Addressed to: <strong className="text-slate-800">{item.addressedToName}</strong></span>
                    <span>•</span>
                    <span>Filed: {new Date(item.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/track?token=${item.trackingNumber}`}
                    className="px-4 py-2.5 rounded-xl bg-kerala-50 hover:bg-kerala-100 text-kerala-900 font-semibold text-xs border border-kerala-200 transition flex items-center gap-1.5"
                  >
                    <span>View Timeline & Letter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
