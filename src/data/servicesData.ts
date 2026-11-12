import { ServiceItem } from '../types';
import { OFFICIAL_ASSETS } from './siteConfig';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'oil-painting-commissions',
    title: 'Custom Oil Painting Commissions on Canvas',
    category: 'portraits',
    subtitle: 'Timeless museum-grade oil paintings on Belgian linen, with classical multi-layered glazes.',
    description:
      'Masterpiece oil paintings crafted with pure artist-grade pigments and linseed mediums on stretched Belgian linen. Whether creating royal family portraits, ancestral tributes, classical figurative artworks, or landscape sceneries, oil paintings offer unparalleled depth, luminosity, and heirloom durability for generations.',
    features: [
      '100% hand-painted by Vikas Gothi with classical sight-size and grisaille underpainting',
      'Created on heavy-duty stretched Belgian linen with kiln-dried pine stretchers',
      'Rich multi-layer glazing for glowing lifelike skin tones and fabric textures',
      'Sealed with archival Gamvar museum varnish for permanent protection',
      'Worldwide crated shipping with Certificate of Authenticity',
    ],
    deliverables: ['Original Oil on Canvas', 'Certificate of Authenticity by Vikas Gothi', 'Custom Framing Options', 'Worldwide Safe Packaging'],
    image: OFFICIAL_ASSETS.oilPortrait,
  },
  {
    id: 'acrylic-painting-commissions',
    title: 'Custom Acrylic Painting Commissions',
    category: 'portraits',
    subtitle: 'Vibrant modern realism, textured impasto, and contemporary canvas statements.',
    description:
      'Bold, expressive, and richly pigmented acrylic artworks on stretched canvas or wooden panels. Perfect for modern living spaces, contemporary portraits, spiritual deities, dynamic landscapes, and customized interior color palettes.',
    features: [
      'Heavy-body artist acrylics with high lightfastness ratings (Golden / Liquitex / Winsor & Newton)',
      'Palette knife textures, smooth gradients, and luminous metallic accents',
      'Water-resistant, non-yellowing satin or gloss protective varnish',
      'Turnaround tailored to your home or office interior installation timeline',
    ],
    deliverables: ['Custom Acrylic on Stretched Canvas', 'Certificate of Authenticity', 'Hanging Hardware Installed', 'Worldwide Shipping'],
    image: OFFICIAL_ASSETS.acrylicEaselPainting,
  },
  {
    id: 'watercolor-commissions',
    title: 'Fine Art Watercolor Commissions',
    category: 'portraits',
    subtitle: 'Delicate, luminous, and ethereal artwork on 100% cotton cold-pressed paper.',
    description:
      'Capturing softness and spontaneous light through transparent watercolor washes. Ideal for botanical florals, bridal portraits, heritage architecture, children portraits, and scenic travel memories on 300 GSM archival Arches or Fabriano cotton paper.',
    features: [
      'Pure artist watercolors (Schmincke Horadam / Daniel Smith extra fine pigments)',
      '100% rag acid-free archival cotton paper with deckled edges',
      'Ethereal translucent layering capturing natural light and atmosphere',
      'Presented with acid-free museum mount board ready for glass framing',
    ],
    deliverables: ['Original Watercolor Artwork', 'Archival Conservation Mount', 'Certificate of Authenticity', 'Care Guide'],
    image: OFFICIAL_ASSETS.studentBalKrishna,
  },
  {
    id: 'charcoal-graphite-portraits',
    title: 'Charcoal & Graphite Portrait Commissions',
    category: 'portraits',
    subtitle: 'Striking monochrome depth, hyperrealistic eyes, and soul-stirring likeness.',
    description:
      'Handcrafted charcoal and graphite portraits created with European willow, compressed Nitram charcoal, and fine graphite on Fabriano cotton paper. Each piece translates photographs of your parents, children, couples, or historical figures into dramatic tonal heirlooms.',
    features: [
      '100% hand-drawn from high-resolution reference photos by Vikas Gothi',
      'Archival 300 GSM acid-free European Fabriano cotton paper',
      'Treated with protective museum UV fixative spray against oxidation and smudging',
      'Custom teakwood or minimal black museum framing available',
    ],
    deliverables: ['Original Hand-drawn Artwork', 'Certificate of Authenticity', 'Framing & Crating Available', 'Worldwide Tracked Shipping'],
    image: OFFICIAL_ASSETS.charcoalPortrait,
  },
  {
    id: 'colour-pencil-portraits',
    title: 'Colour Pencil Fine Art Portraits',
    category: 'portraits',
    subtitle: 'Velvety, hyperrealistic warmth with photographic skin tones and luminous eyes.',
    description:
      'Engineered with premium lightfast coloured pencils (Faber-Castell Polychromos & Caran d’Ache Luminance). Multiple translucent wax-and-oil layers produce rich glowing skin tones and intricate jewelry details that retain brilliance for decades.',
    features: [
      'Layered pigment technique yielding oil-painting richness with fine pencil precision',
      'Exceptional for children, bridal portraits, and beloved pet tributes',
      'Superior lightfast rating ensuring colors never fade over generations',
    ],
    deliverables: ['Custom Handcrafted Artwork', 'Certificate of Authenticity', 'Archival Mount Board', 'Care Guide'],
    image: OFFICIAL_ASSETS.colourPencilPortrait,
  },
  {
    id: 'wall-murals',
    title: 'Bespoke Wall Murals & Accent Architecture',
    category: 'murals',
    subtitle: 'Transforming commercial, hospitality, and residential spaces into living art galleries.',
    description:
      'From expansive music and themed murals to traditional Indian mandalas, botanical courtyards, and luxury villa facades. Vikas Gothi and the mural team conceptualize custom sketches aligned with your interior architecture and paint with weather-resistant artist mediums.',
    features: [
      'See Vikas Gothi at work on signature murals (from vibrant musical violin walls to sacred mandalas)',
      'Styles range from classical Indian frescoes to colorful contemporary abstracts and biophilic botanicals',
      'Durable, washable, UV-resistant artist grade acrylics and varnishes',
      'Turnkey execution with minimal disruption to your daily operations',
    ],
    deliverables: ['Concept Moodboards & 3D Previews', 'Surface Priming & Execution', 'Protective Varnish Coat', 'Maintenance Warranty'],
    image: OFFICIAL_ASSETS.vikasPaintingViolinMural,
  },
  {
    id: 'large-scale-rangoli',
    title: 'Large-Scale Fine Art & 3D Rangoli',
    category: 'rangoli',
    subtitle: 'Mastery in grand festival, record-scale, and royal heritage rangoli creations.',
    description:
      'The Art Horizon is celebrated for awe-inspiring record-scale traditional and 3D illusion rangolis. Led by Vikas Gothi, our team creates mesmerizing floor artworks for mega festivals, corporate conventions, wedding sangeets, and cultural events across India.',
    features: [
      'Expertise in portrait rangoli, traditional Sanskar Bharti patterns, and 3D optical illusions',
      'Vibrant organic and non-toxic powdered pigments in custom blended shades',
      'Execution capacity from 100 sq. ft to 5,000+ sq. ft with precision symmetry',
      'Signature photo opportunity that captivates every guest and media cameras',
    ],
    deliverables: ['Thematic Floor Layout Plan', 'On-Site Team Execution', 'Spot Lighting Advice', 'High-Res Event Video/Photo Showcase'],
    image: OFFICIAL_ASSETS.festivalRangoli,
  },
  {
    id: 'hotel-corporate-art-projects',
    title: 'Hotel & Corporate Art Projects',
    category: 'corporate',
    subtitle: 'Curated canvas suites, sculpture installations, and brand-aligned art collections.',
    description:
      'We partner with architects, interior designers, hoteliers, and corporate leaders to curate and produce bespoke art collections that embody elegance and corporate prestige. From executive boardroom centerpieces to guest suite canvas sets.',
    features: [
      'Tailored color schemes matching interior furniture and lighting palettes',
      'Multi-canvas suites for hotel corridors, guest suites, and corporate meeting rooms',
      'Heavy-duty Belgian linen and kiln-dried pine wood stretchers',
    ],
    deliverables: ['Art Curation Proposal', 'Custom Art Production', 'Frame Matching & Delivery', 'Installation Supervision'],
    image: OFFICIAL_ASSETS.resinGeodeArt,
  },
  {
    id: 'festival-installations',
    title: 'Festival & Cultural Installations',
    category: 'installations',
    subtitle: 'Thematic 3D art installations, temple decor, and grand cultural backdrops.',
    description:
      'Custom thematic installations celebrating Diwali, Ganesh Utsav, Navratri, Holi, and Indian cultural celebrations combining woodcraft, natural pigments, mirror work, and illumination.',
    features: [
      'Conceptualized around sacred geometry, folklore, and contemporary celebration',
      'Safe, sturdy modular construction engineered for high-footfall public venues',
    ],
    deliverables: ['Installation Blueprint', 'Material Procurement', 'On-site Assembly', 'Safe Post-Event Dismantling'],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80',
  },
];
