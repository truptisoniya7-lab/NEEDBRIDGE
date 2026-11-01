import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AssistanceRequest, AssistanceResponse } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  LayoutDashboard,
  HandHeart,
  FileText,
  CheckCircle2,
  Trash2,
  Clock,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'offers'>('requests');
  const [dashboardData, setDashboardData] = useState<{
    myRequests: AssistanceRequest[];
    myOffers: AssistanceResponse[];
    stats: {
      totalRequested: number;
      resolvedRequested: number;
      totalOffered: number;
      successfulHelps: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await api.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      await api.updateRequestStatus(requestId, newStatus);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (requestId: string) => {
    if (window.confirm('Delete this request?')) {
      try {
        await api.deleteRequest(requestId);
        fetchDashboard();
      } catch (err: any) {
        alert(err.message || 'Failed to delete request');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm mt-3">Loading your dashboard...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalRequested: 0,
    resolvedRequested: 0,
    totalOffered: 0,
    successfulHelps: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Personal Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{user?.full_name}</span>! Track your posted needs and mutual aid contributions.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Ask for Assistance
        </Link>
      </div>

      {/* Personal KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Requests</span>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalRequested}</div>
          <p className="text-xs text-slate-400 mt-1">Requests created by you</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resolved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{stats.resolvedRequested}</div>
          <p className="text-xs text-slate-400 mt-1">Needs marked as fulfilled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Offers</span>
            <HandHeart className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalOffered}</div>
          <p className="text-xs text-slate-400 mt-1">Times you volunteered to help</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Helps</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">{stats.successfulHelps}</div>
          <p className="text-xs text-slate-400 mt-1">Accepted or completed offers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          My Requests ({dashboardData?.myRequests.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HandHeart className="w-4 h-4" />
          My Offers of Assistance ({dashboardData?.myOffers.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {dashboardData && dashboardData.myRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {dashboardData.myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={req.status} />
                      <UrgencyBadge urgency={req.urgency} />
                      {req.category && (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {req.category.name}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/requests/${req.id}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                    >
                      {req.title}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">{req.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Posted {new Date(req.created_at).toLocaleDateString()}</span>
                      <span>{req.responses_count || 0} offers received</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {req.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}
                    {req.status === 'open' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'in_progress')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Set In Progress
                      </button>
                    )}
                    {req.status === 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'open')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                    <Link
                      to={`/requests/${req.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <p className="text-slate-500 text-sm">You haven't posted any assistance requests yet.</p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
              >
                <PlusCircle className="w-4 h-4" /> Create Your First Request
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {dashboardData && dashboardData.myOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {dashboardData.myOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                          offer.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : offer.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : offer.status === 'declined'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Status: {offer.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Offered on {new Date(offer.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {offer.request && (
                      <Link
                        to={`/requests/${offer.request_id}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                      >
                        {offer.request.title}
                      </Link>
                    )}

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{offer.message}"
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      to={`/requests/${offer.request_id}`}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors inline-block"
                    >
                      View Request &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <p className="text-slate-500 text-sm">You haven't offered assistance on any community requests yet.</p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
              >
                <HandHeart className="w-4 h-4" /> Browse Needs and Help Someone
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
