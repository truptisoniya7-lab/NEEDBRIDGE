import React from 'react';
import { PlusCircle, Handshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

export const HowItWorks: React.FC = () => {
  const steps: HowItWorksStep[] = [
    {
      number: '01',
      title: 'Post your need',
      tag: '100% Free & Open',
      description:
        'Describe what you need in plain words—from university textbooks to emergency grocery staples or car rides. Set a safe location and urgency tier.',
      icon: <PlusCircle className="w-6 h-6 text-teal-700" aria-hidden="true" />,
    },
    {
      number: '02',
      title: 'Connect with helpers',
      tag: 'Direct & Neighborly',
      description:
        'Local students, neighbors, and volunteers review your request and send direct offers of assistance with their coordinates.',
      icon: <Handshake className="w-6 h-6 text-coral-600" aria-hidden="true" />,
    },
    {
      number: '03',
      title: 'Resolve & give back',
      tag: 'Verified Mutual Aid',
      description:
        'Once help is received, mark your post as resolved. Celebrate community support and pay it forward whenever you have spare capacity.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-700" aria-hidden="true" />,
    },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/80 uppercase tracking-wider">
          Simple & Frictionless
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14201F] tracking-tight">
          How NEEDBRIDGE works
        </h2>
        <p className="text-sm sm:text-base text-stone-600">
          No monetization, no bureaucratic intake. Just direct, neighbor-to-neighbor assistance in three steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white rounded-2xl border border-stone-200/90 p-7 shadow-xs card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-stone-300 font-mono">
                  {step.number}
                </span>
              </div>
              <div className="inline-block text-[11px] font-bold text-teal-800 bg-teal-50/80 px-2 py-0.5 rounded-md mb-2">
                {step.tag}
              </div>
              <h3 className="text-xl font-bold text-[#14201F] mb-2">{step.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{step.description}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center text-xs font-semibold text-teal-800">
              <span>Step {step.number} of 03</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-700"
        >
          <span>Get started in 60 seconds</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
