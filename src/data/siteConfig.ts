import { BusinessConfig } from '../types';

export const OFFICIAL_ASSETS = {
  logo: '/assets/aistudio/THE_ART_HORIZON__LOGO__d2985075.jpg',
  // Director / Founder Vikas Gothi original portrait photo (Suit portrait)
  founderPortrait: '/assets/aistudio/PCBM1617_8a8c1180.JPG',
  // Original Student Work: Young girl student proudly holding her Bal Krishna charcoal drawings
  studentBalKrishna: '/assets/aistudio/WhatsApp_Image_2024-01-08_at_16.21.16_501e11bf_553401ce.jpg',
  // Vikas Gothi wall mural creations
  vikasPaintingMandala: '/assets/aistudio/WhatsApp_Image_2026-10-08_at_6.22.03_PM_bb87e480.jpeg',
  vikasPaintingViolinMural: '/assets/aistudio/WhatsApp_Image_2026-10-08_at_6.22.13_PM__1__96f6997f.jpeg',
  // Real Student Works from The Art Horizon Academy
  studentSunsetPier: '/assets/aistudio/WhatsApp_Image_2026-10-15_at_8.25.38_PM_a08648b2.jpeg',
  studentVibrantElephant: '/assets/aistudio/WhatsApp_Image_2026-10-15_at_8.29.38_PM__1__a789db97.jpeg',
  studentCoupleSelfie: '/assets/aistudio/WhatsApp_Image_2026-10-15_at_8.29.38_PM__2__408ff73e.jpeg',
  studentSpottedDeer: '/assets/aistudio/WhatsApp_Image_2026-10-15_at_8.29.38_PM_d96f38ad.jpeg',
  studentHummingbirdMagnolia: '/assets/aistudio/WhatsApp_Image_2026-10-15_at_8.29.39_PM__1__79ef2edd.jpeg',
  radhaKrishnaEasel: '/assets/aistudio/WhatsApp_Image_2026-10-15_at_8.29.39_PM_c5fc8dfd.jpeg',
  // Specialized fine art and portrait assets
  artisticAnatomyStudy: '/src/assets/images/artistic_anatomy_study_1794419578905.jpg',
  charcoalPortrait: '/src/assets/images/charcoal_portrait_drawing_1794419579981.jpg',
  oilPortrait: '/src/assets/images/oil_portrait_painting_1794419579374.jpg',
  colourPencilPortrait: '/src/assets/images/colour_pencil_portrait_1794419580742.jpg',
  lippanArt: '/src/assets/images/lippan_art_craft_1794419582328.jpg',
  festivalRangoli: '/src/assets/images/festival_floor_rangoli_1794419582652.jpg',
  kidsDrawing: '/src/assets/images/kids_creative_drawing_1794419582402.jpg',
  pencilSketching: '/src/assets/images/pencil_sketching_study_1794419582968.jpg',
  acrylicEaselPainting: '/src/assets/images/acrylic_canvas_painting_1794419602514.jpg',
  resinGeodeArt: '/src/assets/images/resin_geode_art_1794419602991.jpg',
};

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  name: 'The Art Horizon',
  founder: 'Vikas Gothi',
  tagline: 'Where Creativity Finds Its Horizon.',
  phone: '+91 99818 83598',
  email: 'Info@thearthorizon.com',
  website: 'https://thearthorizon.com',
  address: '266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore, Madhya Pradesh, India',
  isAddressPendingConfirmation: false,
  businessHours: 'Studio visits & admissions are arranged by prior appointment. Contact us for current weekday and weekend batch timings.',
  instagramUrl: 'https://instagram.com/thearthorizon',
  whatsappMessage: 'Hello Vikas ji / The Art Horizon team, I would like to enquire regarding',
};

export const TARGET_SEARCH_TERMS = [
  'Art Classes in Indore',
  'Drawing Classes in Indore',
  'Painting Classes in Indore',
  'Kids Art Classes',
  'Fine Art Academy',
  'Online Drawing Classes for Kids',
  'Online Art Classes Worldwide',
  'Portrait Artist in Indore',
  'Acrylic and Oil Painting Commissions',
  'Watercolor Artist',
  'Rangoli Artist',
  'Wall Mural Painting Services',
];

export interface OnlineAgeBatch {
  id: string;
  ageRange: string;
  badge: string;
  title: string;
  recommendedFor: string;
  levels: {
    name: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    focusTopics: string[];
    outcomes: string;
  }[];
}

export const ONLINE_AGE_GROUPS: OnlineAgeBatch[] = [
  {
    id: 'age-6-8',
    ageRange: '6 to 8 Years Old',
    badge: 'Junior Artists',
    title: 'Foundational Drawing & Color Joy',
    recommendedFor: 'Early elementary students developing pencil grip, spatial awareness, and creative curiosity.',
    levels: [
      {
        name: 'Beginner',
        description: 'Building fine motor coordination, steady pencil control, and introducing basic geometric construction.',
        focusTopics: ['Pencil grip & hand control', 'Circle, square, triangle composition', 'Color wheel basics & oil pastels blending', 'Playful animals & nature forms'],
        outcomes: 'Confident freehand drawing without fear of making mistakes.',
      },
      {
        name: 'Intermediate',
        description: 'Learning visual proportions, light versus shadow, and clean boundary coloring with multiple mediums.',
        focusTopics: ['Size & scale relationships', 'Warm vs cool color moods', 'Poster colors & watercolour pencil techniques', 'Storybook scenes & imaginative landscapes'],
        outcomes: 'Ability to observe real-world objects and sketch them with accurate shapes.',
      },
      {
        name: 'Advanced',
        description: 'Developing surface textures, layered backgrounds, and complete structured compositions on quality paper.',
        focusTopics: ['Layered crayon & pastel scratching (sgraffito)', 'Dynamic animal & figure movement', 'Atmospheric perspective (near vs far)', 'Mini-portfolio presentation'],
        outcomes: 'Expressive, independent artworks ready for framing and school competitions.',
      },
    ],
  },
  {
    id: 'age-9-11',
    ageRange: '9 to 11 Years Old',
    badge: 'Creative Explorers',
    title: 'Observational Sketching & Shading Realism',
    recommendedFor: 'Middle childhood students ready for 3D realism, shading gradients, and diverse painting mediums.',
    levels: [
      {
        name: 'Beginner',
        description: 'Transitioning from flat cartoon shapes to realistic 3-dimensional objects with light and shadow.',
        focusTopics: ['Pencil value scale (2B, 4B, 6B)', 'Shading spheres, cylinders, and cubes', 'Cast shadow versus core shadow', 'Basic still life arrangement'],
        outcomes: 'Clear grasp of three-dimensional depth on a two-dimensional sheet.',
      },
      {
        name: 'Intermediate',
        description: 'Mastering color harmony, tonal values in watercolor and acrylics, and introduction to human face proportions.',
        focusTopics: ['Facial grid & eye-nose-lip spacing', 'Watercolour washes (wet-on-wet & dry-brush)', 'Nature studies, botanical leaves & birds', 'Cross-hatching and smudge control'],
        outcomes: 'Ability to draw recognizable portraits and realistic landscape paintings.',
      },
      {
        name: 'Advanced',
        description: 'Complex multi-object compositions, dynamic lighting, reflections in water, and texture rendering.',
        focusTopics: ['Glass and metallic shine rendering', 'Architectural perspective (1-point and 2-point)', 'Acrylic blending on canvas boards', 'Creative storytelling & themed artwork'],
        outcomes: 'Sophisticated artworks demonstrating technical discipline and individual artistic voice.',
      },
    ],
  },
  {
    id: 'age-12-15',
    ageRange: '12 to 15 Years Old',
    badge: 'Young Masters',
    title: 'Academic Realism, Portraiture & Portfolio',
    recommendedFor: 'Teens seeking serious fine art training, design school preparation, or hyperrealistic drawing mastery.',
    levels: [
      {
        name: 'Beginner',
        description: 'Foundational academic drawing fundamentals, sighting angles, proportions, and value structure.',
        focusTopics: ['Sight-size measurement & angle comparative sighting', 'Graphite & charcoal tonal range (HB to 8B)', 'Anatomical facial construction', 'Still life from live observation'],
        outcomes: 'Accurate freehand proportioning and commanding tonal control.',
      },
      {
        name: 'Intermediate',
        description: 'Realistic human anatomy, portrait features, dramatic chiaroscuro lighting, and medium exploration.',
        focusTopics: ['Loomis head construction & skull anatomy', 'Realistic skin texture and hair rendering', 'Watercolour glazing & acrylic canvas techniques', 'Urban sketching & architectural perspective'],
        outcomes: 'Striking, expressive realistic portraits and atmospheric landscape works.',
      },
      {
        name: 'Advanced',
        description: 'Atelier-grade realism, master copy studies, fine art portfolio development, and exhibition prep.',
        focusTopics: ['Classical charcoal & white chalk on toned paper', 'Color pencil realism and oil painting basics', 'Compositional weight & emotive focal points', 'Art school admission portfolio guidance'],
        outcomes: 'Gallery-quality fine art pieces and comprehensive entrance portfolios.',
      },
    ],
  },
];

export const ONLINE_CLASS_SPECIFICATIONS = {
  ageSpan: 'Children aged 6 to 15 years old',
  maxBatchSize: 'Maximum 4 to 5 students per batch',
  batchPacing: '1-Hour focused live interactive Zoom classes • 2 Classes per week',
  levelsPerBatch: '3 structured levels: Beginner, Intermediate, and Advanced in each age cohort',
  oneOnOneOption: {
    available: true,
    title: '1-on-1 Personalized Mentorship Also Available',
    description: 'For students seeking completely individualized attention, customized speed, or preparation for specific competitive examinations and international portfolio submissions, private one-on-one sessions can be booked.',
    note: 'The fee structure for 1-on-1 private sessions is different from small group batches.',
  },
};

export const INTERNATIONAL_DETAILS = {
  subtitle: 'Welcoming Students from Any Country Worldwide (US, UK, UAE, etc.)',
  targetCountries: [
    {
      country: 'United States & Canada',
      code: 'US/CA',
      flag: '🇺🇸 🇨🇦',
      timeZones: 'EST / CST / PST evening & weekend batches',
      popularPrograms: 'Ages 6-8, 9-11, 12-15 Live Zoom Batches • 1-on-1 Private Sessions',
    },
    {
      country: 'United Kingdom & Europe',
      code: 'UK/EU',
      flag: '🇬🇧 🇪🇺',
      timeZones: 'GMT / BST afternoon & weekend sessions',
      popularPrograms: 'Watercolour Foundations, Realistic Sketching, Acrylics on Canvas',
    },
    {
      country: 'United Arab Emirates & Gulf',
      code: 'UAE/GCC',
      flag: '🇦🇪 🇸🇦',
      timeZones: 'GST suitable afternoon & evening batches',
      popularPrograms: 'Small 4-5 Student Batches • Beginner, Intermediate & Advanced',
    },
    {
      country: 'Australia, Singapore & Worldwide',
      code: 'GLOBAL',
      flag: '🇦🇺 🇸🇬 🌏',
      timeZones: 'AEST / SGT friendly flexible time slots',
      popularPrograms: 'Students from any country welcome with timezone-matched slots',
    },
  ],
  features: [
    {
      title: 'Live Interactive Zoom Sessions',
      desc: 'Real-time two-way video instruction with dedicated dual cameras on canvas, palette, and instructor.',
    },
    {
      title: '1-Hour Focused Classes',
      desc: 'Scientifically planned duration to maximize concentration, muscle memory, and creative absorption.',
    },
    {
      title: '2 Classes Per Week',
      desc: 'Balanced pacing that allows practice, assignment completion, and consistent technique refinement.',
    },
    {
      title: 'Max 4 to 5 Students per Batch',
      desc: 'Strictly capped micro-batches guarantee every child receives immediate draw-overs and verbal feedback.',
    },
    {
      title: '3 Structured Progressive Levels',
      desc: 'Beginner, Intermediate, and Advanced curriculum in every age group so every child learns at the right level.',
    },
    {
      title: '1-on-1 Private Sessions Option',
      desc: 'Individual one-on-one classes are also available with tailored timing and specialized curriculum (separate fee).',
    },
  ],
};
