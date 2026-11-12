import React from 'react';
import { useStudio } from '../context/StudioContext';
import { SERVICES_DATA } from '../data/servicesData';
import { Sparkles, CheckCircle2, ArrowRight, Building2, Palette, Sparkle, Layers, Info } from 'lucide-react';

export const CommercialProjectsPage: React.FC = () => {
  const { openEnquiryModal, openLightbox } = useStudio();

  const commercialServices = SERVICES_DATA.filter((s) => s.category !== 'portraits');

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85D38]/10 border border-[#B85D38]/20 text-[#8C4A2D] text-xs font-semibold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-[#B85D38]" />
          <span>Architecture & Event Art</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Commercial Art Projects & Grand Installations
        </h1>
        <p className="text-stone-600 max-w-3xl mx-auto text-base sm:text-lg">
          Transforming commercial spaces, hospitality lobbies, luxury villas, and marquee cultural events through
          hand-painted wall murals, record-scale rangolis, and curated art suites.
        </p>

        {/* Pricing notice */}
        <div className="max-w-xl mx-auto bg-[#F4EDE4] border border-[#E7DFD5] p-3 rounded-sm text-xs text-stone-700 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#B85D38] shrink-0" />
          <span>
            <strong>Project Proposals:</strong> Commercial scopes vary widely by square footage and surface prep.
            Contact us for custom moodboards, site surveys, and turnkey pricing.
          </span>
        </div>
      </section>

      {/* Commercial Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {commercialServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-[#1C1917]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    {service.category.toUpperCase()}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {service.title}
                  </h2>
                  <p className="font-serif italic text-stone-600 text-sm">{service.subtitle}</p>
                  <p className="text-stone-700 text-sm leading-relaxed">{service.description}</p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Scope & Capabilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {service.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B85D38] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 flex items-center justify-between gap-4 mt-4">
                <div>
                  <span className="text-xs text-stone-500 block">Project Costing</span>
                  <span className="text-sm font-semibold text-stone-900">Contact Us for Pricing</span>
                </div>

                <button
                  onClick={() => openEnquiryModal('commercial-projects', service.title)}
                  className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Discuss Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Commercial Workflow */}
      <section className="bg-stone-100/70 border-y border-[#E7DFD5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
              Execution Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Turnkey Professional Project Delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-2">
              <span className="font-serif text-2xl font-bold text-[#B85D38]">01</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Site Assessment</h3>
              <p className="text-xs text-stone-600">
                Detailed surface measurements, lighting conditions analysis, and interior aesthetic synchronization.
              </p>
            </div>
            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-2">
              <span className="font-serif text-2xl font-bold text-[#B85D38]">02</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Digital Concept Proof</h3>
              <p className="text-xs text-stone-600">
                Full-color 2D/3D mockups placed on your actual room or floor photos before any pigment touches the wall.
              </p>
            </div>
            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-2">
              <span className="font-serif text-2xl font-bold text-[#B85D38]">03</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Meticulous Execution</h3>
              <p className="text-xs text-stone-600">
                Executed by Vikas Gothi and trained muralists with non-toxic, odorless, weatherproof artist mediums.
              </p>
            </div>
            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-2">
              <span className="font-serif text-2xl font-bold text-[#B85D38]">04</span>
              <h3 className="font-serif text-lg font-bold text-stone-900">Protective Sealing</h3>
              <p className="text-xs text-stone-600">
                Durable UV and dust-resistant clear varnishes ensuring colors stay vibrant for years with simple wipe-down care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-[#1C1917] text-white p-8 sm:p-12 rounded-sm border border-stone-800 space-y-4">
          <h3 className="font-serif text-3xl font-bold text-white">
            Have an Architectural Space or Grand Celebration in Mind?
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
            From Indore and Madhya Pradesh to national destinations, our team brings creativity, reliability, and
            unmatched artistic finish to every project.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openEnquiryModal('commercial-projects', 'Architectural / Event Art Project')}
              className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Request Commercial Consultation & Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
