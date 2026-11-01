import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, MessageSquare, HandHeart, ArrowUpRight } from 'lucide-react';
import { AssistanceRequest, HelpRequest } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';

export interface RequestCardProps {
  request: AssistanceRequest | HelpRequest;
  showOfferButton?: boolean;
  onOfferHelp?: (id: string) => void;
  className?: string;
  isCompact?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  showOfferButton = false,
  onOfferHelp,
  className = '',
  isCompact = false,
}) => {
  // Normalize fields between AssistanceRequest and HelpRequest
  const isHelpRequest = 'postedAt' in request;
  const id = request.id;
  const title = request.title;
  const location = request.location;
  const status = request.status;

  const categoryName = isHelpRequest
    ? (request as HelpRequest).category
    : (request as AssistanceRequest).category?.name || 'General Aid';

  const categoryIcon = isHelpRequest
    ? (request as HelpRequest).category
    : (request as AssistanceRequest).category?.icon || 'HelpCircle';

  const dateString = isHelpRequest
    ? (request as HelpRequest).postedAt
    : (request as AssistanceRequest).created_at;

  const isUrgent = isHelpRequest
    ? (request as HelpRequest).urgent
    : (request as AssistanceRequest).urgency === 'critical' || (request as AssistanceRequest).urgency === 'high';

  const urgencyLevel = isHelpRequest
    ? ((request as HelpRequest).urgent ? 'critical' : 'medium')
    : (request as AssistanceRequest).urgency;

  const description = !isHelpRequest ? (request as AssistanceRequest).description : undefined;
  const responsesCount = !isHelpRequest ? (request as AssistanceRequest).responses_count : undefined;

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    // If it's already a relative string like '10m ago' or '2h ago'
    if (dateStr.includes('ago') || dateStr.includes('Just now')) return dateStr;
    const diff = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diff)) return dateStr;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <article
      className={`bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs card-hover flex flex-col justify-between focus-within:ring-2 focus-within:ring-teal-700/40 ${className}`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200/70">
              <CategoryIcon iconName={categoryIcon} className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              <span>{categoryName}</span>
            </span>
            {isUrgent && <UrgencyBadge urgency={urgencyLevel} />}
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Title */}
        <Link
          to={`/requests/${id}`}
          className="block group focus:outline-none focus-visible:underline"
        >
          <h3 className="text-base sm:text-lg font-bold text-ink group-hover:text-teal-800 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Optional Description snippet (for full feed) */}
        {!isCompact && description && (
          <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Meta Footer */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-3 truncate">
          <span className="inline-flex items-center gap-1 text-stone-600 truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-stone-400 shrink-0">
            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{timeAgo(dateString)}</span>
          </span>
        </div>

        {/* Action Button */}
        {showOfferButton ? (
          <Link
            to={`/requests/${id}`}
            onClick={(e) => {
              if (onOfferHelp) {
                e.preventDefault();
                onOfferHelp(id);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-coral-50 hover:bg-coral-100 text-coral-700 border border-coral-200/80 transition-all hover:scale-[1.02] shrink-0 focus:outline-none focus:ring-2 focus:ring-coral-500"
          >
            <HandHeart className="w-3.5 h-3.5 text-coral-600" aria-hidden="true" />
            <span>Offer help</span>
          </Link>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            {typeof responsesCount === 'number' && (
              <span className="inline-flex items-center gap-1 text-stone-500 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                <span>{responsesCount}</span>
              </span>
            )}
            <Link
              to={`/requests/${id}`}
              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold focus:outline-none focus-visible:underline"
            >
              <span>Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
