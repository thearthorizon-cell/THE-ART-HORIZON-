import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Sparkles, Award, Palette, Heart, CheckCircle2, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';

import { OFFICIAL_ASSETS } from '../data/siteConfig';

export const FounderPage: React.FC = () => {
  const { openEnquiryModal, openFreeDemoModal, cmsState } = useStudio();
  const { founder } = cmsState;

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Header Profile Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border-4 border-[#F5B700] shadow-2xl">
                <img
                  src={founder.portraitImage}
                  alt={`${founder.name}, ${founder.title} of The Art Horizon`}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:absolute -bottom-6 -right-3 sm:-right-5 bg-[#0B1E3F] text-white p-4 sm:p-5 rounded-sm border border-stone-800 shadow-xl max-w-xs">
                <span className="font-serif text-xl sm:text-2xl font-bold block text-[#F5B700]">
                  {founder.name}
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-200 font-bold block mt-0.5">
                  {founder.title}
                </span>
                <p className="text-[11px] text-stone-300 mt-1">
                  Master in Oil, Acrylic, Watercolor, Charcoal Realism & Wall Murals
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 pt-4 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85D38]/10 border border-[#B85D38]/20 text-[#8C4A2D] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#B85D38]" />
              <span>Founder Spotlight</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight">
              A Life Devoted to the Mastery of Fine Art
            </h1>

            <p className="font-serif italic text-xl text-[#8C4A2D]">
              {founder.quote}
            </p>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {founder.bioParagraph1}
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {founder.bioParagraph2}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => openEnquiryModal('portrait-commissions', 'Commission a Portrait by Vikas Gothi')}
                className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-7 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Commission a Portrait
              </button>
              <button
                onClick={() => openFreeDemoModal()}
                className="border border-stone-800 text-stone-900 hover:text-[#B85D38] hover:border-[#B85D38] px-7 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Join a Mentorship Batch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Mastery */}
      <section className="bg-stone-100/70 border-y border-[#E7DFD5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
              Artistic Disciplines
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Vikas Gothi’s Signature Specializations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded bg-[#D82828]/10 text-[#D82828] flex items-center justify-center font-bold font-serif">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Oil & Acrylic Canvas Painting</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Classical Belgian linen oil paintings with translucent glazes, as well as textured contemporary acrylic
                canvases tailored for fine residences and gallery collectors.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center font-bold font-serif">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Luminous Watercolor Art</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Atmospheric transparency, delicate wet-on-wet pigments, botanical illustrations, and poetic landscapes
                on archival 300 GSM cotton rag paper.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded bg-[#0B1E3F]/10 text-[#0B1E3F] flex items-center justify-center font-bold font-serif">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Charcoal & Graphite Realism</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Known for bringing lifelike breath and psychological depth to portraiture using fine European willow and
                powdered Nitram charcoal with anatomical accuracy.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded bg-[#F5B700]/20 text-[#B85D38] flex items-center justify-center font-bold font-serif">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Wall Murals & Grand Rangoli</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pioneering record-scale traditional and 3D optical illusion rangolis and architectural wall murals for
                festivals, luxury hospitality, and cafes across India.
              </p>
            </div>
          </div>

          {/* Real Studio Murals in Action */}
          <div className="pt-6">
            <h3 className="font-serif text-xl font-bold text-stone-900 text-center mb-6">
              Vikas Gothi at Work: Live Murals & Creations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-3 rounded-sm border border-stone-200 shadow-md">
                <div className="aspect-[4/3] rounded-xs overflow-hidden bg-stone-900">
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-10-08_at_6.22.13_PM__1__96f6997f.jpeg"
                    alt="Vikas Gothi painting musical violin wall mural"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-3">
                  <span className="font-serif text-base font-bold text-stone-900 block">
                    Symphony in Color Wall Mural
                  </span>
                  <p className="text-xs text-stone-500">
                    Handcrafted by Vikas Gothi with vibrant acrylics, swirling musical staves, and rich textures.
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-sm border border-stone-200 shadow-md">
                <div className="aspect-[4/3] rounded-xs overflow-hidden bg-stone-900">
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-10-08_at_6.22.03_PM_bb87e480.jpeg"
                    alt="Vikas Gothi painting sacred mandala wall mural"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-3">
                  <span className="font-serif text-base font-bold text-stone-900 block">
                    Terracotta Sacred Mandala Mural
                  </span>
                  <p className="text-xs text-stone-500">
                    Fine brushwork and rotational geometry in natural terracotta pigments on interior walls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Message to Parents and Aspiring Artists */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200 p-8 sm:p-12 rounded-sm shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#B85D38] text-white flex items-center justify-center font-serif text-lg font-bold">
              VG
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">A Message from Vikas Gothi</h3>
              <p className="text-xs text-stone-500">To parents, students, and art lovers considering our academy</p>
            </div>
          </div>

          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-6">
            <p>
              "When a student walks into The Art Horizon—whether they are five years old or sixty-five—they often carry
              fear. Fear of making a wrong line, fear of being judged, or the belief that they lack a 'god-gifted' talent.
            </p>
            <p>
              My first responsibility is to dismantle that fear. In our studio, an eraser is not a badge of shame; it is
              a creative drawing tool for discovering light. Every master artist you revere once struggled with basic
              perspective and muddy color mixing.
            </p>
            <p>
              With proper guidance, structured exercises, and honest encouragement, anyone can learn to draw and paint
              with confidence. That is my personal promise to every family that entrusts their artistic journey to us."
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-serif font-bold text-stone-900 text-lg block">Vikas Gothi</span>
              <span className="text-xs text-[#8C4A2D] font-medium">Founder, The Art Horizon (Indore, India)</span>
            </div>
            <button
              onClick={() => openEnquiryModal('general', 'Direct Consultation with Vikas Gothi')}
              className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Request 1-on-1 Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
