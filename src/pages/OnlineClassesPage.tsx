import React, { useEffect, useMemo, useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { INTERNATIONAL_DETAILS } from '../data/siteConfig';
import { OnlineCourseProgram } from '../types';
import {
  Globe,
  Video,
  Clock,
  CheckCircle2,
  Sparkles,
  Send,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  User,
  Users,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Phone,
  Layers,
  Award,
  FileText,
  Download,
  Palette,
} from 'lucide-react';

const parseCurriculumTopic = (raw: string) => {
  const match = raw.match(/^\[([^\]]+)\]\s*(.+?)\s*(?:—|--|-)\s*(.+)$/);
  if (match) {
    return {
      category: match[1].trim(),
      title: match[2].trim(),
      medium: match[3].trim(),
    };
  }
  const catOnly = raw.match(/^\[([^\]]+)\]\s*(.+)$/);
  if (catOnly) {
    return {
      category: catOnly[1].trim(),
      title: catOnly[2].trim(),
      medium: '',
    };
  }
  return { category: '', title: raw, medium: '' };
};

const getCategoryBadgeClass = (category: string) => {
  const key = category.toLowerCase();
  if (key.includes('still')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (key.includes('landscape') || key.includes('perspective'))
    return 'bg-sky-50 text-sky-800 border-sky-200';
  if (key.includes('sketch') || key.includes('charcoal'))
    return 'bg-stone-100 text-stone-800 border-stone-300';
  if (key.includes('flower') || key.includes('watercolor'))
    return 'bg-teal-50 text-teal-800 border-teal-200';
  if (key.includes('animal') || key.includes('wildlife'))
    return 'bg-orange-50 text-orange-800 border-orange-200';
  if (key.includes('bird')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (key.includes('modern') || key.includes('concept') || key.includes('acrylic'))
    return 'bg-rose-50 text-rose-800 border-rose-200';
  if (key.includes('folk') || key.includes('heritage'))
    return 'bg-yellow-50 text-yellow-900 border-yellow-300';
  if (key.includes('anatomy')) return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  return 'bg-stone-100 text-stone-700 border-stone-200';
};

export const OnlineClassesPage: React.FC = () => {
  const {
    cmsState,
    selectedCourseSlug,
    setSelectedCourseSlug,
    openCourseDetail,
    openFreeDemoModal,
    addEnquiry,
    businessConfig,
  } = useStudio();

  const { onlineCourses, siteContent } = cmsState;

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0);
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<string>('All');

  // Embedded Book Your Free Demo form state (Section 8)
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [country, setCountry] = useState('United States');
  const [selectedCourse, setSelectedCourse] = useState('Junior Artist Program (Age: 6–8 Years)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeSlot, setTimeSlot] = useState('Weekend Morning (USA / UK)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const activeCourse: OnlineCourseProgram | undefined = useMemo(() => {
    if (!selectedCourseSlug) return undefined;
    return onlineCourses.find((c) => c.slug === selectedCourseSlug || c.id === selectedCourseSlug);
  }, [onlineCourses, selectedCourseSlug]);

  useEffect(() => {
    setSelectedLevelIdx(0);
    setSelectedTopicCategory('All');
  }, [activeCourse?.id]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentName.trim() || !phone.trim()) {
      setFormError('Please enter the student name and contact phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    const ok = await addEnquiry({
      name: `${studentName.trim()}${parentName.trim() ? ` (Parent: ${parentName.trim()})` : ''}`,
      email: email.trim(),
      phone: phone.trim(),
      serviceCategory: 'international-online',
      serviceDetail: `International Online Demo - ${selectedCourse}`,
      countryOrCity: country,
      studentAge: studentAge.trim() || selectedCourse,
      timeSlotPreference: timeSlot,
      message:
        notes.trim() ||
        `International Online Free Demo Request. Parent: ${parentName.trim() || 'N/A'}, Student: ${studentName.trim()}, Age: ${
          studentAge.trim() || 'N/A'
        }, Country: ${country}, Course: ${selectedCourse}.`,
    });
    setIsSubmitting(false);

    if (!ok) {
      setFormError('Unable to reach server right now. Please try again or message us on WhatsApp.');
      return;
    }

    setIsSubmitted(true);
  };

  const onlineFaqs = [
    {
      q: 'What age groups are eligible for the International Online Art Classes?',
      a: 'We welcome children aged 6 to 15 years across three age-specific programs: Junior Artist Program (Age: 6–8 Years), Young Artist Program (Age: 9–11 Years), and Senior Artist Program (Age: 12–15 Years).',
    },
    {
      q: 'How many students are in each online batch?',
      a: 'Classes run in strictly small batches of 4 to 6 students so every child receives step-by-step live guidance and personalized attention on Zoom.',
    },
    {
      q: 'How many classes are held each month and how long is each course?',
      a: 'Each batch follows a 3-month structured course schedule with 8 live interactive classes per month, conducted in clear English-language instruction.',
    },
    {
      q: 'Can families outside India join these classes?',
      a: 'Yes! Our international batches welcome families from the USA, UK, UAE, Oman, Kuwait, Canada, Australia, Singapore, and any country worldwide with flexible international time zones.',
    },
    {
      q: 'Are one-on-one (1:1) private sessions available?',
      a: 'Yes, private one-on-one classes are available for students seeking individual pacing or custom schedules. Note that the fee structure for 1-on-1 classes is different from group batches.',
    },
    {
      q: 'How do I get the detailed weekly curriculum or fee schedule?',
      a: 'Book a free demo class using any button on this page or message us at +91 9981883598—our academic coordinator will walk you through placement, timings, and detailed syllabus information.',
    },
  ];

  // ============================================================
  // DEDICATED COURSE DETAIL VIEW (Update 5)
  // ============================================================
  if (activeCourse) {
    const hasCustomModules = activeCourse.curriculumModules && activeCourse.curriculumModules.length > 0;
    const hasCustomDetails =
      hasCustomModules ||
      activeCourse.techniques.length > 0 ||
      activeCourse.skillsDeveloped.length > 0 ||
      activeCourse.learningOutcomes.length > 0;

    return (
      <div className="space-y-14 py-10 pb-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setSelectedCourseSlug(null);
                window.location.hash = '#/online-classes';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700 hover:text-[#D82828] bg-white border border-stone-200 px-4 py-2 rounded-full shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to International Online Classes</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {onlineCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openCourseDetail(c.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    c.id === activeCourse.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  {c.title} ({c.ageGroup})
                </button>
              ))}
            </div>
          </div>

          {/* Course Hero Split */}
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 bg-stone-100 relative min-h-[280px]">
              <img
                src={activeCourse.heroImage}
                alt={`${activeCourse.title} (${activeCourse.ageGroup})`}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-[#D82828] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                Age: {activeCourse.ageGroup}
              </span>
            </div>

            <div className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B85D38]">
                  <Globe className="w-4 h-4" />
                  <span>International Online Art Program</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                  {activeCourse.title}
                </h1>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{activeCourse.overview}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Duration & Pacing
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{activeCourse.duration}</div>
                  </div>
                  <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Class Format
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{activeCourse.classFormat}</div>
                  </div>
                  <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Schedule
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{activeCourse.scheduleSummary}</div>
                  </div>
                  <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Medium of Instruction
                    </div>
                    <div className="font-semibold text-stone-900 mt-0.5">{activeCourse.language}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() =>
                    openFreeDemoModal({
                      courseTitle: activeCourse.title,
                      ageGroup: activeCourse.ageGroup,
                      mode: 'online',
                    })
                  }
                  className="bg-gradient-to-r from-[#D82828] to-[#F59E0B] hover:opacity-95 text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Book Your Free Demo</span>
                </button>
                {activeCourse.curriculumPdfUrl && (
                  <a
                    href={activeCourse.curriculumPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="bg-[#0B1E3F] hover:bg-stone-900 text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Download Official Syllabus PDF</span>
                  </a>
                )}
                <a
                  href={`https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello Vikas Sir / The Art Horizon, I would like details and batch timings for the ${activeCourse.title} (${activeCourse.ageGroup}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>
          </div>

          {/* Curriculum, Techniques, Skills & Outcomes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-5 h-5 text-[#D82828]" />
                      <h2 className="font-serif text-2xl font-bold text-stone-900">
                        Course Curriculum & Syllabus
                      </h2>
                    </div>
                    {hasCustomModules && (
                      <p className="text-xs text-stone-500 pl-7.5">
                        {activeCourse.curriculumModules.length} Progressive Levels ·{' '}
                        {activeCourse.curriculumModules.reduce((acc, m) => acc + m.topics.length, 0)} Guided Artworks & Studio Projects
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeCourse.curriculumPdfUrl && (
                      <a
                        href={activeCourse.curriculumPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FAF8F5] hover:bg-stone-900 hover:text-white text-stone-800 border border-stone-300 px-3.5 py-1.5 rounded-full transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D82828]" />
                        <span>Official PDF</span>
                      </a>
                    )}
                    {!hasCustomModules && activeCourse.curriculumPendingPdf && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Upload-Ready for Official Curriculum PDF</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject Tracks */}
                {activeCourse.whatChildrenLearn && activeCourse.whatChildrenLearn.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">
                      Core Subjects:
                    </span>
                    {activeCourse.whatChildrenLearn.map((subj, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getCategoryBadgeClass(subj)}`}
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                )}

                {hasCustomModules ? (
                  (() => {
                    const safeLevelIdx =
                      selectedLevelIdx >= 0 && selectedLevelIdx < activeCourse.curriculumModules.length
                        ? selectedLevelIdx
                        : 0;
                    const visibleModules =
                      selectedLevelIdx === -1
                        ? activeCourse.curriculumModules
                        : [activeCourse.curriculumModules[safeLevelIdx]];

                    const availableCategories = Array.from(
                      new Set(
                        visibleModules.flatMap((m) =>
                          (m.topics || []).map((t) => parseCurriculumTopic(t).category).filter(Boolean)
                        )
                      )
                    );

                    return (
                      <div className="space-y-5">
                        {/* Level Tabs */}
                        <div className="flex flex-wrap items-center gap-2">
                          {activeCourse.curriculumModules.map((mod, idx) => {
                            const shortName = mod.moduleTitle.split('·')[0].trim();
                            const isActive = selectedLevelIdx === idx;
                            return (
                              <button
                                key={mod.id || idx}
                                type="button"
                                onClick={() => {
                                  setSelectedLevelIdx(idx);
                                  setSelectedTopicCategory('All');
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                  isActive
                                    ? 'bg-[#D82828] border-[#D82828] text-white shadow-xs'
                                    : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-400'
                                }`}
                              >
                                {shortName} ({mod.topics.length})
                              </button>
                            );
                          })}
                          {activeCourse.curriculumModules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLevelIdx(-1);
                                setSelectedTopicCategory('All');
                              }}
                              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                selectedLevelIdx === -1
                                  ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                                  : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-400'
                              }`}
                            >
                              All Levels ({activeCourse.curriculumModules.reduce((a, m) => a + m.topics.length, 0)})
                            </button>
                          )}
                        </div>

                        {/* Category Filter Row */}
                        {availableCategories.length > 1 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-stone-500 mr-1">Filter by Topic:</span>
                            <button
                              type="button"
                              onClick={() => setSelectedTopicCategory('All')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                selectedTopicCategory === 'All'
                                  ? 'bg-stone-900 text-white'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              All
                            </button>
                            {availableCategories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedTopicCategory(cat)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                  selectedTopicCategory === cat
                                    ? 'bg-[#B85D38] text-white'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Rendered Levels & Syllabus Table */}
                        <div className="space-y-5">
                          {visibleModules.map((mod, mIdx) => {
                            const levelIndex =
                              selectedLevelIdx === -1 ? mIdx : safeLevelIdx;
                            const parsedTopics = (mod.topics || [])
                              .map((raw, tIdx) => ({
                                num: tIdx + 1,
                                ...parseCurriculumTopic(raw),
                              }))
                              .filter(
                                (item) =>
                                  selectedTopicCategory === 'All' || item.category === selectedTopicCategory
                              );

                            return (
                              <div
                                key={mod.id || mIdx}
                                className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-5 space-y-4"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-7 h-7 rounded-full bg-[#D82828] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                      {levelIndex + 1}
                                    </span>
                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                                      {mod.moduleTitle}
                                    </h3>
                                  </div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                    {parsedTopics.length} Shown
                                  </span>
                                </div>

                                {mod.techniques && mod.techniques.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pl-0 sm:pl-9">
                                    {mod.techniques.map((tech, i) => (
                                      <span
                                        key={i}
                                        className="text-[11px] bg-white border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg font-medium"
                                      >
                                        • {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {parsedTopics.length > 0 && (
                                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                                    <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-4 py-2.5 bg-stone-100/80 border-b border-stone-200 text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                                      <div className="col-span-1">#</div>
                                      <div className="col-span-2">Category</div>
                                      <div className="col-span-5">Drawing / Studio Project</div>
                                      <div className="col-span-4">Art Medium & Materials</div>
                                    </div>
                                    <div className="divide-y divide-stone-100">
                                      {parsedTopics.map((item) => (
                                        <div
                                          key={item.num}
                                          className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-3 px-4 py-3 text-xs items-start sm:items-center hover:bg-stone-50/70 transition-colors"
                                        >
                                          <div className="sm:col-span-1 font-bold text-stone-400">
                                            {String(item.num).padStart(2, '0')}
                                          </div>
                                          <div className="sm:col-span-2">
                                            {item.category ? (
                                              <span
                                                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                                                  item.category
                                                )}`}
                                              >
                                                {item.category}
                                              </span>
                                            ) : (
                                              <span className="text-stone-400">—</span>
                                            )}
                                          </div>
                                          <div className="sm:col-span-5 font-semibold text-stone-900 leading-snug">
                                            {item.title}
                                          </div>
                                          <div className="sm:col-span-4 text-stone-600 flex items-center gap-1.5">
                                            {item.medium ? (
                                              <>
                                                <Palette className="w-3 h-3 text-[#B85D38] shrink-0 hidden sm:inline" />
                                                <span>{item.medium}</span>
                                              </>
                                            ) : (
                                              <span className="text-stone-400">Guided Studio Medium</span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-700" />
                      <span>Official Module-by-Module Syllabus (Awaiting Curriculum PDF)</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      The structured module list, lesson-by-lesson techniques, skills developed, and learning
                      outcomes for <strong>{activeCourse.title} ({activeCourse.ageGroup})</strong> are ready to be
                      populated directly from your official Curriculum PDF without any invented placeholder topics.
                    </p>
                    <p className="text-xs text-stone-600">
                      Studio administrators can upload or update all modules, techniques, skills, and outcomes at any
                      time via <strong>Studio Portal → Online Courses</strong>, or parents may book a free demo class
                      for an interactive syllabus walkthrough.
                    </p>
                  </div>
                )}

                {/* Techniques / Skills / Learning Outcomes when populated */}
                {hasCustomDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {activeCourse.techniques.length > 0 && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85D38]">
                          Techniques Covered
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-700">
                          {activeCourse.techniques.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeCourse.skillsDeveloped.length > 0 && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85D38]">
                          Skills Developed
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-700">
                          {activeCourse.skillsDeveloped.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeCourse.learningOutcomes.length > 0 && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#B85D38]">
                          Learning Outcomes
                        </h4>
                        <ul className="space-y-1.5 text-xs text-stone-700">
                          {activeCourse.learningOutcomes.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar: Program Benefits & Gallery Images */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-xs">
                <h3 className="font-serif text-xl font-bold text-stone-900">Program Highlights</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                  {activeCourse.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D82828] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-stone-100">
                  <div className="bg-[#0B1E3F] text-white rounded-2xl p-4 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      1-on-1 Sessions Available
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      Prefer individualized instruction for this age group? Private one-on-one classes are also
                      available (separate 1:1 fee applies).
                    </p>
                  </div>
                </div>
              </div>

              {activeCourse.referenceImages && activeCourse.referenceImages.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-3 shadow-xs">
                  <h3 className="font-serif text-lg font-bold text-stone-900">Program Artwork & Banner</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {activeCourse.referenceImages.map((imgUrl, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                        <img
                          src={imgUrl}
                          alt={`${activeCourse.title} showcase ${idx + 1}`}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN INTERNATIONAL ONLINE ART CLASSES PAGE (Update 4 + Update 5)
  // ============================================================
  return (
    <div className="space-y-20 py-10 pb-24 bg-[#FAF8F5]">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0B1E3F] via-[#17284A] to-[#1C1917] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="max-w-4xl space-y-5 relative z-10">
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>INTERNATIONAL ONLINE ART CLASSES · Ages 6–15</span>
            </div>

            <p className="text-amber-300 font-semibold text-sm sm:text-base tracking-wide">
              Live Online Drawing & Painting Classes for Kids Aged 6–15
            </p>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {siteContent.onlineHeroHeading}
            </h1>

            <p className="text-stone-200 text-base sm:text-lg leading-relaxed max-w-2xl">
              {siteContent.onlineHeroSubtext}
            </p>

            <p className="text-xs sm:text-sm text-stone-300">
              Welcoming international families from the{' '}
              <strong className="text-white">USA, UK, UAE, Oman, Kuwait</strong>, and any country worldwide.
            </p>

            {/* Quick Facts Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5">
                <div className="text-xl sm:text-2xl font-black text-amber-300">4–6</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                  Students / Batch
                </div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5">
                <div className="text-xl sm:text-2xl font-black text-amber-300">8 / Month</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                  Live Zoom Classes
                </div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5">
                <div className="text-xl sm:text-2xl font-black text-amber-300">3 Months</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                  Structured Courses
                </div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5">
                <div className="text-xl sm:text-2xl font-black text-amber-300">English</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-200">
                  Step-by-Step Live
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openFreeDemoModal({ mode: 'online' })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D82828] via-[#E76F51] to-[#F59E0B] hover:opacity-95 text-white px-7 py-3.5 rounded-full font-extrabold text-sm shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{siteContent.onlineHeroPrimaryCta}</span>
              </button>
              <button
                onClick={() => scrollToSection('online-courses')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-all"
              >
                <span>{siteContent.onlineHeroSecondaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE OUR ONLINE ART CLASSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
            General Course Features
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Why Choose Our Online Art Classes
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Thoughtfully structured live online mentorship designed for measurable artistic confidence and joyful focus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Video,
              title: 'Live Interactive Zoom Classes',
              desc: 'Real-time two-way instruction with clear demonstrations and live guidance every class.',
            },
            {
              icon: Users,
              title: 'Small Batches (4–6 Students)',
              desc: 'Strictly small group batches so every child is noticed, guided, and encouraged.',
            },
            {
              icon: Clock,
              title: '8 Live Classes Per Month',
              desc: 'Steady two-classes-a-week rhythm designed across 3-month structured courses.',
            },
            {
              icon: Layers,
              title: 'Age-Appropriate Learning',
              desc: 'Dedicated age bands (6–8, 9–11, 12–15) so students learn alongside peers at their stage.',
            },
            {
              icon: BookOpen,
              title: 'Step-by-Step Guidance',
              desc: 'Complex drawings broken into clear, followable visual steps that build confidence.',
            },
            {
              icon: Globe,
              title: 'English-Language Instruction',
              desc: 'Clear English medium instruction suited for international families across all regions.',
            },
            {
              icon: Star,
              title: 'Personalized Attention',
              desc: 'Live mentor feedback on posture, proportions, shading, and color application.',
            },
            {
              icon: User,
              title: '1-on-1 Classes Available',
              desc: 'Private 1-on-1 sessions also available with tailored schedules (different fee applies).',
            },
          ].map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D82828]/10 text-[#D82828] flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. THREE AGE-BASED ART PROGRAMS (Course 1, 2, 3) */}
      <section id="online-courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
            Three Age-Based Programs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Explore Our International Online Courses
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Select your child’s age program below to inspect full course details or book a free live demo class.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {onlineCourses.map((course) => (
            <article
              key={course.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => openCourseDetail(course.slug)}
                  className="relative aspect-[16/10] bg-stone-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={course.heroImage}
                    alt={`${course.title} (${course.ageGroup})`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-stone-950/85 text-amber-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Age: {course.ageGroup}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#B85D38]">
                    {course.badge}
                  </div>
                  <h3
                    onClick={() => openCourseDetail(course.slug)}
                    className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#D82828] transition-colors cursor-pointer"
                  >
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{course.overview}</p>

                  <div className="pt-2 space-y-1.5 text-xs text-stone-700 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#D82828] shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-[#D82828] shrink-0" />
                      <span>{course.classFormat}</span>
                    </div>
                    {course.curriculumModules.length > 0 && (
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {course.curriculumModules.length} Levels ·{' '}
                          {course.curriculumModules.reduce((acc, m) => acc + m.topics.length, 0)} Structured Lessons
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={() =>
                      openFreeDemoModal({
                        courseTitle: course.title,
                        ageGroup: course.ageGroup,
                        mode: 'online',
                      })
                    }
                    className="flex-1 bg-[#D82828] hover:bg-[#B81E1E] text-white py-2.5 px-4 rounded-full text-xs font-bold transition-colors shadow-xs"
                  >
                    Book Your Free Demo
                  </button>
                  <button
                    onClick={() => openCourseDetail(course.slug)}
                    className="border border-stone-300 hover:border-stone-900 text-stone-800 py-2.5 px-4 rounded-full text-xs font-bold transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <span>Full Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {course.curriculumPdfUrl && (
                  <a
                    href={course.curriculumPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0B1E3F] bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 py-2 px-3 rounded-full transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D82828]" />
                    <span>Download Official Syllabus PDF</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. COURSE DETAILS & CURRICULUM OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white border border-stone-200 rounded-3xl p-7 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B85D38]">
                Curriculum Architecture
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Course Details & Curriculum Overview
              </h2>
            </div>
            <button
              onClick={() => openFreeDemoModal({ mode: 'online' })}
              className="self-start md:self-center bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors"
            >
              Book Assessment Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {onlineCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D82828] uppercase tracking-wider">
                      Age {course.ageGroup}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">
                      {course.curriculumModules.length > 0
                        ? `${course.curriculumModules.length} Levels · ${course.curriculumModules.reduce(
                            (acc, m) => acc + m.topics.length,
                            0
                          )} Topics`
                        : '3 Months'}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">{course.title}</h3>
                  {course.whatChildrenLearn.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {course.whatChildrenLearn.map((subj, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>
                  )}
                  {course.curriculumModules.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-stone-700 pt-1">
                      {course.curriculumModules.map((m, i) => (
                        <li key={m.id || i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{m.moduleTitle}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950">
                      <strong>Upload-Ready Syllabus:</strong> Awaiting your official Curriculum PDF to populate
                      exact lesson modules without inventing topics.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => openCourseDetail(course.slug)}
                    className="text-xs font-bold text-[#D82828] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Explore {course.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {course.curriculumPdfUrl && (
                    <a
                      href={course.curriculumPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-[11px] font-bold text-stone-700 hover:text-stone-950 inline-flex items-center gap-1 bg-white border border-stone-200 px-2.5 py-1 rounded-full"
                    >
                      <Download className="w-3 h-3 text-[#D82828]" />
                      <span>PDF</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 1-on-1 Option Notice */}
          <div className="bg-gradient-to-r from-[#0B1E3F] to-[#1E293B] text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Personalized Option
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                One-on-One (1:1) Private Classes Also Available
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
                Alongside our 4–6 student group batches, parents may book private 1-on-1 sessions for flexible
                scheduling or tailored guidance. The fee structure for 1-on-1 sessions is different from group batches.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCourse('One-on-One (1:1) Private Mentorship');
                scrollToSection('book-free-demo');
              }}
              className="shrink-0 bg-amber-400 hover:bg-amber-300 text-stone-950 px-5 py-2.5 rounded-full text-xs font-bold transition-colors"
            >
              Enquire for 1-on-1
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW OUR ONLINE CLASSES WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
            Simple 3-Step Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            How Our Online Classes Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Book Your Free Demo Class',
              desc: 'Select your child’s age program and international time zone. Receive your live Zoom link and join an interactive assessment session.',
            },
            {
              step: '02',
              title: 'Join a 4–6 Student Live Batch',
              desc: 'Your child enters a friendly English-medium cohort matched to their age (6–8, 9–11, or 12–15) with clear overhead step-by-step teaching.',
            },
            {
              step: '03',
              title: 'Grow Across 8 Live Classes / Month',
              desc: 'Over the 3-month structured course, students complete guided artworks while receiving direct mentor feedback in every session.',
            },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-stone-200 rounded-3xl p-7 space-y-3 shadow-xs">
              <div className="text-3xl font-black text-[#D82828]/25 font-serif">{item.step}</div>
              <h3 className="font-serif text-xl font-bold text-stone-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERNATIONAL_DETAILS.targetCountries.map((region, idx) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-1.5 shadow-2xs">
              <div className="text-2xl">{region.flag}</div>
              <div className="font-serif font-bold text-stone-900 text-base">{region.country}</div>
              <div className="text-xs font-semibold text-[#B85D38]">{region.timeZones}</div>
              <div className="text-[11px] text-stone-500">{region.popularPrograms}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BENEFITS OF LEARNING ART */}
      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
              Holistic Child Development
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Benefits of Learning Art
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Creative Expression',
                desc: 'Encourages imagination, visual storytelling, and independent problem-solving away from passive screens.',
              },
              {
                icon: ShieldCheck,
                title: 'Patience & Concentration',
                desc: 'Observational drawing naturally strengthens sustained attention span and mindful focus.',
              },
              {
                icon: Award,
                title: 'Confidence Through Mastery',
                desc: 'Step-by-step live mentorship helps kids turn blank pages into artworks they are genuinely proud of.',
              },
              {
                icon: Users,
                title: 'Fine Motor & Spatial Skills',
                desc: 'Builds hand-eye coordination, proportion sense, and neat visual organization across every age.',
              },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-6 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-[#B85D38] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{b.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D82828] inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Parent Guide</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {onlineFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-stone-900 text-base"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#D82828] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BOOK YOUR FREE DEMO SECTION */}
      <section id="book-free-demo" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white border border-stone-200 rounded-3xl p-7 sm:p-11 shadow-sm space-y-6">
          <div className="text-center space-y-2 border-b border-stone-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D82828]">
              Live Assessment Session
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Book Your Free Demo Class
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Submit your child’s details below. All demo bookings are securely recorded in our Studio Backend for quick scheduling by Vikas Gothi.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Free Demo Request Saved!</h3>
              <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{parentName || studentName}</strong>! Your demo request for{' '}
                <strong>{studentName}</strong> ({selectedCourse}) from <strong>{country}</strong> has been saved.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `*International Online Free Demo - The Art Horizon*\n*Parent:* ${parentName}\n*Student:* ${studentName} (Age: ${studentAge || 'N/A'})\n*Country:* ${country}\n*Course:* ${selectedCourse}\n*Email:* ${email}\n*Phone:* ${phone}\n*Preferred Time:* ${timeSlot}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-full text-xs font-bold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setParentName('');
                    setStudentName('');
                    setStudentAge('');
                    setEmail('');
                    setPhone('');
                    setNotes('');
                  }}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
                >
                  Submit Another Booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Student Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Student Age</label>
                  <input
                    type="text"
                    value={studentAge}
                    onChange={(e) => setStudentAge(e.target.value)}
                    placeholder="e.g. 9 years"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  >
                    <option value="United States">USA</option>
                    <option value="United Kingdom">UK</option>
                    <option value="United Arab Emirates">UAE</option>
                    <option value="Oman">Oman</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="India">India</option>
                    <option value="Other Country">Other Country</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Selected Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  >
                    <option value="Junior Artist Program (Age: 6–8 Years)">Junior Artist (6–8 Years)</option>
                    <option value="Young Artist Program (Age: 9–11 Years)">Young Artist (9–11 Years)</option>
                    <option value="Senior Artist Program (Age: 12–15 Years)">Senior Artist (12–15 Years)</option>
                    <option value="One-on-One (1:1) Private Mentorship">1-on-1 Private Class (Different Fee)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 / +44 / +971 / +91"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Time Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                  >
                    <option value="Weekend Morning (USA / UK)">Weekend Morning (USA / UK)</option>
                    <option value="Weekend Afternoon / Evening (UAE / GCC)">
                      Weekend Afternoon / Evening (UAE / GCC)
                    </option>
                    <option value="Weekday Evening">Weekday Evening</option>
                    <option value="Flexible">Flexible — Suggest Available Slots</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Questions or Experience Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share your preferred days or any drawing background..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-stone-500">
                  No upfront payment needed for the free demo session.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#D82828] to-[#F59E0B] hover:opacity-95 disabled:opacity-60 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>{isSubmitting ? 'Booking...' : 'Book Free Demo Now'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 9. CONTACT INFORMATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Official Contact Desk
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">THE ART HORIZON</h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Website: <strong className="text-white">www.thearthorizon.com</strong> &nbsp;•&nbsp; Phone / WhatsApp:{' '}
              <strong className="text-white">+91 9981883598</strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:+919981883598"
              className="inline-flex items-center gap-2 bg-white text-stone-900 hover:bg-amber-300 px-5 py-3 rounded-full text-xs font-bold transition-colors"
            >
              <Phone className="w-4 h-4 text-[#D82828]" />
              <span>+91 9981883598</span>
            </a>
            <a
              href="https://wa.me/919981883598"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-full text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
