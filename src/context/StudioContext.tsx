import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BusinessConfig, DetailModalData, EnquiryCategory, EnquirySubmission, GalleryItem, PageId } from '../types';
import { DEFAULT_BUSINESS_CONFIG } from '../data/siteConfig';

interface StudioContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  navigateTo: (page: PageId, hashOrSection?: string) => void;
  businessConfig: BusinessConfig;
  updateBusinessConfig: (newConfig: Partial<BusinessConfig>) => void;
  resetBusinessConfig: () => void;
  enquiries: EnquirySubmission[];
  isLoadingEnquiries: boolean;
  newEnquiriesCount: number;
  refreshEnquiries: () => Promise<void>;
  addEnquiry: (submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: EnquirySubmission['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  clearEnquiries: () => void;
  isEnquiryModalOpen: boolean;
  activeEnquiryCategory: EnquiryCategory;
  activeEnquiryDetail: string;
  openEnquiryModal: (category?: EnquiryCategory, detail?: string) => void;
  closeEnquiryModal: () => void;
  isFreeDemoModalOpen: boolean;
  openFreeDemoModal: () => void;
  closeFreeDemoModal: () => void;
  isInquiriesModalOpen: boolean;
  openInquiriesModal: () => void;
  closeInquiriesModal: () => void;
  isAdminConfigOpen: boolean;
  openAdminConfig: () => void;
  closeAdminConfig: () => void;
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
const ENQUIRIES_STORAGE_KEY = 'the_art_horizon_enquiries_v1';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Page Routing via window.location.hash
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

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage());

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

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>(() => {
    try {
      const saved = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore fallback
    }
    return [];
  });
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);

  // Modals state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [activeEnquiryCategory, setActiveEnquiryCategory] = useState<EnquiryCategory>('general');
  const [activeEnquiryDetail, setActiveEnquiryDetail] = useState('');
  const [isFreeDemoModalOpen, setIsFreeDemoModalOpen] = useState(false);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);
  const [isAdminConfigOpen, setIsAdminConfigOpen] = useState(false);
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

  // Fetch inquiries from server
  const refreshEnquiries = useCallback(async () => {
    setIsLoadingEnquiries(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.enquiries)) {
          setEnquiries(data.enquiries);
          try {
            localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(data.enquiries));
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch server enquiries, relying on cached data', err);
    } finally {
      setIsLoadingEnquiries(false);
    }
  }, []);

  // Fetch enquiries on initial mount
  useEffect(() => {
    refreshEnquiries();
  }, [refreshEnquiries]);

  // Sync route changes with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#/', '').replace('#', '').trim();
      if (rawHash === 'admin' || rawHash === 'inbox' || rawHash === 'studio-backend' || rawHash === 'inquiries') {
        setIsInquiriesModalOpen(true);
        return;
      }
      const page = getInitialPage();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Check if initial hash is #admin, #inbox, or #inquiries
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
    window.location.hash = hashOrSection ? `#/${page}/${hashOrSection}` : `#/${page}`;
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

  // Add inquiry with persistent server sync
  const addEnquiry = async (
    submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    const tempId = 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newEntry: EnquirySubmission = {
      ...submission,
      id: tempId,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Optimistically update local state immediately
    setEnquiries((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save enquiry locally', e);
      }
      return updated;
    });

    // Send to server for persistent storage
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
          timeSlotPreference: submission.timeSlotPreference,
          message: submission.message,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.enquiry) {
          // Replace temp entry with canonical server entry
          setEnquiries((prev) => {
            const replaced = prev.map((item) => (item.id === tempId ? data.enquiry : item));
            try {
              localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(replaced));
            } catch {
              // ignore
            }
            return replaced;
          });
        }
        return true;
      }
    } catch (err) {
      console.warn('Network error while saving enquiry to server, saved locally:', err);
    }

    return true;
  };

  // Update status (mark as contacted / resolved)
  const updateEnquiryStatus = async (id: string, status: EnquirySubmission['status']) => {
    setEnquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      try {
        localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Failed to update status on server:', err);
    }
  };

  // Delete an inquiry
  const deleteEnquiry = async (id: string) => {
    setEnquiries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Failed to delete on server:', err);
    }
  };

  const clearEnquiries = () => {
    setEnquiries([]);
    try {
      localStorage.removeItem(ENQUIRIES_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const openEnquiryModal = (category: EnquiryCategory = 'general', detail: string = '') => {
    setActiveEnquiryCategory(category);
    setActiveEnquiryDetail(detail);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
  };

  const openFreeDemoModal = () => {
    setIsFreeDemoModalOpen(true);
  };

  const closeFreeDemoModal = () => {
    setIsFreeDemoModalOpen(false);
  };

  const openAdminConfig = () => {
    setIsAdminConfigOpen(true);
  };

  const closeAdminConfig = () => {
    setIsAdminConfigOpen(false);
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
        isEnquiryModalOpen,
        activeEnquiryCategory,
        activeEnquiryDetail,
        openEnquiryModal,
        closeEnquiryModal,
        isFreeDemoModalOpen,
        openFreeDemoModal,
        closeFreeDemoModal,
        isInquiriesModalOpen,
        openInquiriesModal,
        closeInquiriesModal,
        isAdminConfigOpen,
        openAdminConfig,
        closeAdminConfig,
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
