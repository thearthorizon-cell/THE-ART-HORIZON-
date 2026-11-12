import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { COURSES_DATA } from '../data/coursesData';
import { SERVICES_DATA } from '../data/servicesData';
import { WORKSHOPS_DATA } from '../data/workshopsData';
import { GALLERY_DATA } from '../data/galleryData';
import { TESTIMONIALS_DATA, GOOGLE_REVIEWS_SUMMARY } from '../data/testimonialsData';
import { OFFICIAL_ASSETS, INTERNATIONAL_DETAILS } from '../data/siteConfig';
import { GoogleReviewsBadge, GoogleIcon } from '../components/common/GoogleReviewsBadge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Award,
  Palette,
  Eye,
  Brush,
  ShieldCheck,
  Users,
  ChevronDown,
  ChevronUp,
  Star,
  Video,
  Smile,
  Heart,
  MessageCircle,
  HelpCircle,
  Play,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    navigateTo,
    openEnquiryModal,
    openFreeDemoModal,
    openLightbox,
    openDetailModal,
    openWriteReviewModal,
    businessConfig,
  } = useStudio();

  // Skilldren-style Age Filter Tab state
  const [selectedAgeTab, setSelectedAgeTab] = useState<'all' | 'kids' | 'teens' | 'adults' | 'professional'>('all');

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleOpenCourseDetail = (course: any) => {
    openDetailModal({
      type: 'course',
      title: course.title,
      subtitle: course.tagline,
      category: course.category,
      description: course.description,
      image: course.image,
      highlights: course.highlights,
      ageGroup: course.ageGroup,
      duration: course.duration,
      batchSize: course.batchSize,
      mediums: course.mediums,
      level: course.level,
      enquiryCategory: 'local-classes',
    });
  };

  // Filter courses based on age tab
  const filteredCourses =
    selectedAgeTab === 'all'
      ? COURSES_DATA
      : COURSES_DATA.filter((course) => {
          if (selectedAgeTab === 'kids') return course.category === 'kids';
          if (selectedAgeTab === 'teens') return course.category === 'teens';
          if (selectedAgeTab === 'adults') return course.category === 'adults' || course.category === 'portrait';
          if (selectedAgeTab === 'professional') return course.category === 'professional' || course.category === 'portrait';
          return true;
        });

  const parentFaqs = [
    {
      q: 'My child has never taken art classes before. Can an absolute beginner join?',
      a: 'Yes, absolutely! Over 80% of our new students start with zero prior training. Master artist Vikas Gothi and our mentors begin from foundational pencil holding, arm posture, basic geometric shapes, and joyful color mixing before advancing to detailed drawing.',
    },
    {
      q: 'How do international online classes via Zoom work across different time zones?',
      a: 'Our international online batches are specially scheduled to match convenient morning and evening hours for students in the United States (EST, CST, PST), United Kingdom (GMT/BST), UAE (GST), Canada, and Australia. Classes are conducted live with dual-camera angles so students can clearly see the teacher’s brushstrokes in real-time.',
    },
    {
      q: 'What art materials do we need to prepare before the first class?',
      a: 'For your initial 45-minute Free Trial Class, you only need simple drawing paper, a pencil, an eraser, and any basic coloring medium you currently have at home (wax crayons, sketch pens, or oil pastels). Once enrolled, we provide a complete, medium-specific recommended material list.',
    },
    {
      q: 'What mediums are taught and commissioned at The Art Horizon?',
      a: 'We teach and accept custom commissions across ALL mediums: Acrylic on Canvas, Classical Oil Painting, Watercolors, Charcoal, Graphite, Soft & Oil Pastels, Lippan Art, Resin Art, and Custom Wall Murals.',
    },
    {
      q: 'What happens if my child misses a scheduled live class?',
      a: 'We understand family schedules change! We offer flexible makeup class slots within the month and provide personalized exercise guidance so your child never falls behind.',
    },
    {
      q: 'Do students receive a certificate upon completing their course?',
      a: 'Yes! Students receive an official Certificate of Fine Art Achievement upon completing their structured module, along with a portfolio review and an opportunity to be featured in our studio art gallery exhibitions.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 bg-white text-stone-800">
      {/* 1. SKILLDREN-STYLE HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F5] to-white pt-8 pb-16 lg:py-20 border-b border-stone-200">
        {/* Soft playful background color spots */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-300 shadow-xs text-xs font-semibold text-stone-800">
                <span className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </span>
                <span className="font-bold text-[#0B1E3F]">Rated 4.9/5</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-600">500+ Students Mentored Worldwide</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]">
                Where Creativity Finds Its <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B]">Horizon.</span>
              </h1>

              {/* Tagline Subtext */}
              <p className="text-lg sm:text-xl text-stone-700 max-w-2xl font-normal leading-relaxed">
                Step-by-step drawing, painting, and fine arts classes for kids, teens, and adults.
                Join live interactive Zoom batches from <strong className="text-stone-900 font-semibold">any country worldwide (US, UK, UAE & more)</strong> or attend in-person at our studio in <strong className="text-stone-900 font-semibold">Indore, India</strong> under master artist <strong className="text-stone-900 font-bold">Vikas Gothi</strong>.
              </p>

              {/* Google Reviews Trust Badge */}
              <div className="pt-1 flex items-center justify-center lg:justify-start">
                <GoogleReviewsBadge
                  variant="hero"
                  onClick={() => navigateTo('testimonials')}
                />
              </div>

              {/* Skilldren-style High-Contrast Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={openFreeDemoModal}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B] hover:opacity-95 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200" />
                  <span>Book Free Trial Class</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('programs-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-white border-2 border-stone-800 hover:border-[#D82828] text-stone-900 hover:text-[#D82828] px-7 py-3.5 rounded-full font-bold text-base transition-all shadow-xs"
                >
                  Explore by Age Group
                </button>
              </div>

              {/* Quick Trust Highlights Row */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block">Live Zoom & Studio</span>
                  <span className="text-xs font-bold text-stone-900">Dual-Camera View</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider block">Small Batches</span>
                  <span className="text-xs font-bold text-stone-900">1:4 Focused Attention</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-teal-700 font-bold uppercase tracking-wider block">All Mediums</span>
                  <span className="text-xs font-bold text-stone-900">Oil, Acrylic, Charcoal</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                  <span className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider block">Global Batches</span>
                  <span className="text-xs font-bold text-stone-900">US, UK, UAE & More</span>
                </div>
              </div>
            </div>

            {/* Right Visual Composition: Skilldren-style interactive photo stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card featuring Real Mural Work */}
                <div className="relative z-10 bg-white p-3.5 rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 group">
                    <img
                      src={OFFICIAL_ASSETS.vikasPaintingViolinMural}
                      alt="Vikas Gothi hand-painting colorful symphony violin wall mural"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/20 to-transparent flex flex-col justify-end p-5 text-white">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                          Master Artist in Action
                        </span>
                      </div>
                      <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                        Vikas Gothi • Founder
                      </h4>
                      <p className="text-xs text-stone-200 mt-1">
                        Handcrafting fine art murals, classical portraits & mentoring next-gen artists.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Student Artwork Pill (Skilldren Style) */}
                <div
                  onClick={() => openLightbox(GALLERY_DATA[0])}
                  className="absolute -bottom-6 -left-6 z-20 bg-white p-3 rounded-2xl shadow-xl border border-stone-200 hover:border-[#D82828] cursor-pointer transition-all flex items-center gap-3 max-w-xs group"
                >
                  <img
                    src={OFFICIAL_ASSETS.studentBalKrishna}
                    alt="Student holding charcoal portrait of Bal Krishna"
                    className="w-14 h-14 rounded-xl object-cover border border-stone-100 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#D82828] uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Student Work
                    </span>
                    <div className="text-xs font-bold text-stone-900">
                      Bal Krishna Charcoal Study
                    </div>
                    <div className="text-[11px] text-stone-500">Tap to view original artwork</div>
                  </div>
                </div>

                {/* Floating Dual-Camera Badge */}
                <div className="absolute -top-5 -right-3 z-20 bg-white px-3.5 py-2.5 rounded-2xl shadow-lg border border-stone-200 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#D82828]">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">
                      Live Zoom
                    </span>
                    <span className="text-xs font-bold text-stone-900">Dual-Camera View</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SKILLDREN-STYLE AGE GROUP FINDER & INTERACTIVE COURSE EXPLORER */}
      <section id="programs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-[#D82828]" />
            <span>Interactive Course Catalog</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Find the Perfect Art Class for You
          </h2>
          <p className="text-stone-600 text-base">
            Select an age category below to explore structured curriculums, batch sizes, and mediums. Click any card to inspect full syllabus or book a trial.
          </p>
        </div>

        {/* Skilldren-style Colorful Rounded Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
          {[
            { id: 'all', label: '🎨 All Programs', age: 'All Ages' },
            { id: 'kids', label: '🐣 Little Picassos', age: 'Ages 5–11' },
            { id: 'teens', label: '🚀 Young Masters', age: 'Ages 12–17' },
            { id: 'adults', label: '☕ Adult Drawing & Painting', age: 'Ages 18+' },
            { id: 'professional', label: '🏛️ Fine Art Atelier & Portraits', age: 'Advanced' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedAgeTab(tab.id as any)}
              className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                selectedAgeTab === tab.id
                  ? 'bg-stone-900 text-white shadow-md scale-105'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedAgeTab === tab.id ? 'bg-amber-400 text-stone-900 font-bold' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {tab.age}
              </span>
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Course Image Header with Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {course.level}
                    </span>
                    <span className="bg-amber-400 text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {course.ageGroup}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {course.batchSize}
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#D82828] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-1 line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Mediums Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.mediums.slice(0, 3).map((medium, mIdx) => (
                      <span
                        key={mIdx}
                        className="bg-stone-100 text-stone-700 text-[10px] font-medium px-2.5 py-0.5 rounded-full"
                      >
                        {medium}
                      </span>
                    ))}
                    {course.mediums.length > 3 && (
                      <span className="text-stone-400 text-[10px] font-semibold self-center">
                        +{course.mediums.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Highlights Bullet Preview */}
                  <ul className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    {course.highlights.slice(0, 2).map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => openFreeDemoModal()}
                  className="flex-1 bg-gradient-to-r from-[#D82828] to-[#E76F51] hover:opacity-95 text-white py-2.5 px-4 rounded-full font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Book Free Trial</span>
                </button>

                <button
                  onClick={() => handleOpenCourseDetail(course)}
                  className="border border-stone-300 hover:border-stone-800 text-stone-800 py-2.5 px-4 rounded-full font-bold text-xs hover:bg-stone-50 transition-all"
                  title="View complete course syllabus and curriculum"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SKILLDREN 4-STEP "HOW ONLINE & STUDIO LEARNING WORKS" */}
      <section className="bg-gradient-to-b from-[#FAF8F5] via-amber-50/20 to-[#FAF8F5] py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#D82828] font-bold flex items-center justify-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Simple 4-Step Process</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
              How Learning Works at The Art Horizon
            </h2>
            <p className="text-stone-600 text-base">
              A smooth, engaging journey designed to build confidence, fine motor control, and true artistic capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Book a Free Trial',
                desc: 'Pick your preferred date and slot for a 45-minute live interactive Zoom trial from anywhere in the world, or visit our Indore studio.',
                badge: 'Zero Commitment',
                color: 'border-amber-300 bg-amber-50/50',
                btnText: 'Book Free Trial',
                action: () => openFreeDemoModal(),
              },
              {
                step: '02',
                title: 'Skill Assessment',
                desc: 'Master artist Vikas Gothi evaluates your child’s natural observational skill, grip, medium preferences, and current level to recommend the perfect track.',
                badge: '1-on-1 Evaluation',
                color: 'border-rose-300 bg-rose-50/50',
                btnText: 'About Vikas Gothi',
                action: () => navigateTo('founder'),
              },
              {
                step: '03',
                title: 'Live Interactive Classes',
                desc: 'Join small batches (max 4–5 students) for ages 6 to 15 with 3 progressive levels (Beginner, Intermediate, Advanced). Dual cameras provide real-time draw-overs. 1-on-1 private classes are also available.',
                badge: 'Max 4–5 Students',
                color: 'border-teal-300 bg-teal-50/50',
                btnText: 'View Class Options',
                action: () => navigateTo('online-classes'),
              },
              {
                step: '04',
                title: 'Showcase & Certificate',
                desc: 'Students complete finished museum-quality artworks, participate in exhibitions, and receive recognized certificates of fine art achievement.',
                badge: 'Exhibition & Portfolio',
                color: 'border-indigo-300 bg-indigo-50/50',
                btnText: 'Explore Gallery',
                action: () => navigateTo('gallery'),
              },
            ].map((stepItem, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${stepItem.color} bg-white shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-extrabold text-[#D82828]">
                      {stepItem.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                      {stepItem.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>

                <button
                  onClick={stepItem.action}
                  className="text-xs font-bold text-stone-900 hover:text-[#D82828] flex items-center gap-1 group pt-2"
                >
                  <span>{stepItem.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY PARENTS & STUDENTS LOVE THE ART HORIZON (SKILLDREN 6-CARD GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-[#D82828]" />
            <span>The Art Horizon Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
            Why Parents & Students Choose Us
          </h2>
          <p className="text-stone-600 text-base">
            We don't do boring copy-paste drawing. We build real, lifelong fine art mastery with warmth, patience, and professional rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Video className="w-6 h-6 text-[#D82828]" />,
              title: 'Dual-Camera Live Experience',
              desc: 'One camera focuses directly overhead onto the instructor’s canvas and palette, while the other keeps eye contact. Students watch every brush blend in HD clarity.',
              tag: 'No Guesswork',
            },
            {
              icon: <Award className="w-6 h-6 text-[#F59E0B]" />,
              title: 'Mentored by Vikas Gothi',
              desc: 'Learn directly from an established artist with 15+ years of live experience in fine art, portraits, and murals. Your child never gets assigned to an untrained intern.',
              tag: 'Direct Founder Mentorship',
            },
            {
              icon: <Palette className="w-6 h-6 text-teal-600" />,
              title: 'All Mediums Under One Roof',
              desc: 'Oil painting, acrylics, watercolours, charcoal, graphite, soft pastels, Lippan art, and wall murals. We don’t limit creativity to just pencil sketching.',
              tag: 'Complete Fine Art Spectrum',
            },
            {
              icon: <Globe className="w-6 h-6 text-indigo-600" />,
              title: 'Flexible Global Timezones',
              desc: 'Dedicated slots tailored for students in the United States, United Kingdom, UAE, Canada, and Australia. Weekend and weekday evening options available.',
              tag: 'US, UK, UAE & Any Country',
            },
            {
              icon: <Users className="w-6 h-6 text-rose-600" />,
              title: 'Small Batches (Max 4–5 Students)',
              desc: 'With strictly 4 to 5 students per session across 3 age cohorts (6-8, 9-11, 12-15 yrs), every child receives instant draw-overs and feedback. 1-on-1 private classes are also available with tailored fee structure.',
              tag: 'Max 4-5 Students • 3 Levels',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
              title: 'Focus, Joy & Screen-Free Habit',
              desc: 'Art develops patient concentration, fine motor control, and emotional balance. A calming creative sanctuary away from video games and phone addiction.',
              tag: 'Holistic Growth',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D82828]">
                  {item.tag}
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MEET FOUNDER VIKAS GOTHI (FEATURING USER'S REAL PORTRAIT PHOTO) */}
      <section className="bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Founder Real Portrait Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-amber-400/80 shadow-2xl bg-stone-800">
                <img
                  src={OFFICIAL_ASSETS.founderPortrait}
                  alt="Vikas Gothi - Founder & Master Artist of The Art Horizon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-400 text-stone-950 px-4 py-2 rounded-xl font-bold text-xs shadow-lg">
                Founder & Mentor
              </div>
            </div>
          </div>

          {/* Founder Bio Details */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Founder & Master Artist</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                Vikas Gothi
              </h2>
              <p className="text-amber-300 font-serif italic text-lg sm:text-xl">
                "Every child is an artist; our mission is to ensure they remain an artist as they grow."
              </p>
            </div>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Based in Indore, Madhya Pradesh, Vikas Gothi has dedicated his life to fine arts education, large-scale
              architectural murals, and portrait commissions. With mastery across all mediums—including oil painting,
              charcoal realism, watercolors, and acrylics—he mentors young minds and adult hobbyists with warmth, patience,
              and structured classical technique.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-amber-300 font-bold text-lg block">15+ Years</span>
                <span className="text-[11px] text-stone-300">Fine Art & Murals</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-amber-300 font-bold text-lg block">500+</span>
                <span className="text-[11px] text-stone-300">Students Mentored</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-amber-300 font-bold text-lg block">All Mediums</span>
                <span className="text-[11px] text-stone-300">Oil, Acrylic, Charcoal</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigateTo('founder')}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 px-6 py-3 rounded-full font-bold text-sm transition-all"
              >
                Read Founder Profile
              </button>
              <button
                onClick={openFreeDemoModal}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full font-bold text-sm transition-all"
              >
                Book a Trial with Vikas Ji
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL STUDENT ARTWORK & STUDIO GALLERY (LIGHTBOX INTERACTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#D82828] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Creations</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
              Student Artwork & Studio Gallery
            </h2>
            <p className="text-stone-600 text-base">
              Original student drawings, master murals, and commission works. Tap any image to inspect in high resolution.
            </p>
          </div>

          <button
            onClick={() => navigateTo('gallery')}
            className="self-start md:self-end text-sm font-bold text-[#D82828] hover:text-stone-900 flex items-center gap-1.5 group"
          >
            <span>View Complete 25+ Artwork Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Gallery Grid: Authentic Student Creations, Master Murals & Classical Studies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_DATA.slice(0, 9).map((art) => (
            <div
              key={art.id}
              onClick={() => openLightbox(art)}
              className="group relative rounded-3xl overflow-hidden bg-stone-100 aspect-[3/4] cursor-pointer shadow-xs hover:shadow-xl transition-all border border-stone-200/80"
            >
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      art.category === 'student-work'
                        ? 'bg-amber-400 text-stone-950'
                        : art.category === 'murals'
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {art.category === 'student-work' ? 'Student Creation' : art.category === 'murals' ? 'Wall Mural' : 'Masterpiece'}
                  </span>
                  <span className="text-[10px] text-stone-300 truncate">{art.artist}</span>
                </div>
                <h4 className="font-serif font-bold text-lg sm:text-xl leading-snug">{art.title}</h4>
                <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">{art.medium}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOM COMMISSIONS & PROFESSIONAL SERVICES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-300/80 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D82828] block">
              Professional Fine Art Services
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
              Custom Portrait & Art Commissions in All Mediums
            </h3>
            <p className="text-stone-700 text-sm sm:text-base">
              We do not restrict commissions to charcoal. We create museum-grade custom portraits and artwork in{' '}
              <strong className="text-stone-950">Oil Painting, Acrylic, Watercolor, Charcoal, Colour Pencil, Wall Murals, and Large-Scale Rangoli</strong>{' '}
              for homes, hotels, and corporate clients worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => openEnquiryModal('portrait-commissions', 'Custom Portrait Commission (All Mediums)')}
              className="bg-stone-900 hover:bg-stone-800 text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md transition-all"
            >
              Request Commission Quote
            </button>
            <button
              onClick={() => navigateTo('portrait-commissions')}
              className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 px-6 py-3.5 rounded-full font-bold text-sm transition-all"
            >
              View Commission Details
            </button>
          </div>
        </div>
      </section>

      {/* 8. PARENT & STUDENT GOOGLE REVIEWS */}
      <section className="bg-stone-50 py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Google Customer Reviews</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
                Rated 4.9 / 5.0 on Google
              </h2>
              <p className="text-stone-600 text-base">
                Over <strong className="text-stone-900 font-semibold">{GOOGLE_REVIEWS_SUMMARY.totalReviews}+ verified reviews</strong> from families in Indore, across India, and international Zoom learners in the USA, UK, and UAE.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openWriteReviewModal}
                className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Write a Review</span>
              </button>
              <button
                onClick={() => navigateTo('testimonials')}
                className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>View All 128+ Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Google Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <GoogleIcon className="w-3.5 h-3.5" />
                      <span>{item.date || 'Verified'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-700 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.avatarColor || 'bg-amber-100'} text-white font-bold flex items-center justify-center text-sm shadow-2xs`}>
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 leading-tight flex items-center gap-1">
                        <span>{item.author}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </h4>
                      <span className="text-xs text-stone-500">{item.role}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SKILLDREN-STYLE PARENT FAQS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-base">
            Everything you need to know about starting your art journey with The Art Horizon.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {parentFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-stone-900 hover:text-[#D82828] transition-colors"
              >
                <span className="text-sm sm:text-base font-serif font-bold">{faq.q}</span>
                <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-stone-700" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-700" />
                  )}
                </span>
              </button>

              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. SKILLDREN FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Start With A Free 45-Minute Trial
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Ready to Discover the Artist Within You?
            </h2>

            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto">
              Join students across the USA, UK, UAE, and India learning fine art under Vikas Gothi.
              Experience our live dual-camera teaching format firsthand with zero commitment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={openFreeDemoModal}
                className="w-full sm:w-auto bg-gradient-to-r from-[#D82828] to-[#F59E0B] hover:opacity-95 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Book Free Trial Class</span>
              </button>

              <a
                href={`https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello Vikas ji, I would like to book a free trial class for The Art Horizon.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-4 rounded-full font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <p className="text-stone-400 text-xs pt-2">
              📍 Studio Address: 266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore • Phone: +91 99818 83598
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
