import React from 'react';
import { GraduationCap, Building2, HeartHandshake, Home, Check } from 'lucide-react';

interface AudienceTile {
  title: string;
  badge: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
}

export const WhoItsFor: React.FC = () => {
  const tiles: AudienceTile[] = [
    {
      title: 'College & Uni Students',
      badge: 'Academic Support',
      description:
        'Overcome semester hurdles without spending hundreds on textbooks, hardware, or tutoring.',
      bullets: [
        'Borrow coursebooks & TI-84 calculators',
        'Peer exam tutoring & project help',
        'Safe campus handover locations',
      ],
      icon: <GraduationCap className="w-6 h-6 text-teal-700" aria-hidden="true" />,
    },
    {
      title: 'Local NGOs & Organizers',
      badge: 'Grassroots Relief',
      description:
        'Bridge gaps between institutional aid and immediate doorstep emergency needs.',
      bullets: [
        'Coordinate surplus food & pantry distribution',
        'Identify urgent community pockets',
        'Transparent mutual aid verification',
      ],
      icon: <Building2 className="w-6 h-6 text-amber-700" aria-hidden="true" />,
    },
    {
      title: 'Community Volunteers',
      badge: 'Lend Capacity',
      description:
        'Put idle resources, vehicles, repair skills, or free hours to high-impact neighborly use.',
      bullets: [
        'Flexible schedule, no bureaucracy',
        'Direct connection with real people',
        'Track personal volunteer impact',
      ],
      icon: <HeartHandshake className="w-6 h-6 text-coral-600" aria-hidden="true" />,
    },
    {
      title: 'Local Neighbors & Families',
      badge: 'Neighborhood Care',
      description:
        'When unexpected life setbacks strike, find empathetic support without stigma or loans.',
      bullets: [
        'Emergency ride to medical appointments',
        'Household tool & appliance borrowing',
        'Temporary staple pantry assistance',
      ],
      icon: <Home className="w-6 h-6 text-emerald-700" aria-hidden="true" />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="who-its-for-title">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200 uppercase tracking-wider">
          Built For Mutual Aid
        </span>
        <h2 id="who-its-for-title" className="text-3xl sm:text-4xl font-extrabold text-[#14201F] tracking-tight">
          Who NEEDBRIDGE is for
        </h2>
        <p className="text-sm sm:text-base text-stone-600">
          Whether you are a student facing exams, an NGO coordinator, or a neighbor with an extra hour to spare.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.title}
            className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs card-hover flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center mb-4">
                {tile.icon}
              </div>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                {tile.badge}
              </span>
              <h3 className="text-lg font-bold text-[#14201F] mt-2 mb-2">{tile.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                {tile.description}
              </p>
            </div>

            <ul className="space-y-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
              {tile.bullets.map((b) => (
                <li key={b} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
