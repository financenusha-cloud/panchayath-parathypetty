'use client';

import React, { useState, useEffect } from 'react';
import { GrievanceLetter, AuthorityRole, GrievanceStatus } from '@/types/grievance';
import { getStoredGrievances, updateGrievanceStatus, forwardGrievance } from '@/utils/storage';
import { AUTHORITY_ROLES } from '@/data/keralaData';
import { StatusBadge } from '@/components/StatusBadge';
import { OfficialLetterPreview } from '@/components/OfficialLetterPreview';
import { 
  ShieldCheck, 
  Inbox, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowRight, 
  Send, 
  FileText, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  CornerDownRight, 
  Check, 
  Wrench,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function AuthorityPortal() {
  const [grievances, setGrievances] = useState<GrievanceLetter[]>([]);
  const [selectedRole, setSelectedRole] = useState<AuthorityRole | 'ALL'>('ASSISTANT_ENGINEER');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update Status Modal / Form State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<GrievanceStatus>('UNDER_REVIEW');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [inspectionFindings, setInspectionFindings] = useState('');
  const [rectificationWork, setRectificationWork] = useState('');
  const [sanctionedAmount, setSanctionedAmount] = useState('');
  const [officialOrderNo, setOfficialOrderNo] = useState('');

  // Forward Modal State
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardRole, setForwardRole] = useState<AuthorityRole>('ASSISTANT_ENGINEER');
  const [forwardRemarks, setForwardRemarks] = useState('');

  // Toast / feedback message
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const list = getStoredGrievances();
    setGrievances(list);
    if (!selectedGrievanceId && list.length > 0) {
      setSelectedGrievanceId(list[0].id);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('parathipetty_data_changed', handleUpdate);
    return () => window.removeEventListener('parathipetty_data_changed', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Find currently logged-in officer profile
  const currentOfficer = AUTHORITY_ROLES.find(o => o.role === selectedRole);

  // Filter grievances
  const filteredGrievances = grievances.filter((g) => {
    // Role filter
    if (selectedRole !== 'ALL' && g.currentAssigneeRole !== selectedRole && g.addressedToRole !== selectedRole) {
      return false;
    }
    // Status filter
    if (filterStatus === 'PENDING') {
      if (['RESOLVED', 'REJECTED'].includes(g.status)) return false;
    } else if (filterStatus !== 'ALL' && g.status !== filterStatus) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = g.trackingNumber.toLowerCase().includes(q) ||
                    g.citizenName.toLowerCase().includes(q) ||
                    g.subject.toLowerCase().includes(q) ||
                    g.panchayat.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedGrievance = grievances.find(g => g.id === selectedGrievanceId) || filteredGrievances[0] || null;

  // Handle Status Update
  const handleApplyStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const actorName = currentOfficer ? currentOfficer.defaultOfficialEn : 'Panchayat Administrative Officer';
    const actorRole = (currentOfficer ? currentOfficer.role : 'SECRETARY') as AuthorityRole;

    const atr = (targetStatus === 'ACTION_IN_PROGRESS' || targetStatus === 'RESOLVED' || inspectionFindings) ? {
      actionDate: new Date().toISOString().split('T')[0],
      actionOfficer: `${actorName} (${currentOfficer?.nameEn || 'Officer'})`,
      findings: inspectionFindings || 'Physical site inspection completed.',
      rectificationWork: rectificationWork || (targetStatus === 'RESOLVED' ? 'Issue redressed and resolved.' : 'Rectification work underway.'),
      sanctionedAmount: sanctionedAmount || undefined,
      officialOrderNo: officialOrderNo || `LSGD/ORD/${Date.now().toString().slice(-5)}`,
    } : undefined;

    const updated = updateGrievanceStatus(selectedGrievance.trackingNumber, {
      newStatus: targetStatus,
      actorName,
      actorRole,
      remarks: statusRemarks.trim() || `Status progressed to ${targetStatus} by authorized personnel.`,
      actionTakenReport: atr,
      resolutionSummary: targetStatus === 'RESOLVED' ? (rectificationWork || statusRemarks || 'Grievance redressed satisfactorily.') : undefined,
    });

    if (updated) {
      showToast(`Status updated to ${targetStatus} for token ${selectedGrievance.trackingNumber}! SMS trigger dispatched.`);
      setShowStatusModal(false);
      setStatusRemarks('');
      setInspectionFindings('');
      setRectificationWork('');
      setSanctionedAmount('');
      setOfficialOrderNo('');
      loadData();
    }
  };

  // Handle Forwarding
  const handleApplyForward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const targetOfficer = AUTHORITY_ROLES.find(o => o.role === forwardRole);
    if (!targetOfficer) return;

    const forwardingOfficerName = currentOfficer ? currentOfficer.defaultOfficialEn : 'Panchayat Executive';
    const forwardingRole = (currentOfficer ? currentOfficer.role : 'SECRETARY') as AuthorityRole;

    const updated = forwardGrievance(
      selectedGrievance.trackingNumber,
      {
        role: forwardRole,
        name: targetOfficer.defaultOfficialEn,
        department: targetOfficer.jurisdiction,
      },
      forwardRemarks.trim() || `Misrouted petition transferred to ${targetOfficer.nameEn} for competent action.`,
      forwardingOfficerName,
      forwardingRole
    );

    if (updated) {
      showToast(`Petition ${selectedGrievance.trackingNumber} transferred to ${targetOfficer.nameEn}!`);
      setShowForwardModal(false);
      setForwardRemarks('');
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-gold-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Banner & Officer Switcher */}
      <div className="bg-gradient-to-r from-kerala-950 via-kerala-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30 mb-2">
            <ShieldCheck className="w-4 h-4 text-gold-300" />
            <span>Panchayat Official In-Tray & Redressal Desk</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white">
            ഉദ്യോഗസ്ഥ കാര്യാലയം (Authority Portal)
          </h1>
          <p className="text-xs sm:text-sm text-kerala-200 mt-1">
            Logged in as Kerala Local Self Government Institution (LSGD) Authority
          </p>
        </div>

        {/* Quick Role Selector */}
        <div className="w-full lg:w-auto bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md">
          <label className="block text-[11px] font-bold text-gold-300 uppercase tracking-wider mb-1 px-2">
            Switch Authority Persona (ഉദ്യോഗസ്ഥനെ മാറ്റുക):
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="w-full lg:w-80 px-3 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs sm:text-sm border border-kerala-600 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="ALL">All Panchayat Departments (Superintendent View)</option>
            {AUTHORITY_ROLES.map((officer) => (
              <option key={officer.role} value={officer.role}>
                {officer.nameEn} ({officer.defaultOfficialEn})
              </option>
            ))}
          </select>
          {currentOfficer && (
            <p className="text-[11px] text-kerala-200 px-2 mt-1">
              {currentOfficer.nameMl} • {currentOfficer.jurisdiction}
            </p>
          )}
        </div>
      </div>

      {/* Main Workspace: Left Inbox List / Right Detail & Action View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inbox List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search token, petitioner, subject..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'ALL'
                    ? 'bg-kerala-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({grievances.length})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'PENDING'
                    ? 'bg-kerala-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Pending Action
              </button>
              <button
                onClick={() => setFilterStatus('RESOLVED')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filterStatus === 'RESOLVED'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Letter Cards Queue */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredGrievances.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No Petitions in this Queue</p>
                <p className="text-xs text-slate-400 mt-1">
                  Change role or filter to view other department petitions.
                </p>
              </div>
            ) : (
              filteredGrievances.map((item) => {
                const isSelected = selectedGrievance?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedGrievanceId(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                      isSelected
                        ? 'border-kerala-800 bg-white ring-2 ring-kerala-600/30 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Urgency Ribbon if Emergency */}
                    {item.urgency === 'EMERGENCY' && (
                      <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {item.trackingNumber}
                      </span>
                      <StatusBadge status={item.status} size="sm" showIcon={false} />
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                      {item.subject}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Petitioner: <strong className="text-slate-800">{item.citizenName}</strong></span>
                      <span className="text-kerala-800 font-semibold">{item.panchayat}, Ward {item.wardNumber}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Detailed View & Action Controller (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedGrievance ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      {selectedGrievance.trackingNumber}
                    </span>
                    <StatusBadge status={selectedGrievance.status} size="md" />
                    {selectedGrievance.urgency === 'EMERGENCY' && (
                      <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-300">
                        EMERGENCY
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedGrievance.subject}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filed on {new Date(selectedGrievance.submittedAt).toLocaleDateString()} at {new Date(selectedGrievance.submittedAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setTargetStatus(selectedGrievance.status === 'UNDER_REVIEW' ? 'SITE_INSPECTION' : 'ACTION_IN_PROGRESS');
                      setShowStatusModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-xs sm:text-sm shadow transition"
                  >
                    <Wrench className="w-4 h-4 text-gold-300" />
                    <span>Update Status / ATR</span>
                  </button>

                  <button
                    onClick={() => setShowForwardModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 transition"
                  >
                    <CornerDownRight className="w-4 h-4 text-slate-500" />
                    <span>Forward</span>
                  </button>
                </div>
              </div>

              {/* Petitioner Info Pill */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Civilian / Petitioner:</span>
                  <span className="font-bold text-slate-900">{selectedGrievance.citizenName}</span>
                  <p className="font-mono text-slate-600">{selectedGrievance.citizenPhone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Location / Ward:</span>
                  <span className="font-bold text-slate-900">{selectedGrievance.panchayat}</span>
                  <p className="text-slate-600">Ward {selectedGrievance.wardNumber} ({selectedGrievance.wardName})</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Specific Landmark:</span>
                  <span className="text-slate-800">{selectedGrievance.locationLandmark}</span>
                </div>
              </div>

              {/* Formal Malayalam Petition Letter Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-kerala-800" />
                    <span>Original Petition Letter (പരാതി കത്ത്):</span>
                  </h3>
                </div>
                <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 text-xs sm:text-sm font-serif leading-relaxed text-slate-800 whitespace-pre-line shadow-inner">
                  {selectedGrievance.formalLetterText || selectedGrievance.description}
                </div>
              </div>

              {/* Attachments if any */}
              {selectedGrievance.attachments && selectedGrievance.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Attached Evidence / Documents:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGrievance.attachments.map((a) => (
                      <span
                        key={a}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs font-mono text-slate-800 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{a}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Official Action Taken Report (ATR) */}
              {selectedGrievance.actionTakenReport && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 uppercase tracking-wide">
                      Active Action Taken Report (ATR)
                    </span>
                    <span className="text-emerald-800 font-mono">
                      Ref: {selectedGrievance.actionTakenReport.officialOrderNo}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    <strong>Findings:</strong> {selectedGrievance.actionTakenReport.findings}
                  </p>
                  <p className="text-slate-700">
                    <strong>Rectification:</strong> {selectedGrievance.actionTakenReport.rectificationWork}
                  </p>
                  {selectedGrievance.actionTakenReport.sanctionedAmount && (
                    <p className="text-emerald-900 font-bold">
                      Sanctioned Estimate: {selectedGrievance.actionTakenReport.sanctionedAmount}
                    </p>
                  )}
                </div>
              )}

              {/* Timeline Trail */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Audit History ({selectedGrievance.timeline.length} actions)
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedGrievance.timeline.map((evt) => (
                    <div key={evt.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{evt.title}</span>
                          <span className="text-[10px] text-kerala-800">({evt.actorName})</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{evt.comment}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(evt.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
              Select a petition from the left queue to review its contents and update status.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Update Status & Action Taken Report */}
      {showStatusModal && selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Update Grievance Status (സ്റ്റാറ്റസ് പുതുക്കുക)
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Token: {selectedGrievance.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyStatusUpdate} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Status (പുതിയ സ്റ്റാറ്റസ്) *
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as GrievanceStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-kerala-700 focus:outline-none"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW (പരിശോധന പുരോഗമിക്കുന്നു)</option>
                  <option value="SITE_INSPECTION">SITE_INSPECTION (സ്ഥലപരിശോധന നടത്തി)</option>
                  <option value="ACTION_IN_PROGRESS">ACTION_IN_PROGRESS (നടപടികൾ ആരംഭിച്ചു / അനുമതി നൽകി)</option>
                  <option value="RESOLVED">RESOLVED (പരാതി പൂർണ്ണമായി പരിഹരിച്ചു / ഉത്തരവായി)</option>
                  <option value="REJECTED">REJECTED (കാരണസഹിതം തള്ളി / പരിധിയിൽ പെടാത്തത്)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Remarks / Note for Citizen *
                </label>
                <textarea
                  rows={2}
                  required
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="e.g. Inspected location with Ward Member. Prepared estimate for repair..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-kerala-700 focus:outline-none"
                />
              </div>

              {/* Action Taken Report Fields */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <p className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  Action Taken Report (ATR) Details
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Field Inspection Findings
                  </label>
                  <input
                    type="text"
                    value={inspectionFindings}
                    onChange={(e) => setInspectionFindings(e.target.value)}
                    placeholder="e.g. Scouring observed at base of culvert, dangerous to traffic."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Rectification Work / Sanctioned Solution
                  </label>
                  <input
                    type="text"
                    value={rectificationWork}
                    onChange={(e) => setRectificationWork(e.target.value)}
                    placeholder="e.g. Emergency stone pitching work approved under disaster relief grant."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Sanctioned Amount (₹)
                    </label>
                    <input
                      type="text"
                      value={sanctionedAmount}
                      onChange={(e) => setSanctionedAmount(e.target.value)}
                      placeholder="e.g. ₹ 1,50,000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Official Order / File No.
                    </label>
                    <input
                      type="text"
                      value={officialOrderNo}
                      onChange={(e) => setOfficialOrderNo(e.target.value)}
                      placeholder="e.g. LSGD/VNG/2026/812"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-xs sm:text-sm shadow transition"
                >
                  Confirm & Dispatch Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Forward Petition to another Authority */}
      {showForwardModal && selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Forward / Transfer Petition (കൈമാറുക)
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Token: {selectedGrievance.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setShowForwardModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyForward} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Transfer to Competent Authority (സ്വീകർത്താവ്) *
                </label>
                <select
                  value={forwardRole}
                  onChange={(e) => setForwardRole(e.target.value as AuthorityRole)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-kerala-700 focus:outline-none"
                >
                  {AUTHORITY_ROLES.map((officer) => (
                    <option key={officer.role} value={officer.role}>
                      {officer.nameEn} ({officer.defaultOfficialEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Transfer / Endorsement Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={forwardRemarks}
                  onChange={(e) => setForwardRemarks(e.target.value)}
                  placeholder="e.g. This grievance pertains to public road drainage works under the jurisdiction of LSGD Engineering Wing. Forwarded for necessary estimate preparation."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-kerala-700 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForwardModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-xs sm:text-sm shadow transition"
                >
                  Transfer Petition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
