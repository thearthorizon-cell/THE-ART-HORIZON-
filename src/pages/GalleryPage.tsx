import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Maximize2, Palette, ArrowRight } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { openLightbox, openEnquiryModal, cmsState } = useStudio();
  const [activeCategory, setActiveCategory] = useState<'all' | 'portraits' | 'murals' | 'rangoli' | 'student-work' | 'fine-art'>('all');

  const galleryItems = cmsState.galleryPhotos;

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-16 py-12 pb-24 bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5 text-[#D82828]" />
          <span>Authentic Studio Portfolio & Student Works</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          The Art Horizon Gallery
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
          An authentic showcase of original fine art by founder <strong className="text-stone-900">Vikas Gothi</strong>,
          anatomical studies, custom portraits in charcoal & oil, festival rangoli, architectural murals, and exemplary student drawings.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: '🎨 All Works' },
            { id: 'portraits', label: '👤 Custom Portraits' },
            { id: 'fine-art', label: '🦴 Anatomy & Fine Art' },
            { id: 'murals', label: '🖌️ Wall Murals' },
            { id: 'rangoli', label: '✨ Festival Rangoli' },
            { id: 'student-work', label: '🌟 Student Works' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeCategory === tab.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Artwork Grid with modern rounded-3xl cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                <img
                  src={item.image}
                  alt={`${item.title} — ${item.medium}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-stone-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Fullscreen</span>
                  </span>
                </div>
                <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                  {item.category.replace('-', ' ')}
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#D82828] transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs text-stone-500 line-clamp-1">{item.medium}</p>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">{item.description}</p>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span>
                    Artist: <strong className="text-stone-800">{item.artist}</strong>
                  </span>
                  <span className="text-[#D82828] font-bold group-hover:underline flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commission CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Want a Custom Commission?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Commission Master Artist Vikas Gothi
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm">
              We create custom oil paintings, realistic charcoal & colour pencil portraits, architectural wall murals, and event rangolis for clients worldwide.
            </p>
          </div>
          <button
            onClick={() => openEnquiryModal('portrait-commissions', 'Commission Enquiry from Gallery')}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all shadow-md"
          >
            Request Commission Quote
          </button>
        </div>
      </section>
    </div>
  );
};
