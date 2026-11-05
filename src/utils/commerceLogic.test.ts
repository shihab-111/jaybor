import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortOutfits,
  calculateCartSummary,
  calculateCapsuleBundle,
  recommendGarmentSize,
  validateCheckoutInput,
  validateNewOutfitInput,
  type OutfitProduct,
  type CartItem,
} from './commerceLogic';

const sampleOutfits: OutfitProduct[] = [
  {
    id: 'outfit-1',
    title: 'Valéria Ivory Linen Tailored Ensemble',
    subtitle: 'Double-breasted linen blazer, mulberry silk camisole & wide-leg trousers',
    category: 'Tailored Workwear',
    occasion: 'Architectural Daytime & Executive Meetings',
    completePrice: 680,
    individualTotal: 775,
    pieces: [
      { id: 'p1', name: 'Double-Breasted Linen Blazer', role: 'Outerwear & Layer', price: 360, fabric: '100% Belgian Flax Linen' },
      { id: 'p2', name: 'Bias-Cut Silk Camisole', role: 'Top & Knit', price: 155, fabric: '19-Momme Mulberry Silk' },
      { id: 'p3', name: 'Pleated Wide-Leg Trousers', role: 'Bottom & Skirt', price: 260, fabric: '100% Belgian Flax Linen' },
    ],
    colorways: [{ name: 'Limestone Ivory', hex: '#EFECE6' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stockCount: 8,
    statusTag: 'In Stock',
    imageUrl: '/test1.jpg',
    fabricOrigin: 'Woven in Biella & Como, Italy',
    careInstructions: 'Specialist dry clean only',
    modelFitNote: 'Model is 177cm and wears size S',
    featured: true,
  },
  {
    id: 'outfit-2',
    title: 'Émeraude Bias-Cut Silk & Cashmere Evening Set',
    subtitle: 'Emerald mulberry silk midi slip dress paired with a champagne cashmere wrap',
    category: 'Evening & Silk',
    occasion: 'Gallery Opening & Black-Tie Dinner',
    completePrice: 790,
    individualTotal: 900,
    pieces: [
      { id: 'p4', name: 'Bias-Cut Silk Midi Dress', role: 'Dress', price: 540, fabric: '22-Momme Mulberry Silk' },
      { id: 'p5', name: 'Draped Cashmere Evening Shawl', role: 'Outerwear & Layer', price: 360, fabric: '100% Inner Mongolian Cashmere' },
    ],
    colorways: [{ name: 'Deep Emerald', hex: '#0F4C3A' }],
    sizes: ['XS', 'S', 'M', 'L'],
    stockCount: 4,
    statusTag: 'Limited Run',
    imageUrl: '/test2.jpg',
    fabricOrigin: 'Como Silk & Scottish Cashmere',
    careInstructions: 'Hand wash cold or dry clean',
    modelFitNote: 'Model is 175cm and wears size S',
    featured: false,
  },
];

test('filterAndSortOutfits filters by category and search query and sorts accurately', () => {
  const workwear = filterAndSortOutfits(sampleOutfits, 'Tailored Workwear', '', 'featured');
  assert.equal(workwear.length, 1);
  assert.equal(workwear[0].id, 'outfit-1');

  const searched = filterAndSortOutfits(sampleOutfits, 'All Outfits', 'cashmere', 'featured');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'outfit-2');

  const sortedDesc = filterAndSortOutfits(sampleOutfits, 'All Outfits', '', 'price-desc');
  assert.equal(sortedDesc[0].id, 'outfit-2');
  assert.equal(sortedDesc[1].id, 'outfit-1');
});

test('calculateCartSummary computes bundle savings, ATELIER15 promo, and free shipping threshold', () => {
  const items: CartItem[] = [
    {
      cartItemId: 'c1',
      outfitId: 'outfit-1',
      title: 'Valéria Ivory Linen Tailored Ensemble',
      purchaseType: 'Complete Outfit Set',
      size: 'M',
      colorway: 'Limestone Ivory',
      unitPrice: 680,
      originalUnitPrice: 775,
      quantity: 1,
      imageUrl: '/test1.jpg',
    },
  ];

  const summary = calculateCartSummary(items, 'atelier15');
  assert.equal(summary.itemCount, 1);
  assert.equal(summary.subtotal, 680);
  assert.equal(summary.bundleSavings, 95);
  assert.equal(summary.promoCodeValid, true);
  assert.equal(summary.promoDiscount, 102); // 15% of 680
  assert.equal(summary.shippingFee, 0); // 578 >= 450
  assert.equal(summary.total, 578);
});

test('calculateCapsuleBundle applies 12% complete outfit discount on 3-piece combinations', () => {
  const result = calculateCapsuleBundle(
    { id: 't1', name: 'Silk Camisole', slot: 'top', price: 180, fabric: 'Silk', color: 'Ivory', swatchHex: '#fff' },
    { id: 'b1', name: 'Wide-Leg Trousers', slot: 'bottom', price: 270, fabric: 'Wool', color: 'Espresso', swatchHex: '#332' },
    { id: 'o1', name: 'Sculpted Blazer', slot: 'outerwear', price: 450, fabric: 'Wool', color: 'Espresso', swatchHex: '#332' }
  );

  assert.equal(result.individualSum, 900);
  assert.equal(result.savingsAmount, 108);
  assert.equal(result.bundlePrice, 792);
});

test('recommendGarmentSize maps body measurements and fit preference to accurate size', () => {
  const recS = recommendGarmentSize(86, 69, 94, 'Signature');
  assert.equal(recS.recommendedSize, 'S');
  assert.equal(recS.fitConfidence, 'Exact Atelier Match');

  const recRelaxed = recommendGarmentSize(86, 69, 94, 'Relaxed');
  assert.equal(recRelaxed.recommendedSize, 'M');
});

test('validateCheckoutInput rejects missing required fields and accepts valid customer details', () => {
  const invalid = validateCheckoutInput({
    fullName: '',
    email: 'not-an-email',
    phone: '123',
    address: '12',
    city: '',
    postalCode: '',
    paymentMethod: 'COD',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);

  const valid = validateCheckoutInput({
    fullName: 'Camille Laurent',
    email: 'camille@atelier.fr',
    phone: '+33 6 12 34 56 78',
    address: '24 Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    postalCode: '75008',
    paymentMethod: 'COD',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validateNewOutfitInput checks seller listing constraints', () => {
  const invalid = validateNewOutfitInput({
    title: 'A',
    subtitle: 'Short',
    completePrice: -10,
    topName: '',
    topPrice: 0,
    bottomName: 'Skirt',
    bottomPrice: 120,
    stockCount: 0,
  });
  assert.equal(invalid.valid, false);

  const valid = validateNewOutfitInput({
    title: 'Solstice Cashmere Knit Set',
    subtitle: 'Ribbed cardigan and flared midi knit skirt',
    completePrice: 540,
    topName: 'Ribbed Cashmere Cardigan',
    topPrice: 310,
    bottomName: 'Flared Midi Knit Skirt',
    bottomPrice: 290,
    stockCount: 12,
  });
  assert.equal(valid.valid, true);
});
