import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { WORKSHOPS_DATA } from '../data/workshopsData';
import { Sparkles, CheckCircle2, ArrowRight, Clock, PackageCheck, Users, Info, Calendar } from 'lucide-react';

export const WorkshopsPage: React.FC = () => {
  const { openEnquiryModal } = useStudio();
  const [activeCategory, setActiveCategory] = useState<'all' | 'resin' | 'lippan' | 'clay' | 'diy' | 'camps' | 'corporate'>('all');

  const filteredWorkshops =
    activeCategory === 'all'
      ? WORKSHOPS_DATA
      : WORKSHOPS_DATA.filter((w) => w.category === activeCategory);

  return (
    <div className="space-y-20 py-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85D38]/10 border border-[#B85D38]/20 text-[#8C4A2D] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B85D38]" />
          <span>Tactile & Meditative Art Experiences</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Creative Art Workshops in Indore
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
          Unwind, disconnect from screens, and craft your own statement art piece in our warm studio setting. All
          materials, safety equipment, and guidance are fully included.
        </p>

        {/* Pricing notice */}
        <div className="max-w-xl mx-auto bg-[#F4EDE4] border border-[#E7DFD5] p-3 rounded-sm text-xs text-stone-700 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#B85D38] shrink-0" />
          <span>
            <strong>Workshop Seats & Pricing:</strong> Available upon request. Batch capacities are kept strictly small
            to provide individual table-side assistance.
          </span>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
          {[
            { id: 'all', label: 'All Workshops' },
            { id: 'resin', label: 'Resin Art' },
            { id: 'lippan', label: 'Lippan Art (Mud & Mirror)' },
            { id: 'clay', label: 'Pottery & Clay Art' },
            { id: 'diy', label: 'DIY Texture on Canvas' },
            { id: 'camps', label: 'Summer Camps' },
            { id: 'corporate', label: 'Corporate & Café' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === tab.id
                  ? 'bg-[#B85D38] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map((ws) => (
            <div
              key={ws.id}
              className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                  <img
                    src={ws.image}
                    alt={ws.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1917]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    {ws.level}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#B85D38] font-bold">
                      {ws.duration}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#B85D38] transition-colors">
                      {ws.title}
                    </h2>
                  </div>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {ws.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      What You Learn & Make:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {ws.whatYouLearn.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B85D38] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between gap-4 mt-4">
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Take Home Artwork</span>
                </div>

                <button
                  onClick={() => openEnquiryModal('workshops', ws.title)}
                  className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Request Batch Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate & Private Studio Booking Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-white p-8 sm:p-12 rounded-sm border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E8926F]">
              Corporate & Private Gatherings
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Host a Private Art Jam or Team Building Session
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We arrange bespoke weekend workshops for corporate teams, birthday celebrations, and café art mixers in
              Indore with custom themes, refreshments, and guided instruction.
            </p>
          </div>
          <button
            onClick={() => openEnquiryModal('workshops', 'Corporate Art Jam / Private Group Workshop')}
            className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-7 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
          >
            Inquire for Private Group
          </button>
        </div>
      </section>
    </div>
  );
};
