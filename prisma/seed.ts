import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Treadmills",
    slug: "treadmills",
    description: "Quiet, performance-led treadmills sized for European home gyms.",
    sortOrder: 1,
  },
  {
    name: "Exercise Bikes",
    slug: "exercise-bikes",
    description: "Studio-style bikes with compact footprints and reliable drive systems.",
    sortOrder: 2,
  },
  {
    name: "Rowing Machines",
    slug: "rowing-machines",
    description: "Smooth rowers with balanced resistance for full-body conditioning.",
    sortOrder: 3,
  },
  {
    name: "Benches",
    slug: "benches",
    description: "Stable benches built for daily strength work and adjustable positions.",
    sortOrder: 4,
  },
  {
    name: "Adjustable Dumbbells",
    slug: "adjustable-dumbbells",
    description: "Compact dumbbell systems with fast weight changes and clean storage.",
    sortOrder: 5,
  },
  {
    name: "Racks & Rigs",
    slug: "racks-rigs",
    description: "Compact racks and rigs for controlled, safe lifting at home or studio.",
    sortOrder: 6,
  },
  {
    name: "Cable Systems",
    slug: "cable-systems",
    description: "Smooth, low-profile cable stations for full-range strength work.",
    sortOrder: 7,
  },
  {
    name: "Mats & Accessories",
    slug: "mats-accessories",
    description: "Training surfaces and accessories that protect floors and joints.",
    sortOrder: 8,
  },
  {
    name: "Home Gym Bundles",
    slug: "bundles",
    description: "Curated equipment sets for complete, space-smart training setups.",
    sortOrder: 9,
  },
];

type CategoryRecord = { id: string; slug: string };
type BrandRecord = { id: string; slug: string };
type CollectionRecord = { id: string; slug: string };
type CustomerRecord = { id: string; email: string };
type ProductRecord = { id: string; slug: string; name: string; sku: string; price: number };
type ShippingMethodRecord = { id: string; name: string; price: number };
type PaymentMethodRecord = { id: string; name: string };

const brands = [
  {
    name: "Coremont",
    slug: "coremont",
    originCountry: "Germany",
    website: "https://coremont.eu",
  },
  {
    name: "NordCore",
    slug: "nordcore",
    originCountry: "Sweden",
    website: "https://nordcore.eu",
  },
  {
    name: "Valen",
    slug: "valen",
    originCountry: "Denmark",
    website: "https://valen-training.eu",
  },
  {
    name: "Ardent",
    slug: "ardent",
    originCountry: "Netherlands",
    website: "https://ardent-fitness.eu",
  },
  {
    name: "Veloce",
    slug: "veloce",
    originCountry: "Italy",
    website: "https://veloce-motion.eu",
  },
];

const collections = [
  {
    name: "Compact Home Gym",
    slug: "compact-home-gym",
    description: "Space-conscious equipment with clean lines and high daily reliability.",
    featured: true,
    heroImageUrl: "/images/collections/compact-home-gym.jpg",
    heroImageAlt: "Compact home gym setup",
    sortOrder: 1,
    productSlugs: [
      "coremont-compact-rack-s1",
      "coremont-compact-rower-c2",
      "coremont-adjustable-dumbbell-set-24kg",
      "coremont-training-mat-pro",
    ],
  },
  {
    name: "Studio Essentials",
    slug: "studio-essentials",
    description: "Durable staples selected for boutique training spaces and private studios.",
    featured: true,
    heroImageUrl: "/images/collections/studio-essentials.jpg",
    heroImageAlt: "Studio strength equipment",
    sortOrder: 2,
    productSlugs: [
      "coremont-studio-bike-m4",
      "coremont-power-rack-v6",
      "coremont-forge-adjustable-bench",
      "coremont-dual-cable-c4",
    ],
  },
  {
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Top-requested pieces for balanced strength and cardio training.",
    featured: true,
    heroImageUrl: "/images/collections/best-sellers.jpg",
    heroImageAlt: "Best selling fitness equipment",
    sortOrder: 3,
    productSlugs: [
      "coremont-arc-t7-treadmill",
      "coremont-axis-rower",
      "coremont-studio-bike-m2",
      "coremont-adjustable-dumbbell-set-32kg",
    ],
  },
  {
    name: "Quiet Cardio",
    slug: "quiet-cardio",
    description: "Low-noise cardio equipment suited to apartment-friendly training.",
    featured: false,
    heroImageUrl: "/images/collections/quiet-cardio.jpg",
    heroImageAlt: "Quiet cardio equipment",
    sortOrder: 4,
    productSlugs: [
      "coremont-quiet-bike-c1",
      "coremont-arc-t9-treadmill",
      "coremont-axis-rower-pro",
    ],
  },
  {
    name: "Strength Foundations",
    slug: "strength-foundations",
    description: "Essential strength pieces to build a complete training base.",
    featured: false,
    heroImageUrl: "/images/collections/strength-foundations.jpg",
    heroImageAlt: "Strength foundations collection",
    sortOrder: 5,
    productSlugs: [
      "coremont-forge-bench",
      "coremont-compact-rack-s2",
      "coremont-adjustable-dumbbell-set-40kg",
    ],
  },
  {
    name: "Home Gym Bundles",
    slug: "bundles",
    description: "Complete bundles assembled for efficient, all-round training.",
    featured: false,
    heroImageUrl: "/images/collections/bundles.jpg",
    heroImageAlt: "Home gym bundle",
    sortOrder: 6,
    productSlugs: [
      "coremont-home-gym-bundle-compact",
      "coremont-studio-starter-bundle",
    ],
  },
];

const shippingMethods = [
  { name: "Standard Delivery", price: 45, etaDays: 5, sortOrder: 1 },
  { name: "Scheduled Delivery", price: 75, etaDays: 4, sortOrder: 2 },
  { name: "White Glove Setup", price: 140, etaDays: 8, sortOrder: 3 },
];

const paymentMethods = [
  { name: "Card Payment", type: "CARD", provider: "Stripe", sortOrder: 1 },
  { name: "Bank Transfer", type: "BANK_TRANSFER", provider: "SEPA", sortOrder: 2 },
  { name: "Invoice on Approval", type: "INVOICE", provider: "Coremont", sortOrder: 3 },
];

const customers = [
  { firstName: "Lena", lastName: "Meyer", email: "lena.meyer@coremont.test", phone: "+49 151 222 344" },
  { firstName: "Julien", lastName: "Bernard", email: "julien.bernard@coremont.test", phone: "+33 6 31 22 11" },
  { firstName: "Sofia", lastName: "Rossi", email: "sofia.rossi@coremont.test", phone: "+39 348 554 201" },
  { firstName: "Marta", lastName: "Nowak", email: "marta.nowak@coremont.test", phone: "+48 601 220 300" },
  { firstName: "Jonas", lastName: "Lund", email: "jonas.lund@coremont.test", phone: "+46 70 552 992" },
  { firstName: "Nina", lastName: "Kovac", email: "nina.kovac@coremont.test", phone: "+385 91 445 992" },
  { firstName: "Felix", lastName: "Huber", email: "felix.huber@coremont.test", phone: "+43 660 222 109" },
  { firstName: "Eva", lastName: "Nagy", email: "eva.nagy@coremont.test", phone: "+36 30 448 558" },
  { firstName: "Oskar", lastName: "Jensen", email: "oskar.jensen@coremont.test", phone: "+45 20 998 443" },
  { firstName: "Ana", lastName: "Silva", email: "ana.silva@coremont.test", phone: "+351 91 221 099" },
  { firstName: "James", lastName: "Adams", email: "james.adams@coremont.test", phone: "+44 7700 900111" },
  { firstName: "Claire", lastName: "Dubois", email: "claire.dubois@coremont.test", phone: "+33 6 77 889 221" },
];

const faqs = [
  {
    question: "How long does delivery take within Europe?",
    answer:
      "Standard delivery arrives in 5–7 working days across most EU regions. Scheduled delivery and setup options are available at checkout.",
    category: "Shipping",
    sortOrder: 1,
  },
  {
    question: "Do you offer room-of-choice or installation?",
    answer:
      "Yes. Selected items qualify for room-of-choice delivery. White Glove Setup includes placement, assembly, and packaging removal.",
    category: "Delivery",
    sortOrder: 2,
  },
  {
    question: "What is your returns policy?",
    answer:
      "Unused equipment can be returned within 30 days. Return labels and pickup can be arranged through support.",
    category: "Returns",
    sortOrder: 3,
  },
  {
    question: "Is professional assembly required?",
    answer:
      "Most items include guided assembly with two-person lifting. Larger treadmills and rigs benefit from our setup service.",
    category: "Product",
    sortOrder: 4,
  },
  {
    question: "Do Coremont products carry a warranty?",
    answer:
      "All Coremont equipment includes a minimum 2-year warranty with extended coverage on frames and drive systems.",
    category: "Warranty",
    sortOrder: 5,
  },
  {
    question: "Can I request a commercial quote for studio purchases?",
    answer:
      "Yes. Our team can provide volume pricing and tailored delivery options for studio and hospitality buyers.",
    category: "Business",
    sortOrder: 6,
  },
  {
    question: "Are your products compatible with EU power sockets?",
    answer:
      "All electronic equipment ships with EU-compliant power cables and voltage requirements for European homes.",
    category: "Technical",
    sortOrder: 7,
  },
  {
    question: "How is equipment packaged for transport?",
    answer:
      "We use reinforced cartons and edge protection to minimise damage, with tracking shared at dispatch.",
    category: "Shipping",
    sortOrder: 8,
  },
];

const productImages = {
  treadmills: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=1200&q=80",
  ],
  "exercise-bikes": [
    "https://images.unsplash.com/photo-1526401485004-2c9509c1e1ce?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  ],
  "rowing-machines": [
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1599058917212-d750089bc07f?auto=format&fit=crop&w=1200&q=80",
  ],
  benches: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501b8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=1200&q=80",
  ],
  "adjustable-dumbbells": [
    "https://images.unsplash.com/photo-1599058918144-1ffabb6d4c53?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=1200&q=80",
  ],
  "racks-rigs": [
    "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501b8?auto=format&fit=crop&w=1200&q=80",
  ],
  "cable-systems": [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1554344058-0030c3f3f0f3?auto=format&fit=crop&w=1200&q=80",
  ],
  "mats-accessories": [
    "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80",
  ],
  bundles: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=1200&q=80",
  ],
};

const productCatalog = [
  {
    name: "Coremont Arc T7 Treadmill",
    slug: "coremont-arc-t7-treadmill",
    sku: "CM-TR-ARC-T7",
    shortDescription: "Quiet motorised treadmill designed for compact home studios.",
    description:
      "A balanced treadmill for daily training with a steady 3.0 CHP motor, clean belt tracking, and a stable frame designed for long sessions.",
    price: 1890,
    compareAtPrice: 2090,
    featured: true,
    originCountry: "Germany",
    material: "Powder-coated steel, aluminium rails",
    maxUserWeight: 150,
    assemblyRequired: true,
    footprintTag: "LARGE",
    usageType: "HOME",
    lengthCm: 180,
    widthCm: 80,
    heightCm: 140,
    weightKg: 98,
    warrantyMonths: 36,
    shippingEstimateDays: 7,
    tags: ["quiet", "home", "running"],
    categorySlug: "treadmills",
    brandSlug: "coremont",
    inventory: { stock: 12, reserved: 2, location: "Berlin" },
  },
  {
    name: "Coremont Arc T9 Treadmill",
    slug: "coremont-arc-t9-treadmill",
    sku: "CM-TR-ARC-T9",
    shortDescription: "Performance treadmill with deeper cushioning and higher incline range.",
    description:
      "A premium upgrade with enhanced cushioning, extended incline control, and a reinforced deck for long, heavy use.",
    price: 2490,
    compareAtPrice: 2690,
    featured: true,
    originCountry: "Germany",
    material: "Powder-coated steel, anodised aluminium",
    maxUserWeight: 170,
    assemblyRequired: true,
    footprintTag: "LARGE",
    usageType: "STUDIO",
    lengthCm: 190,
    widthCm: 86,
    heightCm: 145,
    weightKg: 112,
    warrantyMonths: 48,
    shippingEstimateDays: 7,
    tags: ["incline", "studio", "running"],
    categorySlug: "treadmills",
    brandSlug: "coremont",
    inventory: { stock: 6, reserved: 1, location: "Berlin" },
  },
  {
    name: "Coremont Stride M5 Treadmill",
    slug: "coremont-stride-m5-treadmill",
    sku: "CM-TR-STR-M5",
    shortDescription: "Slim treadmill with a lighter frame for flexible home placement.",
    description:
      "Designed for apartments and spare rooms with a streamlined frame, stable belt tracking, and quiet control console.",
    price: 1490,
    compareAtPrice: null,
    featured: false,
    originCountry: "Poland",
    material: "Steel chassis, composite deck",
    maxUserWeight: 135,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "HOME",
    lengthCm: 168,
    widthCm: 76,
    heightCm: 132,
    weightKg: 85,
    warrantyMonths: 24,
    shippingEstimateDays: 6,
    tags: ["compact", "home", "foldable"],
    categorySlug: "treadmills",
    brandSlug: "valen",
    inventory: { stock: 8, reserved: 0, location: "Warsaw" },
  },
  {
    name: "Coremont Stride M7 Treadmill",
    slug: "coremont-stride-m7-treadmill",
    sku: "CM-TR-STR-M7",
    shortDescription: "Daily-use treadmill with reinforced deck and low-vibration drive.",
    description:
      "A reliable treadmill with a stable deck, improved vibration damping, and a clean interface for focused sessions.",
    price: 1690,
    compareAtPrice: null,
    featured: false,
    originCountry: "Poland",
    material: "Steel chassis, aluminium rails",
    maxUserWeight: 145,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "HOME",
    lengthCm: 175,
    widthCm: 78,
    heightCm: 136,
    weightKg: 90,
    warrantyMonths: 30,
    shippingEstimateDays: 6,
    tags: ["stable", "home", "quiet"],
    categorySlug: "treadmills",
    brandSlug: "valen",
    inventory: { stock: 10, reserved: 1, location: "Warsaw" },
  },
  {
    name: "Coremont Studio Bike M2",
    slug: "coremont-studio-bike-m2",
    sku: "CM-BK-STU-M2",
    shortDescription: "Studio-grade bike with smooth belt drive and quiet resistance.",
    description:
      "Balanced resistance, precise adjustment, and a compact frame sized for daily ride sessions.",
    price: 990,
    compareAtPrice: 1090,
    featured: true,
    originCountry: "Italy",
    material: "Steel frame, aluminium flywheel",
    maxUserWeight: 150,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "STUDIO",
    lengthCm: 118,
    widthCm: 52,
    heightCm: 120,
    weightKg: 54,
    warrantyMonths: 24,
    shippingEstimateDays: 5,
    tags: ["studio", "belt-drive", "compact"],
    categorySlug: "exercise-bikes",
    brandSlug: "veloce",
    inventory: { stock: 14, reserved: 2, location: "Milan" },
  },
  {
    name: "Coremont Studio Bike M4",
    slug: "coremont-studio-bike-m4",
    sku: "CM-BK-STU-M4",
    shortDescription: "Heavy-duty bike with extended adjustment range and smooth cadence.",
    description:
      "Built for high-rotation studio use with reinforced crank arms, balanced flywheel, and precision adjustment points.",
    price: 1290,
    compareAtPrice: 1390,
    featured: true,
    originCountry: "Italy",
    material: "Steel frame, stainless hardware",
    maxUserWeight: 170,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "STUDIO",
    lengthCm: 120,
    widthCm: 55,
    heightCm: 122,
    weightKg: 60,
    warrantyMonths: 36,
    shippingEstimateDays: 6,
    tags: ["studio", "flywheel", "adjustable"],
    categorySlug: "exercise-bikes",
    brandSlug: "veloce",
    inventory: { stock: 9, reserved: 1, location: "Milan" },
  },
  {
    name: "Coremont Quiet Bike C1",
    slug: "coremont-quiet-bike-c1",
    sku: "CM-BK-QT-C1",
    shortDescription: "Low-noise cardio bike designed for apartment-friendly training.",
    description:
      "A quiet belt-drive bike with slim footprint and minimal maintenance requirements for everyday cardio.",
    price: 740,
    compareAtPrice: null,
    featured: false,
    originCountry: "Sweden",
    material: "Steel frame, composite housing",
    maxUserWeight: 135,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 104,
    widthCm: 50,
    heightCm: 110,
    weightKg: 38,
    warrantyMonths: 24,
    shippingEstimateDays: 5,
    tags: ["quiet", "compact", "home"],
    categorySlug: "exercise-bikes",
    brandSlug: "nordcore",
    inventory: { stock: 18, reserved: 1, location: "Stockholm" },
  },
  {
    name: "Coremont Air Bike R8",
    slug: "coremont-air-bike-r8",
    sku: "CM-BK-AIR-R8",
    shortDescription: "Air-resistance bike for interval training and full-body conditioning.",
    description:
      "A sturdy air bike with dual-action handles, reinforced base, and progressive resistance for interval work.",
    price: 1190,
    compareAtPrice: null,
    featured: false,
    originCountry: "Netherlands",
    material: "Steel frame, aluminium fan cage",
    maxUserWeight: 160,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "COMMERCIAL",
    lengthCm: 130,
    widthCm: 60,
    heightCm: 128,
    weightKg: 62,
    warrantyMonths: 24,
    shippingEstimateDays: 6,
    tags: ["interval", "air-resistance", "studio"],
    categorySlug: "exercise-bikes",
    brandSlug: "ardent",
    inventory: { stock: 7, reserved: 0, location: "Amsterdam" },
  },
  {
    name: "Coremont Axis Rower",
    slug: "coremont-axis-rower",
    sku: "CM-RW-AXIS",
    shortDescription: "Smooth rower with balanced resistance and silent rail glide.",
    description:
      "Balanced resistance and a refined rail system keep sessions steady and controlled for full-body conditioning.",
    price: 1390,
    compareAtPrice: 1490,
    featured: true,
    originCountry: "Denmark",
    material: "Steel frame, aluminium rail",
    maxUserWeight: 150,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "HOME",
    lengthCm: 210,
    widthCm: 56,
    heightCm: 96,
    weightKg: 36,
    warrantyMonths: 36,
    shippingEstimateDays: 6,
    tags: ["rower", "quiet", "full-body"],
    categorySlug: "rowing-machines",
    brandSlug: "valen",
    inventory: { stock: 11, reserved: 2, location: "Copenhagen" },
  },
  {
    name: "Coremont Axis Rower Pro",
    slug: "coremont-axis-rower-pro",
    sku: "CM-RW-AXIS-PRO",
    shortDescription: "Enhanced rower with higher resistance range and reinforced frame.",
    description:
      "A commercial-grade rower with a stronger frame, expanded resistance levels, and smooth return glide.",
    price: 1680,
    compareAtPrice: 1790,
    featured: false,
    originCountry: "Denmark",
    material: "Steel frame, stainless rail",
    maxUserWeight: 170,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "STUDIO",
    lengthCm: 220,
    widthCm: 58,
    heightCm: 96,
    weightKg: 42,
    warrantyMonths: 48,
    shippingEstimateDays: 7,
    tags: ["rower", "studio", "durable"],
    categorySlug: "rowing-machines",
    brandSlug: "valen",
    inventory: { stock: 6, reserved: 1, location: "Copenhagen" },
  },
  {
    name: "Coremont Compact Rower C2",
    slug: "coremont-compact-rower-c2",
    sku: "CM-RW-COMP-C2",
    shortDescription: "Compact rower that stores vertically with minimal footprint.",
    description:
      "A space-saving rower with a clean flywheel system and easy vertical storage for smaller rooms.",
    price: 990,
    compareAtPrice: null,
    featured: false,
    originCountry: "Sweden",
    material: "Steel frame, composite housing",
    maxUserWeight: 130,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 190,
    widthCm: 50,
    heightCm: 86,
    weightKg: 30,
    warrantyMonths: 24,
    shippingEstimateDays: 5,
    tags: ["compact", "rower", "storage"],
    categorySlug: "rowing-machines",
    brandSlug: "nordcore",
    inventory: { stock: 15, reserved: 0, location: "Stockholm" },
  },
  {
    name: "Coremont Forge Bench",
    slug: "coremont-forge-bench",
    sku: "CM-BN-FORGE",
    shortDescription: "Flat bench with reinforced steel frame and dense padding.",
    description:
      "A dependable flat bench with a wide base, stable feet, and durable padding for daily use.",
    price: 340,
    compareAtPrice: null,
    featured: false,
    originCountry: "Netherlands",
    material: "Steel frame, high-density foam",
    maxUserWeight: 320,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 120,
    widthCm: 45,
    heightCm: 45,
    weightKg: 24,
    warrantyMonths: 24,
    shippingEstimateDays: 4,
    tags: ["bench", "flat", "strength"],
    categorySlug: "benches",
    brandSlug: "ardent",
    inventory: { stock: 20, reserved: 3, location: "Amsterdam" },
  },
  {
    name: "Coremont Forge Adjustable Bench",
    slug: "coremont-forge-adjustable-bench",
    sku: "CM-BN-FORGE-ADJ",
    shortDescription: "Adjustable bench with stable ladder system and firm padding.",
    description:
      "A sturdy adjustable bench with a simple ladder system, firm support, and smooth handling.",
    price: 520,
    compareAtPrice: null,
    featured: true,
    originCountry: "Netherlands",
    material: "Steel frame, textured upholstery",
    maxUserWeight: 300,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 128,
    widthCm: 52,
    heightCm: 48,
    weightKg: 28,
    warrantyMonths: 24,
    shippingEstimateDays: 4,
    tags: ["adjustable", "bench", "strength"],
    categorySlug: "benches",
    brandSlug: "ardent",
    inventory: { stock: 16, reserved: 2, location: "Amsterdam" },
  },
  {
    name: "Coremont Utility Bench Pro",
    slug: "coremont-utility-bench-pro",
    sku: "CM-BN-UTIL-PRO",
    shortDescription: "Multi-angle bench with reinforced hinges for heavier loads.",
    description:
      "A studio-ready bench with a stable base, reinforced hinges, and smooth adjustment points.",
    price: 680,
    compareAtPrice: 720,
    featured: false,
    originCountry: "Germany",
    material: "Steel frame, textured upholstery",
    maxUserWeight: 350,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "STUDIO",
    lengthCm: 138,
    widthCm: 58,
    heightCm: 50,
    weightKg: 34,
    warrantyMonths: 36,
    shippingEstimateDays: 5,
    tags: ["bench", "studio", "reinforced"],
    categorySlug: "benches",
    brandSlug: "coremont",
    inventory: { stock: 9, reserved: 1, location: "Berlin" },
  },
  {
    name: "Coremont Compact Bench S1",
    slug: "coremont-compact-bench-s1",
    sku: "CM-BN-COMP-S1",
    shortDescription: "Slim bench sized for tight spaces without sacrificing stability.",
    description:
      "A compact bench with a slim base and sturdy frame for short, focused strength sessions.",
    price: 280,
    compareAtPrice: null,
    featured: false,
    originCountry: "Poland",
    material: "Steel frame, vinyl upholstery",
    maxUserWeight: 250,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 110,
    widthCm: 42,
    heightCm: 44,
    weightKg: 18,
    warrantyMonths: 24,
    shippingEstimateDays: 4,
    tags: ["compact", "bench", "home"],
    categorySlug: "benches",
    brandSlug: "valen",
    inventory: { stock: 18, reserved: 0, location: "Warsaw" },
  },
  {
    name: "Coremont Adjustable Dumbbell Set 24kg",
    slug: "coremont-adjustable-dumbbell-set-24kg",
    sku: "CM-DB-ADJ-24",
    shortDescription: "Compact adjustable dumbbells with fast dial selection.",
    description:
      "A space-saving adjustable set covering essential weight ranges with quick-change dial adjustments.",
    price: 420,
    compareAtPrice: null,
    featured: true,
    originCountry: "Germany",
    material: "Steel plates, nylon-coated handles",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 38,
    widthCm: 20,
    heightCm: 18,
    weightKg: 24,
    warrantyMonths: 24,
    shippingEstimateDays: 3,
    tags: ["dumbbells", "compact", "home"],
    categorySlug: "adjustable-dumbbells",
    brandSlug: "coremont",
    inventory: { stock: 25, reserved: 3, location: "Berlin" },
  },
  {
    name: "Coremont Adjustable Dumbbell Set 32kg",
    slug: "coremont-adjustable-dumbbell-set-32kg",
    sku: "CM-DB-ADJ-32",
    shortDescription: "Mid-range adjustable dumbbells for progressive strength training.",
    description:
      "A balanced set of adjustable dumbbells with smooth dial adjustment and compact storage trays.",
    price: 520,
    compareAtPrice: 560,
    featured: true,
    originCountry: "Germany",
    material: "Steel plates, aluminium dial system",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 42,
    widthCm: 20,
    heightCm: 18,
    weightKg: 32,
    warrantyMonths: 24,
    shippingEstimateDays: 3,
    tags: ["dumbbells", "adjustable", "compact"],
    categorySlug: "adjustable-dumbbells",
    brandSlug: "coremont",
    inventory: { stock: 16, reserved: 2, location: "Berlin" },
  },
  {
    name: "Coremont Adjustable Dumbbell Set 40kg",
    slug: "coremont-adjustable-dumbbell-set-40kg",
    sku: "CM-DB-ADJ-40",
    shortDescription: "Heavy-range adjustable set for demanding home workouts.",
    description:
      "A higher-capacity adjustable set with reinforced locking and compact storage trays.",
    price: 690,
    compareAtPrice: 740,
    featured: false,
    originCountry: "Germany",
    material: "Steel plates, reinforced dial system",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 44,
    widthCm: 22,
    heightCm: 20,
    weightKg: 40,
    warrantyMonths: 24,
    shippingEstimateDays: 4,
    tags: ["dumbbells", "heavy", "compact"],
    categorySlug: "adjustable-dumbbells",
    brandSlug: "coremont",
    inventory: { stock: 8, reserved: 1, location: "Berlin" },
  },
  {
    name: "Coremont Compact Dumbbell Pair 20kg",
    slug: "coremont-compact-dumbbell-pair-20kg",
    sku: "CM-DB-COMP-20",
    shortDescription: "Fixed dumbbell pair with compact rubber-coated heads.",
    description:
      "A pair of compact fixed dumbbells with clean rubber coating for floor protection.",
    price: 260,
    compareAtPrice: null,
    featured: false,
    originCountry: "Denmark",
    material: "Cast iron, rubber coating",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 30,
    widthCm: 14,
    heightCm: 14,
    weightKg: 20,
    warrantyMonths: 24,
    shippingEstimateDays: 3,
    tags: ["dumbbells", "fixed", "compact"],
    categorySlug: "adjustable-dumbbells",
    brandSlug: "valen",
    inventory: { stock: 22, reserved: 2, location: "Copenhagen" },
  },
  {
    name: "Coremont Compact Rack S1",
    slug: "coremont-compact-rack-s1",
    sku: "CM-RK-COMP-S1",
    shortDescription: "Compact squat rack with adjustable J-hooks and safety arms.",
    description:
      "A compact rack designed for home strength work with stable feet, clean height settings, and safety arms.",
    price: 780,
    compareAtPrice: null,
    featured: true,
    originCountry: "Germany",
    material: "3 mm steel, powder coat",
    maxUserWeight: 250,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 125,
    widthCm: 120,
    heightCm: 215,
    weightKg: 58,
    warrantyMonths: 36,
    shippingEstimateDays: 6,
    tags: ["rack", "compact", "strength"],
    categorySlug: "racks-rigs",
    brandSlug: "coremont",
    inventory: { stock: 10, reserved: 1, location: "Berlin" },
  },
  {
    name: "Coremont Compact Rack S2",
    slug: "coremont-compact-rack-s2",
    sku: "CM-RK-COMP-S2",
    shortDescription: "Compact rack with added pull-up bar and storage pegs.",
    description:
      "An upgraded compact rack with storage pegs, pull-up bar, and sturdy anchors for daily training.",
    price: 940,
    compareAtPrice: 990,
    featured: false,
    originCountry: "Germany",
    material: "3 mm steel, powder coat",
    maxUserWeight: 300,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 130,
    widthCm: 122,
    heightCm: 220,
    weightKg: 68,
    warrantyMonths: 36,
    shippingEstimateDays: 6,
    tags: ["rack", "storage", "strength"],
    categorySlug: "racks-rigs",
    brandSlug: "coremont",
    inventory: { stock: 7, reserved: 0, location: "Berlin" },
  },
  {
    name: "Coremont Studio Rig R4",
    slug: "coremont-studio-rig-r4",
    sku: "CM-RK-RIG-R4",
    shortDescription: "Modular studio rig with four training bays and storage rail.",
    description:
      "A modular rig engineered for studio training with four bays, adjustable storage, and reinforced uprights.",
    price: 2890,
    compareAtPrice: 3150,
    featured: false,
    originCountry: "Netherlands",
    material: "3.5 mm steel, textured powder coat",
    maxUserWeight: 450,
    assemblyRequired: true,
    footprintTag: "LARGE",
    usageType: "COMMERCIAL",
    lengthCm: 320,
    widthCm: 140,
    heightCm: 240,
    weightKg: 210,
    warrantyMonths: 48,
    shippingEstimateDays: 10,
    tags: ["rig", "studio", "modular"],
    categorySlug: "racks-rigs",
    brandSlug: "ardent",
    inventory: { stock: 3, reserved: 0, location: "Amsterdam" },
  },
  {
    name: "Coremont Power Rack V6",
    slug: "coremont-power-rack-v6",
    sku: "CM-RK-POWER-V6",
    shortDescription: "Full-height power rack with reinforced cross members.",
    description:
      "A full-height rack with reinforced cross members, adjustable safeties, and optional cable attachment points.",
    price: 1790,
    compareAtPrice: 1990,
    featured: true,
    originCountry: "Germany",
    material: "3.5 mm steel, powder coat",
    maxUserWeight: 400,
    assemblyRequired: true,
    footprintTag: "LARGE",
    usageType: "STUDIO",
    lengthCm: 150,
    widthCm: 145,
    heightCm: 235,
    weightKg: 140,
    warrantyMonths: 48,
    shippingEstimateDays: 8,
    tags: ["rack", "power", "studio"],
    categorySlug: "racks-rigs",
    brandSlug: "coremont",
    inventory: { stock: 5, reserved: 1, location: "Berlin" },
  },
  {
    name: "Coremont Cable Station C2",
    slug: "coremont-cable-station-c2",
    sku: "CM-CB-STAT-C2",
    shortDescription: "Compact cable station with smooth pulley tracking.",
    description:
      "A compact cable station with smooth pulley tracking and quick pin adjustments for daily training.",
    price: 1290,
    compareAtPrice: null,
    featured: false,
    originCountry: "Italy",
    material: "Steel frame, aluminium pulleys",
    maxUserWeight: 200,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "HOME",
    lengthCm: 140,
    widthCm: 90,
    heightCm: 215,
    weightKg: 88,
    warrantyMonths: 36,
    shippingEstimateDays: 7,
    tags: ["cable", "compact", "strength"],
    categorySlug: "cable-systems",
    brandSlug: "veloce",
    inventory: { stock: 8, reserved: 1, location: "Milan" },
  },
  {
    name: "Coremont Dual Cable C4",
    slug: "coremont-dual-cable-c4",
    sku: "CM-CB-DUAL-C4",
    shortDescription: "Dual cable system with independent stacks and long travel range.",
    description:
      "A dual-stack cable system with smooth glide rails, independent stacks, and long travel range for full-body work.",
    price: 2890,
    compareAtPrice: 3090,
    featured: true,
    originCountry: "Italy",
    material: "Steel frame, aluminium pulleys",
    maxUserWeight: 250,
    assemblyRequired: true,
    footprintTag: "LARGE",
    usageType: "STUDIO",
    lengthCm: 210,
    widthCm: 150,
    heightCm: 225,
    weightKg: 210,
    warrantyMonths: 48,
    shippingEstimateDays: 10,
    tags: ["cable", "studio", "dual-stack"],
    categorySlug: "cable-systems",
    brandSlug: "veloce",
    inventory: { stock: 4, reserved: 0, location: "Milan" },
  },
  {
    name: "Coremont Wall Cable S1",
    slug: "coremont-wall-cable-s1",
    sku: "CM-CB-WALL-S1",
    shortDescription: "Wall-mounted cable unit with a minimal footprint.",
    description:
      "A wall-mounted cable unit for compact training spaces, featuring a smooth track and quick height adjustments.",
    price: 980,
    compareAtPrice: null,
    featured: false,
    originCountry: "Sweden",
    material: "Steel frame, composite shroud",
    maxUserWeight: 160,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 90,
    widthCm: 60,
    heightCm: 210,
    weightKg: 68,
    warrantyMonths: 24,
    shippingEstimateDays: 6,
    tags: ["cable", "wall", "compact"],
    categorySlug: "cable-systems",
    brandSlug: "nordcore",
    inventory: { stock: 9, reserved: 1, location: "Stockholm" },
  },
  {
    name: "Coremont Training Mat Pro",
    slug: "coremont-training-mat-pro",
    sku: "CM-MT-PRO",
    shortDescription: "Dense training mat with anti-slip texture and reinforced edges.",
    description:
      "A durable training mat with a clean surface texture, reinforced edges, and stable grip.",
    price: 90,
    compareAtPrice: null,
    featured: false,
    originCountry: "Portugal",
    material: "High-density TPE",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 180,
    widthCm: 65,
    heightCm: 1,
    weightKg: 2.4,
    warrantyMonths: 12,
    shippingEstimateDays: 3,
    tags: ["mat", "floor", "grip"],
    categorySlug: "mats-accessories",
    brandSlug: "ardent",
    inventory: { stock: 40, reserved: 5, location: "Lisbon" },
  },
  {
    name: "Coremont Protection Tiles Set",
    slug: "coremont-protection-tiles-set",
    sku: "CM-MT-TILES",
    shortDescription: "Interlocking floor tiles for sound and vibration reduction.",
    description:
      "Reinforced interlocking tiles that protect floors and reduce impact noise in home gyms.",
    price: 120,
    compareAtPrice: null,
    featured: false,
    originCountry: "Portugal",
    material: "Recycled rubber",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 100,
    widthCm: 100,
    heightCm: 2,
    weightKg: 8.5,
    warrantyMonths: 12,
    shippingEstimateDays: 3,
    tags: ["floor", "tiles", "protection"],
    categorySlug: "mats-accessories",
    brandSlug: "ardent",
    inventory: { stock: 30, reserved: 4, location: "Lisbon" },
  },
  {
    name: "Coremont Grip Bands Kit",
    slug: "coremont-grip-bands-kit",
    sku: "CM-AC-GRIP-KIT",
    shortDescription: "Resistance band kit for warm-ups and accessory work.",
    description:
      "A balanced kit of resistance bands with soft grips for daily mobility and activation work.",
    price: 48,
    compareAtPrice: null,
    featured: false,
    originCountry: "Portugal",
    material: "Latex blend, textile grips",
    maxUserWeight: null,
    assemblyRequired: false,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 30,
    widthCm: 12,
    heightCm: 10,
    weightKg: 0.8,
    warrantyMonths: 12,
    shippingEstimateDays: 3,
    tags: ["bands", "mobility", "accessory"],
    categorySlug: "mats-accessories",
    brandSlug: "valen",
    inventory: { stock: 55, reserved: 6, location: "Lisbon" },
  },
  {
    name: "Coremont Home Gym Bundle Compact",
    slug: "coremont-home-gym-bundle-compact",
    sku: "CM-BD-COMP",
    shortDescription: "Compact bundle with adjustable dumbbells, bench, and mat.",
    description:
      "A curated bundle for compact homes including adjustable dumbbells, a stable bench, and a dense training mat.",
    price: 990,
    compareAtPrice: 1140,
    featured: true,
    originCountry: "Germany",
    material: "Mixed materials",
    maxUserWeight: null,
    assemblyRequired: true,
    footprintTag: "COMPACT",
    usageType: "HOME",
    lengthCm: 150,
    widthCm: 80,
    heightCm: 60,
    weightKg: 42,
    warrantyMonths: 24,
    shippingEstimateDays: 6,
    tags: ["bundle", "compact", "home"],
    categorySlug: "bundles",
    brandSlug: "coremont",
    inventory: { stock: 6, reserved: 0, location: "Berlin" },
  },
  {
    name: "Coremont Studio Starter Bundle",
    slug: "coremont-studio-starter-bundle",
    sku: "CM-BD-STUDIO",
    shortDescription: "Studio bundle with rack, bench, and adjustable dumbbells.",
    description:
      "A studio-ready bundle featuring a compact rack, adjustable bench, and mid-range dumbbells.",
    price: 1890,
    compareAtPrice: 2090,
    featured: true,
    originCountry: "Germany",
    material: "Mixed materials",
    maxUserWeight: null,
    assemblyRequired: true,
    footprintTag: "MEDIUM",
    usageType: "STUDIO",
    lengthCm: 200,
    widthCm: 120,
    heightCm: 200,
    weightKg: 85,
    warrantyMonths: 24,
    shippingEstimateDays: 7,
    tags: ["bundle", "studio", "strength"],
    categorySlug: "bundles",
    brandSlug: "coremont",
    inventory: { stock: 4, reserved: 0, location: "Berlin" },
  },
];

const addSpec = (specs: Array<{ group?: string; name: string; value: string }>) =>
  specs.map((spec, index) => ({ ...spec, sortOrder: index }));

const buildSpecifications = (product: (typeof productCatalog)[number]) => {
  switch (product.categorySlug) {
    case "treadmills":
      return addSpec([
        { group: "Performance", name: "Motor", value: "3.0–3.5 CHP continuous" },
        { group: "Performance", name: "Speed range", value: "1–18 km/h" },
        { group: "Performance", name: "Incline", value: "0–12%" },
        { group: "Build", name: "Running deck", value: "140 × 50 cm" },
        { group: "Warranty", name: "Frame", value: `${product.warrantyMonths} months` },
      ]);
    case "exercise-bikes":
      return addSpec([
        { group: "Drive", name: "Drive system", value: "Belt drive" },
        { group: "Resistance", name: "Resistance", value: "Magnetic" },
        { group: "Adjustment", name: "Seat", value: "4-way micro adjustment" },
        { group: "Build", name: "Flywheel", value: "18–22 kg" },
      ]);
    case "rowing-machines":
      return addSpec([
        { group: "Resistance", name: "Resistance", value: "Air + magnetic" },
        { group: "Rail", name: "Rail length", value: "110 cm" },
        { group: "Storage", name: "Storage", value: "Vertical" },
        { group: "Warranty", name: "Frame", value: `${product.warrantyMonths} months` },
      ]);
    case "benches":
      return addSpec([
        { group: "Build", name: "Frame", value: "3 mm steel" },
        { group: "Comfort", name: "Padding", value: "65 mm high-density" },
        { group: "Load", name: "Max load", value: `${product.maxUserWeight ?? 300} kg` },
      ]);
    case "adjustable-dumbbells":
      return addSpec([
        { group: "Adjustability", name: "Weight range", value: "4–40 kg" },
        { group: "Storage", name: "Base", value: "Compact cradle" },
        { group: "Build", name: "Finish", value: "Matte steel" },
      ]);
    case "racks-rigs":
      return addSpec([
        { group: "Frame", name: "Steel", value: "3–3.5 mm" },
        { group: "Load", name: "Max load", value: `${product.maxUserWeight ?? 350} kg` },
        { group: "Compatibility", name: "Attachments", value: "Standard 50 mm" },
      ]);
    case "cable-systems":
      return addSpec([
        { group: "Resistance", name: "Weight stack", value: "2 × 75 kg" },
        { group: "Range", name: "Cable travel", value: "165 cm" },
        { group: "Adjustments", name: "Positions", value: "24 height levels" },
      ]);
    case "mats-accessories":
      return addSpec([
        { group: "Material", name: "Material", value: product.material },
        { group: "Use", name: "Use", value: "Floor protection" },
        { group: "Care", name: "Care", value: "Wipe clean" },
      ]);
    case "bundles":
      return addSpec([
        { group: "Bundle", name: "Includes", value: "Bench + dumbbells + accessories" },
        { group: "Delivery", name: "Delivery", value: "Single freight shipment" },
        { group: "Warranty", name: "Coverage", value: `${product.warrantyMonths} months` },
      ]);
    default:
      return [];
  }
};

const buildImages = (product: (typeof productCatalog)[number]) => {
  const imageUrl = `/images/products/${product.slug}.jpg`;
  return [
    {
      url: imageUrl,
      alt: `${product.name} image 1`,
      sortOrder: 0,
    },
  ];
};

const buildStockStatus = (stock: number) => {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= 4) return "LOW_STOCK";
  return "IN_STOCK";
};

const reviewContent = [
  {
    title: "Smooth and stable",
    content: "Quiet motor and stable deck. Fits our spare room without feeling cramped.",
    rating: 5,
  },
  {
    title: "Great for daily use",
    content: "The frame feels solid and the controls are simple. Perfect for daily sessions.",
    rating: 4,
  },
  {
    title: "Clean and compact",
    content: "Compact footprint and surprisingly sturdy. Assembly was straightforward.",
    rating: 4,
  },
  {
    title: "Studio-ready",
    content: "Reinforced build and smooth adjustment. Exactly what we needed in the studio.",
    rating: 5,
  },
  {
    title: "Quiet ride",
    content: "Low-noise belt drive makes early sessions easy. Great cadence.",
    rating: 5,
  },
  {
    title: "Balanced resistance",
    content: "Even resistance and a comfortable seat. Good value for the quality.",
    rating: 4,
  },
  {
    title: "Strong bench",
    content: "Stable base with zero wobble. Padding feels premium.",
    rating: 5,
  },
  {
    title: "Compact but solid",
    content: "Small footprint but strong enough for heavier lifts.",
    rating: 4,
  },
  {
    title: "Great adjustability",
    content: "Adjustable settings are precise and feel secure.",
    rating: 5,
  },
  {
    title: "Smooth cable glide",
    content: "Cable glide is smooth and consistent. Works well for accessory work.",
    rating: 4,
  },
];

const buildAddress = (fullName: string, city: string, country: string) => ({
  fullName,
  line1: "Rue des Arts 14",
  line2: "",
  city,
  region: "",
  postalCode: "1000",
  country,
  phone: "+33 6 22 11 45",
});

const orderTemplates = [
  {
    email: "lena.meyer@coremont.test",
    customerEmail: "lena.meyer@coremont.test",
    items: [
      { slug: "coremont-arc-t7-treadmill", quantity: 1 },
      { slug: "coremont-training-mat-pro", quantity: 1 },
    ],
    shipping: "Scheduled Delivery",
    payment: "Card Payment",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    shippingStatus: "IN_TRANSIT",
    city: "Munich",
    country: "Germany",
  },
  {
    email: "julien.bernard@coremont.test",
    customerEmail: "julien.bernard@coremont.test",
    items: [
      { slug: "coremont-studio-bike-m2", quantity: 1 },
      { slug: "coremont-adjustable-dumbbell-set-24kg", quantity: 1 },
    ],
    shipping: "Standard Delivery",
    payment: "Bank Transfer",
    status: "PENDING",
    paymentStatus: "UNPAID",
    shippingStatus: "NOT_SHIPPED",
    city: "Lyon",
    country: "France",
  },
  {
    email: "sofia.rossi@coremont.test",
    customerEmail: "sofia.rossi@coremont.test",
    items: [
      { slug: "coremont-axis-rower", quantity: 1 },
      { slug: "coremont-grip-bands-kit", quantity: 2 },
    ],
    shipping: "Standard Delivery",
    payment: "Card Payment",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    shippingStatus: "DELIVERED",
    city: "Milan",
    country: "Italy",
  },
  {
    email: "studio@northlane.fit",
    customerEmail: null,
    items: [
      { slug: "coremont-power-rack-v6", quantity: 1 },
      { slug: "coremont-forge-adjustable-bench", quantity: 2 },
    ],
    shipping: "White Glove Setup",
    payment: "Invoice on Approval",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    shippingStatus: "IN_TRANSIT",
    city: "Hamburg",
    country: "Germany",
  },
  {
    email: "marta.nowak@coremont.test",
    customerEmail: "marta.nowak@coremont.test",
    items: [
      { slug: "coremont-compact-rower-c2", quantity: 1 },
      { slug: "coremont-protection-tiles-set", quantity: 1 },
    ],
    shipping: "Standard Delivery",
    payment: "Card Payment",
    status: "FULFILLED",
    paymentStatus: "PAID",
    shippingStatus: "DELIVERED",
    city: "Krakow",
    country: "Poland",
  },
  {
    email: "jonas.lund@coremont.test",
    customerEmail: "jonas.lund@coremont.test",
    items: [
      { slug: "coremont-arc-t9-treadmill", quantity: 1 },
    ],
    shipping: "Scheduled Delivery",
    payment: "Card Payment",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    shippingStatus: "IN_TRANSIT",
    city: "Stockholm",
    country: "Sweden",
  },
  {
    email: "nina.kovac@coremont.test",
    customerEmail: "nina.kovac@coremont.test",
    items: [
      { slug: "coremont-home-gym-bundle-compact", quantity: 1 },
    ],
    shipping: "Scheduled Delivery",
    payment: "Bank Transfer",
    status: "PENDING",
    paymentStatus: "UNPAID",
    shippingStatus: "NOT_SHIPPED",
    city: "Zagreb",
    country: "Croatia",
  },
  {
    email: "oskar.jensen@coremont.test",
    customerEmail: "oskar.jensen@coremont.test",
    items: [
      { slug: "coremont-studio-bike-m4", quantity: 1 },
      { slug: "coremont-compact-bench-s1", quantity: 1 },
    ],
    shipping: "Standard Delivery",
    payment: "Card Payment",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    shippingStatus: "DELIVERED",
    city: "Copenhagen",
    country: "Denmark",
  },
  {
    email: "ana.silva@coremont.test",
    customerEmail: "ana.silva@coremont.test",
    items: [
      { slug: "coremont-cable-station-c2", quantity: 1 },
    ],
    shipping: "White Glove Setup",
    payment: "Card Payment",
    status: "CONFIRMED",
    paymentStatus: "PAID",
    shippingStatus: "DELIVERED",
    city: "Lisbon",
    country: "Portugal",
  },
  {
    email: "james.adams@coremont.test",
    customerEmail: "james.adams@coremont.test",
    items: [
      { slug: "coremont-adjustable-dumbbell-set-32kg", quantity: 1 },
      { slug: "coremont-forge-bench", quantity: 1 },
    ],
    shipping: "Standard Delivery",
    payment: "Card Payment",
    status: "FULFILLED",
    paymentStatus: "PAID",
    shippingStatus: "DELIVERED",
    city: "London",
    country: "United Kingdom",
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.shippingMethod.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.adminUser.deleteMany();

  await prisma.category.createMany({ data: categories });
  await prisma.brand.createMany({ data: brands });
  await prisma.collection.createMany({
    data: collections.map(({ productSlugs: _ignored, ...collection }) => collection),
  });
  await prisma.shippingMethod.createMany({
    data: shippingMethods.map((method) => ({ ...method, active: true })),
  });
  await prisma.paymentMethod.createMany({
    data: paymentMethods.map((method) => ({ ...method, active: true })),
  });
  await prisma.customer.createMany({ data: customers });
  await prisma.fAQ.createMany({ data: faqs });

  const categoryList = (await prisma.category.findMany()) as CategoryRecord[];
  const brandList = (await prisma.brand.findMany()) as BrandRecord[];
  const collectionList = (await prisma.collection.findMany()) as CollectionRecord[];
  const customerListData = (await prisma.customer.findMany()) as CustomerRecord[];

  const categoryMap = new Map(categoryList.map((category) => [category.slug, category]));
  const brandMap = new Map(brandList.map((brand) => [brand.slug, brand]));
  const collectionMap = new Map(
    collectionList.map((collection) => [collection.slug, collection])
  );
  const customerMap = new Map(
    customerListData.map((customer) => [customer.email, customer])
  );

  for (const product of productCatalog) {
    const category = categoryMap.get(product.categorySlug);
    const brand = brandMap.get(product.brandSlug);
    if (!category || !brand) continue;

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        currency: "EUR",
        featured: product.featured,
        status: "ACTIVE",
        stockStatus: buildStockStatus(product.inventory.stock),
        originCountry: product.originCountry,
        material: product.material,
        maxUserWeight: product.maxUserWeight,
        assemblyRequired: product.assemblyRequired,
        footprintTag: product.footprintTag as any,
        usageType: product.usageType as any,
        lengthCm: product.lengthCm,
        widthCm: product.widthCm,
        heightCm: product.heightCm,
        weightKg: product.weightKg,
        warrantyMonths: product.warrantyMonths,
        shippingEstimateDays: product.shippingEstimateDays,
        tags: product.tags,
        categoryId: category.id,
        brandId: brand.id,
        images: {
          create: buildImages(product),
        },
        specifications: {
          create: buildSpecifications(product),
        },
        inventory: {
          create: {
            stock: product.inventory.stock,
            reserved: product.inventory.reserved,
            location: product.inventory.location,
          },
        },
      },
    });
  }

  const productRecords = (await prisma.product.findMany()) as unknown as ProductRecord[];
  const productMap = new Map(productRecords.map((product) => [product.slug, product]));

  for (const collection of collections) {
    const collectionRecord = collectionMap.get(collection.slug);
    if (!collectionRecord) continue;

    const data = collection.productSlugs
      .map((slug, index) => {
        const product = productMap.get(slug);
        if (!product) return null;
        return {
          collectionId: collectionRecord.id,
          productId: product.id,
          sortOrder: index,
        };
      })
      .filter(Boolean) as Array<{ collectionId: string; productId: string; sortOrder: number }>;

    if (data.length) {
      await prisma.collectionProduct.createMany({ data });
    }
  }

  const customerList = Array.from(customerMap.values()) as CustomerRecord[];
  const productList = Array.from(productMap.values()) as ProductRecord[];

  const reviewsData = productList.slice(0, 16).flatMap((product, index) => {
    const review = reviewContent[index % reviewContent.length];
    const customer = customerList[index % customerList.length];
    return {
      productId: product.id,
      customerId: customer.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      status: "APPROVED" as const,
    };
  });

  await prisma.review.createMany({ data: reviewsData });

  const shippingList = (await prisma.shippingMethod.findMany()) as unknown as ShippingMethodRecord[];
  const paymentList = (await prisma.paymentMethod.findMany()) as unknown as PaymentMethodRecord[];
  const shippingMap = new Map(shippingList.map((method) => [method.name, method]));
  const paymentMap = new Map(paymentList.map((method) => [method.name, method]));

  for (const order of orderTemplates) {
    const customer = order.customerEmail ? customerMap.get(order.customerEmail) : null;
    const shippingMethod = shippingMap.get(order.shipping);
    const paymentMethod = paymentMap.get(order.payment);
    const items = order.items
      .map((item) => {
        const product = productMap.get(item.slug);
        if (!product) return null;
        const unitPrice = Number(product.price);
        return {
          product,
          unitPrice,
          quantity: item.quantity,
          lineTotal: unitPrice * item.quantity,
        };
      })
      .filter(Boolean) as Array<{
      product: (typeof productList)[number];
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }>;

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingTotal = shippingMethod ? Number(shippingMethod.price) : 0;
    const taxTotal = 0;
    const discountTotal = 0;
    const total = subtotal + shippingTotal + taxTotal - discountTotal;

    await prisma.order.create({
      data: {
        orderNumber: `CM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        customerId: customer?.id ?? null,
        guestEmail: order.email,
        status: order.status as any,
        paymentStatus: order.paymentStatus as any,
        shippingStatus: order.shippingStatus as any,
        subtotal,
        shippingTotal,
        taxTotal,
        discountTotal,
        total,
        currency: "EUR",
        shippingMethodId: shippingMethod?.id,
        paymentMethodId: paymentMethod?.id,
        shippingAddressSnapshot: buildAddress(
          `${order.email.split("@")[0]} Client`,
          order.city,
          order.country
        ),
        billingAddressSnapshot: buildAddress(
          `${order.email.split("@")[0]} Client`,
          order.city,
          order.country
        ),
        items: {
          create: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            sku: item.product.sku,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            productSnapshot: item.product,
          })),
        },
      },
    });
  }

  await prisma.adminUser.create({
    data: {
      name: "Coremont Admin",
      email: "admin@coremont.eu",
      role: "OWNER",
      passwordHash: "change-me-in-production",
    },
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "brand_name", value: "Coremont" },
      { key: "support_email", value: "support@coremont.eu" },
      { key: "support_phone", value: "+49 30 220 399" },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
