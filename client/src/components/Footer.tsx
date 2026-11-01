import React from 'react';
import { Link } from 'react-router-dom';
import { HandHeart, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800 pb-16 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-700 flex items-center justify-center text-white">
                <HandHeart className="w-5 h-5 text-teal-200" aria-hidden="true" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">NEEDBRIDGE</span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              <em className="text-stone-200 not-italic font-semibold">"Someone needs it. Someone has it. Let's connect."</em>
              <br />
              A decentralized mutual aid platform empowering students, neighbors, and volunteers to share
              resources, lend a helping hand, and solve everyday challenges together.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Safe Community</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>100% Non-Profit Spirit</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/browse" className="text-stone-400 hover:text-white transition-colors">
                  Browse All Needs
                </Link>
              </li>
              <li>
                <Link to="/browse?urgency=critical" className="text-coral-400 hover:text-coral-300 transition-colors font-medium">
                  Urgent Needs
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-stone-400 hover:text-white transition-colors">
                  Post a Request
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-stone-400 hover:text-white transition-colors">
                  Personal Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Community Principles
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 leading-relaxed">
              <li>&bull; Treat all community members with empathy and dignity</li>
              <li>&bull; Verify mutual safety when coordinating in-person handovers</li>
              <li>&bull; Mark requests as resolved when assistance is completed</li>
              <li>&bull; Keep peer interactions transparent and non-monetized</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>&copy; {new Date().getFullYear()} NEEDBRIDGE. Open community mutual aid.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" aria-hidden="true" /> for community impact.
          </p>
        </div>
      </div>
    </footer>
  );
};
