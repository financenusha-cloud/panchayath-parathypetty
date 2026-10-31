'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KeralaEmblem } from './KeralaEmblem';
import { 
  FileEdit, 
  Search, 
  ShieldCheck, 
  BarChart3, 
  Menu, 
  X, 
  PhoneCall, 
  RotateCcw 
} from 'lucide-react';
import { resetToDemoData } from '@/utils/storage';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/file-grievance', labelEn: 'Post Grievance', labelMl: 'പരാതി നൽകുക', icon: FileEdit },
    { href: '/track', labelEn: 'Track Status', labelMl: 'സ്റ്റാറ്റസ് പരിശോധിക്കുക', icon: Search },
    { href: '/authority', labelEn: 'Authority Portal', labelMl: 'ഉദ്യോഗസ്ഥ ലോഗിൻ', icon: ShieldCheck, highlight: true },
    { href: '/transparency', labelEn: 'Citizen Charter', labelMl: 'സേവനാവകാശം', icon: BarChart3 },
  ];

  const handleReset = () => {
    if (confirm('Reset grievance database to official Kerala Panchayat sample records?')) {
      resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top LSGD Kerala Ribbon */}
      <div className="bg-kerala-900 text-white text-[11px] sm:text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gold-300">തദ്ദേശ സ്വയംഭരണ വകുപ്പ്</span>
            <span className="text-kerala-200 hidden sm:inline">|</span>
            <span className="text-kerala-100 hidden sm:inline">Local Self Government Dept (LSGD), Government of Kerala</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-gold-200">
              <PhoneCall className="w-3 h-3 text-gold-300" />
              <span>Right to Service SLA Helpline: <strong>1800 425 1073</strong></span>
            </div>
            <button
              onClick={handleReset}
              title="Reset to sample grievances"
              className="flex items-center gap-1 text-[10px] text-kerala-100 hover:text-white bg-kerala-950/60 px-2 py-0.5 rounded border border-kerala-700 hover:border-gold-400 transition"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <KeralaEmblem className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-kerala-900 font-sans">
                  പരാതിപ്പെട്ടി
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-gold-100 text-gold-800 border border-gold-300">
                  ParathiPetti
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none mt-0.5">
                Kerala Panchayat Unified Grievance Redressal Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`ml-2 flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-kerala-800 text-white shadow-md'
                        : 'bg-kerala-900 hover:bg-kerala-800 text-white shadow-sm hover:shadow'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-gold-300" />
                    <span>{item.labelEn}</span>
                    <span className="text-[11px] font-normal text-gold-200">({item.labelMl})</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-kerala-50 text-kerala-900 font-semibold border-b-2 border-kerala-700'
                      : 'text-slate-700 hover:text-kerala-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-kerala-700' : 'text-slate-400'}`} />
                  <span>{item.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-kerala-100 text-kerala-900 font-bold'
                    : item.highlight
                    ? 'bg-kerala-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-gold-300' : isActive ? 'text-kerala-800' : 'text-slate-400'}`} />
                  <div>
                    <span className="block">{item.labelEn}</span>
                    <span className={`text-[11px] block font-normal ${item.highlight ? 'text-gold-200' : 'text-slate-400'}`}>
                      {item.labelMl}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
