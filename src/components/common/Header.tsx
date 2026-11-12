import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { PageId } from '../../types';
import {
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  SlidersHorizontal,
  Globe,
  Palette,
  BookOpen,
  ArrowRight,
  Star,
} from 'lucide-react';
import { GoogleReviewsBadge, GoogleIcon } from './GoogleReviewsBadge';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    openEnquiryModal,
    openFreeDemoModal,
    openAdminConfig,
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
      {/* Top Skilldren-style Announcement & Utility Bar */}
      <div className="bg-gradient-to-r from-[#0B1E3F] via-[#1E293B] to-[#0B1E3F] text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Global Class Announcement & Google Rating */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-stone-200">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-stone-900" />
              Free Demo Class
            </span>
            <span className="text-stone-300 text-xs">
              Live Zoom batches for 🇺🇸 US, 🇬🇧 UK, 🇦🇪 UAE & Worldwide • Studio in Indore 📍
            </span>
            <span className="text-stone-500 hidden lg:inline">•</span>
            <GoogleReviewsBadge
              variant="compact"
              onClick={() => handleNavClick('testimonials')}
              className="hidden lg:inline-flex"
            />
          </div>

          {/* Right: Direct Contact & Settings */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${businessConfig.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-stone-200 hover:text-amber-300 font-medium transition-colors"
              title="Call Vikas Gothi"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{businessConfig.phone}</span>
            </a>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <button
              onClick={openFreeDemoModal}
              className="hidden sm:inline-flex items-center gap-1 text-amber-300 hover:text-white font-semibold underline decoration-amber-400/60 underline-offset-2 transition-colors"
            >
              Book 45-Min Free Trial
            </button>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <button
              onClick={openAdminConfig}
              className="flex items-center gap-1 text-stone-400 hover:text-stone-200 text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
              title="Studio Configuration & Enquiries Log"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-13 h-13 rounded-xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-xs group-hover:border-[#D82828] transition-all overflow-hidden">
              <img
                src="/assets/aistudio/THE_ART_HORIZON__LOGO__d2985075.jpg"
                alt="The Art Horizon Official Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-none group-hover:text-[#D82828] transition-colors flex items-center gap-1.5">
                <span>The Art Horizon</span>
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#D82828] font-bold mt-1">
                Fine Art Studio & Academy • Vikas Gothi
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-sm font-medium text-stone-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-full transition-colors ${
                isActive('home') ? 'text-[#D82828] font-bold bg-[#D82828]/10' : 'hover:text-[#D82828] hover:bg-stone-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('about') ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10' : 'hover:text-[#B85D38]'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('founder')}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('founder') ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10' : 'hover:text-[#B85D38]'
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
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('art-classes') || isActive('fine-art-courses')
                    ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10'
                    : 'hover:text-[#B85D38]'
                }`}
              >
                <span>Art Education</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {classesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-[#E7DFD5] shadow-xl rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleNavClick('art-classes')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF8F5] hover:text-[#B85D38] block"
                  >
                    <div className="font-semibold text-stone-900">Art Classes Overview</div>
                    <div className="text-stone-500 text-[11px]">Kids, Teens, Adults & Portraits</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('fine-art-courses')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF8F5] hover:text-[#B85D38] block border-t border-stone-100"
                  >
                    <div className="font-semibold text-stone-900">Professional Fine Art Courses</div>
                    <div className="text-stone-500 text-[11px]">Classical Atelier & Mastery Track</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('online-classes')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF8F5] hover:text-[#B85D38] block border-t border-stone-100 bg-[#FAF8F5]/50"
                  >
                    <div className="font-semibold text-[#B85D38] flex items-center justify-between">
                      <span>Online Art Classes</span>
                      <span className="text-[10px] bg-[#B85D38]/10 text-[#B85D38] px-1.5 py-0.2 rounded font-normal">
                        Global Zoom
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px]">Live 1-hr classes for USA, UK, UAE</div>
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
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('portrait-commissions') || isActive('commercial-projects')
                    ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10'
                    : 'hover:text-[#B85D38]'
                }`}
              >
                <span>Art Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white border border-[#E7DFD5] shadow-xl rounded-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleNavClick('portrait-commissions')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF8F5] hover:text-[#B85D38] block"
                  >
                    <div className="font-semibold text-stone-900">Custom Portrait Commissions</div>
                    <div className="text-stone-500 text-[11px]">Charcoal, Graphite & Colour Pencil</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('commercial-projects')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF8F5] hover:text-[#B85D38] block border-t border-stone-100"
                  >
                    <div className="font-semibold text-stone-900">Commercial Art & Murals</div>
                    <div className="text-stone-500 text-[11px]">Wall Murals, Hotels & Large-Scale Rangoli</div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('workshops')}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('workshops') ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10' : 'hover:text-[#B85D38]'
              }`}
            >
              Workshops
            </button>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('gallery') ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10' : 'hover:text-[#B85D38]'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleNavClick('testimonials')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                isActive('testimonials') ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10' : 'hover:text-[#B85D38]'
              }`}
            >
              <span>Reviews</span>
              <span className="inline-flex items-center gap-0.5 bg-amber-400/20 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>4.9</span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('contact') ? 'text-[#B85D38] font-semibold bg-[#B85D38]/10' : 'hover:text-[#B85D38]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={openGeminiChat}
              className="hidden lg:inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-850 px-3.5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all border border-stone-200 active:scale-95 shadow-2xs"
              title="Ask Gemini AI Advisor about Courses & Commissions"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D82828]" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={openFreeDemoModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B] hover:opacity-95 text-white px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>Book Free Trial</span>
            </button>

            <button
              onClick={() => openEnquiryModal('general', 'Admissions & Services Enquiry')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
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
        <div className="xl:hidden bg-[#FAF8F5] border-b border-[#E7DFD5] shadow-2xl px-6 py-6 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            <div className="pb-3 mb-2 border-b border-stone-200">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Navigation</span>
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2.5 px-3 rounded-md text-base ${
                isActive('home') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-left py-2.5 px-3 rounded-md text-base ${
                isActive('about') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-800'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNavClick('founder')}
              className={`text-left py-2.5 px-3 rounded-md text-base ${
                isActive('founder') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-800'
              }`}
            >
              Founder Profile (Vikas Gothi)
            </button>

            <div className="pt-2 pb-1 text-xs uppercase tracking-wider text-stone-400 font-semibold px-3">
              Art Education
            </div>

            <button
              onClick={() => handleNavClick('art-classes')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('art-classes') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              • Art Classes (Kids, Teens, Adults, Portraits)
            </button>

            <button
              onClick={() => handleNavClick('fine-art-courses')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('fine-art-courses') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              • Professional Fine Art Courses
            </button>

            <button
              onClick={() => handleNavClick('online-classes')}
              className={`text-left py-2 px-3 rounded-md text-sm font-medium ${
                isActive('online-classes')
                  ? 'bg-[#B85D38]/10 text-[#B85D38]'
                  : 'text-[#B85D38] bg-[#B85D38]/5'
              }`}
            >
              • Online Art Classes (Zoom: USA, UK, UAE)
            </button>

            <div className="pt-2 pb-1 text-xs uppercase tracking-wider text-stone-400 font-semibold px-3">
              Art Services & Workshops
            </div>

            <button
              onClick={() => handleNavClick('portrait-commissions')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('portrait-commissions') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              • Custom Portrait Commissions
            </button>

            <button
              onClick={() => handleNavClick('commercial-projects')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('commercial-projects') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              • Commercial Art, Murals & Rangoli
            </button>

            <button
              onClick={() => handleNavClick('workshops')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('workshops') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              • Creative Workshops (Resin, Lippan, Clay)
            </button>

            <div className="pt-2 pb-1 text-xs uppercase tracking-wider text-stone-400 font-semibold px-3">More</div>

            <button
              onClick={() => handleNavClick('gallery')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('gallery') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              Artwork Gallery
            </button>

            <button
              onClick={() => handleNavClick('testimonials')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('testimonials') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              Student Testimonials & Reviews
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-2 px-3 rounded-md text-sm ${
                isActive('contact') ? 'bg-[#B85D38]/10 text-[#B85D38] font-semibold' : 'text-stone-700'
              }`}
            >
              Contact & Studio Location
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openGeminiChat();
              }}
              className="w-full bg-stone-900 text-amber-300 py-3 rounded-sm font-bold text-sm flex items-center justify-center gap-2 border border-stone-800"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask Gemini AI Advisor</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openEnquiryModal('general', 'General Enquiry');
              }}
              className="w-full bg-[#B85D38] text-white py-3 rounded-sm font-medium text-sm flex items-center justify-center gap-2"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openFreeDemoModal();
              }}
              className="w-full border border-stone-300 text-stone-800 py-2.5 rounded-sm font-medium text-sm hover:bg-stone-100"
            >
              Book a Free Demo Class
            </button>

            <a
              href={`tel:${businessConfig.phone.replace(/\s+/g, '')}`}
              className="w-full text-center py-2 text-stone-600 text-sm font-medium hover:text-[#B85D38]"
            >
              Call: {businessConfig.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
