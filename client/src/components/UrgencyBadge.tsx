import React from 'react';
import { UrgencyLevel } from '../types';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, className = '' }) => {
  const styles: Record<UrgencyLevel, { bg: string; text: string; label: string; dot: string }> = {
    low: {
      bg: 'bg-stone-100 border-stone-200',
      text: 'text-stone-700',
      label: 'Low Urgency',
      dot: 'bg-stone-400',
    },
    medium: {
      bg: 'bg-teal-50 border-teal-200/80',
      text: 'text-teal-800',
      label: 'Medium Urgency',
      dot: 'bg-teal-600',
    },
    high: {
      bg: 'bg-amber-50 border-amber-200/80',
      text: 'text-amber-900',
      label: 'High Urgency',
      dot: 'bg-amber-500',
    },
    critical: {
      bg: 'bg-coral-50 border-coral-200/80',
      text: 'text-coral-700',
      label: 'Critical / Urgent',
      dot: 'bg-coral-600 animate-pulse',
    },
  };

  const current = styles[urgency] || styles.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} aria-hidden="true"></span>
      <span>{current.label}</span>
    </span>
  );
};
