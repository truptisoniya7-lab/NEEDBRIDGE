import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AssistanceRequest, AssistanceResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  MapPin,
  Clock,
  User,
  ArrowLeft,
  HandHeart,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Phone,
  Mail,
  Send,
} from 'lucide-react';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState<(AssistanceRequest & { responses: AssistanceResponse[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerPhone, setOfferPhone] = useState(user?.phone || '');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      const data = await api.getRequestById(id);
      setRequest(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !offerMessage.trim()) return;

    setSubmittingOffer(true);
    try {
      await api.offerAssistance(id, {
        message: offerMessage.trim(),
        contact_phone: offerPhone.trim() || undefined,
      });
      setShowOfferModal(false);
      setOfferMessage('');
      setActionSuccess('Your offer of assistance was sent successfully! The author has been notified.');
      fetchDetails();
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assistance offer');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await api.updateRequestStatus(id, newStatus);
      setActionSuccess(`Request status updated to ${newStatus}`);
      fetchDetails();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleResponseStatusChange = async (responseId: string, newStatus: string) => {
    try {
      await api.updateResponseStatus(responseId, newStatus);
      setActionSuccess(`Assistance offer status updated to ${newStatus}`);
      fetchDetails();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update offer');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      try {
        await api.deleteRequest(id);
        navigate('/browse');
      } catch (err: any) {
        alert(err.message || 'Failed to delete request');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm mt-3">Loading request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Request Not Found</h2>
        <p className="text-slate-600 text-sm">{error || 'The requested assistance post does not exist or was removed.'}</p>
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === request.user_id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all requests
      </Link>

      {/* Success alert */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Request Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UrgencyBadge urgency={request.urgency} />
                <StatusBadge status={request.status} />
              </div>
              {request.category && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border ${request.category.color}`}>
                  <CategoryIcon iconName={request.category.icon} className="w-4 h-4" />
                  {request.category.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {request.title}
            </h1>

            {/* Location & Timestamp */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pb-4 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-blue-600" />
                {request.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Posted on {new Date(request.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>

            {/* Optional Image */}
            {request.image_url && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-96">
                <img
                  src={request.image_url}
                  alt={request.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Full Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Need Description
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {request.description}
              </p>
            </div>

            {/* Contact Information */}
            {request.contact_info && (
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Preferred Contact Coordinate
                </h4>
                <p className="text-sm text-blue-800 font-medium">{request.contact_info}</p>
              </div>
            )}
          </div>

          {/* Assistance Offers Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Offers of Assistance ({request.responses?.length || 0})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Community members offering to help with this request
                </p>
              </div>

              {!isAuthor && request.status !== 'resolved' && (
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else {
                      setShowOfferModal(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <HandHeart className="w-4 h-4" />
                  Offer Help
                </button>
              )}
            </div>

            {request.responses && request.responses.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {request.responses.map((res) => (
                  <div key={res.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={res.helper?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={res.helper?.full_name || 'Volunteer'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {res.helper?.full_name || 'Community Volunteer'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Offered {new Date(res.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Offer Status Tag */}
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                          res.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : res.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : res.status === 'declined'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                      {res.message}
                    </p>

                    {res.contact_phone && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone: {res.contact_phone}
                      </p>
                    )}

                    {/* Author Action buttons for this response */}
                    {isAuthor && res.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleResponseStatusChange(res.id, 'accepted')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold"
                        >
                          Accept Offer
                        </button>
                        <button
                          onClick={() => handleResponseStatusChange(res.id, 'declined')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {isAuthor && res.status === 'accepted' && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleResponseStatusChange(res.id, 'completed')}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Help as Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">No offers of assistance submitted yet.</p>
                {!isAuthor && (
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Be the first neighbor or volunteer to lend a hand!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Author Card & Action Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Request Posted By
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={request.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={request.author?.full_name || 'User'}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
              />
              <div>
                <h4 className="font-semibold text-slate-900 text-base">{request.author?.full_name || 'Community Member'}</h4>
                <p className="text-xs text-slate-500 capitalize">{request.author?.role || 'User'}</p>
              </div>
            </div>

            {request.author?.bio && (
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{request.author.bio}"
              </p>
            )}

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              {request.author?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{request.author.location}</span>
                </div>
              )}
              {request.author?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{request.author.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</h3>

            {isAuthor ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  You are the creator of this request. Manage its progress or mark it as resolved.
                </p>

                {request.status !== 'resolved' && (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                )}

                {request.status === 'open' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Set to In Progress
                  </button>
                )}

                {request.status === 'resolved' && (
                  <button
                    onClick={() => handleStatusChange('open')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Reopen Request
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Can you fulfill or support this need? Click below to send an offer directly to{' '}
                  <span className="font-semibold">{request.author?.full_name || 'the requester'}</span>.
                </p>

                {request.status === 'resolved' ? (
                  <div className="p-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-medium text-center">
                    This request has been resolved by the community!
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else {
                        setShowOfferModal(true);
                      }
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    <HandHeart className="w-5 h-5" />
                    Offer Assistance
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offer Assistance Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600">
                <HandHeart className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-lg">Offer Assistance</h3>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  How can you help? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Describe your offer: e.g. 'I have a spare textbook and can meet you at the library tomorrow at 3 PM...'"
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Phone / Contact Details (Optional)
                </label>
                <input
                  type="text"
                  value={offerPhone}
                  onChange={(e) => setOfferPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834 or WhatsApp"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {submittingOffer ? 'Submitting...' : 'Send Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
