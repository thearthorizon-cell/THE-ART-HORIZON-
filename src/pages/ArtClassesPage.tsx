import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { COURSES_DATA } from '../data/coursesData';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Palette,
  Info,
  Star,
  Video,
  ShieldCheck,
} from 'lucide-react';

export const ArtClassesPage: React.FC = () => {
  const { openEnquiryModal, openFreeDemoModal, openDetailModal, navigateTo } = useStudio();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'kids' | 'teens' | 'adults' | 'portrait'>('all');

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

  const filteredCourses =
    selectedFilter === 'all'
      ? COURSES_DATA
      : COURSES_DATA.filter((c) => {
          if (selectedFilter === 'kids') return c.category === 'kids';
          if (selectedFilter === 'teens') return c.category === 'teens';
          if (selectedFilter === 'adults') return c.category === 'adults';
          if (selectedFilter === 'portrait') return c.category === 'portrait' || c.category === 'professional';
          return true;
        });

  return (
    <div className="space-y-16 py-10 pb-24 bg-white">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D82828]" />
          <span>Interactive Art Education • Indore & Worldwide</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Art Programs for Every Age & Stage
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
          Joyful foundational drawing for little ones, advanced sketching for teens, and meditative acrylics & oil ateliers for adults.
          Mentored directly by master artist <strong className="text-stone-900 font-semibold">Vikas Gothi</strong>.
        </p>

        {/* Pricing Policy Card */}
        <div className="max-w-xl mx-auto bg-amber-50/70 border border-amber-200/90 p-3.5 rounded-2xl text-xs text-stone-700 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#D82828] shrink-0" />
          <span>
            <strong>Pricing Policy:</strong> In line with our academy standards, customized batch schedules and fee details are shared upon course request.
          </span>
        </div>
      </section>

      {/* Filter Tabs in Skilldren Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: '🎨 All Classes' },
            { id: 'kids', label: '🐣 Kids (Ages 5–11)' },
            { id: 'teens', label: '🚀 Teens & Sketching' },
            { id: 'adults', label: '☕ Adults Drawing & Painting' },
            { id: 'portrait', label: '🏛️ Portrait & Classical Fine Art' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-stone-200/90 rounded-3xl shadow-xs hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual */}
                <div className="lg:col-span-5 relative bg-stone-100 aspect-[16/10] lg:aspect-auto">
                  <img
                    src={course.image}
                    alt={`${course.title} — ${course.ageGroup}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-stone-900/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.level} Level
                    </span>
                    <span className="bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
                      {course.ageGroup}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                        {course.title}
                      </h2>
                      <p className="font-serif italic text-stone-600 text-sm mt-1">{course.tagline}</p>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed">{course.description}</p>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-600">
                      <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <Users className="w-4 h-4 text-[#D82828]" />
                        <span>
                          <strong>Batch Size:</strong> {course.batchSize}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <Clock className="w-4 h-4 text-[#D82828]" />
                        <span>
                          <strong>Duration:</strong> {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Mediums covered */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                        Mediums Covered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {course.mediums.map((m, i) => (
                          <span
                            key={i}
                            className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Curriculum highlights */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                        Core Learning Milestones:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                        {course.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions & Pricing Policy */}
                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-stone-500 block">Tuition & Enrollment</span>
                      <span className="font-semibold text-stone-800 text-sm">Contact Us for Pricing</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleOpenCourseDetail(course)}
                        className="flex-1 sm:flex-none border border-stone-300 hover:border-stone-800 text-stone-800 px-5 py-2.5 rounded-full text-xs font-bold transition-colors text-center"
                      >
                        View Syllabus
                      </button>
                      <button
                        onClick={() => openFreeDemoModal()}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-[#D82828] to-[#F59E0B] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs text-center"
                      >
                        Book Free Trial
                      </button>
                      <button
                        onClick={() => openEnquiryModal('local-classes', course.title)}
                        className="flex-1 sm:flex-none bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors shadow-xs text-center"
                      >
                        Request Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Online Classes Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 text-white p-8 sm:p-12 rounded-3xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Residing Outside Indore or Abroad?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Join Our International Live Zoom Batches
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm">
              Live interactive Zoom classes for children aged 6–15 years (Junior Artists: 6–8 Years, Young Artists: 9–11 Years, Senior Artists: 12–15 Years). Strictly small batches (Max 4–5 Students) with 3 structured levels (Beginner, Intermediate, Advanced). Individual one-on-one (1:1) sessions also available!
            </p>
          </div>
          <button
            onClick={() => navigateTo('online-classes')}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-colors shadow-md"
          >
            Explore Global Zoom Classes
          </button>
        </div>
      </section>
    </div>
  );
};
