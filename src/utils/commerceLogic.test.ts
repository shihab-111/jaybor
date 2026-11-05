import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortOutfits,
  calculateCartSummary,
  recommendKurtiSize,
  validateCheckoutInput,
  validateNewOutfitInput,
  type OutfitProduct,
  type CartItem,
} from './commerceLogic';

const sampleKurtis: OutfitProduct[] = [
  {
    id: 'kurti-1',
    title: 'Meher Rose-Berry Embroidered Muslin 3-Piece Kurti',
    subtitle: 'Handloom muslin embroidered kurti with straight palazzo pant and organza dupatta',
    category: 'Festive 3-Piece',
    occasion: 'Eid, Dawat & Festive Gatherings',
    priceBdt: 2450,
    originalPriceBdt: 2850,
    pieces: [
      { id: 'p1', name: 'Embroidered Muslin Kurti', role: 'Kurti Top', priceBdt: 1450, fabric: 'Dhakai Soft Muslin' },
      { id: 'p2', name: 'Straight Silk-Cotton Trouser', role: 'Matching Pant / Palazzo', priceBdt: 550, fabric: 'Combed Cotton Silk' },
      { id: 'p3', name: 'Scalloped Organza Dupatta', role: 'Dupatta / Orna', priceBdt: 450, fabric: 'Sheer Organza' },
    ],
    colorName: 'Rose Berry & Lilac',
    colorHex: '#A83264',
    colorways: [{ name: 'Rose Berry & Lilac', hex: '#A83264' }],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
    stockCount: 14,
    statusTag: 'In Stock',
    imageUrl: '/test1.jpg',
    fabric: 'Soft Dhakai Muslin & Organza',
    lengthInches: '42 inches',
    careInstructions: 'Gentle hand wash in cold water',
    featured: true,
    isPublished: true,
  },
  {
    id: 'kurti-2',
    title: 'Pookie Strawberry Blush Chikankari Cotton Kurti Set',
    subtitle: 'Pastel pink chikankari embroidered cotton kurti with lace cuffs and white trouser',
    category: 'Pookie Pastel Edition',
    occasion: 'University, Office & Casual Outings',
    priceBdt: 1390,
    originalPriceBdt: 1650,
    pieces: [
      { id: 'p4', name: 'Chikankari Cotton Kurti', role: 'Kurti Top', priceBdt: 990, fabric: '100% Pure Voile Cotton' },
      { id: 'p5', name: 'Off-White Straight Pant', role: 'Matching Pant / Palazzo', priceBdt: 400, fabric: 'Breathable Cambric Cotton' },
    ],
    colorName: 'Strawberry Blush',
    colorHex: '#F3B6C8',
    colorways: [{ name: 'Strawberry Blush', hex: '#F3B6C8' }],
    sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")'],
    stockCount: 19,
    statusTag: 'New Arrival',
    imageUrl: '/test2.jpg',
    fabric: '100% Pure Combed Cotton',
    lengthInches: '41 inches',
    careInstructions: 'Machine or hand wash cold',
    featured: false,
    isPublished: true,
  },
];

test('filterAndSortOutfits filters Kurti outfits by category and search query', () => {
  const pookie = filterAndSortOutfits(sampleKurtis, 'Pookie Pastel Edition', '', 'featured');
  assert.equal(pookie.length, 1);
  assert.equal(pookie[0].id, 'kurti-2');

  const searched = filterAndSortOutfits(sampleKurtis, 'All Kurtis', 'dupatta', 'featured');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'kurti-1');

  const sortedAsc = filterAndSortOutfits(sampleKurtis, 'All Kurtis', '', 'price-asc');
  assert.equal(sortedAsc[0].id, 'kurti-2');
  assert.equal(sortedAsc[1].id, 'kurti-1');
});

test('calculateCartSummary computes BDT subtotal, JAYBOR10 promo, and Inside/Outside Dhaka courier fees', () => {
  const items: CartItem[] = [
    {
      cartItemId: 'c1',
      outfitId: 'kurti-2',
      title: 'Pookie Strawberry Blush Chikankari Cotton Kurti Set',
      category: 'Pookie Pastel Edition',
      size: 'M (38")',
      colorway: 'Strawberry Blush',
      unitPriceBdt: 1390,
      originalUnitPriceBdt: 1650,
      quantity: 1,
      imageUrl: '/test2.jpg',
    },
  ];

  const insideDhaka = calculateCartSummary(items, 'jaybor10', 'Inside Dhaka');
  assert.equal(insideDhaka.itemCount, 1);
  assert.equal(insideDhaka.subtotalBdt, 1390);
  assert.equal(insideDhaka.bundleSavingsBdt, 260);
  assert.equal(insideDhaka.promoCodeValid, true);
  assert.equal(insideDhaka.promoDiscountBdt, 139);
  assert.equal(insideDhaka.deliveryFeeBdt, 70);
  assert.equal(insideDhaka.totalBdt, 1390 - 139 + 70);

  const outsideDhaka = calculateCartSummary(items, '', 'Outside Dhaka');
  assert.equal(outsideDhaka.deliveryFeeBdt, 130);
  assert.equal(outsideDhaka.totalBdt, 1390 + 130);
});

test('recommendKurtiSize maps chest measurement in inches to Bangladeshi Kurti size', () => {
  const sizeM = recommendKurtiSize(38, 'Regular');
  assert.equal(sizeM.recommendedSize, 'M (38")');
  assert.equal(sizeM.garmentChestInches, 38);

  const sizeRelaxed = recommendKurtiSize(38, 'Relaxed');
  assert.equal(sizeRelaxed.recommendedSize, 'L (40")');
});

test('validateCheckoutInput enforces 11-digit Bangladesh mobile numbers and full address', () => {
  const invalid = validateCheckoutInput({
    fullName: 'A',
    phone: '12345',
    district: '',
    address: 'abc',
    deliveryZone: 'Inside Dhaka',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.district);
  assert.ok(invalid.errors.address);

  const valid = validateCheckoutInput({
    fullName: 'Nusrat Jahan Mim',
    phone: '01712345678',
    district: 'Dhanmondi, Dhaka',
    address: 'House 14, Road 7A, Dhanmondi R/A',
    deliveryZone: 'Inside Dhaka',
  });
  assert.equal(valid.valid, true);
});

test('validateNewOutfitInput checks Jaybor Seller Desk listing fields', () => {
  const invalid = validateNewOutfitInput({
    title: 'ab',
    subtitle: 'abc',
    priceBdt: 0,
    originalPriceBdt: 100,
    fabric: '',
    colorName: '',
    stockCount: 0,
    imageUrl: '',
  });
  assert.equal(invalid.valid, false);

  const valid = validateNewOutfitInput({
    title: 'Aarong-Style Lilac Cotton Kurti',
    subtitle: 'Hand-embroidered neckline with matching trouser',
    priceBdt: 1550,
    originalPriceBdt: 1850,
    fabric: '100% Combed Cotton',
    colorName: 'Pastel Lilac',
    stockCount: 15,
    imageUrl: '/test.jpg',
  });
  assert.equal(valid.valid, true);
});
