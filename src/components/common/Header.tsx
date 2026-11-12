import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { PageId } from '../../types';
import {
  Phone,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Globe,
  ArrowRight,
  Star,
  MessageCircle,
  Youtube,
} from 'lucide-react';
import { GoogleReviewsBadge } from './GoogleReviewsBadge';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    openEnquiryModal,
    openFreeDemoModal,
    openGeminiChat,
    businessConfig,
  } = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleNavClick = (page: PageId, section?: string) => {
    navigateTo(page, section);
    setMobileMenuOpen(false);
    setClassesDropdownOpen(false);
    setServicesDropdownOpen(false);
  };

  const isActive = (page: PageId) => currentPage === page;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
      {/* Top Skilldren-style Announcement & Quick Contact Bar */}
      <div className="bg-gradient-to-r from-[#0B1E3F] via-[#152747] to-[#0B1E3F] text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Left: Global Class Announcement & Google Rating */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-stone-200">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-900 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-stone-900 fill-stone-900" />
              Free Demo Class
            </span>
            <span className="font-semibold text-stone-100 text-xs tracking-wide">
              Live Zoom Batches (🇺🇸 US, 🇬🇧 UK, 🇦🇪 UAE & Global) • Studio in Indore 📍
            </span>
            <span className="text-stone-500 hidden lg:inline">•</span>
            <GoogleReviewsBadge
              variant="compact"
              onClick={() => handleNavClick('testimonials')}
              className="hidden lg:inline-flex"
            />
          </div>

          {/* Right: Direct Phone & WhatsApp for Vikas Gothi */}
          <div className="flex items-center gap-3.5 text-xs shrink-0">
            <a
              href={`https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello Vikas Sir / The Art Horizon, I would like to enquire about art classes and custom commissions.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-emerald-300 hover:text-white font-semibold transition-colors"
              title="Chat with Vikas Gothi on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <span className="text-stone-600 hidden sm:inline">|</span>

            <a
              href={businessConfig.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-red-300 hover:text-white font-semibold transition-colors"
              title="Official YouTube Channel @thearthorizon"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400 fill-current" />
              <span>YouTube</span>
            </a>

            <span className="text-stone-600 hidden lg:inline">|</span>

            <a
              href={`tel:${businessConfig.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-stone-200 hover:text-amber-300 font-bold transition-colors"
              title="Call Vikas Gothi directly"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{businessConfig.phone}</span>
            </a>

            <span className="text-stone-600 hidden md:inline">|</span>

            <button
              onClick={openFreeDemoModal}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-bold underline decoration-amber-400/70 underline-offset-2 transition-colors cursor-pointer"
            >
              Book 45-Min Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-4">
          {/* Official Brand Logo & Name - Bold & Bigger with Zero Overlap */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 text-left group focus:outline-none shrink-0"
            title="The Art Horizon - Home"
          >
            {/* Visual Logo Emblem */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-stone-200/90 p-1 flex items-center justify-center shadow-sm group-hover:border-[#D82828] group-hover:shadow-md transition-all overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/THE_ART_HORIZON__LOGO__d2985075.jpg"
                alt="The Art Horizon Official Logo"
                className="w-full h-full object-contain scale-105 group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Bold Brand Typography */}
            <div className="flex flex-col justify-center shrink-0">
              <div className="font-serif text-2xl sm:text-3xl lg:text-[28px] font-black tracking-tight text-stone-900 leading-none group-hover:text-[#D82828] transition-colors whitespace-nowrap">
                THE ART HORIZON
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#D82828] font-black mt-1 whitespace-nowrap flex items-center gap-1.5">
                <span>Fine Art Studio & Academy</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-700 font-bold">Vikas Gothi</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 2xl:space-x-1.5 text-[13px] 2xl:text-sm font-semibold text-stone-700 whitespace-nowrap">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-full transition-colors ${
                isActive('home') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-full transition-colors ${
                isActive('about') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('founder')}
              className={`px-3 py-2 rounded-full transition-colors ${
                isActive('founder') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              Founder Profile
            </button>

            {/* Art Classes Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setClassesDropdownOpen(true)}
              onMouseLeave={() => setClassesDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('art-classes')}
                className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
                  isActive('art-classes') || isActive('fine-art-courses')
                    ? 'text-[#D82828] font-bold bg-[#D82828]/10'
                    : 'hover:text-[#D82828] hover:bg-stone-50'
                }`}
              >
                <span>Art Classes</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {classesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleNavClick('art-classes')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF8F5] hover:text-[#D82828] block"
                  >
                    <div className="font-bold text-stone-900">Art Classes Overview</div>
                    <div className="text-stone-500 text-[11px]">Kids, Teens, Adults & Portraits</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('fine-art-courses')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF8F5] hover:text-[#D82828] block border-t border-stone-100"
                  >
                    <div className="font-bold text-stone-900">Professional Fine Art Courses</div>
                    <div className="text-stone-500 text-[11px]">Classical European Sight-Size & Oil Atelier</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('online-classes')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF8F5] hover:text-[#D82828] block border-t border-stone-100 bg-[#FAF8F5]/60"
                  >
                    <div className="font-bold text-[#D82828] flex items-center justify-between">
                      <span>Online Art Classes</span>
                      <span className="text-[10px] bg-[#D82828]/10 text-[#D82828] px-2 py-0.5 rounded-full font-bold">
                        Global Zoom
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px]">Live 1-hr sessions for US, UK, UAE & Worldwide</div>
                  </button>
                </div>
              )}
            </div>

            {/* Art Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('portrait-commissions')}
                className={`flex items-center gap-1 px-3 py-2 rounded-full transition-colors ${
                  isActive('portrait-commissions') || isActive('commercial-projects')
                    ? 'text-[#D82828] font-bold bg-[#D82828]/10'
                    : 'hover:text-[#D82828] hover:bg-stone-50'
                }`}
              >
                <span>Art Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white border border-stone-200 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleNavClick('portrait-commissions')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF8F5] hover:text-[#D82828] block"
                  >
                    <div className="font-bold text-stone-900">Custom Portrait Commissions</div>
                    <div className="text-stone-500 text-[11px]">Oil, Acrylic, Watercolor & Charcoal Realism</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('commercial-projects')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF8F5] hover:text-[#D82828] block border-t border-stone-100"
                  >
                    <div className="font-bold text-stone-900">Wall Murals & Rangoli</div>
                    <div className="text-stone-500 text-[11px]">Cafes, Villas, Festivals & Corporate Spaces</div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('workshops')}
              className={`px-3 py-2 rounded-full transition-colors ${
                isActive('workshops') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              Workshops
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`px-3 py-2 rounded-full transition-colors ${
                isActive('gallery') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleNavClick('testimonials')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                isActive('testimonials') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              <span>Reviews</span>
              <span className="inline-flex items-center gap-0.5 bg-amber-400/20 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>4.9</span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-full transition-colors ${
                isActive('contact') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={openGeminiChat}
              className="hidden 2xl:inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-850 px-3.5 py-2.5 rounded-full font-bold text-xs transition-all border border-stone-200 active:scale-95 shadow-2xs"
              title="Ask AI Art Advisor about Courses & Fees"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D82828]" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={openFreeDemoModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B] hover:opacity-95 text-white px-4 sm:px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>Book Free Trial</span>
            </button>

            <button
              onClick={() => openEnquiryModal('general', 'Admissions & Services Enquiry')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF8F5] border-b border-[#E7DFD5] shadow-2xl px-6 py-6 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {/* Direct Phone / WhatsApp Quick Access */}
            <div className="flex items-center gap-2 mb-4">
              <a
                href={`tel:${businessConfig.phone.replace(/\s+/g, '')}`}
                className="flex-1 bg-stone-900 text-white py-2.5 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {businessConfig.phone}</span>
              </a>
              <a
                href={`https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello Vikas Sir / The Art Horizon, I would like to enquire about art classes.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white p-2.5 rounded-xl flex items-center justify-center shrink-0"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={businessConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl flex items-center justify-center shrink-0"
                title="YouTube Channel"
              >
                <Youtube className="w-5 h-5 fill-current" />
              </a>
            </div>

            <div className="pb-3 mb-2 border-b border-stone-200">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">Menu Navigation</span>
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('home') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('about') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('founder')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('founder') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Founder Profile (Vikas Gothi)
            </button>

            <button
              onClick={() => handleNavClick('art-classes')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('art-classes') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Kids & Adult Art Classes
            </button>

            <button
              onClick={() => handleNavClick('fine-art-courses')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('fine-art-courses') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Professional Fine Art Courses
            </button>

            <button
              onClick={() => handleNavClick('online-classes')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold flex items-center justify-between ${
                isActive('online-classes') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              <span>Online Classes (Zoom Worldwide)</span>
              <span className="text-[10px] bg-[#D82828] text-white px-2 py-0.5 rounded-full font-bold">
                Ages 6-15
              </span>
            </button>

            <button
              onClick={() => handleNavClick('portrait-commissions')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('portrait-commissions') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Custom Portrait Commissions
            </button>

            <button
              onClick={() => handleNavClick('commercial-projects')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('commercial-projects') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Wall Murals & Large-Scale Rangoli
            </button>

            <button
              onClick={() => handleNavClick('workshops')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('workshops') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Resin, Lippan & Clay Workshops
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('gallery') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Art Gallery & Student Works
            </button>

            <button
              onClick={() => handleNavClick('testimonials')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('testimonials') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Google Reviews & Testimonials
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                isActive('contact') ? 'bg-[#D82828]/10 text-[#D82828] font-bold' : 'text-stone-800'
              }`}
            >
              Contact Us & Studio Location
            </button>

            <div className="pt-4 space-y-2 border-t border-stone-200 mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openFreeDemoModal();
                }}
                className="w-full bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B] text-white py-3 rounded-full text-center font-bold text-sm shadow-md"
              >
                Book 45-Min Free Trial Class
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnquiryModal('general', 'Admissions & Services Enquiry');
                }}
                className="w-full bg-stone-900 text-white py-3 rounded-full text-center font-bold text-sm"
              >
                Request Course Details & Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
