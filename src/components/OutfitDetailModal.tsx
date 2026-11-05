import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Ruler } from 'lucide-react';
import type {
  OutfitProduct,
  GarmentSize,
  OutfitPiece,
} from '../utils/commerceLogic';
import { ResilientImage } from './ResilientImage';

interface OutfitDetailModalProps {
  outfit: OutfitProduct | null;
  onClose: () => void;
  onAddToCart: (payload: {
    outfit: OutfitProduct;
    purchaseType: 'Complete Outfit Set' | 'Individual Piece';
    selectedPiece?: OutfitPiece;
    size: GarmentSize;
    colorway: string;
  }) => void;
  onOpenSizeGuide: () => void;
}

export const OutfitDetailModal: React.FC<OutfitDetailModalProps> = ({
  outfit,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  const [purchaseMode, setPurchaseMode] = useState<
    'Complete Outfit Set' | 'Individual Piece'
  >('Complete Outfit Set');
  const [selectedPieceId, setSelectedPieceId] = useState<string>(
    outfit?.pieces[0]?.id || ''
  );
  const [selectedSize, setSelectedSize] = useState<GarmentSize>('S');
  const [selectedColorway, setSelectedColorway] = useState<string>(
    outfit?.colorways[0]?.name || ''
  );
  const [justAdded, setJustAdded] = useState(false);

  if (!outfit) return null;

  const activeColorway =
    selectedColorway || outfit.colorways[0]?.name || 'Signature';
  const activePiece =
    outfit.pieces.find((p) => p.id === selectedPieceId) || outfit.pieces[0];

  const bundleSavings = outfit.individualTotal - outfit.completePrice;
  const activePrice =
    purchaseMode === 'Complete Outfit Set'
      ? outfit.completePrice
      : activePiece?.price || outfit.completePrice;

  const handleAdd = () => {
    onAddToCart({
      outfit,
      purchaseType: purchaseMode,
      selectedPiece:
        purchaseMode === 'Individual Piece' ? activePiece : undefined,
      size: selectedSize,
      colorway: activeColorway,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] border border-[#E5E0D8] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col lg:flex-row">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close outfit details"
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-[#FAF8F5]/95 text-[#181615] hover:bg-[#181615] hover:text-[#FAF8F5] transition-colors border border-[#E5E0D8]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Sticky Gallery Column */}
        <div className="lg:w-1/2 bg-[#F0ECE3] relative flex flex-col justify-between min-h-[300px] lg:min-h-[580px] max-h-[360px] lg:max-h-[90vh]">
          <ResilientImage
            src={outfit.imageUrl}
            alt={outfit.title}
            fallbackLabel={outfit.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="p-4 bg-gradient-to-t from-black/75 via-black/40 to-transparent text-[#FAF8F5] absolute bottom-0 inset-x-0">
            <div className="flex items-center justify-between text-xs tracking-wide">
              <span>{outfit.fabricOrigin}</span>
              <span className="font-mono-num">
                {outfit.pieces.length} Coordinated Garments
              </span>
            </div>
          </div>
        </div>

        {/* Right Contiguous Purchase Module with Pinned Bottom Action Bar */}
        <div className="lg:w-1/2 flex flex-col justify-between max-h-[90vh] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
            {/* Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E675F] uppercase tracking-wider pr-8">
              <span>{outfit.category}</span>
              <span aria-hidden="true">·</span>
              <span>{outfit.statusTag}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{outfit.stockCount} sets in atelier</span>
            </div>

            {/* Title & Contiguous Pricing */}
            <div>
              <h2
                id="pdp-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#181615] leading-tight"
              >
                {outfit.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#57514A] mt-1 leading-relaxed">
                {outfit.subtitle}
              </p>
            </div>

            {/* Price readout */}
            <div className="py-3 border-y border-[#E5E0D8] flex items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-semibold text-[#181615] font-mono-num">
                    ${activePrice}
                  </span>
                  {purchaseMode === 'Complete Outfit Set' && (
                    <span className="text-sm text-[#787067] line-through font-mono-num">
                      ${outfit.individualTotal}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6E675F] mt-0.5">
                  {purchaseMode === 'Complete Outfit Set'
                    ? `Complete ${outfit.pieces.length}-piece styled look · Save $${bundleSavings} vs. separates`
                    : `Single garment selection · ${activePiece?.fabric}`}
                </p>
              </div>
              <span className="text-xs text-[#57514A] whitespace-nowrap shrink-0">
                Free Express Courier
              </span>
            </div>

            {/* Purchase Mode Switcher (Segmented Functional Control) */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#57514A] mb-1.5">
                1. Choose Purchase Option
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFECE6] border border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setPurchaseMode('Complete Outfit Set')}
                  className={`py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    purchaseMode === 'Complete Outfit Set'
                      ? 'bg-[#181615] text-[#FAF8F5]'
                      : 'text-[#57514A] hover:text-[#181615]'
                  }`}
                >
                  Complete Look (${outfit.completePrice})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseMode('Individual Piece');
                    if (!selectedPieceId && outfit.pieces[0]) {
                      setSelectedPieceId(outfit.pieces[0].id);
                    }
                  }}
                  className={`py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    purchaseMode === 'Individual Piece'
                      ? 'bg-[#181615] text-[#FAF8F5]'
                      : 'text-[#57514A] hover:text-[#181615]'
                  }`}
                >
                  Individual Pieces
                </button>
              </div>
            </div>

            {/* Garment Breakdown / Piece Selector */}
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-[#57514A] mb-1.5">
                {purchaseMode === 'Complete Outfit Set'
                  ? 'Included Garments in This Outfit'
                  : 'Select Individual Garment to Purchase'}
              </span>
              <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] bg-white">
                {outfit.pieces.map((piece) => {
                  const isSelected =
                    purchaseMode === 'Complete Outfit Set' ||
                    piece.id === activePiece?.id;
                  return (
                    <button
                      key={piece.id}
                      type="button"
                      onClick={() => {
                        setPurchaseMode('Individual Piece');
                        setSelectedPieceId(piece.id);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#FAF8F5] text-[#181615]'
                          : 'text-[#6E675F] hover:bg-[#FAF8F5]/60'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-medium text-[#181615] flex items-center gap-1.5 truncate">
                          <span className="truncate">{piece.name}</span>
                          <span className="text-[#787067] shrink-0">· {piece.role}</span>
                        </div>
                        <p className="text-[11px] text-[#6E675F] truncate">
                          {piece.fabric}
                        </p>
                      </div>
                      <span className="text-xs font-mono-num font-medium text-[#181615] shrink-0">
                        ${piece.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colorway & Size Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#57514A] mb-1.5 truncate whitespace-nowrap">
                  2. Color: <strong className="text-[#181615]">{activeColorway}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {outfit.colorways.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColorway(color.name)}
                      aria-label={`Select colorway ${color.name}`}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-colors whitespace-nowrap shrink-0 ${
                        activeColorway === color.name
                          ? 'border-[#181615] bg-white font-medium text-[#181615]'
                          : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#6E675F] hover:border-[#787067]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#57514A] whitespace-nowrap">
                    3. Size: <strong className="text-[#181615]">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSizeGuide();
                    }}
                    className="text-xs text-[#181615] underline hover:text-[#6E675F] flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Fit Guide</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {outfit.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      aria-label={`Select size ${sz}`}
                      className={`w-9 h-8 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        selectedSize === sz
                          ? 'bg-[#181615] text-[#FAF8F5] border-[#181615]'
                          : 'bg-white text-[#181615] border-[#E5E0D8] hover:border-[#181615]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Care & Fit Note */}
            <div className="text-xs text-[#6E675F] space-y-1 pt-2 border-t border-[#E5E0D8]">
              <p>
                <strong className="text-[#181615]">Fit & Silhouette:</strong>{' '}
                {outfit.modelFitNote}
              </p>
              <p>
                <strong className="text-[#181615]">Garment Care:</strong>{' '}
                {outfit.careInstructions}
              </p>
            </div>
          </div>

          {/* Pinned Primary Purchase Action Footer */}
          <div className="shrink-0 px-6 sm:px-7 py-4 bg-white border-t border-[#E5E0D8] space-y-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-3.5 px-6 bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27] text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {purchaseMode === 'Complete Outfit Set'
                      ? `Add Complete Outfit Set — $${outfit.completePrice}`
                      : `Add ${activePiece?.name} — $${activePiece?.price}`}
                  </span>
                </>
              )}
            </button>
            <div className="flex items-center justify-between text-[11px] text-[#6E675F]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#181615]" />
                Cash on Delivery & Card Accepted
              </span>
              <span>Complimentary 14-Day Atelier Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
