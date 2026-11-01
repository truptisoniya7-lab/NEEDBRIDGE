import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Compass, HeartHandshake } from 'lucide-react';

export const CTABanner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Call to action">
      <div className="bg-teal-900 text-white rounded-2xl p-8 sm:p-14 shadow-md relative overflow-hidden">
        {/* Subtle warm glow accents - not blue-purple gradient */}
        <div
          className="absolute -right-16 -bottom-16 w-72 h-72 bg-teal-700/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/4 -top-16 w-56 h-56 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-800/80 text-teal-100 border border-teal-700/80">
            <HeartHandshake className="w-3.5 h-3.5 text-coral-400" aria-hidden="true" />
            <span>Join Our Mutual Aid Circle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Your help can close someone's request today.
          </h2>

          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl">
            Whether lending a textbook, offering a ride to a clinic, or sharing grocery pantry items—every
            small act strengthens the fabric of our community.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-coral-600 hover:bg-coral-500 text-white shadow-sm transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-coral-400 focus:ring-offset-2 focus:ring-offset-teal-900"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Post a request</span>
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-900"
            >
              <Compass className="w-4 h-4 text-teal-300" aria-hidden="true" />
              <span>Browse requests</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
