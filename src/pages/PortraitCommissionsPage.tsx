import React from 'react';
import { useStudio } from '../context/StudioContext';
import { SERVICES_DATA } from '../data/servicesData';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart, Camera, Package, Award, Info } from 'lucide-react';

export const PortraitCommissionsPage: React.FC = () => {
  const { openEnquiryModal, openLightbox, openDetailModal, businessConfig } = useStudio();

  const portraitServices = SERVICES_DATA.filter((s) => s.category === 'portraits');

  const processSteps = [
    {
      step: '01',
      title: 'Consultation & Medium Selection',
      desc: 'Select your preferred medium: Classical Oil on Linen, Textured Acrylics, Ethereal Watercolor, or Charcoal Realism. Share your reference photograph with Vikas Gothi.',
    },
    {
      step: '02',
      title: 'Composition & Tonal Layout',
      desc: 'We draft the crop, color harmony, and proportion balance to ensure the emotional likeness and focal point match your exact expectations.',
    },
    {
      step: '03',
      title: 'Handcrafted Artwork Execution',
      desc: '100% hand-painted or drawn using museum-grade Belgian linen, pure artist pigments, or archival European cotton paper (Fabriano/Arches).',
    },
    {
      step: '04',
      title: 'Archival Sealing & Framing',
      desc: 'Treated with UV-resistant non-yellowing museum varnish or fixative. Optional bespoke teakwood or matte black museum frames with anti-reflective glass.',
    },
    {
      step: '05',
      title: 'Worldwide Tracked Crated Shipping',
      desc: 'Dispatched securely inside rigid shockproof packaging. Delivered across India, USA, UK, UAE & worldwide with a Certificate of Authenticity signed by Vikas Gothi.',
    },
  ];

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D82828]/10 border border-[#D82828]/20 text-[#D82828] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D82828]" />
          <span>All Fine Art Mediums Handcrafted</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Custom Art & Portrait Commissions
        </h1>
        <p className="text-stone-600 max-w-3xl mx-auto text-base sm:text-lg">
          We craft custom commissions across all mediums: <strong className="text-stone-900">Oil Painting on Belgian Linen</strong>,{' '}
          <strong className="text-stone-900">Vibrant Acrylics</strong>, <strong className="text-stone-900">Fine Watercolors</strong>,{' '}
          <strong className="text-stone-900">Charcoal & Graphite Realism</strong>, and <strong className="text-stone-900">Colour Pencils</strong>.
        </p>

        {/* Pricing notice */}
        <div className="max-w-xl mx-auto bg-[#F4EDE4] border border-[#E7DFD5] p-3 rounded-sm text-xs text-stone-700 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#D82828] shrink-0" />
          <span>
            <strong>Pricing Policy:</strong> Each commission is unique in medium, dimension, and subject count. We provide
            transparent individual quotes upon receiving your reference photo.
          </span>
        </div>
      </section>

      {/* Mediums Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portraitServices.map((service) => (
            <div
              key={service.id}
              onClick={() =>
                openDetailModal({
                  type: 'service',
                  title: service.title,
                  subtitle: service.subtitle,
                  category: 'Custom Commission',
                  description: service.description,
                  image: service.image,
                  features: service.features,
                  deliverables: service.deliverables,
                  enquiryCategory: 'portrait-commissions',
                })
              }
              className="bg-white border-2 border-stone-200 hover:border-[#D82828] rounded-sm overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B1E3F]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    {service.id.includes('oil')
                      ? 'Classical Oil'
                      : service.id.includes('acrylic')
                      ? 'Vibrant Acrylic'
                      : service.id.includes('water')
                      ? 'Luminous Watercolor'
                      : service.id.includes('charcoal')
                      ? 'Charcoal Realism'
                      : 'Colour Pencil'}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#D82828] transition-colors leading-snug">
                    {service.title}
                  </h2>
                  <p className="font-serif italic text-stone-600 text-xs line-clamp-2">{service.subtitle}</p>
                  <p className="text-stone-700 text-xs line-clamp-3 leading-relaxed">{service.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-4 text-xs">
                <span className="text-stone-500 font-semibold">Contact for Pricing</span>
                <span className="text-[#D82828] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* The Commission Journey Steps */}
      <section className="bg-stone-100/70 border-y border-[#E7DFD5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
              Step-by-Step Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              How Your Commission Comes to Life
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <div key={step.step} className="bg-white p-5 border border-stone-200 rounded-sm space-y-2 relative shadow-xs">
                <span className="font-serif text-3xl font-bold text-[#B85D38]/30 block leading-none">
                  {step.step}
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900">{step.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Reference Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-white p-8 sm:p-12 rounded-sm border border-stone-800 space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#E8926F] font-semibold">
              Artist's Advice
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Tips for Selecting the Best Reference Photograph
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm">
              The clearer the light on the face, the more radiant and lifelike your final drawing will be:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs text-stone-300">
            <div className="border border-stone-800 bg-stone-900/60 p-4 rounded-sm space-y-1">
              <span className="font-bold text-[#E8926F] block">Natural Directional Light</span>
              <p className="text-stone-400">
                Photos taken near a window or outdoors during morning/evening sunlight provide gorgeous natural contrast
                and shadow planes.
              </p>
            </div>
            <div className="border border-stone-800 bg-stone-900/60 p-4 rounded-sm space-y-1">
              <span className="font-bold text-[#E8926F] block">High Facial Resolution</span>
              <p className="text-stone-400">
                Ensure eyelashes, iris catchlights, and expression wrinkles around the mouth are visible when zoomed in.
              </p>
            </div>
            <div className="border border-stone-800 bg-stone-900/60 p-4 rounded-sm space-y-1">
              <span className="font-bold text-[#E8926F] block">Vintage Photo Restoration</span>
              <p className="text-stone-400">
                Have an old black-and-white family print? Vikas sir specializes in reconstructing lost details with
                anatomical accuracy.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800">
            <span className="text-xs text-stone-400">
              Worldwide insured crate packaging • Delivered across India, USA, UK & UAE
            </span>
            <button
              onClick={() => openEnquiryModal('portrait-commissions', 'Commission a Custom Portrait')}
              className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-7 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
            >
              Enquire About a Portrait
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
