export type OutfitCategory =
  | 'All Outfits'
  | 'Tailored Workwear'
  | 'Evening & Silk'
  | 'Outerwear Sets'
  | 'Resort Linen';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface OutfitPiece {
  id: string;
  name: string;
  role: 'Top & Knit' | 'Bottom & Skirt' | 'Outerwear & Layer' | 'Dress';
  price: number;
  fabric: string;
}

export interface OutfitProduct {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<OutfitCategory, 'All Outfits'>;
  occasion: string;
  completePrice: number;
  individualTotal: number;
  pieces: OutfitPiece[];
  colorways: { name: string; hex: string }[];
  sizes: GarmentSize[];
  stockCount: number;
  statusTag: 'In Stock' | 'Limited Run' | 'Atelier Pre-Order';
  imageUrl: string;
  fabricOrigin: string;
  careInstructions: string;
  modelFitNote: string;
  featured?: boolean;
}

export interface CartItem {
  cartItemId: string;
  outfitId: string;
  title: string;
  purchaseType: 'Complete Outfit Set' | 'Individual Piece' | 'Custom Capsule Set';
  pieceName?: string;
  size: GarmentSize;
  colorway: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface CustomerCheckoutInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'COD' | 'CARD';
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customer: CustomerCheckoutInput;
  items: CartItem[];
  subtotal: number;
  bundleSavings: number;
  promoDiscount: number;
  shippingFee: number;
  total: number;
  promoCodeApplied: string | null;
  status: 'Confirmed — Preparing Shipment' | 'Dispatched via Courier' | 'Delivered';
}

export interface CapsulePieceOption {
  id: string;
  name: string;
  slot: 'top' | 'bottom' | 'outerwear';
  price: number;
  fabric: string;
  color: string;
  swatchHex: string;
}

export const FREE_SHIPPING_THRESHOLD = 450;
export const STANDARD_SHIPPING_FEE = 25;
export const COMPLETE_OUTFIT_BUNDLE_DISCOUNT_RATE = 0.12;

/**
 * Filter and sort outfit products by category, search query, and sort order.
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
      category === 'All Outfits' || item.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const searchableText = [
      item.title,
      item.subtitle,
      item.category,
      item.occasion,
      item.fabricOrigin,
      ...item.pieces.map((p) => `${p.name} ${p.fabric}`),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.completePrice - b.completePrice;
    }
    if (sortBy === 'price-desc') {
      return b.completePrice - a.completePrice;
    }
    if (sortBy === 'savings-desc') {
      const savingsA = a.individualTotal - a.completePrice;
      const savingsB = b.individualTotal - b.completePrice;
      return savingsB - savingsA;
    }
    // featured default
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
}

/**
 * Calculate cart totals including bundle savings, promo code discounts, and shipping.
 */
export function calculateCartSummary(
  items: CartItem[],
  promoCodeInput: string = ''
): {
  itemCount: number;
  subtotal: number;
  bundleSavings: number;
  promoDiscount: number;
  promoCodeValid: boolean;
  promoMessage: string;
  shippingFee: number;
  amountToFreeShipping: number;
  total: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const originalSubtotal = items.reduce(
    (sum, item) => sum + item.originalUnitPrice * item.quantity,
    0
  );
  const bundleSavings = Math.max(0, originalSubtotal - subtotal);

  const normalizedPromo = promoCodeInput.trim().toUpperCase();
  let promoDiscount = 0;
  let promoCodeValid = false;
  let promoMessage = '';

  if (normalizedPromo === 'ATELIER15' && subtotal > 0) {
    promoDiscount = Math.round(subtotal * 0.15);
    promoCodeValid = true;
    promoMessage = '15% Atelier Private Client reduction applied';
  } else if (normalizedPromo === 'VALERIA50' && subtotal >= 400) {
    promoDiscount = 50;
    promoCodeValid = true;
    promoMessage = '$50 seasonal wardrobe credit applied';
  } else if (normalizedPromo.length > 0) {
    promoMessage = 'Unrecognized code. Try ATELIER15 for 15% off.';
  }

  const discountedSubtotal = Math.max(0, subtotal - promoDiscount);
  const shippingFee =
    discountedSubtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const amountToFreeShipping =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FREE_SHIPPING_THRESHOLD - discountedSubtotal;

  const total = discountedSubtotal + shippingFee;

  return {
    itemCount,
    subtotal,
    bundleSavings,
    promoDiscount,
    promoCodeValid,
    promoMessage,
    shippingFee,
    amountToFreeShipping,
    total,
  };
}

/**
 * Calculate custom 3-piece capsule outfit bundle pricing (12% savings when all 3 slots selected).
 */
export function calculateCapsuleBundle(
  top: CapsulePieceOption,
  bottom: CapsulePieceOption,
  outerwear: CapsulePieceOption
): {
  individualSum: number;
  bundlePrice: number;
  savingsAmount: number;
  discountPercent: number;
} {
  const individualSum = top.price + bottom.price + outerwear.price;
  const savingsAmount = Math.round(
    individualSum * COMPLETE_OUTFIT_BUNDLE_DISCOUNT_RATE
  );
  const bundlePrice = individualSum - savingsAmount;

  return {
    individualSum,
    bundlePrice,
    savingsAmount,
    discountPercent: 12,
  };
}

/**
 * Recommend womenswear garment size based on bust, waist, and hip measurements in cm.
 */
export function recommendGarmentSize(
  bustCm: number,
  waistCm: number,
  hipCm: number,
  fitPreference: 'Tailored' | 'Signature' | 'Relaxed' = 'Signature'
): {
  recommendedSize: GarmentSize;
  fitConfidence: string;
  tailoringAdvice: string;
} {
  // Base size thresholds in cm:
  // XS: bust <= 83, waist <= 66, hip <= 91
  // S:  bust <= 88, waist <= 71, hip <= 96
  // M:  bust <= 94, waist <= 77, hip <= 102
  // L:  bust <= 101, waist <= 84, hip <= 109
  // XL: above L
  const scoreFromBust =
    bustCm <= 83 ? 0 : bustCm <= 88 ? 1 : bustCm <= 94 ? 2 : bustCm <= 101 ? 3 : 4;
  const scoreFromWaist =
    waistCm <= 66 ? 0 : waistCm <= 71 ? 1 : waistCm <= 77 ? 2 : waistCm <= 84 ? 3 : 4;
  const scoreFromHip =
    hipCm <= 91 ? 0 : hipCm <= 96 ? 1 : hipCm <= 102 ? 2 : hipCm <= 109 ? 3 : 4;

  let index = Math.max(scoreFromBust, scoreFromWaist, scoreFromHip);

  if (fitPreference === 'Relaxed' && index < 4) {
    index += 1;
  } else if (fitPreference === 'Tailored' && index > 0 && scoreFromBust === scoreFromWaist) {
    index = Math.max(0, index);
  }

  const sizes: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL'];
  const recommendedSize = sizes[index];

  const spread = Math.max(scoreFromBust, scoreFromWaist, scoreFromHip) -
    Math.min(scoreFromBust, scoreFromWaist, scoreFromHip);

  const tailoringAdvice =
    spread >= 2
      ? 'Your proportions span two standard grading blocks; our complimentary waist dart adjustment is recommended on blazers and trousers.'
      : 'Your measurements align evenly with our standard Italian pattern block with no alteration required.';

  return {
    recommendedSize,
    fitConfidence: spread === 0 ? 'Exact Atelier Match' : 'Balanced Drape Match',
    tailoringAdvice,
  };
}

/**
 * Validate customer checkout form without substituting fallback values.
 */
export function validateCheckoutInput(
  input: CustomerCheckoutInput
): { valid: boolean; errors: Partial<Record<keyof CustomerCheckoutInput, string>> } {
  const errors: Partial<Record<keyof CustomerCheckoutInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter the recipient full name.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address for order receipt.';
  }

  const cleanedPhone = (input.phone || '').replace(/[^\d+]/g, '');
  if (cleanedPhone.length < 7) {
    errors.phone = 'Please provide a valid contact phone number for courier verification.';
  }

  if (!input.address || input.address.trim().length < 5) {
    errors.address = 'Please enter a complete street delivery address.';
  }

  if (!input.city || input.city.trim().length < 2) {
    errors.city = 'Please enter your city.';
  }

  if (!input.postalCode || input.postalCode.trim().length < 3) {
    errors.postalCode = 'Please enter a valid postal or ZIP code.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate new female outfit listing form in the Boutique Seller Desk.
 */
export function validateNewOutfitInput(input: {
  title: string;
  subtitle: string;
  completePrice: number;
  topName: string;
  topPrice: number;
  bottomName: string;
  bottomPrice: number;
  stockCount: number;
}): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 3) {
    return { valid: false, error: 'Outfit title must be at least 3 characters.' };
  }
  if (!input.subtitle || input.subtitle.trim().length < 5) {
    return { valid: false, error: 'Please provide a concise styling subtitle.' };
  }
  if (!Number.isFinite(input.completePrice) || input.completePrice <= 0) {
    return { valid: false, error: 'Complete outfit price must be greater than $0.' };
  }
  if (!input.topName.trim() || !input.bottomName.trim()) {
    return { valid: false, error: 'Please name at least the two primary garments in the outfit.' };
  }
  if (input.topPrice <= 0 || input.bottomPrice <= 0) {
    return { valid: false, error: 'Individual piece prices must be greater than $0.' };
  }
  if (!Number.isInteger(input.stockCount) || input.stockCount < 1) {
    return { valid: false, error: 'Initial stock quantity must be at least 1.' };
  }
  return { valid: true };
}
