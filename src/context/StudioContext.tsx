import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AdminDashboardData,
  AnnouncementItem,
  BusinessConfig,
  CMSState,
  DemoModalPreset,
  DetailModalData,
  EnquiryCategory,
  EnquirySubmission,
  FounderProfileData,
  GalleryItem,
  OnlineCourseProgram,
  PageId,
  SiteContentConfig,
} from '../types';
import {
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_BUSINESS_CONFIG,
  DEFAULT_FOUNDER_PROFILE,
  DEFAULT_ONLINE_COURSES,
  DEFAULT_SITE_CONTENT,
} from '../data/siteConfig';
import { GALLERY_DATA } from '../data/galleryData';

interface SubscribePayload {
  email: string;
  name?: string;
  consent: boolean;
  source?: string;
}

interface SubscribeResult {
  success: boolean;
  alreadySubscribed?: boolean;
  message: string;
  error?: string;
}

interface StudioContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  navigateTo: (page: PageId, hashOrSection?: string) => void;
  businessConfig: BusinessConfig;
  updateBusinessConfig: (newConfig: Partial<BusinessConfig>) => void;
  resetBusinessConfig: () => void;
  // Enquiries
  enquiries: EnquirySubmission[];
  isLoadingEnquiries: boolean;
  newEnquiriesCount: number;
  refreshEnquiries: (pin?: string) => Promise<boolean>;
  addEnquiry: (submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: EnquirySubmission['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  clearEnquiries: () => void;
  // CMS & Online Courses & Newsletter
  cmsState: CMSState;
  refreshPublicCms: () => Promise<void>;
  selectedCourseSlug: string | null;
  setSelectedCourseSlug: (slug: string | null) => void;
  openCourseDetail: (slug: string) => void;
  subscribeNewsletter: (payload: SubscribePayload) => Promise<SubscribeResult>;
  // Admin CMS (PIN protected)
  adminDashboard: AdminDashboardData | null;
  isLoadingAdmin: boolean;
  verifyAndLoadAdmin: (pinOverride?: string) => Promise<{ ok: boolean; error?: string }>;
  clearAdminSession: () => void;
  uploadAdminImage: (file: File) => Promise<{ ok: boolean; url?: string; error?: string }>;
  updateFounderProfile: (data: Partial<FounderProfileData>) => Promise<boolean>;
  updateSiteContent: (data: Partial<SiteContentConfig>) => Promise<boolean>;
  saveAnnouncement: (data: Partial<AnnouncementItem>, id?: string) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  deleteSubscriber: (id: string) => Promise<boolean>;
  saveGalleryPhoto: (data: Partial<GalleryItem>, id?: string) => Promise<boolean>;
  deleteGalleryPhoto: (id: string) => Promise<boolean>;
  updateOnlineCourse: (id: string, data: Partial<OnlineCourseProgram>) => Promise<boolean>;
  // Modals
  isEnquiryModalOpen: boolean;
  activeEnquiryCategory: EnquiryCategory;
  activeEnquiryDetail: string;
  openEnquiryModal: (category?: EnquiryCategory, detail?: string) => void;
  closeEnquiryModal: () => void;
  isFreeDemoModalOpen: boolean;
  demoModalPreset: DemoModalPreset | null;
  openFreeDemoModal: (preset?: DemoModalPreset | React.MouseEvent<any>) => void;
  closeFreeDemoModal: () => void;
  isInquiriesModalOpen: boolean;
  openInquiriesModal: () => void;
  closeInquiriesModal: () => void;
  lightboxItem: GalleryItem | null;
  openLightbox: (item: GalleryItem) => void;
  closeLightbox: () => void;
  detailModalItem: DetailModalData | null;
  openDetailModal: (item: DetailModalData) => void;
  closeDetailModal: () => void;
  isGeminiChatOpen: boolean;
  openGeminiChat: () => void;
  closeGeminiChat: () => void;
  isWriteReviewModalOpen: boolean;
  openWriteReviewModal: () => void;
  closeWriteReviewModal: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'the_art_horizon_config_v2';
const STUDIO_PIN_SESSION_KEY = 'the_art_horizon_admin_pin';
const LEGACY_ENQUIRIES_STORAGE_KEY = 'the_art_horizon_enquiries_v1';

const INITIAL_CMS_STATE: CMSState = {
  founder: DEFAULT_FOUNDER_PROFILE,
  announcements: DEFAULT_ANNOUNCEMENTS,
  onlineCourses: DEFAULT_ONLINE_COURSES,
  galleryPhotos: GALLERY_DATA,
  siteContent: DEFAULT_SITE_CONTENT,
};

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPage = (): PageId => {
    const rawHash = window.location.hash.replace('#/', '').replace('#', '').trim();
    const hash = rawHash.split('/')[0];

    const validPages: PageId[] = [
      'home',
      'about',
      'founder',
      'art-classes',
      'fine-art-courses',
      'online-classes',
      'newsletter',
      'portrait-commissions',
      'commercial-projects',
      'workshops',
      'gallery',
      'testimonials',
      'contact',
    ];
    if (validPages.includes(hash as PageId)) {
      return hash as PageId;
    }
    return 'home';
  };

  const getInitialCourseSlug = (): string | null => {
    const rawHash = window.location.hash.replace('#/', '').replace('#', '').trim();
    const parts = rawHash.split('/');
    if (parts[0] === 'online-classes' && parts[1]) {
      return parts[1];
    }
    return null;
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage());
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(getInitialCourseSlug());

  // Business Config state
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_BUSINESS_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore fallback
    }
    return DEFAULT_BUSINESS_CONFIG;
  });

  // Public CMS state synced from /api/cms
  const [cmsState, setCmsState] = useState<CMSState>(INITIAL_CMS_STATE);

  // Admin-only states (never populated unless authenticated via PIN)
  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboardData | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Modals state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [activeEnquiryCategory, setActiveEnquiryCategory] = useState<EnquiryCategory>('general');
  const [activeEnquiryDetail, setActiveEnquiryDetail] = useState('');
  const [isFreeDemoModalOpen, setIsFreeDemoModalOpen] = useState(false);
  const [demoModalPreset, setDemoModalPreset] = useState<DemoModalPreset | null>(null);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<DetailModalData | null>(null);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);

  const openGeminiChat = () => setIsGeminiChatOpen(true);
  const closeGeminiChat = () => setIsGeminiChatOpen(false);
  const openWriteReviewModal = () => setIsWriteReviewModalOpen(true);
  const closeWriteReviewModal = () => setIsWriteReviewModalOpen(false);
  const openInquiriesModal = () => setIsInquiriesModalOpen(true);
  const closeInquiriesModal = () => setIsInquiriesModalOpen(false);

  const getStoredPin = () => (sessionStorage.getItem(STUDIO_PIN_SESSION_KEY) ?? '').trim();

  // Fetch public CMS state from server
  const refreshPublicCms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms');
      if (res.ok) {
        const data = await res.json();
        setCmsState({
          founder: data.founder || DEFAULT_FOUNDER_PROFILE,
          announcements: Array.isArray(data.announcements) ? data.announcements : DEFAULT_ANNOUNCEMENTS,
          onlineCourses:
            Array.isArray(data.onlineCourses) && data.onlineCourses.length > 0
              ? data.onlineCourses
              : DEFAULT_ONLINE_COURSES,
          galleryPhotos:
            Array.isArray(data.galleryPhotos) && data.galleryPhotos.length > 0
              ? data.galleryPhotos
              : GALLERY_DATA,
          siteContent: data.siteContent || DEFAULT_SITE_CONTENT,
        });
      }
    } catch (err) {
      console.warn('Could not load CMS state from server, using defaults:', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_ENQUIRIES_STORAGE_KEY);
    } catch {
      // ignore
    }
    refreshPublicCms();
  }, [refreshPublicCms]);

  // Fetch enquiries from server ONLY with valid Studio PIN
  const refreshEnquiries = useCallback(async (pinOverride?: string): Promise<boolean> => {
    const pin = (pinOverride ?? getStoredPin()).trim();
    if (!pin) {
      setEnquiries([]);
      return false;
    }

    setIsLoadingEnquiries(true);
    try {
      const res = await fetch('/api/enquiries', {
        headers: { 'x-studio-pin': pin },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.enquiries)) {
          setEnquiries(data.enquiries);
          return true;
        }
      } else if (res.status === 401 || res.status === 429) {
        setEnquiries([]);
        if (res.status === 401) {
          sessionStorage.removeItem(STUDIO_PIN_SESSION_KEY);
          sessionStorage.removeItem('the_art_horizon_admin_auth');
        }
        return false;
      }
    } catch (err) {
      console.warn('Could not fetch server enquiries', err);
    } finally {
      setIsLoadingEnquiries(false);
    }
    return false;
  }, []);

  // Verify PIN and load full admin dashboard + enquiries
  const verifyAndLoadAdmin = useCallback(
    async (pinOverride?: string): Promise<{ ok: boolean; error?: string }> => {
      const pin = (pinOverride ?? getStoredPin()).trim();
      if (!pin) {
        return { ok: false, error: 'Please enter the Studio PIN.' };
      }

      setIsLoadingAdmin(true);
      try {
        const [dashRes, enqRes] = await Promise.all([
          fetch('/api/admin/dashboard', { headers: { 'x-studio-pin': pin } }),
          fetch('/api/enquiries', { headers: { 'x-studio-pin': pin } }),
        ]);

        if (dashRes.status === 429 || enqRes.status === 429) {
          const errData = await dashRes.json().catch(() => ({}));
          return {
            ok: false,
            error: errData.error || 'Too many failed PIN attempts. Please try again later.',
          };
        }

        if (dashRes.status === 401 || enqRes.status === 401) {
          sessionStorage.removeItem(STUDIO_PIN_SESSION_KEY);
          sessionStorage.removeItem('the_art_horizon_admin_auth');
          setEnquiries([]);
          setAdminDashboard(null);
          return {
            ok: false,
            error: 'Incorrect Studio PIN. Only authorized studio administrators can unlock this portal.',
          };
        }

        if (dashRes.ok && enqRes.ok) {
          const dashData = await dashRes.json();
          const enqData = await enqRes.json();
          setAdminDashboard(dashData);
          if (Array.isArray(enqData.enquiries)) {
            setEnquiries(enqData.enquiries);
          }
          return { ok: true };
        }
      } catch (err) {
        console.warn('Failed to load admin dashboard:', err);
        return { ok: false, error: 'Could not reach studio server. Please try again.' };
      } finally {
        setIsLoadingAdmin(false);
      }
      return { ok: false, error: 'Unable to verify Studio PIN.' };
    },
    []
  );

  useEffect(() => {
    if (getStoredPin()) {
      verifyAndLoadAdmin();
    }
  }, [verifyAndLoadAdmin]);

  // Sync route changes with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#/', '').replace('#', '').trim();
      if (rawHash === 'admin' || rawHash === 'inbox' || rawHash === 'studio-backend' || rawHash === 'inquiries') {
        setIsInquiriesModalOpen(true);
        return;
      }
      const page = getInitialPage();
      const slug = getInitialCourseSlug();
      setCurrentPage(page);
      setSelectedCourseSlug(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (
      window.location.hash.includes('admin') ||
      window.location.hash.includes('inbox') ||
      window.location.hash.includes('studio-backend') ||
      window.location.hash.includes('inquiries')
    ) {
      setIsInquiriesModalOpen(true);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId, hashOrSection?: string) => {
    setCurrentPage(page);
    if (page !== 'online-classes') {
      setSelectedCourseSlug(null);
    } else if (!hashOrSection) {
      setSelectedCourseSlug(null);
    } else {
      setSelectedCourseSlug(hashOrSection);
    }
    window.location.hash = hashOrSection ? `#/${page}/${hashOrSection}` : `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCourseDetail = (slug: string) => {
    setSelectedCourseSlug(slug);
    setCurrentPage('online-classes');
    window.location.hash = `#/online-classes/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateBusinessConfig = (newConfig: Partial<BusinessConfig>) => {
    setBusinessConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save business config', e);
      }
      return updated;
    });
  };

  const resetBusinessConfig = () => {
    setBusinessConfig(DEFAULT_BUSINESS_CONFIG);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Add inquiry with persistent server sync (never stored in public localStorage)
  const addEnquiry = async (
    submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: submission.name,
          email: submission.email,
          phone: submission.phone,
          serviceCategory: submission.serviceCategory,
          serviceDetail: submission.serviceDetail,
          countryOrCity: submission.countryOrCity,
          studentAge: submission.studentAge,
          timeSlotPreference: submission.timeSlotPreference,
          message: submission.message,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (getStoredPin() && data?.enquiry) {
          setEnquiries((prev) => [data.enquiry, ...prev]);
          verifyAndLoadAdmin();
        }
        return true;
      }
    } catch (err) {
      console.warn('Network error while saving enquiry to server:', err);
    }

    return false;
  };

  const updateEnquiryStatus = async (id: string, status: EnquirySubmission['status']) => {
    const pin = getStoredPin();
    if (!pin) return;

    setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-studio-pin': pin,
        },
        body: JSON.stringify({ status }),
      });
      await verifyAndLoadAdmin(pin);
    } catch (err) {
      console.warn('Failed to update status on server:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    const pin = getStoredPin();
    if (!pin) return;

    setEnquiries((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'x-studio-pin': pin },
      });
      await verifyAndLoadAdmin(pin);
    } catch (err) {
      console.warn('Failed to delete on server:', err);
    }
  };

  const clearEnquiries = () => {
    setEnquiries([]);
  };

  const clearAdminSession = () => {
    sessionStorage.removeItem(STUDIO_PIN_SESSION_KEY);
    sessionStorage.removeItem('the_art_horizon_admin_auth');
    setEnquiries([]);
    setAdminDashboard(null);
  };

  // Public Newsletter subscription
  const subscribeNewsletter = async (payload: SubscribePayload): Promise<SubscribeResult> => {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (getStoredPin()) {
          verifyAndLoadAdmin();
        }
        return {
          success: true,
          alreadySubscribed: Boolean(data.alreadySubscribed),
          message: data.message || 'Subscribed successfully!',
        };
      }
      return {
        success: false,
        message: data.error || 'Could not complete subscription.',
        error: data.error,
      };
    } catch {
      return {
        success: false,
        message: 'Network error while subscribing. Please try again.',
        error: 'Network error',
      };
    }
  };

  // Admin Image Upload helper (reads File -> DataURL -> POST /api/admin/upload)
  const uploadAdminImage = async (file: File): Promise<{ ok: boolean; url?: string; error?: string }> => {
    const pin = getStoredPin();
    if (!pin) return { ok: false, error: 'Studio Portal is locked.' };

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return { ok: false, error: 'Unsupported format. Please select a JPG, PNG, or WebP image.' };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { ok: false, error: 'Image size exceeds 8MB limit.' };
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    }).catch(() => '');

    if (!dataUrl) {
      return { ok: false, error: 'Could not read image file.' };
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-studio-pin': pin,
        },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return { ok: true, url: data.url };
      }
      return { ok: false, error: data.error || 'Upload failed.' };
    } catch {
      return { ok: false, error: 'Network error uploading image.' };
    }
  };

  const syncAfterAdminMutation = async (pin: string) => {
    await Promise.all([refreshPublicCms(), verifyAndLoadAdmin(pin)]);
  };

  const updateFounderProfile = async (data: Partial<FounderProfileData>): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const res = await fetch('/api/admin/founder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-studio-pin': pin },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateSiteContent = async (data: Partial<SiteContentConfig>): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-studio-pin': pin },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const saveAnnouncement = async (data: Partial<AnnouncementItem>, id?: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const url = id ? `/api/admin/announcements/${id}` : '/api/admin/announcements';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-studio-pin': pin },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'x-studio-pin': pin },
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteSubscriber = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
        headers: { 'x-studio-pin': pin },
      });
      if (res.ok) {
        await verifyAndLoadAdmin(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const saveGalleryPhoto = async (data: Partial<GalleryItem>, id?: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const url = id ? `/api/admin/gallery/${id}` : '/api/admin/gallery';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-studio-pin': pin },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteGalleryPhoto = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'x-studio-pin': pin },
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateOnlineCourse = async (id: string, data: Partial<OnlineCourseProgram>): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-studio-pin': pin },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await syncAfterAdminMutation(pin);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const openEnquiryModal = (category: EnquiryCategory = 'general', detail: string = '') => {
    setActiveEnquiryCategory(category);
    setActiveEnquiryDetail(detail);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
  };

  const openFreeDemoModal = (preset?: DemoModalPreset | React.MouseEvent<any>) => {
    if (
      preset &&
      typeof preset === 'object' &&
      !('nativeEvent' in preset) &&
      ('courseTitle' in preset || 'ageGroup' in preset || 'mode' in preset)
    ) {
      setDemoModalPreset(preset as DemoModalPreset);
    } else {
      setDemoModalPreset(null);
    }
    setIsFreeDemoModalOpen(true);
  };

  const closeFreeDemoModal = () => {
    setIsFreeDemoModalOpen(false);
    setDemoModalPreset(null);
  };

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

  const openDetailModal = (item: DetailModalData) => {
    setDetailModalItem(item);
  };

  const closeDetailModal = () => {
    setDetailModalItem(null);
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <StudioContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        navigateTo,
        businessConfig,
        updateBusinessConfig,
        resetBusinessConfig,
        enquiries,
        isLoadingEnquiries,
        newEnquiriesCount,
        refreshEnquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        clearEnquiries,
        cmsState,
        refreshPublicCms,
        selectedCourseSlug,
        setSelectedCourseSlug,
        openCourseDetail,
        subscribeNewsletter,
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
        isEnquiryModalOpen,
        activeEnquiryCategory,
        activeEnquiryDetail,
        openEnquiryModal,
        closeEnquiryModal,
        isFreeDemoModalOpen,
        demoModalPreset,
        openFreeDemoModal,
        closeFreeDemoModal,
        isInquiriesModalOpen,
        openInquiriesModal,
        closeInquiriesModal,
        lightboxItem,
        openLightbox,
        closeLightbox,
        detailModalItem,
        openDetailModal,
        closeDetailModal,
        isGeminiChatOpen,
        openGeminiChat,
        closeGeminiChat,
        isWriteReviewModalOpen,
        openWriteReviewModal,
        closeWriteReviewModal,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
