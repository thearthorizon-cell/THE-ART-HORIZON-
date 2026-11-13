import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  updateEnquiryStatus: (id: string, status: EnquirySubmission['status']) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
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
const STUDIO_AUTH_SESSION_KEY = 'the_art_horizon_admin_auth';
const LEGACY_ENQUIRIES_STORAGE_KEY = 'the_art_horizon_enquiries_v1';

// Safe session storage wrapper with in-memory fallback (works even in restricted iframes)
const memorySessionMap = new Map<string, string>();
export const safeSessionGet = (key: string): string => {
  try {
    const val = window.sessionStorage.getItem(key);
    if (val !== null) return val;
  } catch {
    // ignore SecurityError in sandboxed iframes
  }
  return memorySessionMap.get(key) ?? '';
};

export const safeSessionSet = (key: string, value: string): void => {
  memorySessionMap.set(key, value);
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore SecurityError
  }
};

export const safeSessionRemove = (key: string): void => {
  memorySessionMap.delete(key);
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore SecurityError
  }
};

interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  isJson: boolean;
}

const xhrFallback = (url: string, init: RequestInit): Promise<{ status: number; contentType: string; text: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(init.method || 'GET', url, true);
      xhr.withCredentials = true;
      xhr.timeout = 12000;
      const headers = init.headers as Record<string, string> | undefined;
      if (headers) {
        for (const [k, v] of Object.entries(headers)) {
          xhr.setRequestHeader(k, v);
        }
      }
      xhr.onload = () => {
        resolve({
          status: xhr.status,
          contentType: xhr.getResponseHeader('content-type') || '',
          text: xhr.responseText || '',
        });
      };
      xhr.onerror = () => reject(new Error('XHR network error'));
      xhr.ontimeout = () => reject(new Error('XHR request timeout'));
      xhr.send((init.body as string | null) ?? null);
    } catch (err) {
      reject(err);
    }
  });
};

async function apiRequest<T = any>(url: string, init: RequestInit = {}, retries = 2): Promise<ApiResult<T>> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let status = 0;
      let contentType = '';
      let rawText = '';

      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
        try {
          const res = await fetch(url, {
            ...init,
            cache: 'no-store',
            credentials: 'same-origin',
            signal: controller ? controller.signal : undefined,
          });
          status = res.status;
          contentType = res.headers.get('content-type') || '';
          rawText = await res.text();
        } finally {
          if (timer) clearTimeout(timer);
        }
      } catch {
        // Fallback to XMLHttpRequest if fetch is blocked, aborted, or hijacked by browser extension/iframe
        const xhrRes = await xhrFallback(url, init);
        status = xhrRes.status;
        contentType = xhrRes.contentType;
        rawText = xhrRes.text;
      }

      const trimmed = rawText.trim();
      const looksLikeJson = contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[');
      let parsed: T | null = null;
      if (looksLikeJson && trimmed) {
        try {
          parsed = JSON.parse(trimmed) as T;
        } catch {
          parsed = null;
        }
      }

      const isWarmupOrGatewayError = status === 502 || status === 503 || status === 504 || (!looksLikeJson && status >= 200);
      if (isWarmupOrGatewayError && attempt < retries) {
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }

      return {
        ok: status >= 200 && status < 300 && looksLikeJson && parsed !== null,
        status,
        data: parsed,
        isJson: looksLikeJson && parsed !== null,
      };
    } catch {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }
      return { ok: false, status: 0, data: null, isJson: false };
    }
  }
  return { ok: false, status: 0, data: null, isJson: false };
}

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

  const activePinRef = useRef<string>(safeSessionGet(STUDIO_PIN_SESSION_KEY).trim());

  const getStoredPin = () => (activePinRef.current || safeSessionGet(STUDIO_PIN_SESSION_KEY)).trim();

  const buildPinHeaders = (pin: string, withJsonContentType = false): Record<string, string> => {
    const headers: Record<string, string> = {
      'x-studio-pin': pin,
      Authorization: `Bearer ${pin}`,
    };
    if (withJsonContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  // Fetch public CMS state from server
  const refreshPublicCms = useCallback(async () => {
    const res = await apiRequest<any>('/api/cms');
    if (res.ok && res.data) {
      const data = res.data;
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
      const res = await apiRequest<any>('/api/enquiries', {
        headers: buildPinHeaders(pin),
      });
      if (res.ok && res.data && Array.isArray(res.data.enquiries)) {
        setEnquiries(res.data.enquiries);
        return true;
      }
      if (res.status === 401 || res.status === 429) {
        setEnquiries([]);
        if (res.status === 401) {
          activePinRef.current = '';
          safeSessionRemove(STUDIO_PIN_SESSION_KEY);
          safeSessionRemove(STUDIO_AUTH_SESSION_KEY);
        }
        return false;
      }
    } finally {
      setIsLoadingEnquiries(false);
    }
    return false;
  }, []);

  // Verify PIN and load full admin dashboard + enquiries in one atomic request
  const verifyAndLoadAdmin = useCallback(
    async (pinOverride?: string): Promise<{ ok: boolean; error?: string }> => {
      const pin = (pinOverride ?? getStoredPin()).trim();
      if (!pin) {
        return { ok: false, error: 'Please enter the Studio PIN.' };
      }

      setIsLoadingAdmin(true);
      try {
        const loginRes = await apiRequest<any>('/api/admin/login', {
          method: 'POST',
          headers: buildPinHeaders(pin, true),
          body: JSON.stringify({ pin }),
        });

        if (loginRes.status === 429) {
          return {
            ok: false,
            error: loginRes.data?.error || 'Too many failed PIN attempts. Please try again later.',
          };
        }

        if (loginRes.status === 401) {
          activePinRef.current = '';
          safeSessionRemove(STUDIO_PIN_SESSION_KEY);
          safeSessionRemove(STUDIO_AUTH_SESSION_KEY);
          setEnquiries([]);
          setAdminDashboard(null);
          return {
            ok: false,
            error: 'Incorrect Studio PIN. Only authorized studio administrators can unlock this portal.',
          };
        }

        if (loginRes.ok && loginRes.data?.dashboard) {
          activePinRef.current = pin;
          safeSessionSet(STUDIO_PIN_SESSION_KEY, pin);
          safeSessionSet(STUDIO_AUTH_SESSION_KEY, 'true');
          setAdminDashboard(loginRes.data.dashboard);
          if (Array.isArray(loginRes.data.enquiries)) {
            setEnquiries(loginRes.data.enquiries);
          }
          return { ok: true };
        }

        if (loginRes.status === 0) {
          return {
            ok: false,
            error: 'Unable to connect to Studio server right now. Please wait a moment and try again.',
          };
        }

        return {
          ok: false,
          error: loginRes.data?.error || `Studio server returned status ${loginRes.status}. Please try again.`,
        };
      } finally {
        setIsLoadingAdmin(false);
      }
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
    const res = await apiRequest<any>('/api/enquiries', {
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
      if (getStoredPin() && res.data?.enquiry) {
        setEnquiries((prev) => [res.data.enquiry, ...prev]);
        verifyAndLoadAdmin();
      }
      return true;
    }

    return false;
  };

  const updateEnquiryStatus = async (id: string, status: EnquirySubmission['status']): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;

    setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    const res = await apiRequest(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await verifyAndLoadAdmin(pin);
      return true;
    }
    await verifyAndLoadAdmin(pin);
    return false;
  };

  const deleteEnquiry = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;

    setEnquiries((prev) => prev.filter((item) => item.id !== id));

    const res = await apiRequest(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: buildPinHeaders(pin),
    });
    if (res.ok) {
      await verifyAndLoadAdmin(pin);
      return true;
    }
    await verifyAndLoadAdmin(pin);
    return false;
  };

  const clearEnquiries = () => {
    setEnquiries([]);
  };

  const clearAdminSession = () => {
    activePinRef.current = '';
    safeSessionRemove(STUDIO_PIN_SESSION_KEY);
    safeSessionRemove(STUDIO_AUTH_SESSION_KEY);
    setEnquiries([]);
    setAdminDashboard(null);
  };

  // Public Newsletter subscription
  const subscribeNewsletter = async (payload: SubscribePayload): Promise<SubscribeResult> => {
    const res = await apiRequest<any>('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok && res.data) {
      if (getStoredPin()) {
        verifyAndLoadAdmin();
      }
      return {
        success: true,
        alreadySubscribed: Boolean(res.data.alreadySubscribed),
        message: res.data.message || 'Subscribed successfully!',
      };
    }
    return {
      success: false,
      message: res.data?.error || 'Could not complete subscription. Please try again.',
      error: res.data?.error || 'Network error',
    };
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

    const res = await apiRequest<any>('/api/admin/upload', {
      method: 'POST',
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify({ dataUrl, fileName: file.name }),
    });
    if (res.ok && res.data?.url) {
      return { ok: true, url: res.data.url };
    }
    return { ok: false, error: res.data?.error || 'Upload failed.' };
  };

  const syncAfterAdminMutation = async (pin: string) => {
    await Promise.all([refreshPublicCms(), verifyAndLoadAdmin(pin)]);
  };

  const updateFounderProfile = async (data: Partial<FounderProfileData>): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const res = await apiRequest('/api/admin/founder', {
      method: 'PUT',
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
    }
    return false;
  };

  const updateSiteContent = async (data: Partial<SiteContentConfig>): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const res = await apiRequest('/api/admin/site-content', {
      method: 'PUT',
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
    }
    return false;
  };

  const saveAnnouncement = async (data: Partial<AnnouncementItem>, id?: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const url = id ? `/api/admin/announcements/${id}` : '/api/admin/announcements';
    const method = id ? 'PUT' : 'POST';
    const res = await apiRequest(url, {
      method,
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
    }
    return false;
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const res = await apiRequest(`/api/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: buildPinHeaders(pin),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
    }
    return false;
  };

  const deleteSubscriber = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const res = await apiRequest(`/api/admin/subscribers/${id}`, {
      method: 'DELETE',
      headers: buildPinHeaders(pin),
    });
    if (res.ok) {
      await verifyAndLoadAdmin(pin);
      return true;
    }
    return false;
  };

  const saveGalleryPhoto = async (data: Partial<GalleryItem>, id?: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const url = id ? `/api/admin/gallery/${id}` : '/api/admin/gallery';
    const method = id ? 'PUT' : 'POST';
    const res = await apiRequest(url, {
      method,
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
    }
    return false;
  };

  const deleteGalleryPhoto = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const res = await apiRequest(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: buildPinHeaders(pin),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
    }
    return false;
  };

  const updateOnlineCourse = async (id: string, data: Partial<OnlineCourseProgram>): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;
    const res = await apiRequest(`/api/admin/courses/${id}`, {
      method: 'PUT',
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await syncAfterAdminMutation(pin);
      return true;
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
