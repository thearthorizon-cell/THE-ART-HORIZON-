import React from 'react';
import { useStudio } from '../context/StudioContext';
import { OFFICIAL_ASSETS } from '../data/siteConfig';
import { Sparkles, CheckCircle2, ArrowRight, Award, Palette, Heart, Users, Compass, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo, openEnquiryModal, openFreeDemoModal } = useStudio();

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85D38]/10 border border-[#B85D38]/20 text-[#8C4A2D] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B85D38]" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Where Creativity Finds Its Horizon.
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
          The Art Horizon was founded in Indore with a single enduring conviction: true artistry is not an elusive
          talent given to a chosen few, but a discipline of patient observation, refined hand-eye coordination, and deep
          love for creative expression.
        </p>
      </section>

      {/* Main Narrative & Atelier Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Moving Beyond Mechanical Drawing into True Sight
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              In modern education, art is frequently reduced to tracing stencils, following quick assembly-line tricks, or
              copying superficial templates. At <strong className="text-stone-900">The Art Horizon</strong>, we take
              inspiration from the classical European atelier tradition fused with India's deep aesthetic heritage
              (Chitra Vidya).
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We teach our students—whether a 6-year-old in Indore or a high-schooler in New York—how to look at the world
              as artists. We dissect complex objects into basic forms, observe how light wraps around curved surfaces,
              understand why warm lights produce cool shadows, and harness the kinetic energy of confident pencil
              strokes.
            </p>

            <div className="p-6 bg-stone-100/80 border-l-4 border-[#B85D38] rounded-r-sm space-y-2">
              <p className="font-serif italic text-stone-800 text-lg">
                "We don't teach students to draw things. We teach students to see the light, shadow, and truth of things.
                Once you can see, the hand naturally follows."
              </p>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8C4A2D]">
                — Vikas Gothi, Founder & Master Artist
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={OFFICIAL_ASSETS.oilPortrait}
                  alt="Classical Oil Portrait on Linen Canvas"
                  className="rounded-2xl aspect-[3/4] object-cover shadow-md"
                />
                <div className="bg-white p-4 border border-stone-200 rounded-2xl">
                  <span className="text-xs font-bold text-stone-900 block">Observational Discipline</span>
                  <span className="text-[11px] text-stone-500">Still life, casts & live sitters</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="bg-[#1C1917] text-white p-4 rounded-2xl border border-stone-800">
                  <span className="text-xs font-bold text-amber-300 block">Archival Integrity</span>
                  <span className="text-[11px] text-stone-300">European cotton papers & lightfast pigments</span>
                </div>
                <img
                  src={OFFICIAL_ASSETS.charcoalPortrait}
                  alt="Hyperrealistic Charcoal Fine Art Portrait"
                  className="rounded-2xl aspect-[3/4] object-cover shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pedagogical Pillars */}
      <section className="bg-stone-100/70 border-y border-[#E7DFD5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
              Methodology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              The Four Pillars of Learning at The Art Horizon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center font-bold font-serif text-lg">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Foundational Anatomy & Form</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Understanding spatial geometry, planar breakdowns (Loomis, Reilly methods), and the anatomical skeletal
                structure beneath surfaces.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center font-bold font-serif text-lg">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Tonal Value Mastery</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Color gets the credit, but value does all the work. We train the eye to accurately calibrate the 9-step
                grayscale before touching full color.
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center font-bold font-serif text-lg">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Color Chemistry & Harmony</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mixing from limited split-primary palettes, temperature balances, glazing layers, and handling varied
                binders (gum arabic, acrylic polymer, linseed oil).
              </p>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center font-bold font-serif text-lg">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Creative Voice & Exhibitions</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Technique is the vehicle; personal imagination is the destination. We encourage unique storytelling,
                studio critique, and annual graduation shows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Studio Environment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-white p-8 sm:p-12 rounded-sm border border-stone-800 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E8926F]">
              Studio Sanctuary in Indore
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              An Inspiring Physical Atelier
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Situated at 266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore, The Art Horizon studio offers an inviting, serene sanctuary away from city
              noise. Equipped with professional wooden easels, daylight color-balanced lighting, plaster cast models, and
              archival material supplies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-800">
            <div>
              <div className="font-serif text-2xl font-bold text-[#E8926F]">Intimate Batches</div>
              <p className="text-xs text-stone-400 mt-1">
                Strict limits of 6 to 8 students per batch ensure personalized guidance at every table.
              </p>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#E8926F]">All Age Groups</div>
              <p className="text-xs text-stone-400 mt-1">
                Dedicated age-appropriate modules for juniors (5–11), teens (12–17), and adult hobbyists/practitioners.
              </p>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#E8926F]">Global Outreach</div>
              <p className="text-xs text-stone-400 mt-1">
                Virtual classroom equipped with dual overhead cameras streaming live to US, UK, and UAE students.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => openFreeDemoModal()}
              className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Book a Free Studio Tour / Trial Class
            </button>
            <button
              onClick={() => navigateTo('art-classes')}
              className="border border-stone-600 hover:border-stone-400 text-stone-200 px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Browse Available Classes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
