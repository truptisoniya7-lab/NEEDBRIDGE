import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ImpactStats } from '../types';
import { HeartHandshake, CheckCircle2, Users, Flame } from 'lucide-react';

export const ImpactBanner: React.FC = () => {
  const [stats, setStats] = useState<ImpactStats>({
    totalRequests: 4,
    resolvedRequests: 1,
    activeRequests: 3,
    activeHelpers: 3,
    totalCategories: 7,
    resolutionRate: 25,
  });

  useEffect(() => {
    api
      .getImpactStats()
      .then((data) => setStats(data))
      .catch((err) => console.warn('Could not fetch real-time impact stats:', err));
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -top-12 w-48 h-48 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="max-w-2xl mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            Community Mutual Aid Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Together, We Bridge the Gap
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-1">
            Every request resolved is a neighbor supported, a student empowered, and a stronger community built.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
              <Flame className="w-4 h-4 text-amber-300" /> Total Needs
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold">{stats.totalRequests}</div>
            <div className="text-xs text-blue-200 mt-0.5">Community requests posted</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Resolved
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold">{stats.resolvedRequests}</div>
            <div className="text-xs text-blue-200 mt-0.5">{stats.resolutionRate}% resolution rate</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
              <Users className="w-4 h-4 text-sky-300" /> Volunteers & Helpers
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold">{stats.activeHelpers}</div>
            <div className="text-xs text-blue-200 mt-0.5">Ready to assist right now</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
              <HeartHandshake className="w-4 h-4 text-rose-300" /> Categories
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold">{stats.totalCategories}</div>
            <div className="text-xs text-blue-200 mt-0.5">Diverse support areas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
