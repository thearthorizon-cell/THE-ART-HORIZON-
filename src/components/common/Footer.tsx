import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { PageId } from '../../types';
import { TARGET_SEARCH_TERMS } from '../../data/siteConfig';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Globe,
  Heart,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { GoogleIcon } from './GoogleReviewsBadge';
import { GOOGLE_REVIEWS_SUMMARY } from '../../data/testimonialsData';

export const Footer: React.FC = () => {
  const {
    navigateTo,
    openEnquiryModal,
    openFreeDemoModal,
    openAdminConfig,
    openWriteReviewModal,
    businessConfig,
  } = useStudio();

  const handleLink = (page: PageId) => {
    navigateTo(page);
  };

  return (
    <footer className="bg-[#181615] text-[#EDE7DE] border-t border-[#2D2825] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Banner */}
        <div className="bg-[#24201D] border border-stone-800 rounded-sm p-6 sm:p-8 mb-16 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#E8926F] text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admissions & Creative Commissions Open</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-100 font-bold">
              Begin Your Artistic Journey at The Art Horizon
            </h3>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl">
              From foundational kids and adult hobby classes in Indore to live interactive Zoom sessions for the USA,
              UK, and UAE, and bespoke hand-drawn portrait commissions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => openEnquiryModal('general', 'Admissions & Pricing Enquiry')}
              className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-3 rounded-sm text-sm font-medium transition-all shadow-sm w-full sm:w-auto text-center"
            >
              Request Course Details & Pricing
            </button>
            <button
              onClick={openFreeDemoModal}
              className="border border-stone-600 hover:border-stone-400 text-stone-200 hover:text-white px-6 py-3 rounded-sm text-sm font-medium transition-all w-full sm:w-auto text-center"
            >
              Book Free Demo Class
            </button>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-white p-1 flex items-center justify-center border border-stone-700 shadow-md">
                <img
                  src="/assets/aistudio/THE_ART_HORIZON__LOGO__d2985075.jpg"
                  alt="The Art Horizon Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  The Art Horizon
                </span>
                <span className="text-[11px] tracking-wider uppercase text-[#F5B700] font-semibold block">
                  Fine Art Studio & Academy • Vikas Gothi
                </span>
              </div>
            </div>

            <p className="font-serif italic text-stone-300 text-base">
              "{businessConfig.tagline}"
            </p>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Founded by master artist <strong className="text-stone-200 font-medium">Vikas Gothi</strong>, The Art
              Horizon is dedicated to classical fine art education, mindful creative workshops, and premier custom
              art services. We mentor artists of all ages to observe truth in form and express imagination with
              masterful technique.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={businessConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-stone-800/90 hover:bg-[#B85D38] flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  businessConfig.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp Us</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={openAdminConfig}
                className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 transition-colors"
                title="Configurable Business Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin Settings</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8926F] font-semibold">
              Explore Pages
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>
                <button onClick={() => handleLink('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('founder')} className="hover:text-white transition-colors">
                  Founder Profile (Vikas Gothi)
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('art-classes')} className="hover:text-white transition-colors">
                  Art Classes (Kids, Teens, Adults)
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('fine-art-courses')} className="hover:text-white transition-colors">
                  Fine Art Courses & Diplomas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('online-classes')}
                  className="hover:text-white text-[#E8926F] flex items-center gap-1 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Online Art Classes (Global)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('portrait-commissions')} className="hover:text-white transition-colors">
                  Portrait Commissions
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('commercial-projects')} className="hover:text-white transition-colors">
                  Commercial Art & Wall Murals
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('workshops')} className="hover:text-white transition-colors">
                  Workshops (Resin, Lippan, Clay)
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('gallery')} className="hover:text-white transition-colors">
                  Artwork Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('testimonials')} className="hover:text-white transition-colors">
                  Student & Client Reviews
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('contact')} className="hover:text-white transition-colors">
                  Contact Us & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Education & Services */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8926F] font-semibold">
              Art Disciplines
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li>
                <span className="text-stone-300 font-medium block">Kids Drawing & Colour</span>
                <span className="text-[11px] text-stone-500">Ages 5-11 foundational motor & visual</span>
              </li>
              <li>
                <span className="text-stone-300 font-medium block">Realistic Charcoal Portraits</span>
                <span className="text-[11px] text-stone-500">Tonal studies, facial planes & hair rendering</span>
              </li>
              <li>
                <span className="text-stone-300 font-medium block">Oil & Acrylic Canvas Painting</span>
                <span className="text-[11px] text-stone-500">Color harmony, glazes & impasto landscapes</span>
              </li>
              <li>
                <span className="text-stone-300 font-medium block">Large-Scale Festival Rangoli</span>
                <span className="text-[11px] text-stone-500">Grand cultural, 3D and Sanskar Bharti art</span>
              </li>
              <li>
                <span className="text-stone-300 font-medium block">Wall Murals & Hospitality Art</span>
                <span className="text-[11px] text-stone-500">Bespoke cafes, villas & corporate lobbies</span>
              </li>
              <li>
                <span className="text-stone-300 font-medium block">Resin & Lippan Workshops</span>
                <span className="text-[11px] text-stone-500">Hands-on weekend creative experiences</span>
              </li>
            </ul>
          </div>

          {/* Business & Studio Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E8926F] font-semibold">
              Studio & Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C86443] shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200">{businessConfig.address}</p>
                  {businessConfig.isAddressPendingConfirmation && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/90 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40 mt-1">
                      <ShieldAlert className="w-2.5 h-2.5" />
                      <span>Address editable pending final confirmation</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C86443] shrink-0" />
                <a
                  href={`tel:${businessConfig.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white text-stone-200 transition-colors"
                >
                  {businessConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C86443] shrink-0" />
                <a
                  href={`mailto:${businessConfig.email}`}
                  className="hover:text-white text-stone-200 transition-colors"
                >
                  {businessConfig.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-stone-800">
                <Clock className="w-4 h-4 text-[#C86443] shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-300 text-xs font-medium block">Studio Timings</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                    {businessConfig.businessHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Target Search Terms Cloud */}
        <div className="py-8 border-b border-stone-800/80">
          <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-3">
            Popular Specializations & Target Regions:
          </div>
          <div className="flex flex-wrap gap-2">
            {TARGET_SEARCH_TERMS.map((term, index) => (
              <span
                key={index}
                className="text-xs text-stone-400 bg-stone-900/90 border border-stone-800 px-3 py-1 rounded-sm hover:border-stone-700 hover:text-stone-200 transition-colors"
              >
                {term}
              </span>
            ))}
          </div>
        </div>

        {/* Google Reviews Trust Bar in Footer */}
        <div className="py-6 border-b border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Google Customer Rating</span>
                <span className="text-amber-400 font-bold text-sm">4.9 / 5.0</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-stone-400">
                Over {GOOGLE_REVIEWS_SUMMARY.totalReviews}+ verified reviews from students, parents & art collectors worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openWriteReviewModal}
              className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold px-4 py-2 rounded-full border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Review Us on Google</span>
            </button>
            <button
              onClick={() => handleLink('testimonials')}
              className="text-xs text-[#E8926F] hover:text-white underline underline-offset-2 transition-colors"
            >
              Read All Reviews
            </button>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} The Art Horizon. All Rights Reserved. Founder & Principal: Vikas Gothi.
          </p>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Fine Arts Education & Creative Services</span>
            <span>•</span>
            <span>Indore, Madhya Pradesh, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
