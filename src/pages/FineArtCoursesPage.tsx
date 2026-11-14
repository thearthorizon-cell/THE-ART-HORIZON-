import React from 'react';
import { useStudio } from '../context/StudioContext';
import { OFFICIAL_ASSETS } from '../data/siteConfig';
import { Sparkles, CheckCircle2, ArrowRight, Award, Palette, Layers, BookOpen, ShieldCheck, Info } from 'lucide-react';

export const FineArtCoursesPage: React.FC = () => {
  const { openEnquiryModal, openFreeDemoModal } = useStudio();

  const syllabusModules = [
    {
      module: 'Module 01',
      title: 'Classical Drawing Foundations & Sight-Size Realism',
      duration: 'Weeks 1 – 6',
      topics: [
        'Sight-size measuring technique & plumb-line plumb calibration',
        'Charles Bargue drawing plates reproduction',
        '9-step tonal value sphere, cylinder, and planar cast rendering',
        'Charcoal powder wash, tortillon blending & kneaded eraser lifting',
      ],
    },
    {
      module: 'Module 02',
      title: 'Canvas Preparation, Mediums & Grisaille Underpainting',
      duration: 'Weeks 7 – 12',
      topics: [
        'Stretching Belgian linen over kiln-dried heavy pine stretchers',
        'Traditional rabbit-skin glue sizing and acrylic gesso grounds',
        'Chemistry of linseed oil, stand oil, turpentine, and mineral spirits',
        'Monochrome grisaille and verdaccio underpaintings to lock tonal accuracy',
      ],
    },
    {
      module: 'Module 03',
      title: 'Color Chemistry, Glazing & Classical Portrait Realism',
      duration: 'Weeks 13 – 18',
      topics: [
        'Zorn limited palette (Ivory Black, Flake White, Yellow Ochre, Cadmium Red)',
        'Optical color mixing through transparent warm & cool glazes',
        'Cranial anatomy, planar faceting, and realistic iris/skin rendering',
        'Live model and photographic reference translation',
      ],
    },
    {
      module: 'Module 04',
      title: 'Large-Format Masterwork, Varnishing & Gallery Career',
      duration: 'Weeks 19 – 24',
      topics: [
        'Executing a personal signature masterwork on stretched canvas (30x40"+)',
        'Dammar vs Synthetic Gamvar museum protective varnishing',
        'Certificate of Completion issued by The Art Horizon',
        'Art exhibition curation, pricing strategies, and portfolio development',
      ],
    },
  ];

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85D38]/10 border border-[#B85D38]/20 text-[#8C4A2D] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#B85D38]" />
          <span>Professional Diploma & Mastery Track</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Professional Fine Art Courses
        </h1>
        <p className="text-stone-600 max-w-3xl mx-auto text-base sm:text-lg">
          An intensive, atelier-style immersion for aspiring professional artists, design college entrance candidates,
          and devoted practitioners seeking classical European sight-size mastery and archival canvas oil painting.
        </p>

        {/* Pricing notice */}
        <div className="max-w-xl mx-auto bg-[#F4EDE4] border border-[#E7DFD5] p-3 rounded-sm text-xs text-stone-700 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#B85D38] shrink-0" />
          <span>
            <strong>Course Details & Fees:</strong> Available upon request. Admissions are based on a brief portfolio
            review or informal studio discussion with Vikas Gothi.
          </span>
        </div>
      </section>

      {/* Program Hero Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-white rounded-sm overflow-hidden border border-stone-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#E8926F] font-semibold">
                6-Month Intensive Diploma / 1-Year Master Certificate
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
                Rigorous Atelier Training Under Vikas Gothi
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Most modern art certificates focus purely on conceptual abstracts without granting students command over
                foundational realism. Our Fine Art Diploma course restores the heritage discipline of master European
                ateliers. You will learn to control drawing, value, edges, and color chemistry until your canvas radiates
                lifelike luminosity.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-stone-300">
                <div className="bg-stone-900/80 p-3 rounded-sm border border-stone-800">
                  <span className="text-[10px] text-stone-400 block uppercase">Cohort Size</span>
                  <span className="font-serif text-lg font-bold text-[#E8926F]">Max 6 Fellows</span>
                </div>
                <div className="bg-stone-900/80 p-3 rounded-sm border border-stone-800">
                  <span className="text-[10px] text-stone-400 block uppercase">Studio Access</span>
                  <span className="font-serif text-lg font-bold text-[#E8926F]">Atelier Easels</span>
                </div>
                <div className="bg-stone-900/80 p-3 rounded-sm border border-stone-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-stone-400 block uppercase">Certification</span>
                  <span className="font-serif text-lg font-bold text-[#E8926F]">Fine Art Diploma</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => openEnquiryModal('local-classes', 'Professional Fine Art Diploma Course')}
                  className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Request Detailed Syllabus & Admissions
                </button>
                <button
                  onClick={() => openFreeDemoModal()}
                  className="border border-stone-700 hover:border-stone-500 text-stone-300 px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Schedule Studio Portfolio Review
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-950 border border-stone-700 shadow-xl">
                <img
                  src={OFFICIAL_ASSETS.radhaKrishnaEasel}
                  alt="Fine Art Masterpiece on Easel by Vikas Gothi"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Modules Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
            Structure & Milestones
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            24-Week Progressive Curriculum Roadmap
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Carefully staged from graphite precision to multilayered canvas oil glazes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {syllabusModules.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-4 hover:border-[#B85D38] transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
                  {item.module}
                </span>
                <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded">
                  {item.duration}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-stone-900">{item.title}</h3>

              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600">
                {item.topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B85D38] shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Admissions & CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="bg-[#FAF8F5] border-2 border-dashed border-[#B85D38]/40 p-8 sm:p-12 rounded-sm space-y-4">
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Ready to Take Your Art to Professional Height?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Admissions for our upcoming Fine Art Diploma batch are currently open. Book a personal portfolio review with
            Vikas Gothi at our Indore studio or via Zoom.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openEnquiryModal('local-classes', 'Fine Art Diploma Admissions')}
              className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Enquire for Diploma Admissions
            </button>
            <button
              onClick={() => openFreeDemoModal()}
              className="border border-stone-800 text-stone-800 hover:text-[#B85D38] px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Book Portfolio Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
