import React, { useState, useMemo, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  AnnouncementCategory,
  AnnouncementItem,
  CurriculumModule,
  EnquirySubmission,
  GalleryItem,
  OnlineCourseProgram,
} from '../../types';
import {
  X,
  Inbox,
  RefreshCw,
  Search,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  Sparkles,
  Download,
  Video,
  Lock,
  LayoutDashboard,
  Image as ImageIcon,
  Megaphone,
  GraduationCap,
  FileText,
  Upload,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  Save,
  Users,
} from 'lucide-react';

type AdminTab = 'overview' | 'enquiries' | 'photos' | 'newsletter' | 'courses' | 'content';

const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  'Announcement',
  'Workshop',
  'New Course',
  'Event',
  'Competition',
  'Student Achievement',
  'Academy Update',
  'Promotion',
];

export const InquiriesInboxModal: React.FC = () => {
  const {
    isInquiriesModalOpen,
    closeInquiriesModal,
    enquiries,
    newEnquiriesCount,
    isLoadingEnquiries,
    refreshEnquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    adminDashboard,
    isLoadingAdmin,
    verifyAndLoadAdmin,
    clearAdminSession,
    uploadAdminImage,
    updateFounderProfile,
    updateSiteContent,
    saveAnnouncement,
    deleteAnnouncement,
    deleteSubscriber,
    saveGalleryPhoto,
    deleteGalleryPhoto,
    updateOnlineCourse,
    businessConfig,
  } = useStudio();

  // Security PIN gate state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      sessionStorage.getItem('the_art_horizon_admin_auth') === 'true' &&
      Boolean(sessionStorage.getItem('the_art_horizon_admin_pin'))
    );
  });

  // Main Admin Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Enquiries tab states
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'contacted' | 'resolved' | 'trials' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Founder Photo / Profile Form State
  const [founderName, setFounderName] = useState('');
  const [founderTitle, setFounderTitle] = useState('');
  const [founderPortrait, setFounderPortrait] = useState('');
  const [founderQuote, setFounderQuote] = useState('');
  const [founderBio1, setFounderBio1] = useState('');
  const [founderBio2, setFounderBio2] = useState('');
  const [isSavingFounder, setIsSavingFounder] = useState(false);
  const [isUploadingFounderImg, setIsUploadingFounderImg] = useState(false);

  // Gallery Form State
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryItem['category']>('student-work');
  const [galMedium, setGalMedium] = useState('');
  const [galDimensions, setGalDimensions] = useState('');
  const [galArtist, setGalArtist] = useState('');
  const [galDesc, setGalDesc] = useState('');
  const [galImage, setGalImage] = useState('');
  const [isUploadingGalImg, setIsUploadingGalImg] = useState(false);
  const [isSavingGal, setIsSavingGal] = useState(false);

  // Announcements Form State
  const [newsletterSubTab, setNewsletterSubTab] = useState<'announcements' | 'subscribers'>('announcements');
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('Announcement');
  const [annImage, setAnnImage] = useState('');
  const [annShortDesc, setAnnShortDesc] = useState('');
  const [annFullDesc, setAnnFullDesc] = useState('');
  const [annPublishedAt, setAnnPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [annExpiresAt, setAnnExpiresAt] = useState('');
  const [annCtaLabel, setAnnCtaLabel] = useState('');
  const [annCtaUrl, setAnnCtaUrl] = useState('');
  const [annStatus, setAnnStatus] = useState<AnnouncementItem['status']>('published');
  const [isUploadingAnnImg, setIsUploadingAnnImg] = useState(false);
  const [isSavingAnn, setIsSavingAnn] = useState(false);

  // Online Course Editor State
  const [selectedCourseId, setSelectedCourseId] = useState<string>('junior-artist');
  const [courseForm, setCourseForm] = useState<OnlineCourseProgram | null>(null);
  const [techniquesText, setTechniquesText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [outcomesText, setOutcomesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [isUploadingCourseImg, setIsUploadingCourseImg] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Site Content Editor State
  const [contentForm, setContentForm] = useState(adminDashboard?.siteContent || null);
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Populate Founder & Site Content whenever adminDashboard loads/changes
  useEffect(() => {
    if (!adminDashboard) return;
    setFounderName(adminDashboard.founder.name);
    setFounderTitle(adminDashboard.founder.title);
    setFounderPortrait(adminDashboard.founder.portraitImage);
    setFounderQuote(adminDashboard.founder.quote);
    setFounderBio1(adminDashboard.founder.bioParagraph1);
    setFounderBio2(adminDashboard.founder.bioParagraph2);
    setContentForm(adminDashboard.siteContent);
  }, [adminDashboard]);

  // Sync selected Online Course into form
  useEffect(() => {
    if (!adminDashboard?.onlineCourses?.length) return;
    const found =
      adminDashboard.onlineCourses.find((c) => c.id === selectedCourseId) || adminDashboard.onlineCourses[0];
    setCourseForm(found);
    setTechniquesText((found.techniques || []).join('\n'));
    setSkillsText((found.skillsDeveloped || []).join('\n'));
    setOutcomesText((found.learningOutcomes || []).join('\n'));
    setBenefitsText((found.benefits || []).join('\n'));
  }, [adminDashboard, selectedCourseId]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) {
      setPinError('Please enter the Studio PIN.');
      return;
    }

    setIsVerifyingPin(true);
    setPinError('');
    sessionStorage.setItem('the_art_horizon_admin_pin', cleanPin);
    const result = await verifyAndLoadAdmin(cleanPin);
    setIsVerifyingPin(false);

    if (result.ok) {
      sessionStorage.setItem('the_art_horizon_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      sessionStorage.removeItem('the_art_horizon_admin_pin');
      sessionStorage.removeItem('the_art_horizon_admin_auth');
      setPinError(result.error || 'Incorrect Studio PIN.');
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      if (activeFilter === 'new' && item.status !== 'new') return false;
      if (activeFilter === 'contacted' && item.status !== 'contacted') return false;
      if (activeFilter === 'resolved' && item.status !== 'resolved') return false;
      if (activeFilter === 'trials') {
        const isTrial =
          (item.serviceDetail && item.serviceDetail.toLowerCase().includes('demo')) ||
          (item.message && item.message.toLowerCase().includes('demo')) ||
          (item.serviceDetail && item.serviceDetail.toLowerCase().includes('trial'));
        if (!isTrial) return false;
      }
      if (activeFilter === 'online') {
        const isOnline =
          item.serviceCategory === 'international-online' ||
          (item.serviceDetail && item.serviceDetail.toLowerCase().includes('zoom')) ||
          (item.countryOrCity &&
            (item.countryOrCity.toLowerCase().includes('us') ||
              item.countryOrCity.toLowerCase().includes('uk') ||
              item.countryOrCity.toLowerCase().includes('uae')));
        if (!isOnline) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          (item.serviceDetail || '').toLowerCase().includes(q) ||
          (item.countryOrCity || '').toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, activeFilter, searchQuery]);

  if (!isInquiriesModalOpen) return null;

  // LOCKED SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative bg-[#FAF8F5] border border-stone-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-[#0B1E3F] to-[#1E293B] text-white p-5 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Studio Admin Dashboard</h3>
                <p className="text-[11px] text-stone-300">The Art Horizon • Vikas Gothi</p>
              </div>
            </div>
            <button onClick={closeInquiriesModal} className="text-stone-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePinSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Enter Studio Admin PIN
              </label>
              <p className="text-xs text-stone-500">
                Manage enquiries, founder & gallery photos, newsletter announcements, online courses, and site text.
              </p>
            </div>

            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Studio PIN"
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-[#D82828]"
            />

            {pinError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">
                {pinError}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={closeInquiriesModal}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                Cancel / Return
              </button>
              <button
                type="submit"
                disabled={isVerifyingPin}
                className="bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {isVerifyingPin ? 'Verifying...' : 'Unlock Studio Dashboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // CSV Helpers
  const handleExportEnquiriesCSV = () => {
    if (enquiries.length === 0) return;
    const headers = [
      'Submission ID',
      'Date & Time',
      'Student / Parent Name',
      'Student Age',
      'Phone Number',
      'Email',
      'Category',
      'Service / Course Details',
      'Location / Country',
      'Time Slot Preference',
      'Status',
      'Message',
    ];
    const rows = enquiries.map((enq) => [
      enq.id,
      new Date(enq.createdAt).toLocaleString('en-IN'),
      `"${(enq.name || '').replace(/"/g, '""')}"`,
      `"${(enq.studentAge || '').replace(/"/g, '""')}"`,
      `"${enq.phone || ''}"`,
      `"${enq.email || ''}"`,
      enq.serviceCategory,
      `"${(enq.serviceDetail || '').replace(/"/g, '""')}"`,
      `"${(enq.countryOrCity || '').replace(/"/g, '""')}"`,
      `"${(enq.timeSlotPreference || '').replace(/"/g, '""')}"`,
      enq.status,
      `"${(enq.message || '').replace(/"/g, '""')}"`,
    ]);
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `the_art_horizon_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSubscribersCSV = () => {
    const subs = adminDashboard?.subscribers || [];
    if (subs.length === 0) return;
    const headers = ['ID', 'Email', 'Name', 'Consent', 'Source', 'Subscribed At'];
    const rows = subs.map((s) => [
      s.id,
      `"${s.email}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.consent ? 'Yes' : 'No',
      `"${s.source || 'newsletter'}"`,
      new Date(s.subscribedAt).toLocaleString('en-IN'),
    ]);
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `the_art_horizon_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cleanPhoneForWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const getWhatsAppChatUrl = (item: EnquirySubmission) => {
    const phoneDigits = cleanPhoneForWhatsApp(item.phone);
    const greetingText = `Hello ${item.name}! This is Vikas Gothi from The Art Horizon Fine Art Studio & Academy. Thank you for your inquiry regarding "${
      item.serviceDetail || 'art classes'
    }". I would be delighted to assist you with batch timings, demo sessions, and course details.`;
    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(greetingText)}`;
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  // Image Upload Handlers
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setBusy: (v: boolean) => void,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const res = await uploadAdminImage(file);
    setBusy(false);
    e.target.value = '';
    if (res.ok && res.url) {
      onSuccess(res.url);
      showToast('success', 'Photograph uploaded cleanly to server!');
    } else {
      showToast('error', res.error || 'Could not upload photograph.');
    }
  };

  // Save Founder
  const handleSaveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFounder(true);
    const ok = await updateFounderProfile({
      name: founderName,
      title: founderTitle,
      portraitImage: founderPortrait,
      quote: founderQuote,
      bioParagraph1: founderBio1,
      bioParagraph2: founderBio2,
    });
    setIsSavingFounder(false);
    showToast(ok ? 'success' : 'error', ok ? 'Founder photograph & profile updated!' : 'Failed to update founder profile.');
  };

  // Gallery Actions
  const resetGalForm = () => {
    setEditingGalleryId(null);
    setGalTitle('');
    setGalCategory('student-work');
    setGalMedium('');
    setGalDimensions('');
    setGalArtist('');
    setGalDesc('');
    setGalImage('');
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !galImage.trim()) {
      showToast('error', 'Please upload/provide a photograph and artwork title.');
      return;
    }
    setIsSavingGal(true);
    const ok = await saveGalleryPhoto(
      {
        title: galTitle,
        category: galCategory,
        medium: galMedium || 'Fine Art Medium',
        dimensions: galDimensions || undefined,
        artist: galArtist || 'The Art Horizon',
        description: galDesc,
        image: galImage,
      },
      editingGalleryId || undefined
    );
    setIsSavingGal(false);
    if (ok) {
      showToast('success', editingGalleryId ? 'Gallery photo updated!' : 'New gallery photo published!');
      resetGalForm();
    } else {
      showToast('error', 'Failed to save gallery photo.');
    }
  };

  // Announcements Actions
  const resetAnnForm = () => {
    setEditingAnnId(null);
    setAnnTitle('');
    setAnnCategory('Announcement');
    setAnnImage('');
    setAnnShortDesc('');
    setAnnFullDesc('');
    setAnnPublishedAt(new Date().toISOString().slice(0, 10));
    setAnnExpiresAt('');
    setAnnCtaLabel('');
    setAnnCtaUrl('');
    setAnnStatus('published');
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annShortDesc.trim()) {
      showToast('error', 'Announcement title and short description are required.');
      return;
    }
    setIsSavingAnn(true);
    const ok = await saveAnnouncement(
      {
        title: annTitle,
        category: annCategory,
        featuredImage: annImage || founderPortrait,
        shortDescription: annShortDesc,
        fullDescription: annFullDesc || annShortDesc,
        publishedAt: annPublishedAt,
        expiresAt: annExpiresAt || undefined,
        ctaLabel: annCtaLabel || undefined,
        ctaUrl: annCtaUrl || undefined,
        status: annStatus,
      },
      editingAnnId || undefined
    );
    setIsSavingAnn(false);
    if (ok) {
      showToast('success', editingAnnId ? 'Announcement updated!' : 'Announcement saved!');
      resetAnnForm();
    } else {
      showToast('error', 'Failed to save announcement.');
    }
  };

  // Online Course Curriculum Helpers
  const addCourseModule = () => {
    if (!courseForm) return;
    const nextMod: CurriculumModule = {
      id: 'mod-' + Date.now(),
      moduleTitle: `Module ${courseForm.curriculumModules.length + 1}`,
      topics: [],
    };
    setCourseForm({
      ...courseForm,
      curriculumModules: [...courseForm.curriculumModules, nextMod],
    });
  };

  const updateModule = (idx: number, patch: Partial<CurriculumModule>) => {
    if (!courseForm) return;
    const next = [...courseForm.curriculumModules];
    next[idx] = { ...next[idx], ...patch };
    setCourseForm({ ...courseForm, curriculumModules: next });
  };

  const removeModule = (idx: number) => {
    if (!courseForm) return;
    setCourseForm({
      ...courseForm,
      curriculumModules: courseForm.curriculumModules.filter((_, i) => i !== idx),
    });
  };

  const parseLines = (txt: string) =>
    txt
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm) return;
    setIsSavingCourse(true);
    const ok = await updateOnlineCourse(courseForm.id, {
      ...courseForm,
      techniques: parseLines(techniquesText),
      skillsDeveloped: parseLines(skillsText),
      learningOutcomes: parseLines(outcomesText),
      benefits: parseLines(benefitsText),
    });
    setIsSavingCourse(false);
    showToast(ok ? 'success' : 'error', ok ? `${courseForm.title} updated cleanly!` : 'Failed to save course.');
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentForm) return;
    setIsSavingContent(true);
    const ok = await updateSiteContent(contentForm);
    setIsSavingContent(false);
    showToast(ok ? 'success' : 'error', ok ? 'Website headlines & content updated!' : 'Failed to update site content.');
  };

  const stats = adminDashboard?.stats || {
    totalEnquiries: enquiries.length,
    newEnquiries: newEnquiriesCount,
    totalSubscribers: adminDashboard?.subscribers?.length || 0,
    publishedAnnouncements: adminDashboard?.announcements?.filter((a) => a.status === 'published').length || 0,
    visibleOnlineCourses: adminDashboard?.onlineCourses?.filter((c) => c.visible !== false).length || 3,
    totalGalleryPhotos: adminDashboard?.galleryPhotos?.length || 0,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-2 max-h-[94vh] flex flex-col">
        {/* Top Admin Header */}
        <div className="bg-gradient-to-r from-[#0B1E3F] via-[#1E293B] to-[#0B1E3F] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold shadow-md shrink-0">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base sm:text-xl font-bold text-white truncate">
                  The Art Horizon — Studio Admin Dashboard
                </h3>
                {newEnquiriesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {newEnquiriesCount} New Leads
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300 truncate">
                PIN-Protected Portal for <strong>Vikas Gothi</strong> • Persistent Server Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                refreshEnquiries();
                verifyAndLoadAdmin();
              }}
              disabled={isLoadingEnquiries || isLoadingAdmin}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-stone-200 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnquiries || isLoadingAdmin ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={() => {
                clearAdminSession();
                setIsAuthenticated(false);
                setPinInput('');
              }}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-stone-700"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            <button
              onClick={closeInquiriesModal}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Studio Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs Navigation */}
        <div className="bg-white border-b border-stone-200 px-3 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'enquiries', label: `Enquiries (${stats.totalEnquiries})`, icon: Inbox },
            { id: 'photos', label: 'Photo Manager', icon: ImageIcon },
            { id: 'newsletter', label: 'Newsletter & Announcements', icon: Megaphone },
            { id: 'courses', label: 'Online Courses', icon: GraduationCap },
            { id: 'content', label: 'Website Content', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
                  active
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Toast */}
        {toastMsg && (
          <div
            className={`mx-4 sm:mx-6 mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border shrink-0 ${
              toastMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <span>{toastMsg.text}</span>
            <button onClick={() => setToastMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Scrollable Tab Panel */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-6">
          {/* ==================== TAB 1: OVERVIEW ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Total Enquiries', value: stats.totalEnquiries, tab: 'enquiries' as AdminTab },
                  { label: 'New Leads', value: stats.newEnquiries, tab: 'enquiries' as AdminTab },
                  { label: 'Subscribers', value: stats.totalSubscribers, tab: 'newsletter' as AdminTab },
                  { label: 'Published Updates', value: stats.publishedAnnouncements, tab: 'newsletter' as AdminTab },
                  { label: 'Online Courses', value: stats.visibleOnlineCourses, tab: 'courses' as AdminTab },
                  { label: 'Gallery Photos', value: stats.totalGalleryPhotos, tab: 'photos' as AdminTab },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(card.tab)}
                    className="bg-white border border-stone-200 hover:border-[#D82828] rounded-2xl p-4 text-left transition-all shadow-2xs"
                  >
                    <div className="text-2xl font-black text-stone-900 tabular-nums">{card.value}</div>
                    <div className="text-[11px] font-semibold text-stone-500 mt-0.5">{card.label}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-stone-900">Quick Studio Actions</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setActiveTab('photos')}
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 border border-stone-200 text-left font-bold text-stone-800 flex items-center gap-2.5"
                    >
                      <ImageIcon className="w-4 h-4 text-[#D82828]" />
                      <span>Change Founder or Gallery Photo</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('newsletter')}
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 border border-stone-200 text-left font-bold text-stone-800 flex items-center gap-2.5"
                    >
                      <Megaphone className="w-4 h-4 text-[#D82828]" />
                      <span>Publish New Announcement</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 border border-stone-200 text-left font-bold text-stone-800 flex items-center gap-2.5"
                    >
                      <GraduationCap className="w-4 h-4 text-[#D82828]" />
                      <span>Update Course Curriculum / PDF</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 border border-stone-200 text-left font-bold text-stone-800 flex items-center gap-2.5"
                    >
                      <FileText className="w-4 h-4 text-[#D82828]" />
                      <span>Edit Homepage & Hero Headlines</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-stone-900">Latest Student Enquiries</h4>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-bold text-[#D82828] hover:underline"
                    >
                      Manage All
                    </button>
                  </div>
                  {enquiries.length === 0 ? (
                    <p className="text-xs text-stone-500">No enquiries submitted yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {enquiries.slice(0, 4).map((enq) => (
                        <div
                          key={enq.id}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 truncate">{enq.name}</div>
                            <div className="text-[11px] text-stone-500 truncate">{enq.serviceDetail || enq.phone}</div>
                          </div>
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                            {enq.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: ENQUIRY MANAGEMENT ==================== */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
                  {[
                    { id: 'all', label: `All (${enquiries.length})` },
                    { id: 'new', label: `New (${enquiries.filter((e) => e.status === 'new').length})` },
                    { id: 'trials', label: 'Trial Bookings' },
                    { id: 'online', label: 'International Zoom' },
                    { id: 'contacted', label: `Contacted (${enquiries.filter((e) => e.status === 'contacted').length})` },
                    { id: 'resolved', label: `Enrolled (${enquiries.filter((e) => e.status === 'resolved').length})` },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => setActiveFilter(pill.id as any)}
                      className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                        activeFilter === pill.id
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, phone, course..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#D82828]"
                    />
                  </div>
                  <button
                    onClick={handleExportEnquiriesCSV}
                    disabled={enquiries.length === 0}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-stone-400 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-stone-800">No Matching Enquiries</h4>
                  <p className="text-xs text-stone-500">All website demo bookings and contact enquiries appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEnquiries.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl border p-4 sm:p-5 ${
                        item.status === 'new' ? 'border-rose-300 shadow-sm' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="uppercase text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800">
                            {item.status}
                          </span>
                          <span className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            disabled={statusUpdatingId === item.id}
                            onChange={async (e) => {
                              setStatusUpdatingId(item.id);
                              await updateEnquiryStatus(item.id, e.target.value as EnquirySubmission['status']);
                              setStatusUpdatingId(null);
                            }}
                            className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 font-semibold text-stone-700"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="resolved">Enrolled / Resolved</option>
                          </select>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete enquiry from "${item.name}"?`)) {
                                deleteEnquiry(item.id);
                              }
                            }}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <div className="font-serif text-base font-bold text-stone-900">{item.name}</div>
                          {item.studentAge && (
                            <div className="text-[11px] font-semibold text-[#B85D38]">Age: {item.studentAge}</div>
                          )}
                          <div className="font-mono font-bold text-stone-800">{item.phone}</div>
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={getWhatsAppChatUrl(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-[#25D366] text-white font-bold px-2.5 py-1 rounded-lg"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${item.phone.replace(/\s+/g, '')}`}
                              className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 font-semibold px-2.5 py-1 rounded-lg"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                          </div>
                          {item.email && (
                            <div className="text-stone-600 flex items-center gap-1 pt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{item.email}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="font-bold text-stone-900 bg-stone-50 p-2 rounded-lg border border-stone-200">
                            {item.serviceDetail || item.serviceCategory}
                          </div>
                          {item.countryOrCity && (
                            <div className="flex items-center gap-1 text-stone-600">
                              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>{item.countryOrCity}</span>
                            </div>
                          )}
                          {item.timeSlotPreference && (
                            <div className="flex items-center gap-1 text-stone-600">
                              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{item.timeSlotPreference}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-[#FAF8F5] p-3 rounded-lg border border-stone-200 text-stone-700 leading-relaxed max-h-28 overflow-y-auto">
                          {item.message || 'No additional notes.'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: PHOTO MANAGER (FOUNDER & GALLERY) ==================== */}
          {activeTab === 'photos' && (
            <div className="space-y-8">
              {/* Founder Photo & Bio Manager */}
              <form
                onSubmit={handleSaveFounder}
                className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      Founder Photograph & Profile (Update 1)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Replace the Founder photograph anytime without modifying website code.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingFounder}
                    className="bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white px-5 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSavingFounder ? 'Saving...' : 'Save Founder Profile'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-4 space-y-3">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-400">
                      <img src={founderPortrait} alt="Founder Preview" className="w-full h-full object-cover" />
                    </div>
                    <label className="w-full cursor-pointer bg-[#FAF8F5] hover:bg-amber-50 border border-dashed border-stone-300 rounded-xl p-3 text-xs font-bold text-stone-800 flex items-center justify-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-[#D82828]" />
                      <span>{isUploadingFounderImg ? 'Uploading...' : 'Upload New Founder Photo'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setIsUploadingFounderImg, setFounderPortrait)}
                      />
                    </label>
                    <input
                      type="text"
                      value={founderPortrait}
                      onChange={(e) => setFounderPortrait(e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-3 py-1.5 text-[11px] bg-stone-50 border border-stone-200 rounded-lg font-mono"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Founder Name</label>
                        <input
                          type="text"
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Title / Role</label>
                        <input
                          type="text"
                          value={founderTitle}
                          onChange={(e) => setFounderTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Founder Quote</label>
                      <input
                        type="text"
                        value={founderQuote}
                        onChange={(e) => setFounderQuote(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Biography Paragraph 1</label>
                      <textarea
                        rows={2}
                        value={founderBio1}
                        onChange={(e) => setFounderBio1(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Biography Paragraph 2</label>
                      <textarea
                        rows={2}
                        value={founderBio2}
                        onChange={(e) => setFounderBio2(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </form>

              {/* Gallery Photo Manager */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      Artwork & Student Gallery Photo Manager
                    </h4>
                    <p className="text-xs text-stone-500">
                      Upload new artworks, replace photos, edit details, or remove items from the live gallery.
                    </p>
                  </div>
                  {editingGalleryId && (
                    <button onClick={resetGalForm} className="text-xs font-bold text-[#D82828] hover:underline">
                      Cancel Edit & Add New
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveGallery} className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="font-bold text-stone-900">
                    {editingGalleryId ? 'Edit Existing Gallery Artwork' : 'Add New Gallery Artwork'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Artwork Title *</label>
                      <input
                        type="text"
                        required
                        value={galTitle}
                        onChange={(e) => setGalTitle(e.target.value)}
                        placeholder="e.g. Sunset Watercolor Study"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Category</label>
                      <select
                        value={galCategory}
                        onChange={(e) => setGalCategory(e.target.value as GalleryItem['category'])}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      >
                        <option value="student-work">Student Work</option>
                        <option value="portraits">Custom Portraits</option>
                        <option value="fine-art">Fine Art / Anatomy</option>
                        <option value="murals">Wall Murals</option>
                        <option value="rangoli">Festival Rangoli</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={galArtist}
                        onChange={(e) => setGalArtist(e.target.value)}
                        placeholder="e.g. Student / Vikas Gothi"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Medium</label>
                      <input
                        type="text"
                        value={galMedium}
                        onChange={(e) => setGalMedium(e.target.value)}
                        placeholder="e.g. Acrylic on Canvas"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Dimensions (Optional)</label>
                      <input
                        type="text"
                        value={galDimensions}
                        onChange={(e) => setGalDimensions(e.target.value)}
                        placeholder="e.g. 16 x 20 inches"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Upload Image *</label>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-white hover:bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 font-bold inline-flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5 text-[#D82828]" />
                          <span>{isUploadingGalImg ? 'Uploading...' : 'Choose File'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setIsUploadingGalImg, setGalImage)}
                          />
                        </label>
                        <input
                          type="text"
                          value={galImage}
                          onChange={(e) => setGalImage(e.target.value)}
                          placeholder="/uploads/..."
                          className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded-xl font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                    <div className="flex-1">
                      <label className="block font-semibold text-stone-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={galDesc}
                        onChange={(e) => setGalDesc(e.target.value)}
                        placeholder="Brief story about the artwork..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSavingGal}
                      className="bg-[#D82828] hover:bg-[#B81E1E] text-white px-5 py-2 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSavingGal ? 'Saving...' : editingGalleryId ? 'Update Artwork' : 'Add to Gallery'}</span>
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(adminDashboard?.galleryPhotos || []).map((g) => (
                    <div key={g.id} className="border border-stone-200 rounded-2xl overflow-hidden bg-white flex flex-col">
                      <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                        <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {g.category}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                        <div>
                          <div className="font-bold text-stone-900 line-clamp-1">{g.title}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{g.artist}</div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => {
                              setEditingGalleryId(g.id);
                              setGalTitle(g.title);
                              setGalCategory(g.category);
                              setGalMedium(g.medium);
                              setGalDimensions(g.dimensions || '');
                              setGalArtist(g.artist);
                              setGalDesc(g.description);
                              setGalImage(g.image);
                            }}
                            className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-900 font-semibold px-2.5 py-1 rounded bg-stone-100"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete artwork "${g.title}" from the gallery?`)) {
                                deleteGalleryPhoto(g.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 font-semibold px-2.5 py-1 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: NEWSLETTER & ANNOUNCEMENTS ==================== */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewsletterSubTab('announcements')}
                  className={`px-4 py-2 rounded-full text-xs font-bold ${
                    newsletterSubTab === 'announcements'
                      ? 'bg-[#D82828] text-white'
                      : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  Announcements ({adminDashboard?.announcements?.length || 0})
                </button>
                <button
                  onClick={() => setNewsletterSubTab('subscribers')}
                  className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                    newsletterSubTab === 'subscribers'
                      ? 'bg-[#D82828] text-white'
                      : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Subscribers ({adminDashboard?.subscribers?.length || 0})</span>
                </button>
              </div>

              {newsletterSubTab === 'announcements' ? (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveAnnouncement}
                    className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <h4 className="font-serif text-lg font-bold text-stone-900">
                        {editingAnnId ? 'Edit Announcement' : 'Create New Announcement'}
                      </h4>
                      {editingAnnId && (
                        <button type="button" onClick={resetAnnForm} className="text-[#D82828] font-bold hover:underline">
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-stone-700 mb-1">Announcement Title *</label>
                        <input
                          type="text"
                          required
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="e.g. Summer Portrait & Charcoal Workshop"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Category</label>
                        <select
                          value={annCategory}
                          onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        >
                          {ANNOUNCEMENT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Status</label>
                        <select
                          value={annStatus}
                          onChange={(e) => setAnnStatus(e.target.value as AnnouncementItem['status'])}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        >
                          <option value="published">Published (Live Now)</option>
                          <option value="draft">Draft (Hidden)</option>
                          <option value="scheduled">Scheduled (Publish on Date)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Publication Date</label>
                        <input
                          type="date"
                          value={annPublishedAt}
                          onChange={(e) => setAnnPublishedAt(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Optional Expiry Date</label>
                        <input
                          type="date"
                          value={annExpiresAt}
                          onChange={(e) => setAnnExpiresAt(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Featured Image</label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl font-bold inline-flex items-center gap-1 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-[#D82828]" />
                            <span>{isUploadingAnnImg ? '...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setIsUploadingAnnImg, setAnnImage)}
                            />
                          </label>
                          <input
                            type="text"
                            value={annImage}
                            onChange={(e) => setAnnImage(e.target.value)}
                            placeholder="/uploads/..."
                            className="w-full px-2.5 py-2 border border-stone-300 rounded-xl font-mono text-[11px]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Optional CTA Button Label</label>
                        <input
                          type="text"
                          value={annCtaLabel}
                          onChange={(e) => setAnnCtaLabel(e.target.value)}
                          placeholder="e.g. Register Now"
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Optional Link (#/page or URL)</label>
                        <input
                          type="text"
                          value={annCtaUrl}
                          onChange={(e) => setAnnCtaUrl(e.target.value)}
                          placeholder="#/online-classes or https://..."
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Short Description *</label>
                      <textarea
                        rows={2}
                        required
                        value={annShortDesc}
                        onChange={(e) => setAnnShortDesc(e.target.value)}
                        placeholder="Brief card summary..."
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Full Announcement Details</label>
                      <textarea
                        rows={3}
                        value={annFullDesc}
                        onChange={(e) => setAnnFullDesc(e.target.value)}
                        placeholder="Complete details displayed when visitors click Read Full Update..."
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingAnn}
                        className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-full font-bold inline-flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isSavingAnn ? 'Saving...' : editingAnnId ? 'Update Announcement' : 'Publish / Save'}</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {(adminDashboard?.announcements || []).map((ann) => (
                      <div
                        key={ann.id}
                        className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={ann.featuredImage}
                            alt={ann.title}
                            className="w-20 h-14 object-cover rounded-xl bg-stone-100 shrink-0"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  ann.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ann.status === 'scheduled'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {ann.status}
                              </span>
                              <span className="text-[11px] font-bold text-[#B85D38]">{ann.category}</span>
                              <span className="text-[11px] text-stone-400">{ann.publishedAt}</span>
                            </div>
                            <div className="font-bold text-stone-900 text-sm truncate">{ann.title}</div>
                            <p className="text-stone-500 line-clamp-1">{ann.shortDescription}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              saveAnnouncement(
                                { status: ann.status === 'published' ? 'draft' : 'published' },
                                ann.id
                              )
                            }
                            className="px-3 py-1.5 rounded-lg border border-stone-200 font-semibold text-stone-700 hover:bg-stone-50 inline-flex items-center gap-1"
                          >
                            {ann.status === 'published' ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Publish</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingAnnId(ann.id);
                              setAnnTitle(ann.title);
                              setAnnCategory(ann.category);
                              setAnnImage(ann.featuredImage);
                              setAnnShortDesc(ann.shortDescription);
                              setAnnFullDesc(ann.fullDescription);
                              setAnnPublishedAt(ann.publishedAt.slice(0, 10));
                              setAnnExpiresAt(ann.expiresAt ? ann.expiresAt.slice(0, 10) : '');
                              setAnnCtaLabel(ann.ctaLabel || '');
                              setAnnCtaUrl(ann.ctaUrl || '');
                              setAnnStatus(ann.status);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 font-semibold text-stone-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete announcement "${ann.title}"?`)) {
                                deleteAnnouncement(ann.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-stone-900">Private Newsletter Subscribers</h4>
                      <p className="text-xs text-stone-500">
                        Subscriber emails are never visible to public visitors.
                      </p>
                    </div>
                    <button
                      onClick={handleExportSubscribersCSV}
                      disabled={!adminDashboard?.subscribers?.length}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Subscribers CSV</span>
                    </button>
                  </div>

                  {!adminDashboard?.subscribers?.length ? (
                    <p className="text-xs text-stone-500 py-6 text-center">No newsletter subscribers yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                            <th className="py-2 pr-4">Email</th>
                            <th className="py-2 pr-4">Name</th>
                            <th className="py-2 pr-4">Subscribed Date</th>
                            <th className="py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminDashboard.subscribers.map((sub) => (
                            <tr key={sub.id} className="border-b border-stone-100">
                              <td className="py-2.5 pr-4 font-semibold text-stone-900">{sub.email}</td>
                              <td className="py-2.5 pr-4 text-stone-600">{sub.name || '—'}</td>
                              <td className="py-2.5 pr-4 text-stone-500">{formatDate(sub.subscribedAt)}</td>
                              <td className="py-2.5 text-right">
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Remove subscriber ${sub.email}?`)) {
                                      deleteSubscriber(sub.id);
                                    }
                                  }}
                                  className="text-rose-600 hover:underline font-semibold"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 5: ONLINE COURSE MANAGER ==================== */}
          {activeTab === 'courses' && courseForm && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {(adminDashboard?.onlineCourses || []).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourseId(c.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      selectedCourseId === c.id
                        ? 'bg-[#D82828] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {c.title} ({c.ageGroup})
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSaveCourse}
                className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5 text-xs shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      Edit {courseForm.title} ({courseForm.ageGroup})
                    </h4>
                    <p className="text-stone-500">
                      Populate official modules from your Curriculum PDF, update artwork, or toggle visibility.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseForm.visible}
                        onChange={(e) => setCourseForm({ ...courseForm, visible: e.target.checked })}
                        className="accent-[#D82828]"
                      />
                      <span>Visible Publicly</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseForm.curriculumPendingPdf}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, curriculumPendingPdf: e.target.checked })
                        }
                        className="accent-[#D82828]"
                      />
                      <span>Awaiting PDF Notice</span>
                    </label>
                    <button
                      type="submit"
                      disabled={isSavingCourse}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-full font-bold inline-flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isSavingCourse ? 'Saving...' : 'Save Course'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-4 space-y-2.5">
                    <div className="aspect-[16/10] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                      <img src={courseForm.heroImage} alt={courseForm.title} className="w-full h-full object-cover" />
                    </div>
                    <label className="w-full cursor-pointer bg-[#FAF8F5] hover:bg-amber-50 border border-dashed border-stone-300 rounded-xl p-2.5 font-bold text-stone-800 flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#D82828]" />
                      <span>{isUploadingCourseImg ? 'Uploading...' : 'Replace Course Photo'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, setIsUploadingCourseImg, (url) =>
                            setCourseForm({ ...courseForm, heroImage: url })
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-stone-700 mb-1">Course Title</label>
                        <input
                          type="text"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Age Group</label>
                        <input
                          type="text"
                          value={courseForm.ageGroup}
                          onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Class Format</label>
                        <input
                          type="text"
                          value={courseForm.classFormat}
                          onChange={(e) => setCourseForm({ ...courseForm, classFormat: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Course Overview</label>
                      <textarea
                        rows={2}
                        value={courseForm.overview}
                        onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Official Syllabus PDF Path / URL</label>
                      <input
                        type="text"
                        value={courseForm.curriculumPdfUrl || ''}
                        onChange={(e) => setCourseForm({ ...courseForm, curriculumPdfUrl: e.target.value })}
                        placeholder="/assets/aistudio/..."
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Curriculum Modules */}
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-stone-900">Curriculum Modules</div>
                    <button
                      type="button"
                      onClick={addCourseModule}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>
                  {courseForm.curriculumModules.length === 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                      No modules yet — click <strong>Add Module</strong> to enter syllabus sections from your PDF.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {courseForm.curriculumModules.map((mod, idx) => (
                        <div key={mod.id || idx} className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={mod.moduleTitle}
                              onChange={(e) => updateModule(idx, { moduleTitle: e.target.value })}
                              placeholder="Module title"
                              className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => removeModule(idx)}
                              className="text-rose-600 p-1"
                              title="Remove module"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={(mod.topics || []).join('\n')}
                            onChange={(e) => updateModule(idx, { topics: parseLines(e.target.value) })}
                            placeholder="Topics covered (one topic per line)"
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Techniques, Skills, Outcomes, Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Techniques Covered (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={techniquesText}
                      onChange={(e) => setTechniquesText(e.target.value)}
                      placeholder="Enter each technique on a new line..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Skills Developed (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="Enter each skill on a new line..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Learning Outcomes (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={outcomesText}
                      onChange={(e) => setOutcomesText(e.target.value)}
                      placeholder="Enter each outcome on a new line..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Program Benefits (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={benefitsText}
                      onChange={(e) => setBenefitsText(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ==================== TAB 6: WEBSITE CONTENT MANAGER ==================== */}
          {activeTab === 'content' && contentForm && (
            <form
              onSubmit={handleSaveContent}
              className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5 text-xs shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-stone-900">Website Headlines & Content</h4>
                  <p className="text-stone-500">Edit key headlines, hero copy, CTA buttons, and promo banners.</p>
                </div>
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-full font-bold inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSavingContent ? 'Saving...' : 'Save Content'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Promotional Announcement Text</span>
                    <label className="inline-flex items-center gap-1.5 font-semibold">
                      <input
                        type="checkbox"
                        checked={contentForm.promoBannerEnabled}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, promoBannerEnabled: e.target.checked })
                        }
                        className="accent-[#D82828]"
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={contentForm.promoBannerText}
                    onChange={(e) => setContentForm({ ...contentForm, promoBannerText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 p-4 border border-stone-200 rounded-xl">
                    <div className="font-bold text-stone-900">Homepage Hero</div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Hero Headline</label>
                      <input
                        type="text"
                        value={contentForm.homeHeroHeadline}
                        onChange={(e) => setContentForm({ ...contentForm, homeHeroHeadline: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Hero Supporting Text</label>
                      <textarea
                        rows={3}
                        value={contentForm.homeHeroSubtext}
                        onChange={(e) => setContentForm({ ...contentForm, homeHeroSubtext: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Primary CTA</label>
                        <input
                          type="text"
                          value={contentForm.homeHeroPrimaryCta}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, homeHeroPrimaryCta: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Secondary CTA</label>
                        <input
                          type="text"
                          value={contentForm.homeHeroSecondaryCta}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, homeHeroSecondaryCta: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border border-stone-200 rounded-xl">
                    <div className="font-bold text-stone-900">International Online Classes Hero</div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Hero Heading</label>
                      <input
                        type="text"
                        value={contentForm.onlineHeroHeading}
                        onChange={(e) => setContentForm({ ...contentForm, onlineHeroHeading: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Hero Subtext</label>
                      <textarea
                        rows={3}
                        value={contentForm.onlineHeroSubtext}
                        onChange={(e) => setContentForm({ ...contentForm, onlineHeroSubtext: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Primary CTA</label>
                        <input
                          type="text"
                          value={contentForm.onlineHeroPrimaryCta}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, onlineHeroPrimaryCta: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Secondary CTA</label>
                        <input
                          type="text"
                          value={contentForm.onlineHeroSecondaryCta}
                          onChange={(e) =>
                            setContentForm({ ...contentForm, onlineHeroSecondaryCta: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-stone-200 rounded-xl">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Newsletter Page Heading</label>
                    <input
                      type="text"
                      value={contentForm.newsletterHeading}
                      onChange={(e) => setContentForm({ ...contentForm, newsletterHeading: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Newsletter Page Subheading</label>
                    <input
                      type="text"
                      value={contentForm.newsletterSubheading}
                      onChange={(e) => setContentForm({ ...contentForm, newsletterSubheading: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500 shrink-0 gap-2">
          <div>
            The Art Horizon Studio Admin • Contact: <strong>{businessConfig.phone}</strong>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Persistent Server DB</span>
            </span>
            <span>•</span>
            <button onClick={closeInquiriesModal} className="font-semibold text-stone-700 hover:text-stone-900">
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
