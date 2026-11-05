export type OutfitCategory =
  | 'All Kurtis'
  | 'Daily Cotton Kurti'
  | '2-Piece Kurti Set'
  | 'Festive 3-Piece'
  | 'Pookie Pastel Edition';

export type GarmentSize =
  | 'S (36")'
  | 'M (38")'
  | 'L (40")'
  | 'XL (42")'
  | 'XXL (44")';

export type DeliveryZone = 'Inside Dhaka' | 'Outside Dhaka';

export interface OutfitPiece {
  id: string;
  name: string;
  role: 'Kurti Top' | 'Matching Pant / Palazzo' | 'Dupatta / Orna';
  priceBdt: number;
  fabric: string;
}

export interface OutfitProduct {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<OutfitCategory, 'All Kurtis'>;
  occasion: string;
  priceBdt: number;
  originalPriceBdt: number;
  pieces: OutfitPiece[];
  colorName: string;
  colorHex: string;
  colorways: { name: string; hex: string }[];
  sizes: GarmentSize[];
  stockCount: number;
  statusTag: 'In Stock' | 'Limited Edition' | 'New Arrival';
  imageUrl: string;
  fabric: string;
  lengthInches: string;
  careInstructions: string;
  featured?: boolean;
  isPublished?: boolean;
}

export interface CartItem {
  cartItemId: string;
  outfitId: string;
  title: string;
  category: string;
  size: GarmentSize;
  colorway: string;
  unitPriceBdt: number;
  originalUnitPriceBdt: number;
  quantity: number;
  imageUrl: string;
}

export interface CustomerCheckoutInput {
  fullName: string;
  phone: string;
  district: string;
  address: string;
  deliveryZone: DeliveryZone;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerUid: string;
  customerName: string;
  phone: string;
  district: string;
  address: string;
  deliveryZone: DeliveryZone;
  paymentMethod: 'Cash on Delivery';
  primaryOutfitTitle: string;
  primaryOutfitImage: string;
  itemSummaryList: string[];
  items: CartItem[];
  totalQuantity: number;
  subtotalBdt: number;
  savingsBdt: number;
  discountBdt: number;
  deliveryFeeBdt: number;
  totalBdt: number;
  promoCodeApplied: string | null;
  status:
    | 'Pending Call Verification'
    | 'Confirmed — Packing Kurti'
    | 'Sent to Steadfast Courier'
    | 'Delivered';
}

export const FREE_DELIVERY_THRESHOLD_BDT = 2500;
export const INSIDE_DHAKA_FEE_BDT = 70;
export const OUTSIDE_DHAKA_FEE_BDT = 130;

export const BD_PHONE_REGEX = /^(\+?88)?01[3-9][0-9]{8}$/;

/**
 * Filter and sort Jaybor Kurti outfits by category, search query, and sort order.
 */
export function filterAndSortOutfits(
  outfits: OutfitProduct[],
  category: OutfitCategory,
  searchQuery: string,
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'savings-desc'
): OutfitProduct[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = outfits.filter((item) => {
    const matchesCategory =
      category === 'All Kurtis' || item.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const searchableText = [
      item.title,
      item.subtitle,
      item.category,
      item.occasion,
      item.fabric,
      item.colorName,
      ...item.pieces.map((p) => `${p.name} ${p.fabric}`),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.priceBdt - b.priceBdt;
    }
    if (sortBy === 'price-desc') {
      return b.priceBdt - a.priceBdt;
    }
    if (sortBy === 'savings-desc') {
      const savingsA = a.originalPriceBdt - a.priceBdt;
      const savingsB = b.originalPriceBdt - b.priceBdt;
      return savingsB - savingsA;
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
}

/**
 * Calculate cart totals in BDT including Kurti set savings, promo code discounts, and Inside/Outside Dhaka courier fee.
 */
export function calculateCartSummary(
  items: CartItem[],
  promoCodeInput: string = '',
  deliveryZone: DeliveryZone = 'Inside Dhaka'
): {
  itemCount: number;
  subtotalBdt: number;
  bundleSavingsBdt: number;
  promoDiscountBdt: number;
  promoCodeValid: boolean;
  promoMessage: string;
  deliveryFeeBdt: number;
  amountToFreeDeliveryBdt: number;
  totalBdt: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalBdt = items.reduce(
    (sum, item) => sum + item.unitPriceBdt * item.quantity,
    0
  );
  const originalSubtotalBdt = items.reduce(
    (sum, item) => sum + item.originalUnitPriceBdt * item.quantity,
    0
  );
  const bundleSavingsBdt = Math.max(0, originalSubtotalBdt - subtotalBdt);

  const normalizedPromo = promoCodeInput.trim().toUpperCase();
  let promoDiscountBdt = 0;
  let promoCodeValid = false;
  let promoMessage = '';

  if (normalizedPromo === 'JAYBOR10' && subtotalBdt > 0) {
    promoDiscountBdt = Math.round(subtotalBdt * 0.1);
    promoCodeValid = true;
    promoMessage = '10% Jaybor Pookie Club discount applied!';
  } else if (normalizedPromo === 'POOKIE100' && subtotalBdt >= 1500) {
    promoDiscountBdt = 100;
    promoCodeValid = true;
    promoMessage = '৳100 festive Kurti discount applied!';
  } else if (normalizedPromo.length > 0) {
    promoMessage = 'Invalid code. Try JAYBOR10 for 10% off.';
  }

  const discountedSubtotal = Math.max(0, subtotalBdt - promoDiscountBdt);
  const baseZoneFee =
    deliveryZone === 'Inside Dhaka'
      ? INSIDE_DHAKA_FEE_BDT
      : OUTSIDE_DHAKA_FEE_BDT;

  const deliveryFeeBdt =
    discountedSubtotal === 0 ||
    discountedSubtotal >= FREE_DELIVERY_THRESHOLD_BDT
      ? 0
      : baseZoneFee;

  const amountToFreeDeliveryBdt =
    discountedSubtotal >= FREE_DELIVERY_THRESHOLD_BDT
      ? 0
      : FREE_DELIVERY_THRESHOLD_BDT - discountedSubtotal;

  const totalBdt = discountedSubtotal + deliveryFeeBdt;

  return {
    itemCount,
    subtotalBdt,
    bundleSavingsBdt,
    promoDiscountBdt,
    promoCodeValid,
    promoMessage,
    deliveryFeeBdt,
    amountToFreeDeliveryBdt,
    totalBdt,
  };
}

/**
 * Recommend Bangladeshi Kurti size based on bust/chest measurement in inches.
 */
export function recommendKurtiSize(
  chestInches: number,
  fitPreference: 'Regular' | 'Relaxed' = 'Regular'
): {
  recommendedSize: GarmentSize;
  garmentChestInches: number;
  lengthNote: string;
  fitAdvice: string;
} {
  let baseIndex =
    chestInches <= 36
      ? 0
      : chestInches <= 38
      ? 1
      : chestInches <= 40
      ? 2
      : chestInches <= 42
      ? 3
      : 4;

  if (fitPreference === 'Relaxed' && baseIndex < 4) {
    baseIndex += 1;
  }

  const sizes: GarmentSize[] = [
    'S (36")',
    'M (38")',
    'L (40")',
    'XL (42")',
    'XXL (44")',
  ];
  const chestMap = [36, 38, 40, 42, 44];
  const lengthMap = ['41 in', '42 in', '42 in', '43 in', '43 in'];

  return {
    recommendedSize: sizes[baseIndex],
    garmentChestInches: chestMap[baseIndex],
    lengthNote: `Kurti Length: ${lengthMap[baseIndex]} · Trouser Length: 38 in`,
    fitAdvice:
      fitPreference === 'Relaxed'
        ? 'Sized with +2 inches airy comfort ease for humid Bangladesh weather.'
        : 'True-to-measurement Bangladeshi boutique pattern block with side slits.',
  };
}

/**
 * Validate Bangladesh Cash on Delivery checkout form without substituting fallback values.
 */
export function validateCheckoutInput(input: CustomerCheckoutInput): {
  valid: boolean;
  errors: Partial<Record<keyof CustomerCheckoutInput, string>>;
} {
  const errors: Partial<Record<keyof CustomerCheckoutInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the customer full name.';
  } else if (input.fullName.trim().length > 100) {
    errors.fullName = 'Name must be under 100 characters.';
  }

  const normalizedPhone = (input.phone || '').replace(/[\s-]/g, '');
  if (!BD_PHONE_REGEX.test(normalizedPhone)) {
    errors.phone =
      'Please enter a valid 11-digit Bangladesh mobile number (e.g. 01712345678).';
  }

  if (!input.district || input.district.trim().length < 2) {
    errors.district =
      'Please enter your District or Thana (e.g. Dhanmondi, Dhaka or Sylhet).';
  }

  if (!input.address || input.address.trim().length < 5) {
    errors.address =
      'Please enter your complete House, Road, and Area address for courier delivery.';
  } else if (input.address.trim().length > 300) {
    errors.address = 'Address must be under 300 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate new Kurti outfit listing in the Jaybor Seller Desk.
 */
export function validateNewOutfitInput(input: {
  title: string;
  subtitle: string;
  priceBdt: number;
  originalPriceBdt: number;
  fabric: string;
  colorName: string;
  stockCount: number;
  imageUrl: string;
}): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 3) {
    return {
      valid: false,
      error: 'Kurti outfit title must be at least 3 characters.',
    };
  }
  if (!input.subtitle || input.subtitle.trim().length < 5) {
    return {
      valid: false,
      error: 'Please enter a short description of the Kurti pieces & embroidery.',
    };
  }
  if (!Number.isFinite(input.priceBdt) || input.priceBdt <= 0) {
    return {
      valid: false,
      error: 'Selling price in BDT (৳) must be greater than 0.',
    };
  }
  if (
    !Number.isFinite(input.originalPriceBdt) ||
    input.originalPriceBdt < input.priceBdt
  ) {
    return {
      valid: false,
      error: 'Regular price must be greater than or equal to selling price.',
    };
  }
  if (!input.fabric || input.fabric.trim().length < 3) {
    return { valid: false, error: 'Please specify the fabric (e.g. Cotton, Muslin).' };
  }
  if (!input.colorName || input.colorName.trim().length < 2) {
    return { valid: false, error: 'Please specify the shade name.' };
  }
  if (!Number.isInteger(input.stockCount) || input.stockCount < 1) {
    return { valid: false, error: 'Stock count must be at least 1.' };
  }
  if (!input.imageUrl || input.imageUrl.trim().length < 5) {
    return { valid: false, error: 'Please select or enter an outfit image.' };
  }
  return { valid: true };
}
