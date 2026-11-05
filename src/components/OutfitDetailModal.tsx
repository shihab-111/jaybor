import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Ruler, Truck } from 'lucide-react';
import type { OutfitProduct, GarmentSize } from '../utils/commerceLogic';
import { ResilientImage } from './ResilientImage';

interface OutfitDetailModalProps {
  outfit: OutfitProduct | null;
  onClose: () => void;
  onAddToCart: (payload: {
    outfit: OutfitProduct;
    size: GarmentSize;
    colorway: string;
  }) => void;
  onOrderNowCod: (payload: {
    outfit: OutfitProduct;
    size: GarmentSize;
    colorway: string;
  }) => void;
  onOpenSizeGuide: () => void;
}

export const OutfitDetailModal: React.FC<OutfitDetailModalProps> = ({
  outfit,
  onClose,
  onAddToCart,
  onOrderNowCod,
  onOpenSizeGuide,
}) => {
  const [selectedSize, setSelectedSize] = useState<GarmentSize>('M (38")');
  const [selectedColorway, setSelectedColorway] = useState<string>(
    outfit?.colorways[0]?.name || outfit?.colorName || ''
  );
  const [justAdded, setJustAdded] = useState(false);

  if (!outfit) return null;

  const activeColorway =
    selectedColorway || outfit.colorways[0]?.name || outfit.colorName;
  const savingsBdt = Math.max(0, outfit.originalPriceBdt - outfit.priceBdt);

  const handleAdd = () => {
    onAddToCart({
      outfit,
      size: selectedSize,
      colorway: activeColorway,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1300);
  };

  const handleDirectCod = () => {
    onOrderNowCod({
      outfit,
      size: selectedSize,
      colorway: activeColorway,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1621]/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#FFF9FB] border border-[#EDD5E1] rounded-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col lg:flex-row">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close outfit details"
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-[#FFF9FB]/95 text-[#2A1621] hover:bg-[#A83264] hover:text-white transition-colors border border-[#EDD5E1] rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Sticky Gallery Column */}
        <div className="lg:w-1/2 bg-[#FCEEF4] relative flex flex-col justify-between min-h-[300px] lg:min-h-[580px] max-h-[360px] lg:max-h-[90vh]">
          <ResilientImage
            src={outfit.imageUrl}
            alt={outfit.title}
            fallbackLabel={outfit.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="p-4 bg-gradient-to-t from-[#2A1621]/85 via-[#2A1621]/45 to-transparent text-[#FFF9FB] absolute bottom-0 inset-x-0">
            <div className="flex items-center justify-between text-xs tracking-wide">
              <span>{outfit.fabric}</span>
              <span className="font-mono-num">
                {outfit.pieces.length}{' '}
                {outfit.pieces.length === 1 ? 'Piece Kurti' : 'Pieces Included'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Contiguous Purchase Module with Pinned Bottom Action Bar */}
        <div className="lg:w-1/2 flex flex-col justify-between max-h-[90vh] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
            {/* Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E4B5E] uppercase tracking-wider pr-8">
              <span>{outfit.category}</span>
              <span aria-hidden="true">·</span>
              <span>{outfit.statusTag}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{outfit.stockCount} pcs in stock</span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2
                id="pdp-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#2A1621] leading-tight"
              >
                {outfit.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E4B5E] mt-1 leading-relaxed">
                {outfit.subtitle}
              </p>
            </div>

            {/* Price readout in BDT */}
            <div className="py-3 border-y border-[#EDD5E1] flex items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-semibold text-[#A83264] font-mono-num">
                    ৳{outfit.priceBdt.toLocaleString()}
                  </span>
                  {savingsBdt > 0 && (
                    <span className="text-sm text-[#8F6B7E] line-through font-mono-num">
                      ৳{outfit.originalPriceBdt.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6E4B5E] mt-0.5">
                  {savingsBdt > 0
                    ? `Save ৳${savingsBdt.toLocaleString()} · Cash on Delivery across Bangladesh`
                    : 'Cash on Delivery across all 64 districts of Bangladesh'}
                </p>
              </div>
              <span className="text-xs text-[#6E4B5E] whitespace-nowrap shrink-0 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#A83264]" />
                Dhaka ৳70 · Outside ৳130
              </span>
            </div>

            {/* Included Pieces in the Kurti Outfit */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-[#6E4B5E] mb-1.5">
                Included in This Kurti Outfit ({outfit.lengthInches})
              </span>
              <div className="divide-y divide-[#EDD5E1] border border-[#EDD5E1] rounded-lg bg-white overflow-hidden">
                {outfit.pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="px-3.5 py-2.5 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium text-[#2A1621] flex items-center gap-1.5 truncate">
                        <span className="truncate">{piece.name}</span>
                        <span className="text-[#8F6B7E] shrink-0">
                          · {piece.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E4B5E] truncate">
                        {piece.fabric}
                      </p>
                    </div>
                    <span className="text-xs font-mono-num font-medium text-[#6E4B5E] shrink-0">
                      Included
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colorway & Size Controls */}
            <div className="space-y-3">
              <div className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#6E4B5E] mb-1.5 truncate whitespace-nowrap">
                  1. Shade: <strong className="text-[#2A1621]">{activeColorway}</strong>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {outfit.colorways.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColorway(color.name)}
                      aria-label={`Select shade ${color.name}`}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs border rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        activeColorway === color.name
                          ? 'border-[#A83264] bg-[#FCEEF4] font-medium text-[#2A1621]'
                          : 'border-[#EDD5E1] bg-white text-[#6E4B5E] hover:border-[#A83264]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#6E4B5E] whitespace-nowrap">
                    2. Chest Size: <strong className="text-[#2A1621]">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSizeGuide();
                    }}
                    className="text-xs text-[#A83264] underline hover:text-[#2A1621] flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>BD Size Calculator</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {outfit.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      aria-label={`Select size ${sz}`}
                      className={`py-2 px-2 text-xs font-medium border rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        selectedSize === sz
                          ? 'bg-[#A83264] text-white border-[#A83264]'
                          : 'bg-white text-[#2A1621] border-[#EDD5E1] hover:border-[#A83264]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Care & Occasion Note */}
            <div className="text-xs text-[#6E4B5E] space-y-1 pt-2 border-t border-[#EDD5E1]">
              <p>
                <strong className="text-[#2A1621]">Best For:</strong>{' '}
                {outfit.occasion}
              </p>
              <p>
                <strong className="text-[#2A1621]">Wash & Care:</strong>{' '}
                {outfit.careInstructions}
              </p>
            </div>
          </div>

          {/* Pinned Primary Purchase Action Footer */}
          <div className="shrink-0 px-6 sm:px-7 py-4 bg-white border-t border-[#EDD5E1] space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDirectCod}
                className="w-full py-3 px-4 bg-[#A83264] text-white hover:bg-[#8C2652] rounded-lg text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order COD Now — ৳{outfit.priceBdt.toLocaleString()}</span>
              </button>

              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-3 px-4 bg-[#FCEEF4] text-[#2A1621] border border-[#EDD5E1] hover:bg-[#F7E2EC] rounded-lg text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#A83264]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>+ Add to Shopping Bag</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6E4B5E]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A83264]" />
                100% Cash on Delivery · Check Before Paying
              </span>
              <span>Easy 7-Day Size Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
