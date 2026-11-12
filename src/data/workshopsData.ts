import { WorkshopItem } from '../types';
import { OFFICIAL_ASSETS } from './siteConfig';

export const WORKSHOPS_DATA: WorkshopItem[] = [
  {
    id: 'resin-art-workshop',
    title: 'Resin Ocean & Geode Masterclass',
    category: 'resin',
    duration: '3.5 Hours (Weekend Batch)',
    level: 'Beginner to Intermediate',
    materialsProvided: true,
    takeHomeArtwork: true,
    description:
      'Immerse yourself in the mesmerizing, fluid world of high-gloss epoxy resin. Learn safe mixing ratios, bubble-free curing, metallic pigment swirls, real crystals application, and lacing techniques to craft stunning ocean waves or luxury geode platters.',
    whatYouLearn: [
      'Safety guidelines, PPE, and non-toxic 2:1 & 3:1 resin chemistry',
      'Ocean foam wave effects using heat guns and white paste',
      'Geode line work with gold foil, metallic mica powders, and natural crystals',
      'Crafting either a 14-inch circular wooden tray or a set of 4 luxury coasters with gold edge gilding',
    ],
    image: OFFICIAL_ASSETS.resinGeodeArt,
  },
  {
    id: 'lippan-art-heritage-workshop',
    title: 'Traditional Lippan Kaam (Mud & Mirror Art)',
    category: 'lippan',
    duration: '4 Hours (Single Day Intensive)',
    level: 'Beginner Friendly',
    materialsProvided: true,
    takeHomeArtwork: true,
    description:
      'Experience the timeless rural craft of the Thar and Kutch regions. Lippan art brings earthy textured clay reliefs embedded with delicate mirrors (Aabhla) that reflect candlelight and natural sunshine into modern living rooms.',
    whatYouLearn: [
      'Preparing smooth, crack-resistant clay dough and adhesive formulation',
      'Rolling even cylindrical clay coils and creating intricate geometric and peacock borders',
      'Accurate placement and setting of diverse shaped mirrors (diamond, round, teardrop)',
      'Finishing with traditional off-white tones or contemporary terracotta washes',
    ],
    image: OFFICIAL_ASSETS.lippanArt,
  },
  {
    id: 'pottery-clay-art',
    title: 'Pottery & Terracotta Clay Sculpture',
    category: 'clay',
    duration: '3 Hours',
    level: 'All Ages & Beginners',
    materialsProvided: true,
    takeHomeArtwork: true,
    description:
      'A deeply tactile, grounding experience with natural organic clay. Participants learn pinch-pot methods, slab building, coiling, and sculpted botanical textures to create functional tableware or decorative planters.',
    whatYouLearn: [
      'Clay conditioning, air pocket removal, and water management',
      'Hand-building techniques: pinch pots, slab vases, and coil bowls',
      'Stamping, leaf imprints, and sgraffito surface decoration',
      'Air-dry finishing methods and studio firing instructions',
    ],
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'diy-art-workshops',
    title: 'DIY Modern Art & Texture on Canvas',
    category: 'diy',
    duration: '2.5 Hours',
    level: 'Beginner Friendly',
    materialsProvided: true,
    takeHomeArtwork: true,
    description:
      'Explore contemporary tactile textures, modeling paste, palette knife arching, alcohol inks, and gold leafing. Designed for anyone seeking to create aesthetic, Instagram-worthy minimalist art pieces for their home walls.',
    whatYouLearn: [
      'Textured modeling paste handling with notched trowels and palette knives',
      'Applying 24K imitation gold/copper leaf with sizing adhesive',
      'Minimalist monochromatic balance and modern Scandinavian compositions',
      'Ready-to-hang stretched canvas creation (12x16 inch)',
    ],
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'summer-art-camps',
    title: 'Summer & Holiday Art Immersion Camps',
    category: 'camps',
    duration: '10-Day / 15-Day Modules (Morning Batches)',
    level: 'Kids (5-11) & Teens (12-16)',
    materialsProvided: true,
    takeHomeArtwork: true,
    description:
      'An inspiring multi-medium vacation sanctuary where young artists explore a new creative medium every two days. Packed with hands-on painting, clay modeling, origami, mask making, tie-dye, and culminating in a grand Student Art Exhibition.',
    whatYouLearn: [
      'Exploration across 6 different mediums: pastels, watercolours, clay, craft, acrylics, and sketch',
      'Art history stories made fun and accessible for young minds',
      'Collaborative mural project fostering camaraderie and teamwork',
      'Certificate of Creative Excellence awarded at the graduation showcase',
    ],
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'corporate-cafe-workshops',
    title: 'Corporate Team Art & Café Art Jams',
    category: 'corporate',
    duration: '2 to 3 Hours (Customizable)',
    level: 'All Skill Levels / Team Building',
    materialsProvided: true,
    takeHomeArtwork: true,
    description:
      'Designed for corporate teams, leadership retreats, café weekend mixers, and birthday celebrations. Art is a proven catalyst for breaking stress, encouraging unconventional problem-solving, and building authentic human connection outside screens.',
    whatYouLearn: [
      'Sip & Paint or Coffee & Canvas format guided step-by-step by master instructors',
      'Collaborative puzzle canvas where each team member paints one quadrant of a unified corporate mural',
      'Zero performance anxiety — warm, joyful, music-backed social atmosphere',
      'Turnkey setup at your office campus, partnered café in Indore, or at our studio',
    ],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
];
