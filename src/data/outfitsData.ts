import type { OutfitProduct, OrderRecord } from '../utils/commerceLogic';

export const HERO_CAMPAIGN_IMAGE =
  '/src/assets/images/jaybor_hero_kurti_campaign_1793898464569.jpg';

export const KURTI_IMAGE_PLATES = [
  {
    label: 'Meher Rose-Berry Muslin 3-Piece Kurti',
    url: '/src/assets/images/jaybor_hero_kurti_campaign_1793898464569.jpg',
  },
  {
    label: 'Pookie Strawberry Blush Chikankari Kurti',
    url: '/src/assets/images/kurti_blush_cotton_daily_1793898467065.jpg',
  },
  {
    label: 'Mulberry Rose Handloom 2-Piece Co-ord Kurti',
    url: '/src/assets/images/kurti_berry_muslin_set_1793898468639.jpg',
  },
  {
    label: 'Nilima Lilac-Plum Zari Festive 3-Piece Kurti',
    url: '/src/assets/images/kurti_lilac_festive_3pc_1793898470269.jpg',
  },
  {
    label: 'Ananya Crimson-Rose Pearl A-Line Kurti',
    url: '/src/assets/images/kurti_crimson_rose_party_1793898470329.jpg',
  },
];

export const INITIAL_OUTFITS: OutfitProduct[] = [
  {
    id: 'jaybor-pookie-blush-chikankari',
    title: 'Pookie Strawberry Blush Chikankari Kurti & Pant Set',
    subtitle:
      'Soft pastel pink chikankari embroidered cotton kurti with crochet lace cuffs & off-white straight pant',
    category: 'Pookie Pastel Edition',
    occasion: 'University Classes, Brunch & Everyday Comfort',
    priceBdt: 1390,
    originalPriceBdt: 1690,
    pieces: [
      {
        id: 'jb-p1',
        name: 'Chikankari Lace-Sleeve Cotton Kurti',
        role: 'Kurti Top',
        priceBdt: 990,
        fabric: '100% Pure Combed Voile Cotton',
      },
      {
        id: 'jb-p2',
        name: 'Tailored Off-White Straight Trouser',
        role: 'Matching Pant / Palazzo',
        priceBdt: 400,
        fabric: 'Breathable Cambric Cotton',
      },
    ],
    colorName: 'Strawberry Blush Pink',
    colorHex: '#F3B6C8',
    colorways: [
      { name: 'Strawberry Blush Pink', hex: '#F3B6C8' },
      { name: 'Lavender Milk', hex: '#DEC4E6' },
    ],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 22,
    statusTag: 'New Arrival',
    imageUrl:
      '/src/assets/images/kurti_blush_cotton_daily_1793898467065.jpg',
    fabric: '100% Pure Combed Cotton · Breathable Summer Weave',
    lengthInches: 'Kurti 42" · Trouser 38"',
    careInstructions: 'Cold hand wash or gentle machine cycle; iron on reverse.',
    featured: true,
    isPublished: true,
  },
  {
    id: 'jaybor-meher-rose-muslin-3pc',
    title: 'Meher Rose-Berry Embroidered Muslin 3-Piece Set',
    subtitle:
      'Zari-embroidered rose-berry muslin kameez kurti, lilac silk-cotton trouser & sheer organza dupatta',
    category: 'Festive 3-Piece',
    occasion: 'Eid, Wedding Dawat & Family Receptions',
    priceBdt: 2450,
    originalPriceBdt: 2890,
    pieces: [
      {
        id: 'jb-m1',
        name: 'Zari & Resham Embroidered Muslin Kurti',
        role: 'Kurti Top',
        priceBdt: 1450,
        fabric: 'Dhakai Soft Heritage Muslin (Cotton Lined)',
      },
      {
        id: 'jb-m2',
        name: 'Lilac Tailored Cigar Pant',
        role: 'Matching Pant / Palazzo',
        priceBdt: 550,
        fabric: 'Soft Silk-Cotton Blend',
      },
      {
        id: 'jb-m3',
        name: 'Tassel-Edged Sheer Organza Orna',
        role: 'Dupatta / Orna',
        priceBdt: 450,
        fabric: 'Lightweight Embroidered Organza (2.5 Yards)',
      },
    ],
    colorName: 'Rose Berry & Pastel Lilac',
    colorHex: '#A83264',
    colorways: [
      { name: 'Rose Berry & Pastel Lilac', hex: '#A83264' },
      { name: 'Plum Wine & Blush', hex: '#6E2549' },
    ],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 14,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/jaybor_hero_kurti_campaign_1793898464569.jpg',
    fabric: 'Dhakai Soft Muslin with Cotton Inner & Organza Orna',
    lengthInches: 'Kurti 43" · Trouser 38" · Orna 90"',
    careInstructions: 'Mild shampoo hand wash cold; dry in shade.',
    featured: true,
    isPublished: true,
  },
  {
    id: 'jaybor-mulberry-handloom-2pc',
    title: 'Rupsha Mulberry-Rose Handloom Cotton 2-Piece Co-ord',
    subtitle:
      'Textured self-weave mulberry rose short kurti tunic with mother-of-pearl buttons & straight palazzo',
    category: '2-Piece Kurti Set',
    occasion: 'Office Wear, Campus & Daily Elegance',
    priceBdt: 1590,
    originalPriceBdt: 1890,
    pieces: [
      {
        id: 'jb-r1',
        name: 'Pearl-Button Handloom Slub Kurti',
        role: 'Kurti Top',
        priceBdt: 1050,
        fabric: 'Handloom Textured Slub Cotton',
      },
      {
        id: 'jb-r2',
        name: 'Relaxed Wide-Leg Matching Palazzo',
        role: 'Matching Pant / Palazzo',
        priceBdt: 540,
        fabric: 'Handloom Textured Slub Cotton with Pocket',
      },
    ],
    colorName: 'Mulberry Rose',
    colorHex: '#9E4768',
    colorways: [
      { name: 'Mulberry Rose', hex: '#9E4768' },
      { name: 'Dusty Mauve', hex: '#B57B94' },
    ],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 18,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/kurti_berry_muslin_set_1793898468639.jpg',
    fabric: 'Deshi Handloom Slub Cotton · Side Pocket Included',
    lengthInches: 'Kurti 37" · Palazzo 39"',
    careInstructions: 'Regular cold wash; colorfast guaranteed.',
    featured: true,
    isPublished: true,
  },
  {
    id: 'jaybor-nilima-lilac-festive-3pc',
    title: 'Nilima Lilac-Plum Scalloped Organza 3-Piece Kurti',
    subtitle:
      'Pastel lavender-plum silk-cotton kurti with floral neckline work, straight pant & scalloped dupatta',
    category: 'Festive 3-Piece',
    occasion: 'Mehendi, Holud Evening & Festive Dinner',
    priceBdt: 2290,
    originalPriceBdt: 2690,
    pieces: [
      {
        id: 'jb-n1',
        name: 'Floral Zari-Work Silk-Cotton Kurti',
        role: 'Kurti Top',
        priceBdt: 1350,
        fabric: 'Premium Joyshree Silk-Cotton',
      },
      {
        id: 'jb-n2',
        name: 'Zari-Border Straight Trouser',
        role: 'Matching Pant / Palazzo',
        priceBdt: 490,
        fabric: 'Premium Joyshree Silk-Cotton',
      },
      {
        id: 'jb-n3',
        name: 'Cutwork Scalloped Chiffon-Organza Orna',
        role: 'Dupatta / Orna',
        priceBdt: 450,
        fabric: 'Embroidered Cutwork Organza',
      },
    ],
    colorName: 'Pastel Lilac Plum',
    colorHex: '#B695B8',
    colorways: [
      { name: 'Pastel Lilac Plum', hex: '#B695B8' },
      { name: 'Soft Rose Quartz', hex: '#E6B8C7' },
    ],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 11,
    statusTag: 'Limited Edition',
    imageUrl:
      '/src/assets/images/kurti_lilac_festive_3pc_1793898470269.jpg',
    fabric: 'Joyshree Silk-Cotton & Cutwork Organza Dupatta',
    lengthInches: 'Kurti 43" · Trouser 38"',
    careInstructions: 'Gentle hand wash separately in cold water.',
    featured: true,
    isPublished: true,
  },
  {
    id: 'jaybor-ananya-crimson-rose-aline',
    title: 'Ananya Light Crimson-Rose Pearl A-Line Kurti Set',
    subtitle:
      'Flared A-line crimson-rose kurti with tonal floral embroidery, pearl sleeve trim & matching pant',
    category: '2-Piece Kurti Set',
    occasion: 'Birthday Dinner, Party & Friday Outings',
    priceBdt: 1750,
    originalPriceBdt: 2100,
    pieces: [
      {
        id: 'jb-a1',
        name: 'Pearl-Trimmed Floral A-Line Kurti',
        role: 'Kurti Top',
        priceBdt: 1290,
        fabric: 'Soft Liva Rayon-Cotton Blend',
      },
      {
        id: 'jb-a2',
        name: 'Tonal Crimson-Rose Straight Pant',
        role: 'Matching Pant / Palazzo',
        priceBdt: 460,
        fabric: 'Soft Liva Rayon-Cotton Blend',
      },
    ],
    colorName: 'Light Crimson Rose',
    colorHex: '#C6536C',
    colorways: [
      { name: 'Light Crimson Rose', hex: '#C6536C' },
      { name: 'Berry Mauve', hex: '#943D5A' },
    ],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 16,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/kurti_crimson_rose_party_1793898470329.jpg',
    fabric: 'High-Drape Soft Rayon-Cotton with Hand-Stitched Pearls',
    lengthInches: 'Kurti 44" · Trouser 38"',
    careInstructions: 'Turn inside out and hand wash gently.',
    featured: true,
    isPublished: true,
  },
  {
    id: 'jaybor-shuvra-daily-cotton-kurti',
    title: 'Shuvra Blush-Petal Everyday Single Cotton Kurti',
    subtitle:
      'Lightweight breathable single kurti with delicate neckline threadwork and side pocket for daily wear',
    category: 'Daily Cotton Kurti',
    occasion: 'Daily Campus, Tuition & Summer Commute',
    priceBdt: 980,
    originalPriceBdt: 1250,
    pieces: [
      {
        id: 'jb-s1',
        name: 'Single Embroidered Daily Cotton Kurti',
        role: 'Kurti Top',
        priceBdt: 980,
        fabric: '100% Export-Grade Combed Cotton',
      },
    ],
    colorName: 'Petal Blush',
    colorHex: '#F0C4D1',
    colorways: [
      { name: 'Petal Blush', hex: '#F0C4D1' },
      { name: 'Lilac Mist', hex: '#D8C2E3' },
    ],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 30,
    statusTag: 'In Stock',
    imageUrl:
      '/src/assets/images/kurti_blush_cotton_daily_1793898467065.jpg',
    fabric: '100% Pure Export Cotton · Pre-Shrunk & Colorfast',
    lengthInches: 'Kurti 41"',
    careInstructions: 'Machine wash cold; dries quickly in shade.',
    featured: false,
    isPublished: true,
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'seed-order-jb-2041',
    orderNumber: 'JB-2041',
    createdAt: '2026-11-05 · 11:20 AM BD Time',
    customerUid: 'seed-customer-1',
    customerName: 'Nusrat Jahan Mim',
    phone: '01712345678',
    district: 'Dhanmondi, Dhaka',
    address: 'House 18, Road 9A, Dhanmondi R/A (Near Satmasjid Road)',
    deliveryZone: 'Inside Dhaka',
    paymentMethod: 'Cash on Delivery',
    primaryOutfitTitle:
      'Pookie Strawberry Blush Chikankari Kurti & Pant Set (M (38") ×1)',
    primaryOutfitImage:
      '/src/assets/images/kurti_blush_cotton_daily_1793898467065.jpg',
    itemSummaryList: [
      'Pookie Strawberry Blush Chikankari Kurti & Pant Set · Size M (38") · Qty 1 · ৳1,390',
    ],
    items: [
      {
        cartItemId: 'seed-c1',
        outfitId: 'jaybor-pookie-blush-chikankari',
        title: 'Pookie Strawberry Blush Chikankari Kurti & Pant Set',
        category: 'Pookie Pastel Edition',
        size: 'M (38")',
        colorway: 'Strawberry Blush Pink',
        unitPriceBdt: 1390,
        originalUnitPriceBdt: 1690,
        quantity: 1,
        imageUrl:
          '/src/assets/images/kurti_blush_cotton_daily_1793898467065.jpg',
      },
    ],
    totalQuantity: 1,
    subtotalBdt: 1390,
    savingsBdt: 300,
    discountBdt: 0,
    deliveryFeeBdt: 70,
    totalBdt: 1460,
    promoCodeApplied: null,
    status: 'Sent to Steadfast Courier',
  },
  {
    id: 'seed-order-jb-2042',
    orderNumber: 'JB-2042',
    createdAt: '2026-11-05 · 01:45 PM BD Time',
    customerUid: 'seed-customer-2',
    customerName: 'Tasnia Rahman',
    phone: '01819876543',
    district: 'Zindabazar, Sylhet',
    address: 'Flat 4B, Rose View Tower, Zindabazar Main Road, Sylhet',
    deliveryZone: 'Outside Dhaka',
    paymentMethod: 'Cash on Delivery',
    primaryOutfitTitle:
      'Meher Rose-Berry Embroidered Muslin 3-Piece Set (L (40") ×1)',
    primaryOutfitImage:
      '/src/assets/images/jaybor_hero_kurti_campaign_1793898464569.jpg',
    itemSummaryList: [
      'Meher Rose-Berry Embroidered Muslin 3-Piece Set · Size L (40") · Qty 1 · ৳2,450',
    ],
    items: [
      {
        cartItemId: 'seed-c2',
        outfitId: 'jaybor-meher-rose-muslin-3pc',
        title: 'Meher Rose-Berry Embroidered Muslin 3-Piece Set',
        category: 'Festive 3-Piece',
        size: 'L (40")',
        colorway: 'Rose Berry & Pastel Lilac',
        unitPriceBdt: 2450,
        originalUnitPriceBdt: 2890,
        quantity: 1,
        imageUrl:
          '/src/assets/images/jaybor_hero_kurti_campaign_1793898464569.jpg',
      },
    ],
    totalQuantity: 1,
    subtotalBdt: 2450,
    savingsBdt: 440,
    discountBdt: 0,
    deliveryFeeBdt: 130,
    totalBdt: 2580,
    promoCodeApplied: null,
    status: 'Pending Call Verification',
  },
];
