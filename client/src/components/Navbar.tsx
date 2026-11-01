import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HandHeart,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Compass,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Tagline */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-xl p-1"
            aria-label="NEEDBRIDGE Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-800 transition-colors">
              <HandHeart className="w-5 h-5 text-teal-100" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#14201F] tracking-tight leading-none font-sans">
                NEEDBRIDGE
              </span>
              <span className="text-[11px] tracking-wide text-stone-500 font-medium mt-0.5">
                Community Mutual Aid
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link
              to="/browse"
              className="text-sm font-semibold text-stone-700 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-md px-1 py-0.5"
            >
              Browse
            </Link>
            <Link
              to="/browse?urgency=critical"
              className="text-sm font-semibold text-stone-700 hover:text-coral-700 transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-coral-500 rounded-md px-1 py-0.5"
            >
              <span>Urgent</span>
              <span className="w-2 h-2 rounded-full bg-coral-600 animate-pulse" aria-hidden="true" />
            </Link>
            <a
              href="/#how-it-works"
              onClick={scrollToHowItWorks}
              className="text-sm font-semibold text-stone-700 hover:text-teal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-md px-1 py-0.5"
            >
              How it works
            </a>
          </nav>

          {/* Right Action & Auth Area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-700/20"
                  />
                  <span className="text-sm font-semibold text-stone-800 max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-stone-200/90 py-2 text-sm z-50 animate-in fade-in zoom-in-95"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="font-semibold text-stone-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 hover:text-teal-800"
                      role="menuitem"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-700" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 hover:text-teal-800"
                      role="menuitem"
                    >
                      <User className="w-4 h-4 text-teal-700" aria-hidden="true" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-stone-700 hover:text-teal-800 px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700 rounded-lg"
              >
                Log in
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-teal-700 text-white hover:bg-teal-800 shadow-xs transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-800 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4 text-teal-200" aria-hidden="true" />
              <span>Post a request</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/create"
              className="p-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-xs"
              aria-label="Post a request"
            >
              <PlusCircle className="w-5 h-5" aria-hidden="true" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAFAF7] px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-teal-800"
          >
            Browse
          </Link>
          <Link
            to="/browse?urgency=critical"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-base font-semibold text-coral-700"
          >
            <span>Urgent Needs</span>
            <span className="w-2 h-2 rounded-full bg-coral-600 animate-pulse" />
          </Link>
          <a
            href="/#how-it-works"
            onClick={(e) => {
              setMobileMenuOpen(false);
              scrollToHowItWorks(e);
            }}
            className="block py-2 text-base font-semibold text-stone-800 hover:text-teal-800"
          >
            How it works
          </a>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-stone-800"
                >
                  Dashboard ({user.full_name})
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-stone-800"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-800 bg-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-teal-700 text-white text-sm font-bold"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
