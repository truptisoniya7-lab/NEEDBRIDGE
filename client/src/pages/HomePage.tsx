import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AssistanceRequest, HelpRequestCategory } from '../types';
import { RequestCard } from '../components/RequestCard';
import { ImpactStats } from '../components/ImpactStats';
import { HowItWorks } from '../components/HowItWorks';
import { UrgentNeeds } from '../components/UrgentNeeds';
import { WhoItsFor } from '../components/WhoItsFor';
import { CTABanner } from '../components/CTABanner';
import {
  Search,
  Sparkles,
  BookOpen,
  Utensils,
  Car,
  GraduationCap,
  Wrench,
  Heart,
  PlusCircle,
  Inbox,
} from 'lucide-react';

interface QuickCategoryChip {
  name: string;
  category: HelpRequestCategory;
  icon: React.ReactNode;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequests, setActiveRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick category chips for Hero filter row
  const quickCategories: QuickCategoryChip[] = [
    { name: 'Textbooks', category: 'Textbooks', icon: <BookOpen className="w-3.5 h-3.5" aria-hidden="true" /> },
    { name: 'Food', category: 'Food', icon: <Utensils className="w-3.5 h-3.5" aria-hidden="true" /> },
    { name: 'Rides', category: 'Rides', icon: <Car className="w-3.5 h-3.5" aria-hidden="true" /> },
    { name: 'Tutoring', category: 'Tutoring', icon: <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" /> },
    { name: 'Repairs', category: 'Repairs', icon: <Wrench className="w-3.5 h-3.5" aria-hidden="true" /> },
  ];

  useEffect(() => {
    api
      .getRequests({ status: 'all' })
      .then((reqs) => {
        setActiveRequests(reqs);
      })
      .catch((err) => console.error('Error fetching real requests:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const handleChipClick = (categoryName: string) => {
    navigate(`/browse?search=${encodeURIComponent(categoryName)}`);
  };

  const handleOfferHelp = (requestId: string) => {
    navigate(`/requests/${requestId}`);
  };

  return (
    <div className="space-y-4 sm:space-y-8 pb-16">
      {/* 2. Hero Section (Two Columns, Stacked on Mobile) */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines, Search Bar & Category Chips */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Pill label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/80 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                <span>Peer-to-Peer Mutual Aid Network</span>
              </div>

              {/* Balanced Headline with Accent Line */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#14201F] leading-[1.12]">
                <span className="block">Someone needs it.</span>
                <span className="block">Someone has it.</span>
                <span className="block text-coral-600 font-extrabold mt-1">Let's connect.</span>
              </h1>

              {/* One-line subtext */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-xl">
                A community-driven platform connecting students, volunteers, and neighbors to share
                vital resources without monetization barriers.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="relative flex items-center shadow-xs rounded-2xl bg-white border border-stone-300 p-1.5 focus-within:ring-2 focus-within:ring-teal-700 focus-within:border-teal-700 transition-all">
                  <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for textbooks, grocery aid, rides, tutoring, repairs…"
                    aria-label="Search community requests"
                    className="w-full px-3 py-2.5 text-stone-900 placeholder-stone-400 text-sm focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm transition-all shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
                  >
                    Find needs
                  </button>
                </div>
              </form>

              {/* Row of Category Chips (Quick Filters) */}
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Quick Category Filters:
                </p>
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category quick filters">
                  {quickCategories.map((chip) => (
                    <button
                      key={chip.name}
                      type="button"
                      onClick={() => handleChipClick(chip.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-stone-700 hover:text-teal-800 border border-stone-200 hover:border-teal-300 shadow-xs transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-700"
                    >
                      <span className="text-teal-700">{chip.icon}</span>
                      <span>{chip.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Real Community Requests Stack */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div
                className="absolute inset-0 bg-teal-100/50 rounded-3xl blur-2xl -z-10 pointer-events-none"
                aria-hidden="true"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Live Community Activity
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-medium">Real-time needs</span>
                </div>

                {/* Staggered Floating Cards or Empty State */}
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-32 bg-white rounded-2xl border border-stone-200 animate-pulse" />
                    ))}
                  </div>
                ) : activeRequests.length > 0 ? (
                  <div className="relative space-y-3.5">
                    {activeRequests.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.id}
                        className={`transition-all ${
                          idx === 0
                            ? 'animate-float'
                            : idx === 1
                            ? 'animate-floatDelayed sm:ml-4'
                            : 'sm:ml-8'
                        }`}
                      >
                        <RequestCard
                          request={item}
                          showOfferButton={true}
                          onOfferHelp={handleOfferHelp}
                          isCompact={true}
                          className="border-stone-200/90 shadow-sm hover:shadow-md"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                      <Inbox className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-stone-800 text-base">Be the first to post a request</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      There are no active requests posted yet. Post your need or share what you can offer to start the circle.
                    </p>
                    <Link
                      to="/create"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Post a request</span>
                    </Link>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <p className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-coral-600 fill-coral-600" aria-hidden="true" />
                    <span>Empowering neighbors through direct mutual aid.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ImpactStats Strip (Count-Up Animation on Scroll) */}
      <ImpactStats />

      {/* 4. HowItWorks Section (3 Steps) */}
      <HowItWorks />

      {/* 5. UrgentNeeds Grid (Time-Sensitive Needs) */}
      <UrgentNeeds requests={activeRequests} loading={loading} />

      {/* 6. WhoItsFor Section (4 Tiles) */}
      <WhoItsFor />

      {/* 7. CTABanner ("Your help can close someone's request today") */}
      <CTABanner />
    </div>
  );
};
