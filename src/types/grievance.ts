export type GrievanceStatus = 
  | 'SUBMITTED' 
  | 'ACKNOWLEDGED' 
  | 'UNDER_REVIEW' 
  | 'SITE_INSPECTION' 
  | 'ACTION_IN_PROGRESS' 
  | 'RESOLVED' 
  | 'REJECTED' 
  | 'FORWARDED';

export type UrgencyLevel = 'NORMAL' | 'HIGH' | 'EMERGENCY';

export type AuthorityRole = 
  | 'PRESIDENT' 
  | 'SECRETARY' 
  | 'WARD_MEMBER' 
  | 'ASSISTANT_ENGINEER' 
  | 'HEALTH_INSPECTOR' 
  | 'VILLAGE_EXTENSION_OFFICER' 
  | 'AGRICULTURAL_OFFICER' 
  | 'KUDUMBASHREE_CDS';

export interface AuthorityOfficer {
  id: string;
  role: AuthorityRole;
  nameEn: string;
  nameMl: string;
  designationEn: string;
  designationMl: string;
  departmentEn: string;
  departmentMl: string;
  contactNumber: string;
  email: string;
  officeHours: string;
  wardNo?: number; // For ward members
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: GrievanceStatus;
  actorRole: AuthorityRole | 'CITIZEN' | 'SYSTEM';
  actorName: string;
  title: string;
  titleMl: string;
  comment: string;
  actionTaken?: string;
  attachmentName?: string;
}

export interface GrievanceLetter {
  id: string;
  trackingNumber: string; // e.g. KL-TVM-VNG-2026-0814
  submittedAt: string;
  updatedAt: string;
  slaDeadline: string; // 7 days as per Kerala Right to Services Act
  
  // Panchayat details
  district: string;
  districtMl: string;
  blockPanchayat?: string;
  panchayat: string;
  panchayatMl: string;
  wardNumber: number;
  wardName: string;

  // Addressed Authority
  addressedToRole: AuthorityRole;
  addressedToName: string;
  addressedDepartment: string;
  
  // Citizen details
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  citizenAddress: string;
  citizenAadhaarLast4?: string;

  // Complaint details
  category: string;
  categoryMl: string;
  subject: string;
  description: string;
  urgency: UrgencyLevel;
  locationLandmark: string;

  // Letter content
  formalLetterText: string;
  attachments?: string[];

  // Resolution & Status
  status: GrievanceStatus;
  currentAssigneeName: string;
  currentAssigneeRole: AuthorityRole;
  resolutionSummary?: string;
  resolvedAt?: string;
  actionTakenReport?: {
    actionDate: string;
    actionOfficer: string;
    findings: string;
    rectificationWork: string;
    sanctionedAmount?: string;
    officialOrderNo?: string;
  };
  
  // Timeline audit trail
  timeline: TimelineEvent[];
  
  // Citizen feedback
  citizenSatisfaction?: 'SATISFIED' | 'DISSATISFIED';
  citizenRating?: number;
  citizenFeedbackText?: string;
}

export interface KeralaDistrict {
  id: string;
  nameEn: string;
  nameMl: string;
  panchayats: {
    id: string;
    nameEn: string;
    nameMl: string;
    wardsCount: number;
  }[];
}
