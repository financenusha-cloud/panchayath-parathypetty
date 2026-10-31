'use client';

import { GrievanceLetter, GrievanceStatus, AuthorityRole, TimelineEvent } from '@/types/grievance';
import { INITIAL_GRIEVANCES } from '@/data/initialGrievances';
import { supabase, isSupabaseConfigured, subscribeToGrievancesRealtime } from '@/lib/supabase';

const STORAGE_KEY = 'parathipetty_grievances_v1';
const EVENT_NAME = 'parathipetty_data_changed';

// Synchronize Supabase record shape with client GrievanceLetter
function mapSupabaseRowToGrievance(row: any): GrievanceLetter {
  return {
    id: row.id || `grv-${row.tracking_number}`,
    trackingNumber: row.tracking_number,
    submittedAt: row.submitted_at || row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    slaDeadline: row.sla_deadline,
    district: row.district,
    districtMl: row.district_ml || row.district,
    panchayat: row.panchayat,
    panchayatMl: row.panchayat_ml || row.panchayat,
    wardNumber: Number(row.ward_number),
    wardName: row.ward_name || `Ward ${row.ward_number}`,
    addressedToRole: row.addressed_to_role,
    addressedToName: row.addressed_to_name,
    addressedDepartment: row.addressed_department,
    citizenName: row.citizen_name,
    citizenPhone: row.citizen_phone,
    citizenEmail: row.citizen_email,
    citizenAddress: row.citizen_address,
    citizenAadhaarLast4: row.citizen_aadhaar_last4,
    category: row.category,
    categoryMl: row.category_ml || row.category,
    subject: row.subject,
    description: row.description,
    urgency: row.urgency,
    locationLandmark: row.location_landmark,
    formalLetterText: row.formal_letter_text || row.description,
    attachments: row.attachments || [],
    status: row.status,
    currentAssigneeName: row.current_assignee_name,
    currentAssigneeRole: row.current_assignee_role,
    resolutionSummary: row.resolution_summary,
    resolvedAt: row.resolved_at,
    actionTakenReport: row.action_taken_report,
    timeline: [
      {
        id: `tl-sub-${row.tracking_number}`,
        timestamp: row.submitted_at || new Date().toISOString(),
        status: 'SUBMITTED',
        actorRole: 'CITIZEN',
        actorName: row.citizen_name,
        title: 'Petition Registered',
        titleMl: 'പരാതി പോർട്ടലിൽ സമർപ്പിച്ചു',
        comment: `Petition officially entered into LSGD grievance ledger under token ${row.tracking_number}.`,
      },
      ...(row.status !== 'SUBMITTED' ? [{
        id: `tl-ack-${row.tracking_number}`,
        timestamp: row.updated_at || new Date().toISOString(),
        status: row.status as GrievanceStatus,
        actorRole: row.current_assignee_role as AuthorityRole,
        actorName: row.current_assignee_name,
        title: `Progressed to ${row.status}`,
        titleMl: 'സ്റ്റാറ്റസ് പുതുക്കി',
        comment: row.resolution_summary || 'Action taken by designated Panchayat authority.',
      }] : [])
    ],
    citizenSatisfaction: row.citizen_satisfaction,
    citizenRating: row.citizen_rating,
    citizenFeedbackText: row.citizen_feedback_text,
  };
}

export function getStoredGrievances(): GrievanceLetter[] {
  if (typeof window === 'undefined') {
    return INITIAL_GRIEVANCES;
  }
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRIEVANCES));
      fetchGrievancesFromSupabase();
      return INITIAL_GRIEVANCES;
    }
    const parsed = JSON.parse(raw);
    fetchGrievancesFromSupabase();
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GRIEVANCES;
  } catch (e) {
    console.error('Error reading grievances:', e);
    return INITIAL_GRIEVANCES;
  }
}

// Background sync from live Supabase PostgreSQL
let isFetchingFromSupabase = false;
async function fetchGrievancesFromSupabase() {
  if (isFetchingFromSupabase || !isSupabaseConfigured || !supabase || typeof window === 'undefined') return;
  isFetchingFromSupabase = true;

  try {
    const { data, error } = await supabase
      .from('grievances')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped = data.map(mapSupabaseRowToGrievance);
      const local = getLocalCache();
      
      // Merge: keep local timeline details if richer, update status from Supabase
      const merged = mapped.map(remoteItem => {
        const localMatch = local.find(l => l.trackingNumber.toUpperCase() === remoteItem.trackingNumber.toUpperCase());
        if (localMatch && localMatch.timeline && localMatch.timeline.length > remoteItem.timeline.length) {
          return {
            ...remoteItem,
            timeline: localMatch.timeline,
          };
        }
        return remoteItem;
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event(EVENT_NAME));
    }
  } catch (err) {
    console.warn('Supabase background fetch notice:', err);
  } finally {
    isFetchingFromSupabase = false;
  }
}

function getLocalCache(): GrievanceLetter[] {
  if (typeof window === 'undefined') return INITIAL_GRIEVANCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_GRIEVANCES;
  } catch {
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

  // Sync to Live Supabase PostgreSQL
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
      else console.log('Successfully saved to live Supabase cloud database!');
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

  // Update in live Supabase PostgreSQL
  if (isSupabaseConfigured && supabase) {
    supabase.from('grievances').update({
      status: params.newStatus,
      updated_at: now,
      resolved_at: params.newStatus === 'RESOLVED' ? now : item.resolvedAt,
      resolution_summary: params.resolutionSummary || item.resolutionSummary,
      action_taken_report: updatedItem.actionTakenReport,
    }).eq('tracking_number', trackingNumber).then(({ error }) => {
      if (error) console.warn('Supabase status update notice:', error.message);
      else console.log('Successfully updated status in live Supabase cloud database!');
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

  // Sync to Supabase
  if (isSupabaseConfigured && supabase) {
    supabase.from('grievances').update({
      status: 'FORWARDED',
      current_assignee_name: targetOfficer.name,
      current_assignee_role: targetOfficer.role,
      addressed_department: targetOfficer.department,
      updated_at: now,
    }).eq('tracking_number', trackingNumber).then(({ error }) => {
      if (error) console.warn('Supabase forwarding notice:', error.message);
    });
  }

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

  // Sync feedback to Supabase
  if (isSupabaseConfigured && supabase) {
    supabase.from('grievances').update({
      citizen_satisfaction: satisfaction,
      citizen_rating: rating,
      citizen_feedback_text: feedbackText,
    }).eq('tracking_number', trackingNumber).then(({ error }) => {
      if (error) console.warn('Supabase feedback notice:', error.message);
    });
  }

  return true;
}

export function resetToDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRIEVANCES));
  window.dispatchEvent(new Event(EVENT_NAME));
}
