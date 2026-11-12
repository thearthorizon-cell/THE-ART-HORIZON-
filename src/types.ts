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
  timeSlotPreference?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
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
