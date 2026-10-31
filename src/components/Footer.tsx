import React from 'react';
import Link from 'next/link';
import { KeralaEmblem } from './KeralaEmblem';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <KeralaEmblem className="w-10 h-10" />
              <div>
                <h3 className="font-bold text-white text-base">പരാതിപ്പെട്ടി (ParathiPetti)</h3>
                <p className="text-xs text-gold-400">Panchayat Citizen Redressal System</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An initiative of the Local Self Government Department (LSGD), Government of Kerala, ensuring every civilian petition promptly reaches the designated Panchayat authority with legally binding SLA tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Right to Service Act (സേവനാവകാശ നിയമം 2012) compliant</span>
            </div>
          </div>

          {/* Col 2: Key LSGD Authorities */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2">
              Panchayat Authorities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-gold-300 transition">Grama Panchayat President (ഭരണ സമിതി)</li>
              <li className="hover:text-gold-300 transition">Panchayat Secretary (Executive Officer)</li>
              <li className="hover:text-gold-300 transition">Ward Member (വാർഡ് ജനപ്രതിനിധി)</li>
              <li className="hover:text-gold-300 transition">Assistant Engineer (LSGD Works Wing)</li>
              <li className="hover:text-gold-300 transition">Health Inspector (Sanitation & Health)</li>
              <li className="hover:text-gold-300 transition">Village Extension Officer (Life Mission / VEO)</li>
              <li className="hover:text-gold-300 transition">Agricultural Officer (Krishi Bhavan)</li>
            </ul>
          </div>

          {/* Col 3: Citizen Portals & Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Citizen Access
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/file-grievance" className="hover:text-white flex items-center gap-1.5 transition">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Lodge Official Petition / പരാതി നൽകുക
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white flex items-center gap-1.5 transition">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                  Track Live Grievance Status
                </Link>
              </li>
              <li>
                <Link href="/authority" className="hover:text-white flex items-center gap-1.5 transition">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Official Personnel Login
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-white flex items-center gap-1.5 transition">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Public SLA Dashboard & Charter
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpline */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2">
              LSGD Kerala Helpdesk
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Local Self Government Department, Swaraj Bhavan, Nanthancode, Thiruvananthapuram - 695003</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-semibold">Toll Free: 1800 425 1073</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support.lsgd@kerala.gov.in</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                  Akshaya Kendra Assisted Grievance Lodging Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Government of Kerala. All Rights Reserved. Designed for LSGD Panchayati Raj Institutions.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Right to Information (RTI)</span>
            <span>•</span>
            <span>Citizen Charter</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
