import type {
  OutfitProduct,
  CapsulePieceOption,
  OrderRecord,
} from '../utils/commerceLogic';

export const HERO_CAMPAIGN_IMAGE =
  '/src/assets/images/hero_womens_atelier_campaign_1793894291048.jpg';

export const INITIAL_OUTFITS: OutfitProduct[] = [
  {
    id: 'valeria-ivory-linen-suit',
    title: 'Valéria Architectural Linen 3-Piece Suit',
    subtitle:
      'Double-breasted ivory flax blazer, 19-momme silk camisole & wide-leg tailored trousers',
    category: 'Tailored Workwear',
    occasion: 'Executive Daytime & Summer Ceremonies',
    completePrice: 680,
    individualTotal: 775,
    pieces: [
      {
        id: 'vl-blazer',
        name: 'Double-Breasted Flax Linen Blazer',
        role: 'Outerwear & Layer',
        price: 360,
        fabric: '100% Organic Belgian Flax Linen (290gsm)',
      },
      {
        id: 'vl-cami',
        name: 'Bias-Cut Mulberry Silk Camisole',
        role: 'Top & Knit',
        price: 155,
        fabric: '100% 19-Momme Como Mulberry Silk',
      },
      {
        id: 'vl-trouser',
        name: 'High-Waisted Wide-Leg Linen Trousers',
        role: 'Bottom & Skirt',
        price: 260,
        fabric: '100% Organic Belgian Flax Linen, Bemberg Lined',
      },
    ],
    colorways: [
      { name: 'Limestone Ivory', hex: '#F2EFE9' },
      { name: 'Warm Sand', hex: '#D8CBB8' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 9,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/hero_womens_atelier_campaign_1793894291048.jpg',
    fabricOrigin: 'Woven in Biella & Como, Italy · Tailored in Milan',
    careInstructions:
      'Specialist dry clean only; steam lightly on reverse side.',
    modelFitNote:
      'Relaxed architectural shoulder with fluid full-length trouser drape.',
    featured: true,
  },
  {
    id: 'emeraude-silk-evening-set',
    title: 'Émeraude Bias-Cut Silk & Cashmere Evening Ensemble',
    subtitle:
      '22-momme emerald mulberry silk slip dress paired with a draped champagne cashmere shawl',
    category: 'Evening & Silk',
    occasion: 'Black-Tie Gala, Opera & Evening Receptions',
    completePrice: 790,
    individualTotal: 900,
    pieces: [
      {
        id: 'em-dress',
        name: 'Cowl-Neck Bias-Cut Silk Midi Dress',
        role: 'Dress',
        price: 540,
        fabric: '100% 22-Momme Grade-6A Mulberry Silk',
      },
      {
        id: 'em-shawl',
        name: 'Artisanal Draped Cashmere Evening Wrap',
        role: 'Outerwear & Layer',
        price: 360,
        fabric: '100% 2-Ply Inner Mongolian Cashmere',
      },
    ],
    colorways: [
      { name: 'Botanical Emerald & Champagne', hex: '#0E4D3B' },
      { name: 'Midnight Noir & Ivory', hex: '#1B1B1D' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stockCount: 5,
    statusTag: 'Limited Run',
    imageUrl:
      '/src/assets/images/outfit_silk_evening_ensemble_1793894291827.jpg',
    fabricOrigin: 'Como Silk Weaving Mill · Hawick Cashmere Finishing',
    careInstructions:
      'Dry clean or cold hand wash with pH-neutral silk detergent.',
    modelFitNote:
      'Cut on a 45-degree bias to contour naturally without constricting.',
    featured: true,
  },
  {
    id: 'montaigne-espresso-power-suit',
    title: 'Montaigne Espresso Virgin Wool Power Suit',
    subtitle:
      'Sculpted single-breasted wool blazer, ivory cotton poplin shirt & pleated trousers',
    category: 'Tailored Workwear',
    occasion: 'Boardroom Leadership & Autumn City Tailoring',
    completePrice: 840,
    individualTotal: 960,
    pieces: [
      {
        id: 'mt-blazer',
        name: 'Peak-Lapel Virgin Wool Tailored Jacket',
        role: 'Outerwear & Layer',
        price: 460,
        fabric: '100% Super 130s Virgin Wool',
      },
      {
        id: 'mt-shirt',
        name: 'Structured Mother-of-Pearl Poplin Shirt',
        role: 'Top & Knit',
        price: 190,
        fabric: '100% Two-Fold Egyptian Cotton Poplin',
      },
      {
        id: 'mt-trousers',
        name: 'Double-Pleated Full-Length Wool Trousers',
        role: 'Bottom & Skirt',
        price: 310,
        fabric: '100% Super 130s Virgin Wool with Calfskin Belt Loops',
      },
    ],
    colorways: [
      { name: 'Roast Espresso & Ivory', hex: '#3B2820' },
      { name: 'Anthracite Slate & White', hex: '#2F3237' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 11,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/outfit_tailored_power_suit_1793894293160.jpg',
    fabricOrigin: 'Vitale Barberis Canonico Wool, Pratrivero, Italy',
    careInstructions: 'Professional dry clean; store on contoured cedar hanger.',
    modelFitNote:
      'True to size at waist with elongated straight-wide leg silhouette.',
    featured: true,
  },
  {
    id: 'vendome-trench-layered-look',
    title: 'Vendôme Belted Gabardine Trench & Merino Set',
    subtitle:
      'Water-repellent sand cotton gabardine trench coat, charcoal merino turtleneck & cream trousers',
    category: 'Outerwear Sets',
    occasion: 'Transitional City Travel & European Autumn',
    completePrice: 890,
    individualTotal: 1015,
    pieces: [
      {
        id: 'vd-trench',
        name: 'Belted Storm-Flap Cotton Gabardine Trench',
        role: 'Outerwear & Layer',
        price: 520,
        fabric: '100% High-Density Ventile Cotton Gabardine',
      },
      {
        id: 'vd-knit',
        name: 'Fine-Gauge Charcoal Merino Turtleneck',
        role: 'Top & Knit',
        price: 215,
        fabric: '100% Extra-Fine Australian Merino Wool',
      },
      {
        id: 'vd-pants',
        name: 'Crease-Front Cream Wool-Crepe Cigarette Trousers',
        role: 'Bottom & Skirt',
        price: 280,
        fabric: '96% Virgin Wool, 4% Elastane',
      },
    ],
    colorways: [
      { name: 'Trench Sand & Charcoal', hex: '#C6B091' },
      { name: 'Olive Stone & Espresso', hex: '#787562' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 7,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/outfit_parisian_trench_set_1793894293285.jpg',
    fabricOrigin: 'Lancashire Gabardine Cotton · Biella Merino Knit',
    careInstructions: 'Dry clean coat; hand wash merino knit cold flat dry.',
    modelFitNote: 'Cinched waist belt allows effortless layering over knitwear.',
    featured: true,
  },
  {
    id: 'cap-ferrat-terracotta-linen-set',
    title: 'Cap-Ferrat Terracotta Organic Linen Wrap Set',
    subtitle:
      'Kimono-sleeve wrap blouse with wide sash belt and high-waisted A-line midi skirt',
    category: 'Resort Linen',
    occasion: 'Mediterranean Coast, Daytime Soirée & Art Fairs',
    completePrice: 520,
    individualTotal: 590,
    pieces: [
      {
        id: 'cf-blouse',
        name: 'Origami-Tie Organic Linen Wrap Blouse',
        role: 'Top & Knit',
        price: 270,
        fabric: '100% GOTS-Certified Normandy Linen',
      },
      {
        id: 'cf-skirt',
        name: 'Sun-Pleated High-Waisted Midi Linen Skirt',
        role: 'Bottom & Skirt',
        price: 320,
        fabric: '100% GOTS-Certified Normandy Linen with Side Pockets',
      },
    ],
    colorways: [
      { name: 'Sienna Terracotta', hex: '#A54E31' },
      { name: 'Olive Grove', hex: '#555E43' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 6,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/outfit_riviera_linen_set_1793894294892.jpg',
    fabricOrigin: 'Normandy Flax Harvest · Garment-Dyed in Provence',
    careInstructions: 'Machine wash delicate 30°C; line dry in shade.',
    modelFitNote: 'Adjustable wrap waist accommodates custom torso shaping.',
    featured: true,
  },
  {
    id: 'palais-silk-twill-lounge-suit',
    title: 'Palais Champagne Silk-Wool Evening Suit',
    subtitle:
      'Shawl-collar satin-lapel dinner jacket, silk georgette blouse & fluid palazzo trousers',
    category: 'Evening & Silk',
    occasion: 'Modern Bridal Registry, Cocktail & Vernissage',
    completePrice: 740,
    individualTotal: 845,
    pieces: [
      {
        id: 'pl-jacket',
        name: 'Shawl-Collar Silk-Wool Dinner Jacket',
        role: 'Outerwear & Layer',
        price: 410,
        fabric: '70% Virgin Wool, 30% Mulberry Silk Satin',
      },
      {
        id: 'pl-blouse',
        name: 'Draped Collar Silk Georgette Blouse',
        role: 'Top & Knit',
        price: 185,
        fabric: '100% Crêpe Georgette Silk',
      },
      {
        id: 'pl-palazzo',
        name: 'Fluid Wide-Leg Palazzo Evening Trousers',
        role: 'Bottom & Skirt',
        price: 250,
        fabric: '70% Virgin Wool, 30% Mulberry Silk',
      },
    ],
    colorways: [
      { name: 'Pearl Champagne', hex: '#EAE3D5' },
      { name: 'Onyx Evening', hex: '#18181A' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stockCount: 3,
    statusTag: 'Limited Run',
    imageUrl:
      '/src/assets/images/hero_womens_atelier_campaign_1793894291048.jpg',
    fabricOrigin: 'Lyon Silk & Biella Wool Blend',
    careInstructions: 'Specialist silk-care dry clean only.',
    modelFitNote: 'Designed for an elongated evening drape with heeled sandals.',
    featured: false,
  },
];

export const CAPSULE_STYLER_OPTIONS: {
  tops: CapsulePieceOption[];
  bottoms: CapsulePieceOption[];
  outerwear: CapsulePieceOption[];
} = {
  tops: [
    {
      id: 'cap-top-silk-cami',
      name: '19-Momme Bias Silk Camisole',
      slot: 'top',
      price: 155,
      fabric: 'Como Mulberry Silk',
      color: 'Limestone Ivory',
      swatchHex: '#F2EFE9',
    },
    {
      id: 'cap-top-merino-knit',
      name: 'Fine-Gauge Merino Turtleneck',
      slot: 'top',
      price: 215,
      fabric: 'Extra-Fine Australian Merino',
      color: 'Charcoal Slate',
      swatchHex: '#3A3B3E',
    },
    {
      id: 'cap-top-poplin-shirt',
      name: 'Atelier Egyptian Poplin Shirt',
      slot: 'top',
      price: 190,
      fabric: 'Two-Fold Cotton Poplin',
      color: 'Crisp Chalk',
      swatchHex: '#F7F6F2',
    },
    {
      id: 'cap-top-linen-wrap',
      name: 'Origami-Tie Linen Wrap Blouse',
      slot: 'top',
      price: 270,
      fabric: 'Normandy Organic Linen',
      color: 'Sienna Terracotta',
      swatchHex: '#A54E31',
    },
  ],
  bottoms: [
    {
      id: 'cap-bot-linen-wide',
      name: 'High-Waisted Wide-Leg Linen Trousers',
      slot: 'bottom',
      price: 260,
      fabric: 'Belgian Flax Linen',
      color: 'Limestone Ivory',
      swatchHex: '#F2EFE9',
    },
    {
      id: 'cap-bot-wool-pleated',
      name: 'Double-Pleated Super 130s Trousers',
      slot: 'bottom',
      price: 310,
      fabric: 'Vitale Barberis Virgin Wool',
      color: 'Roast Espresso',
      swatchHex: '#3B2820',
    },
    {
      id: 'cap-bot-midi-skirt',
      name: 'Sun-Pleated A-Line Linen Midi Skirt',
      slot: 'bottom',
      price: 320,
      fabric: 'Normandy Organic Linen',
      color: 'Sienna Terracotta',
      swatchHex: '#A54E31',
    },
    {
      id: 'cap-bot-silk-slip',
      name: 'Bias-Cut Emerald Silk Midi Skirt',
      slot: 'bottom',
      price: 340,
      fabric: '22-Momme Mulberry Silk',
      color: 'Botanical Emerald',
      swatchHex: '#0E4D3B',
    },
  ],
  outerwear: [
    {
      id: 'cap-out-linen-blazer',
      name: 'Double-Breasted Flax Linen Blazer',
      slot: 'outerwear',
      price: 360,
      fabric: 'Belgian Flax Linen',
      color: 'Limestone Ivory',
      swatchHex: '#F2EFE9',
    },
    {
      id: 'cap-out-trench',
      name: 'Belted Ventile Gabardine Trench Coat',
      slot: 'outerwear',
      price: 520,
      fabric: 'Water-Repellent Cotton Gabardine',
      color: 'Trench Sand',
      swatchHex: '#C6B091',
    },
    {
      id: 'cap-out-wool-blazer',
      name: 'Peak-Lapel Espresso Wool Jacket',
      slot: 'outerwear',
      price: 460,
      fabric: 'Super 130s Virgin Wool',
      color: 'Roast Espresso',
      swatchHex: '#3B2820',
    },
    {
      id: 'cap-out-cashmere-wrap',
      name: '2-Ply Draped Cashmere Evening Shawl',
      slot: 'outerwear',
      price: 360,
      fabric: 'Inner Mongolian Cashmere',
      color: 'Warm Champagne',
      swatchHex: '#DECDB6',
    },
  ],
};

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    orderId: 'MV-1048',
    createdAt: '2026-11-05 · 09:14 CET',
    customer: {
      fullName: 'Élodie Marchand',
      email: 'elodie.marchand@cabinet-paris.fr',
      phone: '+33 6 44 81 29 03',
      address: '18 Avenue Montaigne',
      city: 'Paris',
      postalCode: '75008',
      paymentMethod: 'CARD',
      notes: 'Leave with concierge on ground floor.',
    },
    items: [
      {
        cartItemId: 'seed-1',
        outfitId: 'montaigne-espresso-power-suit',
        title: 'Montaigne Espresso Virgin Wool Power Suit',
        purchaseType: 'Complete Outfit Set',
        size: 'S',
        colorway: 'Roast Espresso & Ivory',
        unitPrice: 840,
        originalUnitPrice: 960,
        quantity: 1,
        imageUrl:
          '/src/assets/images/outfit_tailored_power_suit_1793894293160.jpg',
      },
    ],
    subtotal: 840,
    bundleSavings: 120,
    promoDiscount: 0,
    shippingFee: 0,
    total: 840,
    promoCodeApplied: null,
    status: 'Dispatched via Courier',
  },
  {
    orderId: 'MV-1049',
    createdAt: '2026-11-05 · 11:42 CET',
    customer: {
      fullName: 'Sofia Conti',
      email: 's.conti@architettura-milano.it',
      phone: '+39 02 8942 1170',
      address: 'Via Brera 28',
      city: 'Milan',
      postalCode: '20121',
      paymentMethod: 'COD',
      notes: 'Cash on delivery verified by telephone.',
    },
    items: [
      {
        cartItemId: 'seed-2',
        outfitId: 'emeraude-silk-evening-set',
        title: 'Émeraude Bias-Cut Silk & Cashmere Evening Ensemble',
        purchaseType: 'Complete Outfit Set',
        size: 'M',
        colorway: 'Botanical Emerald & Champagne',
        unitPrice: 790,
        originalUnitPrice: 900,
        quantity: 1,
        imageUrl:
          '/src/assets/images/outfit_silk_evening_ensemble_1793894291827.jpg',
      },
    ],
    subtotal: 790,
    bundleSavings: 110,
    promoDiscount: 119,
    shippingFee: 0,
    total: 671,
    promoCodeApplied: 'ATELIER15',
    status: 'Confirmed — Preparing Shipment',
  },
];
