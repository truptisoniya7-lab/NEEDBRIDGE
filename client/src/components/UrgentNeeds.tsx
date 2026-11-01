import React from 'react';
import { Link } from 'react-router-dom';
import { AssistanceRequest, HelpRequest } from '../types';
import { RequestCard } from './RequestCard';
import { Flame, ArrowRight } from 'lucide-react';

interface UrgentNeedsProps {
  requests: (AssistanceRequest | HelpRequest)[];
  loading?: boolean;
}

export const UrgentNeeds: React.FC<UrgentNeedsProps> = ({ requests, loading = false }) => {
  // Filter for urgent requests (critical or high)
  const urgentList = requests
    .filter((r) => {
      if ('urgent' in r) return r.urgent;
      const ar = r as AssistanceRequest;
      return ar.urgency === 'critical' || ar.urgency === 'high';
    })
    .slice(0, 3);

  // If no urgent requests returned, show the first available requests
  const displayList = urgentList.length > 0 ? urgentList : requests.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="urgent-needs-title">
      <div className="bg-coral-50/50 rounded-2xl border border-coral-200/80 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-coral-100 text-coral-800 border border-coral-200 mb-2">
              <Flame className="w-3.5 h-3.5 text-coral-600 animate-pulse" aria-hidden="true" />
              <span>Time-Sensitive Needs</span>
            </div>
            <h2 id="urgent-needs-title" className="text-2xl sm:text-3xl font-extrabold text-[#14201F] tracking-tight">
              Urgent Community Needs
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Requests needing resolution within 24 to 48 hours. Your help can prevent an emergency.
            </p>
          </div>

          <Link
            to="/browse?urgency=critical"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-coral-700 hover:text-coral-800 transition-colors shrink-0 group focus:outline-none focus-visible:underline"
          >
            <span>View all urgent needs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 bg-white/70 rounded-2xl border border-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((req) => (
              <RequestCard key={req.id} request={req} showOfferButton={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
