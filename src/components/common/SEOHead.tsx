import React, { useEffect } from 'react';
import { PageId } from '../../types';

interface SEOHeadProps {
  page: PageId;
  customTitle?: string;
  customDescription?: string;
}

const PAGE_METADATA: Record<PageId, { title: string; description: string; keywords: string }> = {
  home: {
    title: 'The Art Horizon – Fine Art Studio & Academy | Indore',
    description:
      'Where Creativity Finds Its Horizon. Discover fine art classes for kids and adults, international Zoom sessions, custom portrait commissions, and wall murals by Vikas Gothi.',
    keywords: 'Art Classes in Indore, Drawing Classes in Indore, Painting Classes in Indore, Fine Art Academy, Vikas Gothi',
  },
  about: {
    title: 'About The Art Horizon – Our Atelier Philosophy & Vision',
    description:
      'Learn about The Art Horizon fine arts studio in Indore. Dedicated to nurturing authentic artistic technique, classical drawing discipline, and contemporary creative freedom.',
    keywords: 'About The Art Horizon, Fine Arts Academy Indore, Art Studio Indore, Vikas Gothi Art',
  },
  founder: {
    title: 'Vikas Gothi – Founder & Master Artist | The Art Horizon',
    description:
      'Meet Vikas Gothi, founder of The Art Horizon. Renowned fine artist specializing in hyperrealistic charcoal portraits, grand rangoli installations, and fine art education.',
    keywords: 'Vikas Gothi, Portrait Artist in Indore, Rangoli Artist, Master Fine Artist India',
  },
  'art-classes': {
    title: 'Art Classes in Indore – Kids, Teens & Adult Drawing & Painting',
    description:
      'Structured fine art classes in Indore for kids, teens, and adults. Learn observational sketching, charcoal shading, acrylics, watercolours, and anatomical portraiture.',
    keywords: 'Kids Art Classes, Drawing Classes in Indore, Painting Classes in Indore, Sketching Classes',
  },
  'fine-art-courses': {
    title: 'Professional Fine Art Courses & Diplomas | The Art Horizon',
    description:
      'Master classical oil painting on canvas, sight-size realism, anatomy studies, and portfolio development with professional fine art courses by Vikas Gothi.',
    keywords: 'Fine Art Academy, Professional Fine Art Courses, Oil Painting Classes Indore, Diploma in Fine Arts',
  },
  'online-classes': {
    title: 'International Online Art Classes – Live Zoom Drawing & Painting | The Art Horizon',
    description:
      'Live interactive online drawing and painting classes for kids aged 6–15 via Zoom. Small batches of 4–6 students, 8 live classes per month, Junior, Young & Senior programs.',
    keywords: 'Online Drawing Classes for Kids, International Online Art Classes, Live Zoom Art Classes US UK UAE',
  },
  newsletter: {
    title: 'Newsletter & Academy Announcements | The Art Horizon',
    description:
      'Latest academy announcements, upcoming drawing and painting workshops, new international batches, art competitions, and student achievements at The Art Horizon.',
    keywords: 'The Art Horizon Newsletter, Art Workshops Indore, Student Art Achievements, Art Competitions',
  },
  'portrait-commissions': {
    title: 'Custom Portrait Commissions – Charcoal & Colour Pencil | Vikas Gothi',
    description:
      'Commission museum-grade, hand-drawn portraits in charcoal, graphite, and colour pencil by Vikas Gothi. Worldwide delivery with certificate of authenticity.',
    keywords: 'Portrait Artist in Indore, Charcoal Portraits, Custom Portrait Commission, Colour Pencil Portraits',
  },
  'commercial-projects': {
    title: 'Commercial Art Projects – Wall Murals & Rangoli | The Art Horizon',
    description:
      'Bespoke wall murals, record-scale traditional and 3D rangoli, and corporate art installations for hotels, cafes, and grand cultural festivals.',
    keywords: 'Wall Mural Painting Services, Rangoli Artist, Corporate Art Projects, Hotel Murals Indore',
  },
  workshops: {
    title: 'Creative Art Workshops – Resin, Lippan, Pottery & Clay Art',
    description:
      'Join weekend creative art workshops at The Art Horizon. Ocean resin art, traditional Kutch Lippan mud and mirror art, terracotta clay pottery, and summer camps.',
    keywords: 'Resin Art Workshop, Lippan Art Workshop Indore, Clay Pottery Classes, Art Workshops Indore',
  },
  gallery: {
    title: 'Artwork Gallery – Fine Art, Portraits & Murals | The Art Horizon',
    description:
      'Explore original artworks, commissioned charcoal portraits, student masterpieces, and large-scale murals by Vikas Gothi and The Art Horizon studio.',
    keywords: 'Fine Art Gallery Indore, Charcoal Drawing Gallery, Student Artwork Exhibition',
  },
  testimonials: {
    title: 'Student & Client Testimonials | The Art Horizon',
    description:
      'Read authentic experiences from students, parents, and art commission clients from Indore, the United States, United Kingdom, and the UAE.',
    keywords: 'The Art Horizon Reviews, Student Experiences, Art Class Feedback Indore',
  },
  contact: {
    title: 'Contact The Art Horizon – Studio Visit & Course Enquiries | Indore',
    description:
      'Get in touch with The Art Horizon in Usha Nagar, Indore. Call +91 99818 83598, WhatsApp, or request course details and free demo sessions.',
    keywords: 'Contact The Art Horizon, Art Studio Location Indore, Ranjeet Hanuman Road Art Class',
  },
};

export const SEOHead: React.FC<SEOHeadProps> = ({ page, customTitle, customDescription }) => {
  useEffect(() => {
    const meta = PAGE_METADATA[page] || PAGE_METADATA.home;
    const finalTitle = customTitle || meta.title;
    const finalDesc = customDescription || meta.description;

    document.title = finalTitle;

    // Update meta description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', finalDesc);
    }

    // Update OG Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', finalTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', finalDesc);

    // Update Twitter Title & Description
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', finalTitle);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', finalDesc);
  }, [page, customTitle, customDescription]);

  return null;
};
