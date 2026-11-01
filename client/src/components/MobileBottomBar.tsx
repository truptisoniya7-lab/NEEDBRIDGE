import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, PlusCircle, LayoutDashboard, Home } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-t border-stone-200/90 py-1.5 px-4 shadow-lg"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            isActive('/') ? 'text-teal-800 font-bold' : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Browse */}
        <Link
          to="/browse"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            isActive('/browse') ? 'text-teal-800 font-bold' : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
          aria-label="Browse requests"
        >
          <Compass className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px]">Browse</span>
        </Link>

        {/* Post (Primary center button) */}
        <Link
          to="/create"
          className="flex flex-col items-center -mt-4 group"
          aria-label="Post a request"
        >
          <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:bg-teal-800 transition-transform group-hover:scale-105">
            <PlusCircle className="w-6 h-6 text-teal-100" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-teal-800 mt-0.5">Post</span>
        </Link>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
            isActive('/dashboard') ? 'text-teal-800 font-bold' : 'text-stone-500 hover:text-stone-800 font-medium'
          }`}
          aria-label="My Dashboard"
        >
          <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px]">Dashboard</span>
        </Link>
      </div>
    </nav>
  );
};
