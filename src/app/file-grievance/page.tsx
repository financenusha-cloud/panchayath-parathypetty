'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KERALA_DISTRICTS, AUTHORITY_ROLES, GRIEVANCE_CATEGORIES } from '@/data/keralaData';
import { AuthorityRole, UrgencyLevel } from '@/types/grievance';
import { createNewGrievance } from '@/utils/storage';
import { PrintReceipt } from '@/components/PrintReceipt';
import { OfficialLetterPreview } from '@/components/OfficialLetterPreview';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  Send, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  HelpCircle,
  Paperclip,
  Check
} from 'lucide-react';

function FileGrievanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial query params
  const initialAuthority = searchParams.get('authority') as AuthorityRole | null;
  const initialUrgency = searchParams.get('urgency') as UrgencyLevel | null;

  // Form State
  const [districtId, setDistrictId] = useState('TVM');
  const [panchayatId, setPanchayatId] = useState('venganoor');
  const [wardNumber, setWardNumber] = useState(7);
  const [wardName, setWardName] = useState('Chavadinada Ward (ചാവടിനട)');

  const [addressedRole, setAddressedRole] = useState<AuthorityRole>(initialAuthority || 'SECRETARY');
  const [category, setCategory] = useState(GRIEVANCE_CATEGORIES[0].id);
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialUrgency || 'NORMAL');

  // Citizen details
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenAddress, setCitizenAddress] = useState('');
  const [citizenAadhaarLast4, setCitizenAadhaarLast4] = useState('');

  // Complaint details
  const [subject, setSubject] = useState('');
  const [locationLandmark, setLocationLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [formalLetterText, setFormalLetterText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'FORM' | 'PREVIEW'>('FORM');
  const [submitting, setSubmitting] = useState(false);
  const [submittedGrievance, setSubmittedGrievance] = useState<any>(null);

  // Selected district & panchayat objects
  const currentDistrict = KERALA_DISTRICTS.find(d => d.id === districtId) || KERALA_DISTRICTS[0];
  const currentPanchayat = currentDistrict.panchayats.find(p => p.id === panchayatId) || currentDistrict.panchayats[0];
  const currentOfficer = AUTHORITY_ROLES.find(o => o.role === addressedRole) || AUTHORITY_ROLES[1];
  const currentCategory = GRIEVANCE_CATEGORIES.find(c => c.id === category) || GRIEVANCE_CATEGORIES[0];

  // Update panchayat when district changes
  const handleDistrictChange = (distId: string) => {
    setDistrictId(distId);
    const dist = KERALA_DISTRICTS.find(d => d.id === distId);
    if (dist && dist.panchayats.length > 0) {
      setPanchayatId(dist.panchayats[0].id);
    }
  };

  // Smart suggestion for authority when category changes
  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    const catObj = GRIEVANCE_CATEGORIES.find(c => c.id === catId);
    if (catObj && catObj.defaultRole) {
      setAddressedRole(catObj.defaultRole);
    }
  };

  // Generate formal Malayalam petition letter
  const generateFormalMalayalamLetter = () => {
    const panchayatName = currentPanchayat.nameMl || currentPanchayat.nameEn;
    const officerName = currentOfficer.nameMl;
    const roleTitle = currentOfficer.nameMl;

    const generated = `ബഹുമാനപ്പെട്ട ${roleTitle} അവർകൾ മുൻപാകെ,
${panchayatName}, ${currentDistrict.nameMl} ജില്ല.

വിഷയം: വാർഡ് ${wardNumber} ലെ ${subject || 'പൊതുവിഷയം'} സംബന്ധിച്ച്.

സർ / മാഡം,
ഞാൻ ${panchayatName} വാർഡ് ${wardNumber} ലെ താമസക്കാരനായ ${citizenName || '[ഹർജിക്കാരന്റെ പേര്]'} ആണ്. 

${description || '[പരാതിയുടെ പൂർണ്ണ വിവരങ്ങൾ ഇവിടെ രേഖപ്പെടുത്തുക]'}

സ്ഥലം / അടയാളം: ${locationLandmark || 'വാർഡ് പരിധിയിൽ'}

ആയതിനാൽ ബഹുമാനപ്പെട്ട ${roleTitle} അവർകൾ ഈ വിഷയത്തിൽ അടിയന്തരമായി നേരിട്ട് പരിശോധന നടത്തുകയും കേരള പഞ്ചായത്ത് രാജ് നിയമപ്രകാരം ആവശ്യമായ നടപടികൾ സ്വീകരിക്കുകയും ചെയ്യണമെന്ന് വിനീതമായി അപേക്ഷിക്കുന്നു.

വിശ്വസ്തതയോടെ,
${citizenName || '[ഹർജിക്കാരന്റെ ഒപ്പ്]'}
ഫോൺ: ${citizenPhone || ''}`;

    setFormalLetterText(generated);
  };

  // Simulate file attachment
  const handleAttachSimulatedFile = (filename: string) => {
    if (!attachedFiles.includes(filename)) {
      setAttachedFiles([...attachedFiles, filename]);
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizenName.trim() || !citizenPhone.trim() || !subject.trim() || !description.trim()) {
      alert('Please complete petitioner name, phone number, subject, and complaint description.');
      return;
    }

    setSubmitting(true);

    const letterBody = formalLetterText.trim() || `ബഹുമാനപ്പെട്ട ${currentOfficer.nameMl} അവർകൾ മുൻപാകെ,
${currentPanchayat.nameMl}.
വിഷയം: ${subject}
${description}
വിശ്വസ്തതയോടെ, ${citizenName}`;

    setTimeout(() => {
      const created = createNewGrievance({
        district: currentDistrict.nameEn,
        districtMl: currentDistrict.nameMl,
        panchayat: currentPanchayat.nameEn,
        panchayatMl: currentPanchayat.nameMl,
        wardNumber: Number(wardNumber),
        wardName: wardName || `Ward ${wardNumber}`,
        addressedToRole: addressedRole,
        addressedToName: `${currentOfficer.defaultOfficialEn} (${currentOfficer.nameEn})`,
        addressedDepartment: currentOfficer.jurisdiction,
        citizenName: citizenName.trim(),
        citizenPhone: citizenPhone.trim(),
        citizenEmail: citizenEmail.trim(),
        citizenAddress: citizenAddress.trim() || `Ward ${wardNumber}, ${currentPanchayat.nameEn}`,
        citizenAadhaarLast4: citizenAadhaarLast4.trim(),
        category: currentCategory.titleEn,
        categoryMl: currentCategory.titleMl,
        subject: subject.trim(),
        description: description.trim(),
        urgency,
        locationLandmark: locationLandmark.trim() || `Ward ${wardNumber} area`,
        formalLetterText: letterBody,
        attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        currentAssigneeName: currentOfficer.defaultOfficialEn,
        currentAssigneeRole: addressedRole,
      });

      setSubmittedGrievance(created);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  if (submittedGrievance) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <PrintReceipt grievance={submittedGrievance} />
        <div className="pt-6">
          <OfficialLetterPreview grievance={submittedGrievance} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kerala-100 text-kerala-800 text-xs font-bold mb-2">
          <span>ഔദ്യോഗിക പരാതി സമർപ്പണം</span>
          <span>•</span>
          <span>Official Petition Filing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Post Grievance to Panchayat Authority (പരാതി നൽകുക)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Direct communication channel to elected representatives and executive officers across Kerala Grama Panchayaths.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('FORM')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'FORM'
              ? 'border-kerala-800 text-kerala-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Fill Petition Form (പത്രിക)</span>
        </button>
        <button
          onClick={() => {
            if (!formalLetterText && description) generateFormalMalayalamLetter();
            setActiveTab('PREVIEW');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'PREVIEW'
              ? 'border-kerala-800 text-kerala-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Official Letter Preview (മാതൃക)</span>
        </button>
      </div>

      {activeTab === 'PREVIEW' ? (
        <div className="space-y-6">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>This is how your formal petition letter will appear in the officer&apos;s digital in-tray:</span>
            <button
              onClick={() => setActiveTab('FORM')}
              className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-amber-950 transition"
            >
              Back to Editing Form
            </button>
          </div>

          <OfficialLetterPreview
            grievance={{
              id: 'preview-temp',
              trackingNumber: 'DRAFT-KL-PENDING-SUBMISSION',
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              slaDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
              district: currentDistrict.nameEn,
              districtMl: currentDistrict.nameMl,
              panchayat: currentPanchayat.nameEn,
              panchayatMl: currentPanchayat.nameMl,
              wardNumber,
              wardName: wardName || `Ward ${wardNumber}`,
              addressedToRole: addressedRole,
              addressedToName: `${currentOfficer.defaultOfficialEn} (${currentOfficer.nameEn})`,
              addressedDepartment: currentOfficer.jurisdiction,
              citizenName: citizenName || '[Your Full Name]',
              citizenPhone: citizenPhone || '+91 9XXXXXXXXX',
              citizenEmail,
              citizenAddress: citizenAddress || 'House Name, Locality, Ward No.',
              citizenAadhaarLast4,
              category: currentCategory.titleEn,
              categoryMl: currentCategory.titleMl,
              subject: subject || '[Subject of Your Grievance]',
              description: description || '[Detailed grievance description]',
              urgency,
              locationLandmark: locationLandmark || 'Near landmark',
              formalLetterText: formalLetterText || description,
              attachments: attachedFiles,
              status: 'SUBMITTED',
              currentAssigneeName: currentOfficer.defaultOfficialEn,
              currentAssigneeRole: addressedRole,
              timeline: [],
            }}
          />

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-base shadow-lg transition"
            >
              <Send className="w-5 h-5 text-gold-300" />
              <span>{submitting ? 'Dispatching Letter...' : 'Confirm & Dispatch Petition Now'}</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Panchayat & Location Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-kerala-700" />
              <h2 className="text-base font-bold text-slate-900">
                1. Select Panchayat & Ward (പഞ്ചായത്തും വാർഡും)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* District */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District (ജില്ല) *
                </label>
                <select
                  value={districtId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-medium"
                >
                  {KERALA_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameEn} ({d.nameMl})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grama Panchayat */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grama Panchayat (ഗ്രാമപഞ്ചായത്ത്) *
                </label>
                <select
                  value={panchayatId}
                  onChange={(e) => setPanchayatId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-medium"
                >
                  {currentDistrict.panchayats.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameEn} ({p.nameMl})
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ward Number (വാർഡ് നമ്പർ) *
                </label>
                <div className="flex gap-2">
                  <select
                    value={wardNumber}
                    onChange={(e) => setWardNumber(Number(e.target.value))}
                    className="w-24 px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-bold"
                  >
                    {Array.from({ length: currentPanchayat.wardsCount || 20 }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>
                        Ward {w}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    placeholder="Ward name / Area (e.g. Chavadinada)"
                    className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Authority & Grievance Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-kerala-700" />
                <h2 className="text-base font-bold text-slate-900">
                  2. Choose Authority & Category (അധികാരിയും വിഭാഗവും)
                </h2>
              </div>
              <span className="text-xs text-kerala-800 bg-kerala-50 px-2.5 py-0.5 rounded-full font-medium">
                Direct Officer Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grievance Category (വിഷയ വിഭാഗം) *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-medium"
                >
                  {GRIEVANCE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titleEn} ({c.titleMl})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority / Urgency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urgency Level (മുൻഗണന) *
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm font-semibold focus:outline-none ${
                    urgency === 'EMERGENCY'
                      ? 'border-red-400 bg-red-50 text-red-900'
                      : urgency === 'HIGH'
                      ? 'border-amber-400 bg-amber-50 text-amber-900'
                      : 'border-slate-300 bg-white text-slate-900'
                  }`}
                >
                  <option value="NORMAL">Normal Priority (7 Days statutory SLA)</option>
                  <option value="HIGH">High Priority (Hazard, school pathway, potable water)</option>
                  <option value="EMERGENCY">Emergency (Life danger, flood, landslide runoff)</option>
                </select>
              </div>
            </div>

            {/* Authority Role Selector Grid */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Specific Authority Addressed (സ്വീകർത്താവ് - അധികാരിയെ തിരഞ്ഞെടുക്കുക) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {AUTHORITY_ROLES.map((officer) => {
                  const isSelected = addressedRole === officer.role;
                  return (
                    <div
                      key={officer.role}
                      onClick={() => setAddressedRole(officer.role)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-kerala-800 bg-kerala-50/80 shadow-sm'
                          : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {officer.role.replace('_', ' ')}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-kerala-800" />}
                        </div>
                        <p className="font-bold text-xs text-slate-900 leading-snug">
                          {officer.nameEn}
                        </p>
                        <p className="text-[11px] text-kerala-800 font-medium">
                          {officer.nameMl}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                        {officer.descriptionEn}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
                <span className="font-bold text-kerala-900">Current Assignee:</span>
                <span>{currentOfficer.defaultOfficialEn} ({currentOfficer.nameMl})</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">{currentOfficer.jurisdiction}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Petitioner Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Phone className="w-5 h-5 text-kerala-700" />
              <h2 className="text-base font-bold text-slate-900">
                3. Petitioner / Civilian Details (ഹർജിക്കാരന്റെ വിവരങ്ങൾ)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (പൂർണ്ണ നാമം) *
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. K. Radhakrishnan Nair"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number for SMS Tracking *
                </label>
                <input
                  type="tel"
                  required
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder="+91 94470 XXXXX"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={citizenEmail}
                  onChange={(e) => setCitizenEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address (മേൽവിലാസം) *
                </label>
                <input
                  type="text"
                  required
                  value={citizenAddress}
                  onChange={(e) => setCitizenAddress(e.target.value)}
                  placeholder="House Name / No., Road, Ward No., Post Office, PIN"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aadhaar Card (Last 4 Digits)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={citizenAadhaarLast4}
                  onChange={(e) => setCitizenAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 7821"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Grievance Content & Letter Formulation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-kerala-700" />
                <h2 className="text-base font-bold text-slate-900">
                  4. Grievance Subject & Description (പരാതി വിവരങ്ങൾ)
                </h2>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject of Grievance (വിഷയം) *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Dangerously damaged road culvert caving in near Chavadinada temple"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location Landmark / Geographic Details (സ്ഥല വിവരണം) *
              </label>
              <input
                type="text"
                required
                value={locationLandmark}
                onChange={(e) => setLocationLandmark(e.target.value)}
                placeholder="e.g. 50 meters south of Ward Member office, near primary school entrance"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Detailed Complaint Description (വിശദമായ പരാതി) *
                </label>
                <button
                  type="button"
                  onClick={generateFormalMalayalamLetter}
                  className="flex items-center gap-1.5 text-xs font-bold text-kerala-800 hover:text-kerala-900 bg-kerala-100 px-3 py-1 rounded-md transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>Generate Formal Malayalam Letter Format</span>
                </button>
              </div>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue clearly: when did it start, how many residents are affected, any previous complaints made, and expected resolution..."
                className="w-full p-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-kerala-600 focus:outline-none"
              />
            </div>

            {/* Generated Official Malayalam Petition Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Formal Official Petition Statement (ഔദ്യോഗിക ഹർജി വാചകം)
                </label>
                <span className="text-[11px] text-slate-500">Auto-formatted for official LSGD filing</span>
              </div>
              <textarea
                rows={6}
                value={formalLetterText}
                onChange={(e) => setFormalLetterText(e.target.value)}
                placeholder="Click 'Generate Formal Malayalam Letter Format' above or customize this text..."
                className="w-full p-3 rounded-lg border border-amber-300 bg-amber-50/30 text-xs sm:text-sm text-slate-900 font-serif leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Attachments Simulator */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach Supporting Photos / Documents (തെളിവുകൾ ചേർക്കുക)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAttachSimulatedFile('ground_site_photo_01.jpg')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span>+ Add Site Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachSimulatedFile('resident_signatures_memo.pdf')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span>+ Add Ward Signatures Sheet</span>
                </button>

                {attachedFiles.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-xs text-emerald-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                if (!formalLetterText && description) generateFormalMalayalamLetter();
                setActiveTab('PREVIEW');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Official Letterhead</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-kerala-800 hover:bg-kerala-700 text-white font-bold text-base shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5 text-gold-300" />
              <span>{submitting ? 'Dispatching...' : 'Lodge Grievance Letter (പരാതി അയക്കുക)'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}

export default function FileGrievancePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Petition System...</div>}>
      <FileGrievanceContent />
    </Suspense>
  );
}
