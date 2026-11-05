import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  ArrowUpRight,
  X,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  filterAndSortOutfits,
  calculateCartSummary,
  type OutfitCategory,
  type OutfitProduct,
  type OutfitPiece,
  type GarmentSize,
  type CartItem,
  type OrderRecord,
  type CapsulePieceOption,
} from './utils/commerceLogic';
import {
  HERO_CAMPAIGN_IMAGE,
  INITIAL_OUTFITS,
  INITIAL_ORDERS,
} from './data/outfitsData';
import { ResilientImage } from './components/ResilientImage';
import { OutfitDetailModal } from './components/OutfitDetailModal';
import { CapsuleStylerSection } from './components/CapsuleStylerSection';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { BoutiqueSellerModal } from './components/BoutiqueSellerModal';

const CATEGORIES: OutfitCategory[] = [
  'All Outfits',
  'Tailored Workwear',
  'Evening & Silk',
  'Outerwear Sets',
  'Resort Linen',
];

export default function App() {
  // Catalog & Business State
  const [outfits, setOutfits] = useState<OutfitProduct[]>(INITIAL_OUTFITS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] =
    useState<OutfitCategory>('All Outfits');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'savings-desc'
  >('featured');

  // Promotional Banner Dismiss State
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  // Active Modals & Drawers
  const [selectedOutfitForPdp, setSelectedOutfitForPdp] =
    useState<OutfitProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [atelierTab, setAtelierTab] = useState<'styler' | 'sizing'>('styler');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Shopping Bag State (Seeded with 1 signature outfit so bag is immediately inspectable or modifiable)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: `${INITIAL_OUTFITS[0].id}-Complete Outfit Set-complete-S-${INITIAL_OUTFITS[0].colorways[0].name}`,
      outfitId: INITIAL_OUTFITS[0].id,
      title: INITIAL_OUTFITS[0].title,
      purchaseType: 'Complete Outfit Set',
      size: 'S',
      colorway: INITIAL_OUTFITS[0].colorways[0].name,
      unitPrice: INITIAL_OUTFITS[0].completePrice,
      originalUnitPrice: INITIAL_OUTFITS[0].individualTotal,
      quantity: 1,
      imageUrl: INITIAL_OUTFITS[0].imageUrl,
    },
  ]);

  const filteredOutfits = useMemo(
    () =>
      filterAndSortOutfits(outfits, selectedCategory, searchQuery, sortBy),
    [outfits, selectedCategory, searchQuery, sortBy]
  );

  const cartSummary = useMemo(
    () => calculateCartSummary(cartItems, ''),
    [cartItems]
  );

  // Handlers
  const handleAddToCartFromPdp = (payload: {
    outfit: OutfitProduct;
    purchaseType: 'Complete Outfit Set' | 'Individual Piece';
    selectedPiece?: OutfitPiece;
    size: GarmentSize;
    colorway: string;
  }) => {
    const unitPrice =
      payload.purchaseType === 'Complete Outfit Set'
        ? payload.outfit.completePrice
        : payload.selectedPiece?.price || payload.outfit.completePrice;

    const originalUnitPrice =
      payload.purchaseType === 'Complete Outfit Set'
        ? payload.outfit.individualTotal
        : unitPrice;

    const pieceKey = payload.selectedPiece?.id || 'complete';
    const cartItemId = `${payload.outfit.id}-${payload.purchaseType}-${pieceKey}-${payload.size}-${payload.colorway}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          outfitId: payload.outfit.id,
          title: payload.outfit.title,
          purchaseType: payload.purchaseType,
          pieceName: payload.selectedPiece?.name,
          size: payload.size,
          colorway: payload.colorway,
          unitPrice,
          originalUnitPrice,
          quantity: 1,
          imageUrl: payload.outfit.imageUrl,
        },
      ];
    });
  };

  const handleQuickAddCompleteSet = (outfit: OutfitProduct) => {
    handleAddToCartFromPdp({
      outfit,
      purchaseType: 'Complete Outfit Set',
      size: 'S',
      colorway: outfit.colorways[0]?.name || 'Signature',
    });
    setQuickAddedId(outfit.id);
    setTimeout(() => setQuickAddedId(null), 1200);
  };

  const handleAddCustomCapsule = (payload: {
    top: CapsulePieceOption;
    bottom: CapsulePieceOption;
    outerwear: CapsulePieceOption;
    size: GarmentSize;
    bundlePrice: number;
    individualSum: number;
  }) => {
    const cartItemId = `capsule-${payload.top.id}-${payload.bottom.id}-${payload.outerwear.id}-${payload.size}`;
    const pieceSummary = `${payload.outerwear.name} + ${payload.top.name} + ${payload.bottom.name}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          outfitId: 'custom-capsule',
          title: 'Bespoke 3-Piece Capsule Ensemble',
          purchaseType: 'Custom Capsule Set',
          pieceName: pieceSummary,
          size: payload.size,
          colorway: `${payload.outerwear.color.split(' ')[0]} / ${payload.top.color.split(' ')[0]}`,
          unitPrice: payload.bundlePrice,
          originalUnitPrice: payload.individualSum,
          quantity: 1,
          imageUrl: HERO_CAMPAIGN_IMAGE,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const handleCompleteOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  const handleAddNewOutfitListing = (newOutfit: OutfitProduct) => {
    setOutfits((prev) => [newOutfit, ...prev]);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: OrderRecord['status']
  ) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status } : ord))
    );
  };

  const handleRestockOutfit = (outfitId: string, additionalUnits: number) => {
    setOutfits((prev) =>
      prev.map((o) =>
        o.id === outfitId
          ? { ...o, stockCount: o.stockCount + additionalUnits }
          : o
      )
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#181615]">
      {/* Slim Dismissible Promotional Surface (<= 40px height, 15% mobile sticky cap respected) */}
      {showPromoBanner && (
        <div className="h-9 bg-[#181615] text-[#FAF8F5] px-4 sm:px-8 flex items-center justify-between text-xs">
          <div className="truncate">
            <span>
              Autumn / Winter Atelier Collection · Save 12% on Complete Styled
              Outfits · Code{' '}
              <strong className="font-mono-num">ATELIER15</strong> for 15%
              Private Client Reduction
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPromoBanner(false)}
            aria-label="Dismiss announcement banner"
            className="ml-4 text-[#D8CFC2] hover:text-white transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Strictly 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[#E5E0D8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark in display face */}
          <a
            href="#top"
            className="font-display text-2xl font-semibold tracking-tight text-[#181615] whitespace-nowrap shrink-0"
          >
            Maison Valéria
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-[#57514A]"
          >
            <a
              href="#collection-grid"
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Outfits Collection
            </a>
            <a
              href="#capsule-styler"
              onClick={() => setAtelierTab('styler')}
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Capsule Styler
            </a>
            <a
              href="#capsule-styler"
              onClick={() => setAtelierTab('sizing')}
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Fit Calculator
            </a>
            <button
              type="button"
              onClick={() => setIsSellerModalOpen(true)}
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors uppercase tracking-wider whitespace-nowrap shrink-0"
            >
              Boutique Desk
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag with ${cartSummary.itemCount} items`}
              className="px-4 py-2 text-xs font-medium bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shopping Bag ({cartSummary.itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: Storefront Hero Split + Full-Width Provenance Strip */}
        <section className="border-b border-[#E5E0D8]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left 6 Cols: Editorial Campaign Copy & Direct Route */}
              <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-8">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#6E675F]">
                    <span>01. Autumn / Winter 2026 Lookbook</span>
                    <span aria-hidden="true">·</span>
                    <span>Milan & Paris Atelier</span>
                  </div>

                  <h1
                    className="font-display font-semibold text-[#181615] leading-[1.08] tracking-tight max-w-xl"
                    style={{
                      fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                      textWrap: 'balance',
                    }}
                  >
                    Architectural Womenswear Styled as Complete Ensembles.
                  </h1>

                  <p className="text-base text-[#4A443F] leading-relaxed max-w-[62ch]">
                    Every Maison Valéria look is pattern-graded as a cohesive
                    two- or three-piece female outfit—pairing Belgian flax
                    suiting, 22-momme Como mulberry silk, and Super 130s virgin
                    wool. Acquire the complete styled ensemble with a 12%
                    atelier reduction or select individual garments.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection('collection-grid')}
                      className="px-6 py-3.5 bg-[#181615] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-[#2E2A27] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <span>Explore Curated Outfits</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAtelierTab('styler');
                        scrollToSection('capsule-styler');
                      }}
                      className="px-5 py-3.5 bg-white border border-[#181615] text-[#181615] text-xs font-medium uppercase tracking-wider hover:bg-[#F4F0EA] transition-colors whitespace-nowrap shrink-0"
                    >
                      Build 3-Piece Capsule
                    </button>
                  </div>

                  {/* Featured Campaign Look Callout */}
                  <div className="pt-5 border-t border-[#E5E0D8] flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[#6E675F] block">
                        Pictured Campaign Ensemble
                      </span>
                      <strong className="text-[#181615] font-medium">
                        Valéria Architectural Linen 3-Piece Suit (Blazer + Silk
                        Camisole + Trousers)
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedOutfitForPdp(outfits[0])}
                      className="text-xs font-medium text-[#181615] underline underline-offset-4 hover:text-[#6E675F] whitespace-nowrap shrink-0"
                    >
                      Inspect Look ($680)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: High-Fidelity Editorial Campaign Plate */}
              <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] bg-[#EFECE6] border border-[#E5E0D8] overflow-hidden">
                <ResilientImage
                  src={HERO_CAMPAIGN_IMAGE}
                  alt="Woman wearing the Valéria Ivory Linen 3-Piece Tailored Suit in a sunlit limestone courtyard"
                  className="w-full h-full lg:h-full object-cover object-center"
                />
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-[#FAF8F5] flex items-end justify-between gap-4">
                  <div className="text-xs">
                    <div className="uppercase tracking-widest text-[#D8CFC2]">
                      Plate 01 · Limestone Courtyard Campaign
                    </div>
                    <div className="font-medium mt-0.5">
                      100% Belgian Flax Linen & 19-Momme Mulberry Silk
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickAddCompleteSet(outfits[0])}
                    className="px-3.5 py-2 bg-[#FAF8F5] text-[#181615] text-xs font-medium hover:bg-[#E5E0D8] transition-colors whitespace-nowrap shrink-0"
                  >
                    Quick Add Set · $680
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Atelier Provenance & Commercial Terms Strip */}
            <div className="mt-10 pt-8 border-t border-[#E5E0D8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <div className="font-semibold text-[#181615] uppercase tracking-wider">
                  Complete Outfit Pricing
                </div>
                <p className="text-[#57514A] mt-1">
                  Save 12% automatically when purchasing any full styled look
                  or 3-piece capsule vs. individual garments.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#181615] uppercase tracking-wider">
                  Certified Italian Mills
                </div>
                <p className="text-[#57514A] mt-1">
                  Grade-6A Como mulberry silk, Biella Super 130s virgin wool,
                  and GOTS-certified European flax linen.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#181615] uppercase tracking-wider">
                  Cash on Delivery & Card
                </div>
                <p className="text-[#57514A] mt-1">
                  Settle online or choose verified Cash on Delivery (COD) with
                  complimentary courier shipping over $450.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#181615] uppercase tracking-wider">
                  Merchant & Studio Ready
                </div>
                <p className="text-[#57514A] mt-1">
                  Live inventory tracking, custom capsule styling, and instant
                  listing management via the{' '}
                  <button
                    type="button"
                    onClick={() => setIsSellerModalOpen(true)}
                    className="underline text-[#181615] font-medium"
                  >
                    Boutique Desk
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Female Outfits Collection Grid */}
        <section
          id="collection-grid"
          className="py-16 sm:py-20 max-w-[1280px] mx-auto px-4 sm:px-8"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D8]">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E675F] mb-2">
                <span>01. Curated Ensembles & Separates</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">
                  {filteredOutfits.length} Styled Outfits Available
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#181615] tracking-tight">
                Complete Female Outfits Collection
              </h2>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#787067] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  aria-label="Search outfits by garment, fabric, or occasion"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search silk, blazer, linen..."
                  className="pl-8 pr-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615] w-52 sm:w-60"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-[#E5E0D8] px-3 py-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E675F]" />
                <label htmlFor="sort-select" className="sr-only">
                  Sort outfits
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | 'featured'
                        | 'price-asc'
                        | 'price-desc'
                        | 'savings-desc'
                    )
                  }
                  className="text-xs bg-transparent text-[#181615] focus:outline-none"
                >
                  <option value="featured">Sort: Editorial Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="savings-desc">Highest Bundle Savings</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Bar (Functional Segmented Buttons) */}
          <div className="py-5 flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFECE6] border border-[#E5E0D8]"
              role="group"
              aria-label="Filter outfits by category"
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#181615] text-[#FAF8F5]'
                        : 'text-[#57514A] hover:text-[#181615]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsSellerModalOpen(true)}
              className="text-xs font-medium text-[#181615] underline underline-offset-4 hover:text-[#57514A] whitespace-nowrap shrink-0"
            >
              + List New Outfit in Boutique Desk
            </button>
          </div>

          {/* 3-Column Product Grid */}
          {filteredOutfits.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#E5E0D8] space-y-3">
              <p className="font-display text-2xl text-[#181615]">
                No ensembles match your current filter criteria.
              </p>
              <p className="text-xs text-[#6E675F]">
                Try clearing your search query or switching to All Outfits.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Outfits');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#181615] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider whitespace-nowrap shrink-0"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
              {filteredOutfits.map((outfit) => {
                const savings = outfit.individualTotal - outfit.completePrice;
                const isQuickAdded = quickAddedId === outfit.id;

                return (
                  <article
                    key={outfit.id}
                    className="group bg-white border border-[#E5E0D8] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* 3:4 Editorial Image Container */}
                      <div className="relative aspect-[3/4] bg-[#EFECE6] overflow-hidden border-b border-[#E5E0D8]">
                        <ResilientImage
                          src={outfit.imageUrl}
                          alt={outfit.title}
                          fallbackLabel={outfit.title}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        />

                        {/* Hover Quick Actions */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/45 to-transparent flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOutfitForPdp(outfit)}
                            className="flex-1 py-2 px-3 bg-[#FAF8F5] text-[#181615] text-xs font-medium hover:bg-[#E5E0D8] transition-colors whitespace-nowrap shrink-0"
                          >
                            Shop Look / Pieces
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAddCompleteSet(outfit)}
                            aria-label={`Quick add complete ${outfit.title} set to bag`}
                            className="py-2 px-3 bg-[#181615] text-[#FAF8F5] text-xs font-medium hover:bg-[#2E2A27] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            {isQuickAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <span>+ Set (${outfit.completePrice})</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Card Body: Clean Unboxed Metadata + Title + Garment Breakdown */}
                      <div className="p-5 space-y-3">
                        {/* Unboxed Metadata (Zero-Pill Rule) */}
                        <div className="flex items-center justify-between text-xs text-[#6E675F] uppercase tracking-wider">
                          <span>
                            {outfit.category} · {outfit.pieces.length} Pieces
                          </span>
                          <span>{outfit.statusTag}</span>
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-[#181615] leading-snug">
                            <button
                              type="button"
                              onClick={() => setSelectedOutfitForPdp(outfit)}
                              className="text-left hover:underline underline-offset-4"
                            >
                              {outfit.title}
                            </button>
                          </h3>
                          <p className="text-xs text-[#57514A] mt-1 line-clamp-2 leading-relaxed">
                            {outfit.subtitle}
                          </p>
                        </div>

                        {/* Individual Garment List Preview */}
                        <div className="pt-2 border-t border-[#F0ECE3] space-y-1">
                          {outfit.pieces.map((piece) => (
                            <div
                              key={piece.id}
                              className="flex items-center justify-between text-[11px] text-[#6E675F]"
                            >
                              <span className="truncate pr-2">
                                {piece.name}
                              </span>
                              <span className="font-mono-num shrink-0">
                                ${piece.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Baseline-Aligned Tabular Price & Colorway Swatches */}
                    <div className="px-5 py-3.5 border-t border-[#E5E0D8] bg-[#FAF8F5] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[15px] font-semibold text-[#181615] font-mono-num">
                            ${outfit.completePrice}
                          </span>
                          <span className="text-xs text-[#787067] line-through font-mono-num">
                            ${outfit.individualTotal}
                          </span>
                          <span className="text-[11px] text-[#0E4D3B] font-medium">
                            Save ${savings}
                          </span>
                        </div>
                        <span className="block text-[11px] text-[#6E675F]">
                          Complete Outfit Price · Sizes XS–XL
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {outfit.colorways.map((c) => (
                          <span
                            key={c.name}
                            title={c.name}
                            className="w-3.5 h-3.5 border border-black/25"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: Interactive 3-Piece Capsule Styler & Fit Studio */}
        <CapsuleStylerSection
          activeTab={atelierTab}
          onTabChange={setAtelierTab}
          onAddCustomCapsuleToCart={handleAddCustomCapsule}
        />
      </main>

      {/* SECTION 4: Quiet Editorial Footer */}
      <footer className="bg-[#181615] text-[#FAF8F5] border-t border-[#2E2A27]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <span className="font-display text-2xl font-semibold tracking-tight block">
              Maison Valéria
            </span>
            <p className="text-xs text-[#A8A096] leading-relaxed">
              Direct-to-client luxury womenswear and complete styled ensembles.
              Patterned in Milan, woven from certified Italian silk, wool, and
              flax linen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#D8CFC2]">
            <a
              href="#collection-grid"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Outfits Catalog
            </a>
            <a
              href="#capsule-styler"
              onClick={() => setAtelierTab('styler')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              3-Piece Capsule Builder
            </a>
            <a
              href="#capsule-styler"
              onClick={() => setAtelierTab('sizing')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Size & Fit Calculator
            </a>
            <button
              type="button"
              onClick={() => setIsSellerModalOpen(true)}
              className="hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Boutique Seller Desk ({orders.length} Orders)
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Shopping Bag ({cartSummary.itemCount})
            </button>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-4 border-t border-[#2E2A27] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#787067] gap-2">
          <span>
            © 2026 Maison Valéria Atelier S.r.l. All rights reserved.
          </span>
          <span>
            Milan · Paris · Complimentary Express Garment-on-Hanger Courier over
            $450
          </span>
        </div>
      </footer>

      {/* Contiguous Purchase Module (PDP Modal) */}
      <OutfitDetailModal
        outfit={selectedOutfitForPdp}
        onClose={() => setSelectedOutfitForPdp(null)}
        onAddToCart={handleAddToCartFromPdp}
        onOpenSizeGuide={() => {
          setAtelierTab('sizing');
          scrollToSection('capsule-styler');
        }}
      />

      {/* Slide-Over Shopping Bag & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Boutique Seller & Inventory Management Modal */}
      <BoutiqueSellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        outfits={outfits}
        orders={orders}
        onAddOutfit={handleAddNewOutfitListing}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onRestockOutfit={handleRestockOutfit}
      />
    </div>
  );
}
