import React from 'react';
import { GrievanceStatus } from '@/types/grievance';
import { 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Search, 
  Wrench, 
  XCircle, 
  Send,
  AlertTriangle 
} from 'lucide-react';

interface Props {
  status: GrievanceStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, showIcon = true, size = 'md' }: Props) {
  const config: Record<GrievanceStatus, { labelEn: string; labelMl: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    SUBMITTED: {
      labelEn: 'Submitted',
      labelMl: 'സമർപ്പിച്ചു',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    ACKNOWLEDGED: {
      labelEn: 'Acknowledged',
      labelMl: 'സ്വീകരിച്ചു',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <FileCheck className="w-3.5 h-3.5" />,
    },
    UNDER_REVIEW: {
      labelEn: 'Under Review',
      labelMl: 'പരിശോധനയിൽ',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      icon: <Search className="w-3.5 h-3.5" />,
    },
    SITE_INSPECTION: {
      labelEn: 'Site Inspection',
      labelMl: 'സ്ഥലപരിശോധന',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: <Search className="w-3.5 h-3.5" />,
    },
    ACTION_IN_PROGRESS: {
      labelEn: 'Action in Progress',
      labelMl: 'നടപടി പുരോഗമിക്കുന്നു',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: <Wrench className="w-3.5 h-3.5" />,
    },
    RESOLVED: {
      labelEn: 'Redressed / Resolved',
      labelMl: 'പരിഹരിച്ചു',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    REJECTED: {
      labelEn: 'Disposed / Rejected',
      labelMl: 'തീർപ്പാക്കി / തള്ളി',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    FORWARDED: {
      labelEn: 'Transferred',
      labelMl: 'കൈമാറി',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      icon: <Send className="w-3.5 h-3.5" />,
    },
  };

  const item = config[status] || {
    labelEn: status,
    labelMl: '',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${item.bg} ${item.text} ${item.border} ${sizeClasses[size]}`}
    >
      {showIcon && item.icon}
      <span>{item.labelEn}</span>
      <span className="opacity-70 text-[11px] hidden sm:inline">({item.labelMl})</span>
    </span>
  );
}
