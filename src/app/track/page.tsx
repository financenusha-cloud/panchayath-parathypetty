'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GrievanceLetter } from '@/types/grievance';
import { getStoredGrievances, getGrievanceByTracking, getGrievancesByPhone, addCitizenFeedback } from '@/utils/storage';
import { StatusBadge } from '@/components/StatusBadge';
import { OfficialLetterPreview } from '@/components/OfficialLetterPreview';
import { 
  Search, 
  Clock, 
  MapPin, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  Building2,
  FileText
} from 'lucide-react';
import Link from 'next/link';

function TrackContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');

  const [searchQuery, setSearchQuery] = useState(tokenParam || '');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceLetter | null>(null);
  const [matchingGrievances, setMatchingGrievances] = useState<GrievanceLetter[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'TIMELINE' | 'LETTER' | 'ATR'>('TIMELINE');

  // Feedback form state
  const [rating, setRating] = useState<'SATISFIED' | 'DISSATISFIED' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (tokenParam) {
      handlePerformSearch(tokenParam);
    } else {
      const all = getStoredGrievances();
      if (all.length > 0) {
        setSelectedGrievance(all[0]);
      }
    }
  }, [tokenParam]);

  const handlePerformSearch = (query: string) => {
    const q = query.trim();
    if (!q) return;

    setHasSearched(true);
    setFeedbackSubmitted(false);

    // Try token lookup
    const byToken = getGrievanceByTracking(q);
    if (byToken) {
      setSelectedGrievance(byToken);
      setMatchingGrievances([byToken]);
      return;
    }

    // Try phone lookup
    const byPhone = getGrievancesByPhone(q);
    if (byPhone.length > 0) {
      setMatchingGrievances(byPhone);
      setSelectedGrievance(byPhone[0]);
      return;
    }

    // Not found
    setSelectedGrievance(null);
    setMatchingGrievances([]);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !rating) return;

    addCitizenFeedback(
      selectedGrievance.trackingNumber,
      rating,
      rating === 'SATISFIED' ? 5 : 2,
      feedbackText
    );

    setFeedbackSubmitted(true);
    // Reload grievance data
    const updated = getGrievanceByTracking(selectedGrievance.trackingNumber);
    if (updated) setSelectedGrievance(updated);
  };

  const calculateRemainingDays = (deadline: string) => {
    const target = new Date(deadline).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-2">
          <span>സേവനാവകാശ ട്രാക്കിംഗ്</span>
          <span>•</span>
          <span>Right to Services Live Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Track Grievance Status (പരാതി നില പരിശോധിക്കുക)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Monitor your petition letter&apos;s real-time progress, site inspection reports, and official orders issued by Panchayat authorities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePerformSearch(searchQuery);
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Tracking Token (e.g. KL-TVM-VNG-2026-0421) or Registered Mobile..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-sm shadow transition"
          >
            Track Status
          </button>
        </form>

        {/* Quick chip suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500">
          <span>Demo Tokens:</span>
          {['KL-TVM-VNG-2026-0421', 'KL-ALP-MRK-2026-1189', 'KL-WYD-MPD-2026-0932', 'KL-KTM-KMK-2026-0544'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setSearchQuery(t);
                handlePerformSearch(t);
              }}
              className="font-mono text-kerala-800 hover:text-kerala-950 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Matching Results Selector if Multiple found (e.g. search by phone) */}
      {matchingGrievances.length > 1 && (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-xs font-bold text-amber-900 mb-2">
            Found {matchingGrievances.length} grievances for this phone number. Select one:
          </p>
          <div className="flex flex-wrap gap-2">
            {matchingGrievances.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGrievance(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  selectedGrievance?.id === g.id
                    ? 'bg-kerala-800 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {g.trackingNumber} ({g.panchayat})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grievance Details View */}
      {selectedGrievance ? (
        <div className="space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-sm sm:text-base font-black text-slate-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-300">
                    {selectedGrievance.trackingNumber}
                  </span>
                  <StatusBadge status={selectedGrievance.status} size="md" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mt-2">
                  {selectedGrievance.subject}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>
                    {selectedGrievance.panchayat} ({selectedGrievance.district} District), Ward {selectedGrievance.wardNumber} ({selectedGrievance.wardName})
                  </span>
                </p>
              </div>

              {/* SLA Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-right sm:text-right shrink-0">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  RTS SLA Status
                </p>
                {selectedGrievance.status === 'RESOLVED' ? (
                  <p className="text-sm font-bold text-emerald-700 flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Redressed within SLA</span>
                  </p>
                ) : (
                  <div>
                    <p className="text-lg font-black text-kerala-900 font-mono">
                      {calculateRemainingDays(selectedGrievance.slaDeadline)} Days Remaining
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Mandatory redressal deadline: {new Date(selectedGrievance.slaDeadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Officer & Petitioner Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="p-3 bg-kerala-50/60 rounded-xl border border-kerala-200">
                <p className="text-[10px] uppercase font-bold text-kerala-800">Assigned Authority</p>
                <p className="font-bold text-slate-900 mt-1">{selectedGrievance.addressedToName}</p>
                <p className="text-xs text-slate-600">{selectedGrievance.addressedDepartment}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-500">Petitioner (Civilian)</p>
                <p className="font-bold text-slate-900 mt-1">{selectedGrievance.citizenName}</p>
                <p className="text-xs text-slate-600 font-mono">{selectedGrievance.citizenPhone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-500">Category & Priority</p>
                <p className="font-bold text-slate-900 mt-1">{selectedGrievance.category}</p>
                <p className="text-xs font-semibold text-amber-700">Urgency: {selectedGrievance.urgency}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-500">Date Lodged</p>
                <p className="font-bold text-slate-900 mt-1">
                  {new Date(selectedGrievance.submittedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(selectedGrievance.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Navigation Tabs for Details */}
            <div className="flex items-center gap-2 border-b border-slate-200 pt-2">
              <button
                onClick={() => setActiveSubTab('TIMELINE')}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                  activeSubTab === 'TIMELINE'
                    ? 'border-kerala-800 text-kerala-900 bg-kerala-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Progress Timeline ({selectedGrievance.timeline.length} Events)
              </button>
              <button
                onClick={() => setActiveSubTab('LETTER')}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                  activeSubTab === 'LETTER'
                    ? 'border-kerala-800 text-kerala-900 bg-kerala-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Official Letterhead View
              </button>
              {selectedGrievance.actionTakenReport && (
                <button
                  onClick={() => setActiveSubTab('ATR')}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                    activeSubTab === 'ATR'
                      ? 'border-kerala-800 text-kerala-900 bg-kerala-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Action Taken Report (ATR)
                </button>
              )}
            </div>

            {/* Tab 1: Timeline */}
            {activeSubTab === 'TIMELINE' && (
              <div className="pt-4 space-y-6">
                <div className="relative border-l-2 border-kerala-200 ml-4 sm:ml-6 space-y-8 pb-4">
                  {selectedGrievance.timeline.map((event, index) => {
                    const isLatest = index === selectedGrievance.timeline.length - 1;
                    return (
                      <div key={event.id} className="relative pl-6 sm:pl-8 group">
                        
                        {/* Dot */}
                        <div
                          className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition ${
                            isLatest
                              ? 'bg-kerala-700 border-white ring-4 ring-kerala-200'
                              : 'bg-white border-kerala-400'
                          }`}
                        />

                        {/* Event Content */}
                        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={event.status} size="sm" />
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                {event.title}
                              </h4>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500">
                              {new Date(event.timestamp).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>

                          <p className="text-xs text-kerala-800 font-medium">
                            {event.titleMl}
                          </p>

                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {event.comment}
                          </p>

                          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 mt-2">
                            <span>
                              Action by: <strong className="text-slate-800">{event.actorName}</strong>
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">
                              Role: {event.actorRole}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Letter */}
            {activeSubTab === 'LETTER' && (
              <div className="pt-2">
                <OfficialLetterPreview grievance={selectedGrievance} />
              </div>
            )}

            {/* Tab 3: Action Taken Report */}
            {activeSubTab === 'ATR' && selectedGrievance.actionTakenReport && (
              <div className="pt-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                  <FileCheck2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-bold text-emerald-950">
                    Official Action Taken Report (ATR - നടപടി റിപ്പോർട്ട്)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-600 block">Inspecting / Reporting Officer:</span>
                    <span className="text-slate-900 font-semibold">{selectedGrievance.actionTakenReport.actionOfficer}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">Date of Action / Sanction:</span>
                    <span className="text-slate-900 font-semibold">{selectedGrievance.actionTakenReport.actionDate}</span>
                  </div>
                  {selectedGrievance.actionTakenReport.officialOrderNo && (
                    <div>
                      <span className="font-bold text-slate-600 block">Official Order Reference:</span>
                      <span className="font-mono font-bold text-kerala-900">{selectedGrievance.actionTakenReport.officialOrderNo}</span>
                    </div>
                  )}
                  {selectedGrievance.actionTakenReport.sanctionedAmount && (
                    <div>
                      <span className="font-bold text-slate-600 block">Sanctioned Financial Estimate:</span>
                      <span className="font-bold text-emerald-700">{selectedGrievance.actionTakenReport.sanctionedAmount}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <span className="font-bold text-slate-700 block text-xs">Field Findings:</span>
                  <p className="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-lg border border-emerald-200 mt-1">
                    {selectedGrievance.actionTakenReport.findings}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block text-xs">Rectification Work Performed / In-Progress:</span>
                  <p className="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-lg border border-emerald-200 mt-1">
                    {selectedGrievance.actionTakenReport.rectificationWork}
                  </p>
                </div>
              </div>
            )}

            {/* Citizen Feedback Module */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Citizen Feedback & Satisfaction Rating (പൗരന്റെ അഭിപ്രായം)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Did the Panchayat authority address your grievance satisfactorily? Your feedback is reviewed by the LSGD Vigilance Wing.
              </p>

              {feedbackSubmitted || selectedGrievance.citizenSatisfaction ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Thank you! Your feedback has been officially registered.</p>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Status: {selectedGrievance.citizenSatisfaction || rating}
                      {selectedGrievance.citizenFeedbackText && ` - "${selectedGrievance.citizenFeedbackText}"`}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRating('SATISFIED')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                        rating === 'SATISFIED'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Satisfied with Redressal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRating('DISSATISFIED')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                        rating === 'DISSATISFIED'
                          ? 'bg-rose-600 text-white border-rose-700 shadow'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Unsatisfied / Delayed</span>
                    </button>
                  </div>

                  {rating && (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Provide details of your experience with the officer or remaining issues..."
                        className="w-full p-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-gold-300" />
                        <span>Submit Official Citizen Review</span>
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>

          </div>

        </div>
      ) : hasSearched ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Grievance Record Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We could not locate any grievance matching token or phone: <strong className="font-mono text-slate-800">{searchQuery}</strong>. Please check the spelling or verify the number sent in your SMS.
          </p>
          <div className="pt-2">
            <Link
              href="/file-grievance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-kerala-800 text-white font-bold text-xs shadow hover:bg-kerala-700 transition"
            >
              <span>Lodge a New Grievance</span>
            </Link>
          </div>
        </div>
      ) : null}

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
