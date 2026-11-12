import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  INTERNATIONAL_DETAILS,
  ONLINE_AGE_GROUPS,
  ONLINE_CLASS_SPECIFICATIONS,
} from '../data/siteConfig';
import {
  Globe,
  Video,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  User,
  Users,
  Award,
  Layers,
  Star,
  Check,
  Zap,
} from 'lucide-react';

export const OnlineClassesPage: React.FC = () => {
  const { openFreeDemoModal, addEnquiry } = useStudio();

  // Tab state for age cohorts
  const [activeAgeTab, setActiveAgeTab] = useState<string>('age-6-8');

  // Local form state for direct enquiry on the page
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [studentAge, setStudentAge] = useState('6 to 8 Years');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [classFormat, setClassFormat] = useState('Small Group Batch (Max 4-5 Students)');
  const [timeSlot, setTimeSlot] = useState('Weekend Morning (US EST / UK GMT)');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedAgeGroup =
    ONLINE_AGE_GROUPS.find((group) => group.id === activeAgeTab) || ONLINE_AGE_GROUPS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      serviceCategory: 'international-online',
      serviceDetail: `Online Zoom - ${studentAge} [${selectedLevel}] (${classFormat})`,
      countryOrCity: country,
      timeSlotPreference: timeSlot,
      message: message.trim() || `Format: ${classFormat}. Age: ${studentAge}, Level: ${selectedLevel}, Country: ${country}, Slot: ${timeSlot}.`,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="space-y-20 py-10 pb-24">
      {/* 1. Page Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D82828]/10 via-amber-500/10 to-teal-500/10 border border-[#D82828]/20 text-[#D82828] text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4 text-[#D82828]" />
          <span>Global Live Interactive Zoom Atelier</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight max-w-5xl mx-auto">
          International Online Art Classes <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B]">
            Ages 6 to 15 Years Old
          </span>
        </h1>

        <p className="text-stone-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          Small, intimate batches with <strong className="text-stone-900">strictly 4 to 5 students maximum</strong> per batch.
          Structured across 3 distinct age cohorts with <strong className="text-stone-900">Beginner, Intermediate, and Advanced</strong> levels.
          Welcoming students from <strong className="text-stone-900">any country worldwide</strong>—including the US, UK, UAE, Canada, Australia, Singapore & Europe.
        </p>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-[#D82828]">4 – 5</div>
            <div className="text-xs font-bold text-stone-800 uppercase mt-0.5">Students / Batch</div>
            <div className="text-[11px] text-stone-500">Max capped for personal focus</div>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">6 – 15</div>
            <div className="text-xs font-bold text-stone-800 uppercase mt-0.5">Years Age Cohorts</div>
            <div className="text-[11px] text-stone-500">6-8, 9-11 & 12-15 groups</div>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-teal-600">3 Levels</div>
            <div className="text-xs font-bold text-stone-800 uppercase mt-0.5">In Every Batch</div>
            <div className="text-[11px] text-stone-500">Beginner • Inter. • Adv.</div>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
            <div className="text-2xl sm:text-3xl font-black text-purple-600">1-on-1</div>
            <div className="text-xs font-bold text-stone-800 uppercase mt-0.5">Private Classes</div>
            <div className="text-[11px] text-stone-500">Custom 1:1 sessions available</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={openFreeDemoModal}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D82828] to-[#F59E0B] text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
            <span>Book 45-Min Free Demo Class</span>
          </button>
          <a
            href="#age-structure"
            className="inline-flex items-center gap-2 bg-white border border-stone-300 text-stone-800 hover:border-stone-900 px-6 py-3.5 rounded-full font-semibold text-sm transition-all"
          >
            <span>Explore Age Batches & Levels</span>
            <ArrowRight className="w-4 h-4 text-stone-500" />
          </a>
        </div>
      </section>

      {/* 2. Interactive Age Groups & 3 Levels Matrix (CORE REQUEST) */}
      <section id="age-structure" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D82828] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Age Groups & 3 Levels Matrix
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Tailored For Ages 6 to 15 Years Old
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Every child is placed in an age-matched micro-batch of <strong className="text-stone-900">max 4 to 5 students</strong>.
            Within each age group, our curriculum advances through 3 structured tiers: <strong>Beginner, Intermediate, and Advanced</strong>.
          </p>
        </div>

        {/* Age Group Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 bg-stone-100/80 rounded-2xl max-w-2xl mx-auto">
          {ONLINE_AGE_GROUPS.map((group) => {
            const isSelected = activeAgeTab === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setActiveAgeTab(group.id)}
                className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'bg-white text-[#D82828] shadow-md border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                <span>{group.ageRange}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-[#D82828]' : 'text-stone-400'}`}>
                  {group.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Age Group Overview Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D82828] uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                <span>Micro-Batch: Max 4 to 5 Students</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {selectedAgeGroup.ageRange} • {selectedAgeGroup.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                {selectedAgeGroup.recommendedFor}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-100/80 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-300">
                1-Hour Classes • 2x / Week
              </span>
              <span className="bg-teal-100/80 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-300">
                Live Interactive Zoom
              </span>
            </div>
          </div>

          {/* 3 Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedAgeGroup.levels.map((lvl, index) => {
              const badgeColors =
                lvl.name === 'Beginner'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : lvl.name === 'Intermediate'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';

              const headerBorder =
                lvl.name === 'Beginner'
                  ? 'border-emerald-500'
                  : lvl.name === 'Intermediate'
                  ? 'border-amber-500'
                  : 'border-purple-500';

              return (
                <div
                  key={index}
                  className={`bg-stone-50/70 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-all relative overflow-hidden border-t-4 ${headerBorder}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeColors}`}>
                        Level {index + 1}: {lvl.name}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">Step {index + 1} of 3</span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed min-h-[40px]">
                      {lvl.description}
                    </p>

                    <div>
                      <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Core Focus Topics:
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {lvl.focusTopics.map((topic, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">
                      Milestone Outcome
                    </div>
                    <div className="text-xs font-semibold text-stone-800">
                      {lvl.outcomes}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Not sure which level fits your child? We conduct an initial free assessment during the 45-minute demo class to recommend the right placement.
              </span>
            </div>
            <button
              onClick={openFreeDemoModal}
              className="font-bold underline text-amber-800 hover:text-amber-950 shrink-0"
            >
              Book Placement Assessment
            </button>
          </div>
        </div>
      </section>

      {/* 3. Dedicated 1-on-1 Personalized Mentorship Section (CORE REQUEST) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-[#1E1B18] to-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl relative overflow-hidden">
          {/* Subtle artistic background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D82828]/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Premium Private Instruction</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                One-on-One (1:1) Classes Also Available
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                In addition to our small batches of 4 to 5 students, <strong className="text-white">individual one-on-one sessions</strong> are available for students who prefer completely personalized attention, customized curriculum pace, preparation for international art competitions, or fine art school portfolios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-300">
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>100% individual mentor focus on your child’s unique artistic pace</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Flexible scheduling tailored to your exact international timezone</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Deep dive into specialized mediums: Oils, Realistic Portraits, Acrylics</span>
                </div>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Targeted portfolio preparation for creative schools (NID, NIFT, US/UK art colleges)</span>
                </div>
              </div>

              {/* Crucial Note on Fee Structure */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>Note on Pricing:</strong> The fee structure for one-on-one (1:1) sessions is different from small group batches. Please request custom details below or via WhatsApp.
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-[#D82828] text-stone-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Book 1-on-1 Classes</h3>
                <p className="text-xs text-stone-300 mt-1">
                  Connect directly with Founder Vikas Gothi for custom slot availability and 1:1 fee plan.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="#enquiry-form"
                  onClick={() => {
                    setClassFormat('One-on-One (1:1) Private Mentorship');
                  }}
                  className="w-full inline-block bg-white text-stone-900 hover:bg-amber-300 font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
                >
                  Request 1:1 Details Below
                </a>
                <a
                  href="https://wa.me/919981883598?text=Hello%20Vikas%20ji,%20I%20would%20like%20to%20enquire%20about%201-on-1%20private%20online%20art%20classes%20for%20my%20child."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  Chat on WhatsApp (+91 99818 83598)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 5 Core Pillars of Our Online Atelier */}
      <section className="bg-stone-50 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
              Methodology & Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Why Parents Worldwide Trust The Art Horizon
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Engineered so that physical distance never compromises personal attention, technique fidelity, or artistic joy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTERNATIONAL_DETAILS.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 border border-stone-200/90 rounded-2xl space-y-3 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D82828]/10 text-[#D82828] flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Country Availability Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
            Timezones & Geographic Reach
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Convenient Batch Timings for Students Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Classes are synchronized with international weekend mornings and weekday evenings so children learn when they are refreshed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERNATIONAL_DETAILS.targetCountries.map((c, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200/90 shadow-xs p-5 rounded-2xl space-y-2 hover:border-[#D82828] hover:shadow-md transition-all"
            >
              <div className="text-3xl">{c.flag}</div>
              <div className="font-serif font-bold text-stone-900 text-base">{c.country}</div>
              <div className="text-xs text-amber-700 font-semibold">{c.timeZones}</div>
              <div className="text-[11px] text-stone-500 leading-relaxed">{c.popularPrograms}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Dedicated International Class Enquiry Form */}
      <section id="enquiry-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white border border-stone-200 p-8 sm:p-12 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2 border-b border-stone-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
              Begin Your Artistic Journey
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Request Online Class Details & Free Demo
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
              Choose your child’s age cohort, preferred level, and batch format. Our academic coordinator will share schedule options and fee details within 24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Enquiry Received!</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. We have noted your interest for {studentAge} ({selectedLevel} - {classFormat}). We will share the batch syllabus and trial class links via WhatsApp / Email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Student / Parent Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma / David Smith"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp / Contact Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (US) / +44 (UK) / +971 (UAE) / +91 (India)"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Country of Residence</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  >
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="Other Country">Other Country</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Class Format Preference</label>
                  <select
                    value={classFormat}
                    onChange={(e) => setClassFormat(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828] font-medium"
                  >
                    <option value="Small Group Batch (Max 4-5 Students)">Small Group (Max 4–5 Students)</option>
                    <option value="One-on-One (1:1) Private Mentorship">One-on-One (1:1) Private (Different Fee)</option>
                  </select>
                </div>
              </div>

              {/* Age Cohort & Level Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Student Age Group (6 to 15 Years)
                  </label>
                  <select
                    value={studentAge}
                    onChange={(e) => setStudentAge(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  >
                    <option value="6 to 8 Years">6 to 8 Years Old (Junior Artists)</option>
                    <option value="9 to 11 Years">9 to 11 Years Old (Creative Explorers)</option>
                    <option value="12 to 15 Years">12 to 15 Years Old (Young Masters)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preferred Batch Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  >
                    <option value="Beginner">Beginner (Foundations & Motor Control)</option>
                    <option value="Intermediate">Intermediate (Realism, Shading & Proportions)</option>
                    <option value="Advanced">Advanced (Atelier Realism & Portfolio)</option>
                    <option value="Assess during Demo">Assess & Recommend during Free Demo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Time Window</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                >
                  <option value="Weekend Morning (US EST / UK GMT)">Weekend Morning (US EST / UK GMT)</option>
                  <option value="Weekend Afternoon / Evening (UAE GST)">Weekend Afternoon / Evening (UAE GST)</option>
                  <option value="Weekday Evening (US PST / EST)">Weekday Evening (US PST / EST)</option>
                  <option value="Flexible / Contact me with options">Flexible / Contact me with available slots</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Specific Learning Goals or Questions
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us if your child has prior drawing experience or specific mediums they are passionate about..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-stone-500">
                  Transparent details & free trial link sent within 24 hours. No upfront payment required.
                </span>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D82828] to-[#F59E0B] hover:opacity-95 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Request Class Details</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
