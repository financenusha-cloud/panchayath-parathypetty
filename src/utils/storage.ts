'use client';

import { GrievanceLetter, GrievanceStatus, AuthorityRole, TimelineEvent } from '@/types/grievance';
import { INITIAL_GRIEVANCES } from '@/data/initialGrievances';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEY = 'parathipetty_grievances_v1';
const EVENT_NAME = 'parathipetty_data_changed';

export function getStoredGrievances(): GrievanceLetter[] {
  if (typeof window === 'undefined') {
    return INITIAL_GRIEVANCES;
  }
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRIEVANCES));
      return INITIAL_GRIEVANCES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GRIEVANCES;
  } catch (e) {
    console.error('Error reading grievances from localStorage:', e);
    return INITIAL_GRIEVANCES;
  }
}

export function saveGrievances(data: GrievanceLetter[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error('Error saving grievances:', e);
  }
}

export function getGrievanceByTracking(trackingNumber: string): GrievanceLetter | undefined {
  const all = getStoredGrievances();
  const clean = trackingNumber.trim().toUpperCase();
  return all.find(g => g.trackingNumber.toUpperCase() === clean);
}

export function getGrievancesByPhone(phone: string): GrievanceLetter[] {
  const all = getStoredGrievances();
  const cleanPhone = phone.replace(/\D/g, '');
  return all.filter(g => g.citizenPhone.replace(/\D/g, '').includes(cleanPhone));
}

export function createNewGrievance(payload: Omit<GrievanceLetter, 'id' | 'trackingNumber' | 'submittedAt' | 'updatedAt' | 'slaDeadline' | 'status' | 'timeline'>): GrievanceLetter {
  const now = new Date();
  const currentYear = now.getFullYear();
  const distCode = (payload.district || 'KL').substring(0, 3).toUpperCase();
  const panCode = (payload.panchayat || 'PAN').replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const trackingNumber = `KL-${distCode}-${panCode}-${currentYear}-${randomSuffix}`;
  
  // 7 days SLA according to Kerala Right to Services Act
  const slaDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const initialTimeline: TimelineEvent[] = [
    {
      id: `tl-${Date.now()}-1`,
      timestamp: now.toISOString(),
      status: 'SUBMITTED',
      actorRole: 'CITIZEN',
      actorName: payload.citizenName,
      title: 'Petition Registered by Citizen',
      titleMl: 'പൗരൻ പരാതി പോർട്ടലിൽ സമർപ്പിച്ചു',
      comment: `Official letter addressed to ${payload.addressedToName} (${payload.addressedDepartment}) entered into LSGD grievance ledger under token ${trackingNumber}.`,
    },
    {
      id: `tl-${Date.now()}-2`,
      timestamp: new Date(now.getTime() + 5000).toISOString(),
      status: 'ACKNOWLEDGED',
      actorRole: 'SYSTEM',
      actorName: 'Panchayat Citizen Facilitation Desk',
      title: 'Dispatched to Designated Officer In-tray',
      titleMl: 'ബന്ധപ്പെട്ട ഉദ്യോഗസ്ഥന്റെ ഇൻബോക്സിലേക്ക് അയച്ചു',
      comment: `Formal letter dispatched to ${payload.currentAssigneeName} (${payload.currentAssigneeRole}). SMS receipt triggered to citizen ${payload.citizenPhone}.`,
    }
  ];

  const newGrievance: GrievanceLetter = {
    ...payload,
    id: `grv-${Date.now()}`,
    trackingNumber,
    submittedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    slaDeadline: slaDate.toISOString(),
    status: 'ACKNOWLEDGED',
    timeline: initialTimeline,
  };

  const current = getStoredGrievances();
  const updated = [newGrievance, ...current];
  saveGrievances(updated);

  // If Supabase is connected, sync asynchronously
  if (isSupabaseConfigured && supabase) {
    supabase.from('grievances').insert({
      tracking_number: trackingNumber,
      district: payload.district,
      district_ml: payload.districtMl,
      panchayat: payload.panchayat,
      panchayat_ml: payload.panchayatMl,
      ward_number: payload.wardNumber,
      ward_name: payload.wardName,
      addressed_to_role: payload.addressedToRole,
      addressed_to_name: payload.addressedToName,
      addressed_department: payload.addressedDepartment,
      citizen_name: payload.citizenName,
      citizen_phone: payload.citizenPhone,
      citizen_email: payload.citizenEmail,
      citizen_address: payload.citizenAddress,
      citizen_aadhaar_last4: payload.citizenAadhaarLast4,
      category: payload.category,
      category_ml: payload.categoryMl,
      subject: payload.subject,
      description: payload.description,
      urgency: payload.urgency,
      location_landmark: payload.locationLandmark,
      formal_letter_text: payload.formalLetterText,
      status: 'ACKNOWLEDGED',
      current_assignee_name: payload.currentAssigneeName,
      current_assignee_role: payload.currentAssigneeRole,
      sla_deadline: slaDate.toISOString(),
    }).then(({ error }) => {
      if (error) console.warn('Supabase sync notice:', error.message);
    });
  }

  return newGrievance;
}

export function updateGrievanceStatus(
  trackingNumber: string,
  params: {
    newStatus: GrievanceStatus;
    actorName: string;
    actorRole: AuthorityRole;
    remarks: string;
    actionTakenReport?: GrievanceLetter['actionTakenReport'];
    resolutionSummary?: string;
  }
): GrievanceLetter | null {
  const all = getStoredGrievances();
  const index = all.findIndex(g => g.trackingNumber.toUpperCase() === trackingNumber.trim().toUpperCase());
  if (index === -1) return null;

  const item = all[index];
  const now = new Date().toISOString();

  const statusTitles: Record<GrievanceStatus, { en: string; ml: string }> = {
    SUBMITTED: { en: 'Petition Filed', ml: 'പരാതി സമർപ്പിച്ചു' },
    ACKNOWLEDGED: { en: 'Acknowledged by Official', ml: 'പരാതി സ്വീകരിച്ചു' },
    UNDER_REVIEW: { en: 'Under Official Examination', ml: 'പരിശോധന പുരോഗമിക്കുന്നു' },
    SITE_INSPECTION: { en: 'Site Inspection Conducted', ml: 'സ്ഥലപരിശോധന നടത്തി' },
    ACTION_IN_PROGRESS: { en: 'Action Taken / Sanction Issued', ml: 'നടപടികൾ പുരോഗമിക്കുന്നു' },
    RESOLVED: { en: 'Grievance Formally Redressed', ml: 'പരാതി പരിഹരിച്ചു' },
    REJECTED: { en: 'Disposed with Non-Feasibility Notice', ml: 'കാരണസഹിതം തീർപ്പാക്കി' },
    FORWARDED: { en: 'Transferred to Competent Authority', ml: 'മറ്റൊരു വകുപ്പിലേക്ക് കൈമാറി' },
  };

  const newEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    status: params.newStatus,
    actorRole: params.actorRole,
    actorName: params.actorName,
    title: statusTitles[params.newStatus]?.en || 'Status Updated',
    titleMl: statusTitles[params.newStatus]?.ml || 'സ്റ്റാറ്റസ് പുതുക്കി',
    comment: params.remarks,
    actionTaken: params.actionTakenReport?.rectificationWork || params.resolutionSummary,
  };

  const updatedItem: GrievanceLetter = {
    ...item,
    status: params.newStatus,
    updatedAt: now,
    resolvedAt: params.newStatus === 'RESOLVED' ? now : item.resolvedAt,
    resolutionSummary: params.resolutionSummary || item.resolutionSummary,
    actionTakenReport: params.actionTakenReport ? { ...item.actionTakenReport, ...params.actionTakenReport } : item.actionTakenReport,
    timeline: [...item.timeline, newEvent],
  };

  all[index] = updatedItem;
  saveGrievances(all);

  // If Supabase is connected, sync asynchronously
  if (isSupabaseConfigured && supabase) {
    supabase.from('grievances').update({
      status: params.newStatus,
      updated_at: now,
      resolved_at: params.newStatus === 'RESOLVED' ? now : item.resolvedAt,
      resolution_summary: params.resolutionSummary || item.resolutionSummary,
      action_taken_report: updatedItem.actionTakenReport,
    }).eq('tracking_number', trackingNumber).then(({ error }) => {
      if (error) console.warn('Supabase status update notice:', error.message);
    });
  }

  return updatedItem;
}

export function forwardGrievance(
  trackingNumber: string,
  targetOfficer: {
    role: AuthorityRole;
    name: string;
    department: string;
  },
  remarks: string,
  forwardingOfficerName: string,
  forwardingOfficerRole: AuthorityRole
): GrievanceLetter | null {
  const all = getStoredGrievances();
  const index = all.findIndex(g => g.trackingNumber.toUpperCase() === trackingNumber.trim().toUpperCase());
  if (index === -1) return null;

  const item = all[index];
  const now = new Date().toISOString();

  const newEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    status: 'FORWARDED',
    actorRole: forwardingOfficerRole,
    actorName: forwardingOfficerName,
    title: `Forwarded to ${targetOfficer.name}`,
    titleMl: `${targetOfficer.department} ലേക്ക് കൈമാറി`,
    comment: remarks,
  };

  const updatedItem: GrievanceLetter = {
    ...item,
    status: 'FORWARDED',
    currentAssigneeName: targetOfficer.name,
    currentAssigneeRole: targetOfficer.role,
    addressedDepartment: targetOfficer.department,
    updatedAt: now,
    timeline: [...item.timeline, newEvent],
  };

  all[index] = updatedItem;
  saveGrievances(all);
  return updatedItem;
}

export function addCitizenFeedback(
  trackingNumber: string,
  satisfaction: 'SATISFIED' | 'DISSATISFIED',
  rating: number,
  feedbackText: string
): boolean {
  const all = getStoredGrievances();
  const index = all.findIndex(g => g.trackingNumber.toUpperCase() === trackingNumber.trim().toUpperCase());
  if (index === -1) return false;

  const item = all[index];
  item.citizenSatisfaction = satisfaction;
  item.citizenRating = rating;
  item.citizenFeedbackText = feedbackText;
  item.timeline.push({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: item.status,
    actorRole: 'CITIZEN',
    actorName: item.citizenName,
    title: satisfaction === 'SATISFIED' ? 'Citizen Confirmed Resolution' : 'Citizen Submitted Dissatisfaction Note',
    titleMl: satisfaction === 'SATISFIED' ? 'പൗരൻ സംതൃപ്തി രേഖപ്പെടുത്തി' : 'പൗരൻ അതൃപ്തി രേഖപ്പെടുത്തി',
    comment: feedbackText || (satisfaction === 'SATISFIED' ? 'Service marked satisfactory.' : 'Citizen marked redressal insufficient.'),
  });

  saveGrievances(all);
  return true;
}

export function resetToDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRIEVANCES));
  window.dispatchEvent(new Event(EVENT_NAME));
}
