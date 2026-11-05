import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  PackageCheck,
  Layers,
  Check,
  Database,
  LogIn,
  LogOut,
  Phone,
  MapPin,
} from 'lucide-react';
import {
  validateNewOutfitInput,
  type OutfitProduct,
  type OrderRecord,
  type OutfitCategory,
} from '../utils/commerceLogic';
import { KURTI_IMAGE_PLATES } from '../data/outfitsData';
import { ResilientImage } from './ResilientImage';

interface BoutiqueSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: OutfitProduct[];
  orders: OrderRecord[];
  currentUserEmail: string | null;
  isCloudSynced: boolean;
  onGoogleSignIn: () => Promise<void>;
  onGoogleSignOut: () => Promise<void>;
  onAddOutfit: (outfit: OutfitProduct) => Promise<void>;
  onUpdateOrderStatus: (
    orderId: string,
    status: OrderRecord['status']
  ) => Promise<void>;
  onRestockOutfit: (
    outfitId: string,
    additionalUnits: number
  ) => Promise<void>;
}

export const BoutiqueSellerModal: React.FC<BoutiqueSellerModalProps> = ({
  isOpen,
  onClose,
  outfits,
  orders,
  currentUserEmail,
  isCloudSynced,
  onGoogleSignIn,
  onGoogleSignOut,
  onAddOutfit,
  onUpdateOrderStatus,
  onRestockOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'publish'>(
    'orders'
  );

  // Publish New Kurti Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<
    Exclude<OutfitCategory, 'All Kurtis'>
  >('Pookie Pastel Edition');
  const [priceBdt, setPriceBdt] = useState<string>('1490');
  const [originalPriceBdt, setOriginalPriceBdt] = useState<string>('1790');
  const [fabric, setFabric] = useState('100% Pure Combed Cotton');
  const [colorName, setColorName] = useState('Rose Berry Pink');
  const [stockCount, setStockCount] = useState<string>('15');
  const [imageUrl, setImageUrl] = useState(KURTI_IMAGE_PLATES[0].url);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!isOpen) return null;

  const totalRevenueBdt = orders.reduce((sum, o) => sum + o.totalBdt, 0);
  const totalUnitsInStock = outfits.reduce((sum, o) => sum + o.stockCount, 0);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const rawDataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        const maxDimension = 720;
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
          setImageUrl(compressedDataUrl);
        } else {
          setImageUrl(rawDataUrl);
        }
      };
      img.onerror = () => {
        setImageUrl(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Number(priceBdt);
    const parsedOriginal = Number(originalPriceBdt);
    const parsedStock = Number(stockCount);

    const validation = validateNewOutfitInput({
      title,
      subtitle,
      priceBdt: parsedPrice,
      originalPriceBdt: parsedOriginal,
      fabric,
      colorName,
      stockCount: parsedStock,
      imageUrl,
    });

    if (!validation.valid) {
      setErrorMsg(validation.error || 'Please verify all fields.');
      return;
    }

    setErrorMsg(null);
    const newOutfit: OutfitProduct = {
      id: `jaybor-kurti-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      occasion: 'Everyday & Festive Bangladesh Wear',
      priceBdt: parsedPrice,
      originalPriceBdt: parsedOriginal,
      pieces: [
        {
          id: `piece-k-${Date.now()}`,
          name: `${title.trim()} Kurti`,
          role: 'Kurti Top',
          priceBdt: Math.round(parsedPrice * 0.7),
          fabric: fabric.trim(),
        },
        {
          id: `piece-p-${Date.now()}`,
          name: 'Matching Tailored Trouser',
          role: 'Matching Pant / Palazzo',
          priceBdt: Math.round(parsedPrice * 0.3),
          fabric: fabric.trim(),
        },
      ],
      colorName: colorName.trim(),
      colorHex: '#A83264',
      colorways: [
        { name: colorName.trim(), hex: '#A83264' },
        { name: 'Soft Lavender', hex: '#D8C2E3' },
      ],
      sizes: ['S (36")', 'M (38")', 'L (40")', 'XL (42")', 'XXL (44")'],
      stockCount: parsedStock,
      statusTag: 'New Arrival',
      imageUrl: imageUrl.trim(),
      fabric: fabric.trim(),
      lengthInches: 'Kurti 42" · Trouser 38"',
      careInstructions: 'Cold hand wash recommended.',
      featured: true,
      isPublished: true,
    };

    await onAddOutfit(newOutfit);
    setPublishSuccess(true);
    setTitle('');
    setSubtitle('');
    setTimeout(() => {
      setPublishSuccess(false);
      setActiveTab('catalog');
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1621]/55 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="boutique-seller-title"
    >
      <div className="w-full max-w-5xl bg-[#FFF9FB] border border-[#EDD5E1] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EDD5E1] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A83264] font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>
                Jaybor Business Database ·{' '}
                {isCloudSynced
                  ? 'Firebase Cloud Firestore Connected'
                  : 'Ready for Admin Cloud Sync'}
              </span>
            </div>
            <h2
              id="boutique-seller-title"
              className="font-display text-2xl font-semibold text-[#2A1621]"
            >
              Jaybor — Seller & Customer Order Details Desk
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUserEmail ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6E4B5E] hidden sm:inline">
                  Admin: <strong className="text-[#2A1621]">{currentUserEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={onGoogleSignOut}
                  className="px-3 py-1.5 text-xs font-medium border border-[#EDD5E1] rounded-lg bg-[#FCEEF4] text-[#2A1621] hover:bg-[#A83264] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="px-3.5 py-2 text-xs font-medium bg-[#FCEEF4] text-[#A83264] border border-[#EDD5E1] rounded-lg hover:bg-[#A83264] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Owner Google Login (Sync Cloud DB)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close boutique seller desk"
              className="w-9 h-9 flex items-center justify-center border border-[#EDD5E1] rounded-lg text-[#2A1621] hover:bg-[#A83264] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-3 divide-x divide-[#EDD5E1] border-b border-[#EDD5E1] bg-[#FCEEF4]">
          <div className="p-4">
            <span className="text-xs text-[#6E4B5E] block">
              Total COD Order Value
            </span>
            <span className="text-xl font-semibold text-[#A83264] font-mono-num">
              ৳{totalRevenueBdt.toLocaleString()}
            </span>
          </div>
          <div className="p-4">
            <span className="text-xs text-[#6E4B5E] block">
              Customer COD Orders
            </span>
            <span className="text-xl font-semibold text-[#2A1621] font-mono-num">
              {orders.length} orders
            </span>
          </div>
          <div className="p-4">
            <span className="text-xs text-[#6E4B5E] block">
              Kurti Catalog & Stock
            </span>
            <span className="text-xl font-semibold text-[#2A1621] font-mono-num">
              {outfits.length} designs · {totalUnitsInStock} pcs
            </span>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-6 pt-3 bg-white border-b border-[#EDD5E1] flex items-center gap-5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#A83264] text-[#A83264]'
                : 'border-transparent text-[#6E4B5E] hover:text-[#2A1621]'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Image Orders & Customer Details ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'catalog'
                ? 'border-[#A83264] text-[#A83264]'
                : 'border-transparent text-[#6E4B5E] hover:text-[#2A1621]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kurti Stock & Catalog ({outfits.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('publish')}
            className={`pb-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'publish'
                ? 'border-[#A83264] text-[#A83264]'
                : 'border-transparent text-[#6E4B5E] hover:text-[#2A1621]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add New Kurti Outfit to Database</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-white border border-[#EDD5E1] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Ordered Kurti Image + Customer & Address Details */}
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#FCEEF4] border border-[#EDD5E1] shrink-0">
                      <ResilientImage
                        src={ord.primaryOutfitImage}
                        alt={ord.primaryOutfitTitle}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono-num font-bold text-[#A83264]">
                          #{ord.orderNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#2A1621]">
                          {ord.customerName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num text-[#2A1621] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#A83264]" />
                          {ord.phone}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-[#2A1621]">
                        Ordered Kurti: {ord.primaryOutfitTitle}
                      </div>

                      <div className="text-xs text-[#6E4B5E] flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#A83264] shrink-0 mt-0.5" />
                        <span>
                          {ord.address}, <strong>{ord.district}</strong> (
                          {ord.deliveryZone} · {ord.paymentMethod})
                        </span>
                      </div>

                      <div className="text-[11px] text-[#8F6B7E]">
                        Placed: {ord.createdAt} · Delivery Fee: ৳
                        {ord.deliveryFeeBdt}
                      </div>
                    </div>
                  </div>

                  {/* COD Total & Fulfillment Status Selector */}
                  <div className="flex sm:flex-row md:flex-col items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#FCEEF4]">
                    <div className="text-right">
                      <span className="text-[11px] text-[#6E4B5E] block">
                        COD Collectible
                      </span>
                      <span className="text-base font-mono-num font-bold text-[#A83264]">
                        ৳{ord.totalBdt.toLocaleString()}
                      </span>
                    </div>

                    <select
                      aria-label={`Order status for ${ord.orderNumber}`}
                      value={ord.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(
                          ord.id,
                          e.target.value as OrderRecord['status']
                        )
                      }
                      className="text-xs border border-[#EDD5E1] rounded-lg bg-[#FCEEF4] px-3 py-1.5 text-[#2A1621] font-medium focus:outline-none focus:border-[#A83264]"
                    >
                      <option value="Pending Call Verification">
                        Pending Call Verification
                      </option>
                      <option value="Confirmed — Packing Kurti">
                        Confirmed — Packing Kurti
                      </option>
                      <option value="Sent to Steadfast Courier">
                        Sent to Steadfast Courier
                      </option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="divide-y divide-[#EDD5E1] border border-[#EDD5E1] rounded-xl bg-white overflow-hidden">
              {outfits.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#FCEEF4] border border-[#EDD5E1] shrink-0">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#2A1621] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#6E4B5E] mt-0.5">
                        {item.category} · {item.fabric} · Price:{' '}
                        <span className="font-mono-num font-semibold text-[#A83264]">
                          ৳{item.priceBdt.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono-num text-[#5B2C44]">
                      Stock: <strong>{item.stockCount}</strong> pcs
                    </span>
                    <button
                      type="button"
                      onClick={() => onRestockOutfit(item.id, 5)}
                      className="px-3 py-1.5 text-xs font-medium border border-[#EDD5E1] rounded-lg bg-[#FCEEF4] text-[#2A1621] hover:bg-[#A83264] hover:text-white transition-colors whitespace-nowrap shrink-0"
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
              className="bg-white border border-[#EDD5E1] rounded-xl p-5 space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-title"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Kurti Outfit Name *
                  </label>
                  <input
                    id="new-outfit-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Zara Pastel Rose Muslin 2-Piece Kurti Set"
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-category"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Kurti Category *
                  </label>
                  <select
                    id="new-outfit-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as Exclude<OutfitCategory, 'All Kurtis'>
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621]"
                  >
                    <option value="Pookie Pastel Edition">
                      Pookie Pastel Edition
                    </option>
                    <option value="Daily Cotton Kurti">
                      Daily Cotton Kurti
                    </option>
                    <option value="2-Piece Kurti Set">2-Piece Kurti Set</option>
                    <option value="Festive 3-Piece">Festive 3-Piece</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-outfit-subtitle"
                  className="block text-xs font-medium text-[#2A1621] mb-1"
                >
                  Short Description (Embroidery, Pant & Dupatta Details) *
                </label>
                <input
                  id="new-outfit-subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Soft pastel rose embroidered cotton kurti with lace sleeves and matching pant"
                  className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-price"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Selling Price in BDT (৳) *
                  </label>
                  <input
                    id="new-outfit-price"
                    type="number"
                    value={priceBdt}
                    onChange={(e) => setPriceBdt(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621] font-mono-num"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-original-price"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Regular Price in BDT (৳) *
                  </label>
                  <input
                    id="new-outfit-original-price"
                    type="number"
                    value={originalPriceBdt}
                    onChange={(e) => setOriginalPriceBdt(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621] font-mono-num"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-stock"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Available Stock (Pcs) *
                  </label>
                  <input
                    id="new-outfit-stock"
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621] font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-outfit-fabric"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Fabric Quality *
                  </label>
                  <input
                    id="new-outfit-fabric"
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="100% Pure Combed Cotton"
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-outfit-color"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Color / Shade Name *
                  </label>
                  <input
                    id="new-outfit-color"
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    placeholder="Strawberry Blush Pink"
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621]"
                  />
                </div>
              </div>

              {/* Outfit Image Selector or Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2 border-t border-[#FCEEF4]">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="new-outfit-image"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Choose Studio Kurti Photo
                  </label>
                  <select
                    id="new-outfit-image"
                    value={
                      KURTI_IMAGE_PLATES.some((p) => p.url === imageUrl)
                        ? imageUrl
                        : KURTI_IMAGE_PLATES[0].url
                    }
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EDD5E1] rounded-lg bg-[#FFF9FB] text-[#2A1621]"
                  >
                    {KURTI_IMAGE_PLATES.map((img) => (
                      <option key={img.label} value={img.url}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-5">
                  <label
                    htmlFor="new-outfit-upload"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    Or Upload Kurti Photo from Device
                  </label>
                  <input
                    id="new-outfit-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="w-full text-xs text-[#6E4B5E] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#FCEEF4] file:text-[#A83264] hover:file:bg-[#F7E2EC]"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <div className="w-14 h-16 rounded-lg overflow-hidden border border-[#EDD5E1] bg-[#FCEEF4]">
                    <ResilientImage
                      src={imageUrl}
                      alt="Kurti preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-[#991B1B] font-medium">{errorMsg}</p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#A83264] text-white rounded-lg text-xs font-medium uppercase tracking-wider hover:bg-[#8C2652] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  {publishSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved to Jaybor Database</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Save Kurti Outfit to Database</span>
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
