export type PageId =
  | 'home'
  | 'about'
  | 'founder'
  | 'art-classes'
  | 'fine-art-courses'
  | 'online-classes'
  | 'portrait-commissions'
  | 'commercial-projects'
  | 'workshops'
  | 'gallery'
  | 'testimonials'
  | 'contact';

export type EnquiryCategory =
  | 'local-classes'
  | 'international-online'
  | 'portrait-commissions'
  | 'commercial-projects'
  | 'workshops'
  | 'general';

export interface BusinessConfig {
  name: string;
  founder: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  isAddressPendingConfirmation: boolean;
  businessHours: string;
  instagramUrl: string;
  youtubeUrl: string;
  whatsappMessage: string;
}

export interface EnquirySubmission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  serviceCategory: EnquiryCategory;
  serviceDetail?: string;
  countryOrCity?: string;
  studentAge?: string;
  timeSlotPreference?: string;
  message: string;
  status: 'new' | 'contacted' | 'reviewed' | 'resolved';
}

export interface CourseItem {
  id: string;
  title: string;
  category: 'kids' | 'teens' | 'adults' | 'professional' | 'portrait';
  tagline: string;
  ageGroup: string;
  batchSize: string;
  mediums: string[];
  duration: string;
  description: string;
  highlights: string[];
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'portraits' | 'murals' | 'rangoli' | 'corporate' | 'installations';
  subtitle: string;
  description: string;
  features: string[];
  deliverables: string[];
  image: string;
}

export interface WorkshopItem {
  id: string;
  title: string;
  category: 'resin' | 'lippan' | 'clay' | 'diy' | 'camps' | 'corporate';
  duration: string;
  level: string;
  materialsProvided: boolean;
  takeHomeArtwork: boolean;
  description: string;
  whatYouLearn: string[];
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'portraits' | 'murals' | 'rangoli' | 'student-work' | 'fine-art';
  medium: string;
  dimensions?: string;
  year?: string;
  artist: string;
  description: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  courseOrService: string;
  date?: string;
  rating?: number;
  isGoogleReview?: boolean;
  avatarColor?: string;
  reviewerBadge?: string;
  ownerReply?: {
    author: string;
    date: string;
    text: string;
  };
}

export type DetailItemType = 'course' | 'service' | 'workshop';

export interface DetailModalData {
  type: DetailItemType;
  title: string;
  subtitle?: string;
  category?: string;
  description: string;
  image: string;
  highlights?: string[];
  features?: string[];
  deliverables?: string[];
  whatYouLearn?: string[];
  ageGroup?: string;
  duration?: string;
  batchSize?: string;
  mediums?: string[];
  level?: string;
  enquiryCategory: EnquiryCategory;
}

// ============================================================
// CMS, Newsletter, Announcements & Online Course Upgrades
// ============================================================

export interface FounderProfileData {
  name: string;
  title: string;
  portraitImage: string;
  quote: string;
  bioParagraph1: string;
  bioParagraph2: string;
}

export type AnnouncementCategory =
  | 'Announcement'
  | 'Workshop'
  | 'New Course'
  | 'Event'
  | 'Competition'
  | 'Student Achievement'
  | 'Academy Update'
  | 'Promotion';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: AnnouncementCategory;
  featuredImage: string;
  shortDescription: string;
  fullDescription: string;
  publishedAt: string; // YYYY-MM-DD or ISO string
  expiresAt?: string; // Optional YYYY-MM-DD
  ctaLabel?: string;
  ctaUrl?: string;
  status: 'published' | 'draft' | 'scheduled';
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  consent: boolean;
  subscribedAt: string;
  source?: string;
}

export interface CurriculumModule {
  id: string;
  moduleTitle: string;
  topics: string[];
  techniques?: string[];
}

export interface OnlineCourseProgram {
  id: 'junior-artist' | 'young-artist' | 'senior-artist' | string;
  slug: string;
  title: string;
  ageGroup: string;
  badge: string;
  heroImage: string;
  referenceImages: string[];
  overview: string;
  duration: string;
  classFormat: string;
  scheduleSummary: string;
  language: string;
  whatChildrenLearn: string[];
  curriculumModules: CurriculumModule[];
  techniques: string[];
  skillsDeveloped: string[];
  learningOutcomes: string[];
  benefits: string[];
  curriculumPdfUrl?: string;
  curriculumPendingPdf: boolean;
  visible: boolean;
  updatedAt?: string;
}

export interface SiteContentConfig {
  promoBannerText: string;
  promoBannerEnabled: boolean;
  homeHeroHeadline: string;
  homeHeroSubtext: string;
  homeHeroPrimaryCta: string;
  homeHeroSecondaryCta: string;
  onlineHeroHeading: string;
  onlineHeroSubtext: string;
  onlineHeroPrimaryCta: string;
  onlineHeroSecondaryCta: string;
  newsletterHeading: string;
  newsletterSubheading: string;
}

export interface CMSState {
  founder: FounderProfileData;
  announcements: AnnouncementItem[];
  onlineCourses: OnlineCourseProgram[];
  galleryPhotos: GalleryItem[];
  siteContent: SiteContentConfig;
}

export interface DemoModalPreset {
  courseTitle?: string;
  ageGroup?: string;
  mode?: 'online' | 'studio';
}

export interface AdminDashboardData extends CMSState {
  subscribers: NewsletterSubscriber[];
  stats: {
    totalEnquiries: number;
    newEnquiries: number;
    totalSubscribers: number;
    publishedAnnouncements: number;
    visibleOnlineCourses: number;
    totalGalleryPhotos: number;
  };
}
