import React from 'react';
import { RequestStatus } from '../types';
import { CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'open':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Open</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80 ${className}`}>
          <PlayCircle className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
          <span>In Progress</span>
        </span>
      );
    case 'resolved':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span>Resolved</span>
        </span>
      );
    case 'closed':
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200 ${className}`}>
          <XCircle className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
          <span>Closed</span>
        </span>
      );
  }
};
