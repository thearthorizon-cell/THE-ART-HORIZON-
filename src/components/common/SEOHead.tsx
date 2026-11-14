import React, { useEffect } from 'react';
import { PageId } from '../../types';

interface SEOHeadProps {
  page: PageId;
  courseSlug?: string | null;
  customTitle?: string;
  customDescription?: string;
}

const CANONICAL_BASE = 'https://www.thearthorizon.com';

const PAGE_METADATA: Record<PageId, { path: string; title: string; description: string; keywords: string }> = {
  home: {
    path: '/',
    title: 'Online Drawing & Painting Classes for Kids | The Art Horizon',
    description:
      'Explore live online drawing and painting classes for kids aged 6–15 at The Art Horizon. Small batches of max 4–5 students. Book your free demo class today!',
    keywords:
      'Online Drawing Classes for Kids, Online Painting Classes for Kids, Live Online Art Classes, Drawing Classes for Ages 6–15, Small Group Online Art Classes, The Art Horizon, Vikas Gothi',
  },
  about: {
    path: '/about',
    title: 'About The Art Horizon — Fine Art Studio & Online Academy',
    description:
      'Discover The Art Horizon founded by Vikas Gothi. Classical fine art instruction, small group online art classes (Max 4–5 Students), and in-studio Indore training.',
    keywords:
      'About The Art Horizon, Fine Arts Academy Indore, Live Online Art Classes, Vikas Gothi Art Studio',
  },
  founder: {
    path: '/founder',
    title: 'Vikas Gothi — Founder & Master Fine Artist | The Art Horizon',
    description:
      'Meet Vikas Gothi, founder and mentor at The Art Horizon. Teaching live online drawing and painting classes for kids aged 6–15, custom portraits, and murals.',
    keywords:
      'Vikas Gothi, Portrait Artist in Indore, Online Art Teacher for Kids, Master Fine Artist India',
  },
  'art-classes': {
    path: '/art-classes',
    title: 'Drawing & Painting Classes for Kids, Teens & Adults | The Art Horizon',
    description:
      'Structured drawing and painting classes in Indore and live online via Zoom. Small batches of Max 4–5 Students for kids, teens, and adults.',
    keywords:
      'Online Drawing Classes for Kids, Online Painting Classes for Kids, Drawing Classes for Ages 6–15, Kids Art Classes Indore',
  },
  'fine-art-courses': {
    path: '/fine-art-courses',
    title: 'Professional Fine Art Courses & Diploma | The Art Horizon',
    description:
      'Classical oil painting on canvas, sight-size realism, anatomy studies, and portfolio development mentored by Vikas Gothi at The Art Horizon.',
    keywords:
      'Fine Art Academy, Professional Fine Art Courses, Oil Painting Classes Indore, Pre-College Art Portfolio',
  },
  'online-classes': {
    path: '/online-classes',
    title: 'Live Online Art Classes for Kids Ages 6–15 | The Art Horizon',
    description:
      'Join live online drawing & painting classes via Zoom for Junior Artists (6–8 Years), Young Artists (9–11 Years), and Senior Artists (12–15 Years). Max 4–5 Students per batch.',
    keywords:
      'Live Online Art Classes, Online Drawing Classes for Kids, Online Painting Classes for Kids, Drawing Classes for Ages 6–15, Small Group Online Art Classes',
  },
  'portrait-commissions': {
    path: '/portrait-commissions',
    title: 'Custom Hand-Painted Portrait Commissions | The Art Horizon',
    description:
      'Commission museum-grade portraits in oil, acrylic, watercolor, charcoal, and colour pencil by Vikas Gothi with worldwide insured delivery.',
    keywords:
      'Custom Portrait Commission, Charcoal Portrait Artist, Oil Portrait Painting, Colour Pencil Portraits India',
  },
  'commercial-projects': {
    path: '/commercial-projects',
    title: 'Commercial Wall Murals & Festival Rangoli Art | The Art Horizon',
    description:
      'Bespoke architectural wall murals, hospitality and café art, and grand festival rangoli installations by Vikas Gothi and The Art Horizon.',
    keywords:
      'Wall Mural Painting Services, Commercial Murals Indore, Festival Rangoli Artist, Hotel Art Installations',
  },
  workshops: {
    path: '/workshops',
    title: 'Weekend Art Workshops — Resin, Lippan & Clay | The Art Horizon',
    description:
      'Hands-on weekend art workshops in Indore including ocean resin art, traditional Kutch Lippan mud-mirror art, pottery, and summer art camps.',
    keywords:
      'Resin Art Workshop Indore, Lippan Art Workshop, Clay Pottery Classes Indore, Weekend Art Workshops',
  },
  gallery: {
    path: '/gallery',
    title: 'Student Art & Studio Portfolio Gallery | The Art Horizon',
    description:
      'Explore original artworks by kids and teen students, charcoal and oil portraits, festival rangolis, and murals created at The Art Horizon.',
    keywords:
      'The Art Horizon Gallery, Kids Drawing Showcase, Charcoal Portrait Portfolio, Wall Mural Gallery',
  },
  testimonials: {
    path: '/testimonials',
    title: 'Parent & Student Reviews | The Art Horizon',
    description:
      'Read verified feedback from parents and art students across India, USA, UK, and UAE learning drawing and painting with Vikas Gothi.',
    keywords:
      'The Art Horizon Reviews, Online Art Class Reviews, Parent Testimonials Vikas Gothi',
  },
  contact: {
    path: '/contact',
    title: 'Contact & Book Your Free Demo Class | The Art Horizon',
    description:
      'Contact The Art Horizon to book a free online demo art class or visit our studio in Usha Nagar, Indore. Call or WhatsApp +91 99818 83598.',
    keywords:
      'Contact The Art Horizon, Book Free Demo Art Class, Art Studio Indore Usha Nagar',
  },
};

const COURSE_METADATA: Record<string, { path: string; title: string; description: string }> = {
  'junior-artist': {
    path: '/online-classes/junior-artist',
    title: 'Junior Artists Online Drawing Class (6–8 Years) | The Art Horizon',
    description:
      'Live online drawing & painting classes for Junior Artists (6–8 Years) across 3 progressive levels. Small group online art classes (Max 4–5 Students). Book your free demo!',
  },
  'young-artist': {
    path: '/online-classes/young-artist',
    title: 'Young Artists Online Art & Painting Class (9–11 Years) | The Art Horizon',
    description:
      'Live online drawing & painting classes for Young Artists (9–11 Years) covering perspective, shading, pastels, and folk art in batches of Max 4–5 Students.',
  },
  'senior-artist': {
    path: '/online-classes/senior-artist',
    title: 'Senior Artists Fine Art & Portfolio Class (12–15 Years) | The Art Horizon',
    description:
      'Pre-college live online fine art classes for Senior Artists (12–15 Years) covering anatomy, charcoal, watercolors, and acrylics. Max 4–5 Students per batch.',
  },
};

function upsertMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export const SEOHead: React.FC<SEOHeadProps> = ({ page, courseSlug, customTitle, customDescription }) => {
  useEffect(() => {
    const baseMeta = PAGE_METADATA[page] || PAGE_METADATA.home;
    const courseMeta = page === 'online-classes' && courseSlug ? COURSE_METADATA[courseSlug] : undefined;

    const finalTitle = customTitle || courseMeta?.title || baseMeta.title;
    const finalDesc = customDescription || courseMeta?.description || baseMeta.description;
    const finalPath = courseMeta?.path || baseMeta.path;
    const canonicalUrl = `${CANONICAL_BASE}${finalPath === '/' ? '/' : finalPath}`;

    document.title = finalTitle;
    upsertCanonical(canonicalUrl);

    upsertMetaTag('name', 'description', finalDesc);
    upsertMetaTag('name', 'keywords', baseMeta.keywords);
    upsertMetaTag('property', 'og:title', finalTitle);
    upsertMetaTag('property', 'og:description', finalDesc);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('name', 'twitter:title', finalTitle);
    upsertMetaTag('name', 'twitter:description', finalDesc);
  }, [page, courseSlug, customTitle, customDescription]);

  return null;
};
