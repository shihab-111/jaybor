import React, { useState } from 'react';
import { X, PlusCircle, PackageCheck, Layers, Check } from 'lucide-react';
import {
  validateNewOutfitInput,
  type OutfitProduct,
  type OrderRecord,
  type OutfitCategory,
} from '../utils/commerceLogic';

interface BoutiqueSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: OutfitProduct[];
  orders: OrderRecord[];
  onAddOutfit: (outfit: OutfitProduct) => void;
  onUpdateOrderStatus: (
    orderId: string,
    status: OrderRecord['status']
  ) => void;
  onRestockOutfit: (outfitId: string, additionalUnits: number) => void;
}

const PRESET_IMAGES = [
  {
    label: 'Ivory Linen Tailoring Plate',
    url: '/src/assets/images/hero_womens_atelier_campaign_1793894291048.jpg',
  },
  {
    label: 'Emerald Silk Evening Plate',
    url: '/src/assets/images/outfit_silk_evening_ensemble_1793894291827.jpg',
  },
  {
    label: 'Espresso Power Suit Plate',
    url: '/src/assets/images/outfit_tailored_power_suit_1793894293160.jpg',
  },
  {
    label: 'Vendôme Trench Set Plate',
    url: '/src/assets/images/outfit_parisian_trench_set_1793894293285.jpg',
  },
  {
    label: 'Riviera Terracotta Linen Plate',
    url: '/src/assets/images/outfit_riviera_linen_set_1793894294892.jpg',
  },
];

export const BoutiqueSellerModal: React.FC<BoutiqueSellerModalProps> = ({
  isOpen,
  onClose,
  outfits,
  orders,
  onAddOutfit,
  onUpdateOrderStatus,
  onRestockOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'publish'>(
    'orders'
  );

  // Publish New Outfit Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] =
    useState<Exclude<OutfitCategory, 'All Outfits'>>('Tailored Workwear');
  const [completePrice, setCompletePrice] = useState<string>('640');
  const [topName, setTopName] = useState('');
  const [topPrice, setTopPrice] = useState<string>('360');
  const [bottomName, setBottomName] = useState('');
  const [bottomPrice, setBottomPrice] = useState<string>('350');
  const [stockCount, setStockCount] = useState<string>('8');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsInStock = outfits.reduce((sum, o) => sum + o.stockCount, 0);

  const handleCreateOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedComplete = Number(completePrice);
    const parsedTop = Number(topPrice);
    const parsedBottom = Number(bottomPrice);
    const parsedStock = Number(stockCount);

    const validation = validateNewOutfitInput({
      title,
      subtitle,
      completePrice: parsedComplete,
      topName,
      topPrice: parsedTop,
      bottomName,
      bottomPrice: parsedBottom,
      stockCount: parsedStock,
    });

    if (!validation.valid) {
      setErrorMsg(validation.error || 'Please verify all fields.');
      return;
    }

    setErrorMsg(null);
    const individualTotal = Math.max(parsedComplete + 60, parsedTop + parsedBottom);

    const newOutfit: OutfitProduct = {
      id: `custom-outfit-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      occasion: 'Atelier Seasonal Release',
      completePrice: parsedComplete,
      individualTotal,
      pieces: [
        {
          id: `piece-top-${Date.now()}`,
          name: topName.trim(),
          role: 'Top & Knit',
          price: parsedTop,
          fabric: 'Italian Atelier Reserve Textile',
        },
        {
          id: `piece-bot-${Date.now()}`,
          name: bottomName.trim(),
          role: 'Bottom & Skirt',
          price: parsedBottom,
          fabric: 'Italian Atelier Reserve Textile',
        },
      ],
      colorways: [
        { name: 'Atelier Signature', hex: '#D8CBB8' },
        { name: 'Obsidian Noir', hex: '#1B1B1D' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      stockCount: parsedStock,
      statusTag: 'In Stock',
      imageUrl,
      fabricOrigin: 'Woven in Italy · Small-Batch Release',
      careInstructions: 'Specialist dry clean recommended.',
      modelFitNote: 'Tailored to standard Maison Valéria grading.',
      featured: true,
    };

    onAddOutfit(newOutfit);
    setPublishSuccess(true);
    setTitle('');
    setSubtitle('');
    setTopName('');
    setBottomName('');
    setTimeout(() => {
      setPublishSuccess(false);
      setActiveTab('catalog');
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="boutique-seller-title"
    >
      <div className="w-full max-w-4xl bg-[#FAF8F5] border border-[#E5E0D8] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E5E0D8] flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#6E675F]">
              Merchant Operations & Inventory Studio
            </div>
            <h2
              id="boutique-seller-title"
              className="font-display text-2xl font-semibold text-[#181615]"
            >
              Maison Valéria — Boutique Seller Desk
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close boutique seller desk"
            className="w-9 h-9 flex items-center justify-center border border-[#E5E0D8] text-[#181615] hover:bg-[#181615] hover:text-[#FAF8F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-3 divide-x divide-[#E5E0D8] border-b border-[#E5E0D8] bg-[#F4F0EA]">
          <div className="p-4">
            <span className="text-xs text-[#6E675F] block">
              Booked Order Volume
            </span>
            <span className="text-xl font-semibold text-[#181615] font-mono-num">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="p-4">
            <span className="text-xs text-[#6E675F] block">
              Active Client Orders
            </span>
            <span className="text-xl font-semibold text-[#181615] font-mono-num">
              {orders.length}
            </span>
          </div>
          <div className="p-4">
            <span className="text-xs text-[#6E675F] block">
              Catalog Outfits / Total Stock
            </span>
            <span className="text-xl font-semibold text-[#181615] font-mono-num">
              {outfits.length} looks · {totalUnitsInStock} sets
            </span>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-6 pt-4 bg-white border-b border-[#E5E0D8] flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#181615] text-[#181615]'
                : 'border-transparent text-[#6E675F] hover:text-[#181615]'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Client Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'catalog'
                ? 'border-[#181615] text-[#181615]'
                : 'border-transparent text-[#6E675F] hover:text-[#181615]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inventory & Restock ({outfits.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('publish')}
            className={`pb-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'publish'
                ? 'border-[#181615] text-[#181615]'
                : 'border-transparent text-[#6E675F] hover:text-[#181615]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish New Outfit Listing</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' && (
            <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] bg-white">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono-num font-semibold text-[#181615]">
                        #{ord.orderId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#181615]">
                        {ord.customer.fullName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#6E675F]">
                        {ord.customer.city} ({ord.customer.paymentMethod})
                      </span>
                    </div>
                    <div className="text-xs text-[#57514A]">
                      {ord.items
                        .map((i) => `${i.title} (${i.size} ×${i.quantity})`)
                        .join(', ')}
                    </div>
                    <div className="text-[11px] text-[#787067]">
                      Placed {ord.createdAt} · Contact: {ord.customer.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-mono-num font-semibold text-[#181615]">
                      ${ord.total}
                    </span>
                    <select
                      aria-label={`Order status for ${ord.orderId}`}
                      value={ord.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(
                          ord.orderId,
                          e.target.value as OrderRecord['status']
                        )
                      }
                      className="text-xs border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 text-[#181615] focus:outline-none focus:border-[#181615]"
                    >
                      <option value="Confirmed — Preparing Shipment">
                        Confirmed — Preparing Shipment
                      </option>
                      <option value="Dispatched via Courier">
                        Dispatched via Courier
                      </option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] bg-white">
              {outfits.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#181615]">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#6E675F] mt-0.5">
                      {item.category} · {item.pieces.length} pieces · Complete
                      Set:{' '}
                      <span className="font-mono-num font-medium text-[#181615]">
                        ${item.completePrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono-num text-[#4A443F]">
                      Stock: <strong>{item.stockCount}</strong> sets
                    </span>
                    <button
                      type="button"
                      onClick={() => onRestockOutfit(item.id, 5)}
                      className="px-3 py-1.5 text-xs font-medium border border-[#E5E0D8] bg-[#FAF8F5] hover:bg-[#181615] hover:text-[#FAF8F5] transition-colors whitespace-nowrap shrink-0"
                    >
                      +5 Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'publish' && (
            <form
              onSubmit={handleCreateOutfit}
              className="bg-white border border-[#E5E0D8] p-5 space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-title"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Outfit Ensemble Title *
                  </label>
                  <input
                    id="new-outfit-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Solstice Ribbed Cashmere Midi Set"
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-category"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Collection Category *
                  </label>
                  <select
                    id="new-outfit-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as Exclude<OutfitCategory, 'All Outfits'>
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615]"
                  >
                    <option value="Tailored Workwear">Tailored Workwear</option>
                    <option value="Evening & Silk">Evening & Silk</option>
                    <option value="Outerwear Sets">Outerwear Sets</option>
                    <option value="Resort Linen">Resort Linen</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-outfit-subtitle"
                  className="block text-xs font-medium text-[#181615] mb-1"
                >
                  Included Garments & Fabric Description *
                </label>
                <input
                  id="new-outfit-subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Belted cardigan jacket paired with a high-waisted knitted A-line midi skirt"
                  className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-top-name"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Primary Garment 1 (Top / Jacket) *
                  </label>
                  <input
                    id="new-outfit-top-name"
                    type="text"
                    value={topName}
                    onChange={(e) => setTopName(e.target.value)}
                    placeholder="Belted Cashmere Cardigan"
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-outfit-top-price"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Garment 1 Individual Price ($) *
                  </label>
                  <input
                    id="new-outfit-top-price"
                    type="number"
                    value={topPrice}
                    onChange={(e) => setTopPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615] font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-bottom-name"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Primary Garment 2 (Trousers / Skirt / Dress) *
                  </label>
                  <input
                    id="new-outfit-bottom-name"
                    type="text"
                    value={bottomName}
                    onChange={(e) => setBottomName(e.target.value)}
                    placeholder="Flared Cashmere Midi Skirt"
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-outfit-bottom-price"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Garment 2 Individual Price ($) *
                  </label>
                  <input
                    id="new-outfit-bottom-price"
                    type="number"
                    value={bottomPrice}
                    onChange={(e) => setBottomPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615] font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-complete-price"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Complete Outfit Set Price ($) *
                  </label>
                  <input
                    id="new-outfit-complete-price"
                    type="number"
                    value={completePrice}
                    onChange={(e) => setCompletePrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615] font-mono-num"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-stock"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Initial Atelier Stock *
                  </label>
                  <input
                    id="new-outfit-stock"
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615] font-mono-num"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-image"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Lookbook Photography Plate
                  </label>
                  <select
                    id="new-outfit-image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5E0D8] bg-[#FAF8F5] text-[#181615]"
                  >
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.label} value={img.url}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-[#991B1B] font-medium">{errorMsg}</p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#181615] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-[#2E2A27] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  {publishSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Outfit Published to Storefront</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish Outfit to Storefront</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
