import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  ArrowUpRight,
  X,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  OperationType,
  handleFirestoreError,
} from './firebase';
import {
  filterAndSortOutfits,
  calculateCartSummary,
  type OutfitCategory,
  type OutfitProduct,
  type GarmentSize,
  type CartItem,
  type OrderRecord,
} from './utils/commerceLogic';
import {
  HERO_CAMPAIGN_IMAGE,
  INITIAL_OUTFITS,
  INITIAL_ORDERS,
  resolveKurtiImageUrl,
} from './data/outfitsData';
import { ResilientImage } from './components/ResilientImage';
import { OutfitDetailModal } from './components/OutfitDetailModal';
import { CapsuleStylerSection } from './components/CapsuleStylerSection';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { BoutiqueSellerModal } from './components/BoutiqueSellerModal';

const CATEGORIES: OutfitCategory[] = [
  'All Kurtis',
  'Pookie Pastel Edition',
  'Daily Cotton Kurti',
  '2-Piece Kurti Set',
  'Festive 3-Piece',
];

const LOCAL_ORDERS_STORAGE_KEY = 'jaybor_bd_orders_v2';
const LOCAL_OUTFITS_STORAGE_KEY = 'jaybor_bd_outfits_v2';

export default function App() {
  // Auth & Database State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Catalog & Customer Orders State (Backed by Firestore + Local Cache so every device is fast & smooth)
  const [outfits, setOutfits] = useState<OutfitProduct[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_OUTFITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_OUTFITS;
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_ORDERS;
  });

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] =
    useState<OutfitCategory>('All Kurtis');
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
  const [cartInitialStep, setCartInitialStep] = useState<'bag' | 'checkout'>(
    'bag'
  );
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [utilityTab, setUtilityTab] = useState<'sizing' | 'tracker'>('sizing');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Shopping Bag State (Seeded with 1 signature Pookie Kurti Set)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: `${INITIAL_OUTFITS[0].id}-M (38")-${INITIAL_OUTFITS[0].colorways[0].name}`,
      outfitId: INITIAL_OUTFITS[0].id,
      title: INITIAL_OUTFITS[0].title,
      category: INITIAL_OUTFITS[0].category,
      size: 'M (38")',
      colorway: INITIAL_OUTFITS[0].colorways[0].name,
      unitPriceBdt: INITIAL_OUTFITS[0].priceBdt,
      originalUnitPriceBdt: INITIAL_OUTFITS[0].originalPriceBdt,
      quantity: 1,
      imageUrl: INITIAL_OUTFITS[0].imageUrl,
    },
  ]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Subscribe to public published outfits in Firestore
  useEffect(() => {
    if (!authReady) return;
    const outfitsPath = 'outfits';
    const q = query(
      collection(db, outfitsPath),
      where('isPublished', '==', true)
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteOutfits: OutfitProduct[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              title: d.title,
              subtitle: d.subtitle,
              category: d.category,
              occasion: 'Everyday & Festive Bangladesh Wear',
              priceBdt: d.priceBdt,
              originalPriceBdt: d.originalPriceBdt,
              pieces: [
                {
                  id: `${docSnap.id}-p1`,
                  name: d.title,
                  role: 'Kurti Top',
                  priceBdt: d.priceBdt,
                  fabric: d.fabric,
                },
              ],
              colorName: d.colorName,
              colorHex: d.colorHex,
              colorways: [{ name: d.colorName, hex: d.colorHex }],
              sizes: d.sizes || [
                'S (36")',
                'M (38")',
                'L (40")',
                'XL (42")',
                'XXL (44")',
              ],
              stockCount: d.stockCount,
              statusTag: d.statusTag,
              imageUrl: resolveKurtiImageUrl(d.imageUrl),
              fabric: d.fabric,
              lengthInches: 'Kurti 42" · Trouser 38"',
              careInstructions: 'Cold hand wash recommended.',
              featured: true,
              isPublished: d.isPublished,
            };
          });

          setOutfits((prev) => {
            const existingIds = new Set(remoteOutfits.map((r) => r.id));
            const merged = [
              ...remoteOutfits,
              ...prev.filter((p) => !existingIds.has(p.id)),
            ];
            try {
              localStorage.setItem(
                LOCAL_OUTFITS_STORAGE_KEY,
                JSON.stringify(merged)
              );
            } catch {
              // ignore
            }
            return merged;
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, outfitsPath);
      }
    );

    return () => unsub();
  }, [authReady]);

  // Subscribe to customer orders in Firestore when authenticated
  useEffect(() => {
    if (!authReady || !currentUser || !currentUser.emailVerified) return;
    const ordersPath = 'orders';
    const isAdminUser = currentUser.email === 'shihabahmmed700@gmail.com';
    const ordersQuery = isAdminUser
      ? collection(db, ordersPath)
      : query(
          collection(db, ordersPath),
          where('customerUid', '==', currentUser.uid)
        );

    const unsub = onSnapshot(
      ordersQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders: OrderRecord[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              orderNumber: d.orderNumber,
              createdAt: 'Synced in Jaybor Cloud DB',
              customerUid: d.customerUid,
              customerName: d.customerName,
              phone: d.phone,
              district: d.district,
              address: d.address,
              deliveryZone: d.deliveryZone,
              paymentMethod: 'Cash on Delivery',
              primaryOutfitTitle: d.primaryOutfitTitle,
              primaryOutfitImage: resolveKurtiImageUrl(d.primaryOutfitImage),
              itemSummaryList: d.itemSummaryList || [],
              items: [],
              totalQuantity: d.totalQuantity,
              subtotalBdt: d.subtotalBdt,
              savingsBdt: 0,
              discountBdt: d.discountBdt,
              deliveryFeeBdt: d.deliveryFeeBdt,
              totalBdt: d.totalBdt,
              promoCodeApplied: null,
              status: d.status,
            };
          });

          setOrders((prev) => {
            const remoteNumbers = new Set(
              remoteOrders.map((r) => r.orderNumber)
            );
            const merged = [
              ...remoteOrders,
              ...prev.filter((p) => !remoteNumbers.has(p.orderNumber)),
            ];
            try {
              localStorage.setItem(
                LOCAL_ORDERS_STORAGE_KEY,
                JSON.stringify(merged)
              );
            } catch {
              // ignore
            }
            return merged;
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, ordersPath);
      }
    );

    return () => unsub();
  }, [authReady, currentUser]);

  const filteredOutfits = useMemo(
    () =>
      filterAndSortOutfits(outfits, selectedCategory, searchQuery, sortBy),
    [outfits, selectedCategory, searchQuery, sortBy]
  );

  const cartSummary = useMemo(
    () => calculateCartSummary(cartItems, '', 'Inside Dhaka'),
    [cartItems]
  );

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In cancelled or failed:', err);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Cart & Order Handlers
  const handleAddToCart = (payload: {
    outfit: OutfitProduct;
    size: GarmentSize;
    colorway: string;
  }) => {
    const cartItemId = `${payload.outfit.id}-${payload.size}-${payload.colorway}`;

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
          category: payload.outfit.category,
          size: payload.size,
          colorway: payload.colorway,
          unitPriceBdt: payload.outfit.priceBdt,
          originalUnitPriceBdt: payload.outfit.originalPriceBdt,
          quantity: 1,
          imageUrl: payload.outfit.imageUrl,
        },
      ];
    });
  };

  const handleOrderNowCodFromPdp = (payload: {
    outfit: OutfitProduct;
    size: GarmentSize;
    colorway: string;
  }) => {
    handleAddToCart(payload);
    setSelectedOutfitForPdp(null);
    setCartInitialStep('checkout');
    setIsCartOpen(true);
  };

  const handleQuickAddKurti = (outfit: OutfitProduct) => {
    handleAddToCart({
      outfit,
      size: 'M (38")',
      colorway: outfit.colorways[0]?.name || outfit.colorName,
    });
    setQuickAddedId(outfit.id);
    setTimeout(() => setQuickAddedId(null), 1200);
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

  const handleCompleteOrder = async (newOrder: OrderRecord) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      localStorage.setItem(
        LOCAL_ORDERS_STORAGE_KEY,
        JSON.stringify(updatedOrders)
      );
    } catch {
      // ignore
    }

    // If user is authenticated & verified, also persist directly to Cloud Firestore /orders/{orderId}
    if (currentUser && currentUser.emailVerified) {
      const safeOrderId = newOrder.id.replace(/[^a-zA-Z0-9_-]/g, '-');
      const path = `orders/${safeOrderId}`;
      try {
        await setDoc(doc(db, 'orders', safeOrderId), {
          orderNumber: newOrder.orderNumber.slice(0, 32),
          customerUid: currentUser.uid,
          customerName: newOrder.customerName.slice(0, 100),
          phone: newOrder.phone.slice(0, 14),
          district: newOrder.district.slice(0, 80),
          address: newOrder.address.slice(0, 300),
          deliveryZone: newOrder.deliveryZone,
          paymentMethod: 'Cash on Delivery',
          primaryOutfitTitle: newOrder.primaryOutfitTitle.slice(0, 300),
          primaryOutfitImage: newOrder.primaryOutfitImage.slice(0, 350000),
          itemSummaryList: newOrder.itemSummaryList.slice(0, 10),
          totalQuantity: Math.min(100, Math.max(1, newOrder.totalQuantity)),
          subtotalBdt: newOrder.subtotalBdt,
          deliveryFeeBdt: newOrder.deliveryFeeBdt,
          discountBdt: newOrder.discountBdt,
          totalBdt: newOrder.totalBdt,
          status: 'Pending Call Verification',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }

    setCartItems([]);
  };

  const handleAddNewOutfitListing = async (newOutfit: OutfitProduct) => {
    const updated = [newOutfit, ...outfits];
    setOutfits(updated);
    try {
      localStorage.setItem(LOCAL_OUTFITS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (
      currentUser &&
      currentUser.emailVerified &&
      currentUser.email === 'shihabahmmed700@gmail.com'
    ) {
      const safeId = newOutfit.id.replace(/[^a-zA-Z0-9_-]/g, '-');
      const path = `outfits/${safeId}`;
      try {
        await setDoc(doc(db, 'outfits', safeId), {
          title: newOutfit.title.slice(0, 120),
          subtitle: newOutfit.subtitle.slice(0, 240),
          category: newOutfit.category,
          priceBdt: newOutfit.priceBdt,
          originalPriceBdt: newOutfit.originalPriceBdt,
          fabric: newOutfit.fabric.slice(0, 120),
          colorName: newOutfit.colorName.slice(0, 60),
          colorHex: newOutfit.colorHex,
          imageUrl: newOutfit.imageUrl.slice(0, 350000),
          stockCount: newOutfit.stockCount,
          statusTag: newOutfit.statusTag,
          sizes: newOutfit.sizes.slice(0, 6),
          isPublished: true,
          authorUid: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderRecord['status']
  ) => {
    const updated = orders.map((ord) =>
      ord.id === orderId ? { ...ord, status } : ord
    );
    setOrders(updated);
    try {
      localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (
      currentUser &&
      currentUser.emailVerified &&
      currentUser.email === 'shihabahmmed700@gmail.com' &&
      !orderId.startsWith('seed-')
    ) {
      const safeId = orderId.replace(/[^a-zA-Z0-9_-]/g, '-');
      const targetOrder = orders.find((o) => o.id === orderId);
      if (targetOrder) {
        const path = `orders/${safeId}`;
        try {
          await updateDoc(doc(db, 'orders', safeId), {
            status,
            address: targetOrder.address,
            district: targetOrder.district,
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      }
    }
  };

  const handleRestockOutfit = async (
    outfitId: string,
    additionalUnits: number
  ) => {
    const updated = outfits.map((o) =>
      o.id === outfitId
        ? { ...o, stockCount: o.stockCount + additionalUnits }
        : o
    );
    setOutfits(updated);
    try {
      localStorage.setItem(LOCAL_OUTFITS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9FB] text-[#2A1621]">
      {/* Slim Dismissible Promotional Surface (<= 40px height, 15% mobile sticky cap respected) */}
      {showPromoBanner && (
        <div className="h-9 bg-[#A83264] text-white px-4 sm:px-8 flex items-center justify-between text-xs">
          <div className="truncate">
            <span>
              Jaybor Bangladesh · 100% Cash on Delivery (Inside Dhaka ৳70 ·
              Outside Dhaka ৳130) · Use Code{' '}
              <strong className="font-mono-num">JAYBOR10</strong> for 10% Off
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPromoBanner(false)}
            aria-label="Dismiss announcement banner"
            className="ml-4 text-[#FCEEF4] hover:text-white transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Strictly 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FFF9FB]/95 backdrop-blur-xs border-b border-[#EDD5E1]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark in display face */}
          <a
            href="#top"
            className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#A83264] whitespace-nowrap shrink-0"
          >
            Jaybor
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-[#6E4B5E]"
          >
            <a
              href="#collection-grid"
              className="hover:text-[#A83264] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Kurti Collection
            </a>
            <a
              href="#size-and-tracker"
              onClick={() => setUtilityTab('sizing')}
              className="hover:text-[#A83264] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              BD Size Guide
            </a>
            <a
              href="#size-and-tracker"
              onClick={() => setUtilityTab('tracker')}
              className="hover:text-[#A83264] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Track Order
            </a>
            <button
              type="button"
              onClick={() => setIsSellerModalOpen(true)}
              className="hover:text-[#A83264] hover:underline underline-offset-4 transition-colors uppercase tracking-wider whitespace-nowrap shrink-0"
            >
              Seller Desk
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setCartInitialStep('bag');
                setIsCartOpen(true);
              }}
              aria-label={`Open shopping bag with ${cartSummary.itemCount} items`}
              className="px-4 py-2 text-xs font-medium bg-[#A83264] text-white rounded-lg hover:bg-[#8C2652] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>COD Bag ({cartSummary.itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: Storefront Hero Split + Full-Width BD Delivery & Trust Strip */}
        <section className="border-b border-[#EDD5E1] bg-gradient-to-b from-[#FCEEF4]/60 to-[#FFF9FB]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left 6 Cols: Editorial Campaign Copy & Direct Route */}
              <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-7">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#A83264] font-medium">
                    <span>01. Jaybor Bangladesh Kurti Edition</span>
                    <span aria-hidden="true">·</span>
                    <span>Soft Pookie & Classic Heritage</span>
                  </div>

                  <h1
                    className="font-display font-semibold text-[#2A1621] leading-[1.08] tracking-tight max-w-xl"
                    style={{
                      fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                      textWrap: 'balance',
                    }}
                  >
                    Graceful Pastel & Berry Kurti Outfits for Every Occasion.
                  </h1>

                  <p className="text-base text-[#5B2C44] leading-relaxed max-w-[60ch]">
                    Designed in Dhaka for effortless everyday comfort and
                    festive charm. Explore breathable chikankari cotton kurtis,
                    2-piece handloom co-ords, and embroidered 3-piece muslin
                    sets—delivered across all 64 districts of Bangladesh with
                    100% Cash on Delivery.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection('collection-grid')}
                      className="px-6 py-3.5 bg-[#A83264] text-white rounded-lg text-xs font-medium uppercase tracking-wider hover:bg-[#8C2652] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <span>Shop Kurti Collection</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUtilityTab('tracker');
                        scrollToSection('size-and-tracker');
                      }}
                      className="px-5 py-3.5 bg-white border border-[#EDD5E1] text-[#2A1621] rounded-lg text-xs font-medium uppercase tracking-wider hover:border-[#A83264] hover:bg-[#FCEEF4] transition-colors whitespace-nowrap shrink-0"
                    >
                      Track COD Order
                    </button>
                  </div>

                  {/* Featured Campaign Look Callout */}
                  <div className="pt-5 border-t border-[#EDD5E1] flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[#6E4B5E] block">
                        Pictured Featured Ensemble
                      </span>
                      <strong className="text-[#2A1621] font-medium">
                        Meher Rose-Berry Embroidered Muslin 3-Piece Kurti Set
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedOutfitForPdp(outfits[1] || outfits[0])}
                      className="text-xs font-medium text-[#A83264] underline underline-offset-4 hover:text-[#2A1621] whitespace-nowrap shrink-0"
                    >
                      View Set (৳2,450)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: High-Fidelity Kurti Campaign Image */}
              <div className="lg:col-span-6 relative min-h-[360px] sm:min-h-[440px] bg-[#FCEEF4] border border-[#EDD5E1] rounded-2xl overflow-hidden shadow-sm">
                <ResilientImage
                  src={HERO_CAMPAIGN_IMAGE}
                  alt="Young South Asian woman wearing Jaybor Rose-Berry Embroidered Muslin 3-Piece Kurti Set"
                  className="w-full h-full lg:h-full object-cover object-center"
                />
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#2A1621]/85 via-[#2A1621]/45 to-transparent text-[#FFF9FB] flex items-end justify-between gap-4">
                  <div className="text-xs">
                    <div className="uppercase tracking-widest text-[#F7E2EC]">
                      Jaybor Signature · Dhakai Muslin & Organza
                    </div>
                    <div className="font-medium mt-0.5">
                      Sizes S (36") to XXL (44") · 100% Cash on Delivery
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAddKurti(outfits[1] || outfits[0])
                    }
                    className="px-3.5 py-2 bg-[#FFF9FB] text-[#2A1621] rounded-lg text-xs font-medium hover:bg-[#FCEEF4] transition-colors whitespace-nowrap shrink-0"
                  >
                    Quick Add · ৳2,450
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Bangladesh Service & Database Highlights */}
            <div className="mt-10 pt-8 border-t border-[#EDD5E1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <div className="font-semibold text-[#A83264] uppercase tracking-wider">
                  Cash on Delivery Only
                </div>
                <p className="text-[#6E4B5E] mt-1">
                  Zero advance payment required. Check your Kurti parcel in
                  front of the delivery rider and pay cash.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#A83264] uppercase tracking-wider">
                  Fast BD Courier Rates
                </div>
                <p className="text-[#6E4B5E] mt-1">
                  Inside Dhaka ৳70 (24–48 hrs) · Outside Dhaka ৳130 (Steadfast &
                  Pathao Courier) · Free over ৳2,500.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#A83264] uppercase tracking-wider">
                  Breathable Deshi Fabrics
                </div>
                <p className="text-[#6E4B5E] mt-1">
                  100% combed voile cotton, soft Dhakai muslin, and silk-cotton
                  tailored for Bangladesh's climate.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#A83264] uppercase tracking-wider">
                  Live Order & Image Database
                </div>
                <p className="text-[#6E4B5E] mt-1">
                  Every order saves the ordered Kurti photo and customer address
                  inside the{' '}
                  <button
                    type="button"
                    onClick={() => setIsSellerModalOpen(true)}
                    className="underline text-[#A83264] font-semibold"
                  >
                    Jaybor Seller Desk
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Jaybor Kurti Outfits Collection Grid */}
        <section
          id="collection-grid"
          className="py-14 sm:py-18 max-w-[1280px] mx-auto px-4 sm:px-8"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-7 border-b border-[#EDD5E1]">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E4B5E] mb-2">
                <span>01. Jaybor Kurti Catalog</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">
                  {filteredOutfits.length} Kurti Outfits Ready to Ship
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2A1621] tracking-tight">
                Curated Kurti Outfits Collection
              </h2>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8F6B7E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  aria-label="Search Kurtis by fabric, color, or style"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cotton, muslin, blush..."
                  className="pl-8 pr-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] focus:outline-none focus:border-[#A83264] w-52 sm:w-60"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-[#EDD5E1] rounded-lg px-3 py-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#A83264]" />
                <label htmlFor="sort-select" className="sr-only">
                  Sort Kurtis
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
                  className="text-xs bg-transparent text-[#2A1621] focus:outline-none"
                >
                  <option value="featured">Sort: Featured Pookie Picks</option>
                  <option value="price-asc">Price: Low to High (৳)</option>
                  <option value="price-desc">Price: High to Low (৳)</option>
                  <option value="savings-desc">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Bar (Functional Segmented Buttons) */}
          <div className="py-5 flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FCEEF4] border border-[#EDD5E1] rounded-lg"
              role="group"
              aria-label="Filter Kurtis by category"
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#A83264] text-white shadow-xs'
                        : 'text-[#5B2C44] hover:text-[#2A1621]'
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
              className="text-xs font-medium text-[#A83264] underline underline-offset-4 hover:text-[#2A1621] whitespace-nowrap shrink-0"
            >
              + Add Kurti / View Customer Orders ({orders.length})
            </button>
          </div>

          {/* 3-Column Kurti Product Grid */}
          {filteredOutfits.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#EDD5E1] rounded-xl space-y-3">
              <p className="font-display text-2xl text-[#2A1621]">
                No Kurti outfits match your search.
              </p>
              <p className="text-xs text-[#6E4B5E]">
                Try clearing your search or selecting All Kurtis.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Kurtis');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#A83264] text-white rounded-lg text-xs font-medium uppercase tracking-wider whitespace-nowrap shrink-0"
              >
                Show All Kurtis
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pt-2">
              {filteredOutfits.map((outfit) => {
                const savings = Math.max(
                  0,
                  outfit.originalPriceBdt - outfit.priceBdt
                );
                const isQuickAdded = quickAddedId === outfit.id;

                return (
                  <article
                    key={outfit.id}
                    className="group bg-white border border-[#EDD5E1] rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* 3:4 Editorial Image Container */}
                      <div className="relative aspect-[3/4] bg-[#FCEEF4] overflow-hidden border-b border-[#EDD5E1]">
                        <ResilientImage
                          src={outfit.imageUrl}
                          alt={outfit.title}
                          fallbackLabel={outfit.title}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        />

                        {/* Quick Action Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#2A1621]/85 via-[#2A1621]/45 to-transparent flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOutfitForPdp(outfit)}
                            className="flex-1 py-2 px-3 bg-[#FFF9FB] text-[#2A1621] rounded-md text-xs font-medium hover:bg-[#FCEEF4] transition-colors whitespace-nowrap shrink-0"
                          >
                            View Details & Size
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAddKurti(outfit)}
                            aria-label={`Quick add ${outfit.title} to COD bag`}
                            className="py-2 px-3 bg-[#A83264] text-white rounded-md text-xs font-medium hover:bg-[#8C2652] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            {isQuickAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <span>
                                + COD Bag (৳{outfit.priceBdt.toLocaleString()})
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Card Body: Clean Unboxed Metadata + Title + Included Pieces */}
                      <div className="p-5 space-y-2.5">
                        {/* Unboxed Metadata (Zero-Pill Rule) */}
                        <div className="flex items-center justify-between text-xs text-[#6E4B5E] uppercase tracking-wider">
                          <span>
                            {outfit.category} · {outfit.pieces.length}{' '}
                            {outfit.pieces.length === 1 ? 'Pc' : 'Pcs'}
                          </span>
                          <span className="text-[#A83264] font-medium">
                            {outfit.statusTag}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-[#2A1621] leading-snug">
                            <button
                              type="button"
                              onClick={() => setSelectedOutfitForPdp(outfit)}
                              className="text-left hover:text-[#A83264] transition-colors"
                            >
                              {outfit.title}
                            </button>
                          </h3>
                          <p className="text-xs text-[#6E4B5E] mt-1 line-clamp-2 leading-relaxed">
                            {outfit.subtitle}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#FCEEF4] text-[11px] text-[#6E4B5E] flex items-center justify-between">
                          <span className="truncate pr-2">{outfit.fabric}</span>
                          <span className="font-mono-num shrink-0">
                            {outfit.lengthInches.split('·')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Baseline-Aligned Tabular BDT Price & Colorway Swatches */}
                    <div className="px-5 py-3.5 border-t border-[#EDD5E1] bg-[#FFF9FB] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[16px] font-semibold text-[#A83264] font-mono-num">
                            ৳{outfit.priceBdt.toLocaleString()}
                          </span>
                          {savings > 0 && (
                            <>
                              <span className="text-xs text-[#8F6B7E] line-through font-mono-num">
                                ৳{outfit.originalPriceBdt.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-[#2A1621] font-medium">
                                Save ৳{savings}
                              </span>
                            </>
                          )}
                        </div>
                        <span className="block text-[11px] text-[#6E4B5E]">
                          Cash on Delivery · Sizes 36"–44"
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {outfit.colorways.map((c) => (
                          <span
                            key={c.name}
                            title={c.name}
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
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

        {/* SECTION 3: BD Kurti Size Calculator & Live COD Order Tracker */}
        <CapsuleStylerSection
          activeTab={utilityTab}
          onTabChange={setUtilityTab}
          orders={orders}
        />
      </main>

      {/* SECTION 4: Quiet Classic Footer */}
      <footer className="bg-[#2A1621] text-[#FFF9FB] border-t border-[#472538]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <span className="font-display text-2xl font-semibold tracking-tight text-[#F7E2EC] block">
              Jaybor
            </span>
            <p className="text-xs text-[#D8B4C6] leading-relaxed">
              Modern classic & pookie Kurti outfits boutique in Bangladesh.
              Soft cotton, muslin, and festive 3-piece sets delivered to all 64
              districts with Cash on Delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#F7E2EC]">
            <a
              href="#collection-grid"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Kurti Catalog
            </a>
            <a
              href="#size-and-tracker"
              onClick={() => setUtilityTab('sizing')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              BD Size Calculator
            </a>
            <a
              href="#size-and-tracker"
              onClick={() => setUtilityTab('tracker')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Track COD Order
            </a>
            <button
              type="button"
              onClick={() => setIsSellerModalOpen(true)}
              className="hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Seller & Order Database ({orders.length} Orders)
            </button>
            <button
              type="button"
              onClick={() => {
                setCartInitialStep('bag');
                setIsCartOpen(true);
              }}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              COD Bag ({cartSummary.itemCount})
            </button>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-4 border-t border-[#472538] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B891A5] gap-2">
          <span>© 2026 Jaybor Bangladesh. All rights reserved.</span>
          <span>
            Dhaka · Chattogram · Sylhet · Rajshahi · Khulna · 100% Cash on
            Delivery
          </span>
        </div>
      </footer>

      {/* Contiguous Purchase Module (PDP Modal) */}
      <OutfitDetailModal
        outfit={selectedOutfitForPdp}
        onClose={() => setSelectedOutfitForPdp(null)}
        onAddToCart={handleAddToCart}
        onOrderNowCod={handleOrderNowCodFromPdp}
        onOpenSizeGuide={() => {
          setUtilityTab('sizing');
          scrollToSection('size-and-tracker');
        }}
      />

      {/* Slide-Over Shopping Bag & COD Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        initialStep={cartInitialStep}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currentUserUid={currentUser?.uid || null}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Jaybor Seller & Customer Order Details Database Modal */}
      <BoutiqueSellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        outfits={outfits}
        orders={orders}
        currentUserEmail={currentUser?.email || null}
        isCloudSynced={Boolean(currentUser?.emailVerified)}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onAddOutfit={handleAddNewOutfitListing}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onRestockOutfit={handleRestockOutfit}
      />
    </div>
  );
}
