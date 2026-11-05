import React, { useState } from 'react';
import { Layers, Ruler, Check, ShoppingBag } from 'lucide-react';
import {
  calculateCapsuleBundle,
  recommendGarmentSize,
  type CapsulePieceOption,
  type GarmentSize,
} from '../utils/commerceLogic';
import { CAPSULE_STYLER_OPTIONS } from '../data/outfitsData';

interface CapsuleStylerSectionProps {
  activeTab: 'styler' | 'sizing';
  onTabChange: (tab: 'styler' | 'sizing') => void;
  onAddCustomCapsuleToCart: (payload: {
    top: CapsulePieceOption;
    bottom: CapsulePieceOption;
    outerwear: CapsulePieceOption;
    size: GarmentSize;
    bundlePrice: number;
    individualSum: number;
  }) => void;
}

export const CapsuleStylerSection: React.FC<CapsuleStylerSectionProps> = ({
  activeTab,
  onTabChange,
  onAddCustomCapsuleToCart,
}) => {
  // Capsule Styler State
  const [selectedTop, setSelectedTop] = useState<CapsulePieceOption>(
    CAPSULE_STYLER_OPTIONS.tops[0]
  );
  const [selectedBottom, setSelectedBottom] = useState<CapsulePieceOption>(
    CAPSULE_STYLER_OPTIONS.bottoms[0]
  );
  const [selectedOuterwear, setSelectedOuterwear] =
    useState<CapsulePieceOption>(CAPSULE_STYLER_OPTIONS.outerwear[0]);
  const [capsuleSize, setCapsuleSize] = useState<GarmentSize>('S');
  const [capsuleAdded, setCapsuleAdded] = useState(false);

  // Size Calculator State
  const [bustCm, setBustCm] = useState<number>(87);
  const [waistCm, setWaistCm] = useState<number>(69);
  const [hipCm, setHipCm] = useState<number>(95);
  const [fitPref, setFitPref] = useState<'Tailored' | 'Signature' | 'Relaxed'>(
    'Signature'
  );

  const bundleMath = calculateCapsuleBundle(
    selectedTop,
    selectedBottom,
    selectedOuterwear
  );

  const sizeRecommendation = recommendGarmentSize(
    bustCm,
    waistCm,
    hipCm,
    fitPref
  );

  const handleAddCapsule = () => {
    onAddCustomCapsuleToCart({
      top: selectedTop,
      bottom: selectedBottom,
      outerwear: selectedOuterwear,
      size: capsuleSize,
      bundlePrice: bundleMath.bundlePrice,
      individualSum: bundleMath.individualSum,
    });
    setCapsuleAdded(true);
    setTimeout(() => setCapsuleAdded(false), 1500);
  };

  return (
    <section
      id="capsule-styler"
      className="py-16 sm:py-20 border-t border-[#E5E0D8] bg-[#F4F0EA]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Section Header with Interactive Mode Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E5E0D8]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E675F] mb-2">
              <span>02. Bespoke Wardrobe Architecture</span>
              <span aria-hidden="true">·</span>
              <span>12% Complete Set Reduction</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#181615] tracking-tight">
              Capsule Outfit Styler & Atelier Fit Studio
            </h2>
          </div>

          {/* Functional Segmented Tab Bar */}
          <div
            className="inline-flex items-center gap-1 p-1 bg-[#E5E0D8] self-start"
            role="tablist"
            aria-label="Atelier interactive tools"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'styler'}
              onClick={() => onTabChange('styler')}
              className={`px-4 py-2 text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'styler'
                  ? 'bg-[#181615] text-[#FAF8F5]'
                  : 'text-[#4A443F] hover:text-[#181615]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3-Piece Capsule Builder</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sizing'}
              onClick={() => onTabChange('sizing')}
              className={`px-4 py-2 text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'sizing'
                  ? 'bg-[#181615] text-[#FAF8F5]'
                  : 'text-[#4A443F] hover:text-[#181615]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Interactive Size & Fit Calculator</span>
            </button>
          </div>
        </div>

        {activeTab === 'styler' ? (
          <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: 3-Slot Garment Selector */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slot 1: Top & Knit */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] p-5">
                <div className="text-xs text-[#6E675F] uppercase tracking-wider mb-1">
                  Layer 01 · Base Top
                </div>
                <h3 className="text-sm font-semibold text-[#181615] mb-4">
                  Select Silk or Knit Top
                </h3>
                <div className="space-y-2.5">
                  {CAPSULE_STYLER_OPTIONS.tops.map((item) => {
                    const active = selectedTop.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedTop(item)}
                        className={`w-full text-left p-3 border transition-colors ${
                          active
                            ? 'border-[#181615] bg-white'
                            : 'border-[#E5E0D8] bg-[#FAF8F5] hover:border-[#A8A096]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#181615]">
                            {item.name}
                          </span>
                          <span className="text-xs font-mono-num text-[#181615] shrink-0">
                            ${item.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#6E675F]">
                          <span
                            className="w-2.5 h-2.5 border border-black/20 shrink-0"
                            style={{ backgroundColor: item.swatchHex }}
                          />
                          <span>{item.color}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.fabric}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot 2: Bottom & Skirt */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] p-5">
                <div className="text-xs text-[#6E675F] uppercase tracking-wider mb-1">
                  Layer 02 · Trousers or Skirt
                </div>
                <h3 className="text-sm font-semibold text-[#181615] mb-4">
                  Select Tailored Bottom
                </h3>
                <div className="space-y-2.5">
                  {CAPSULE_STYLER_OPTIONS.bottoms.map((item) => {
                    const active = selectedBottom.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBottom(item)}
                        className={`w-full text-left p-3 border transition-colors ${
                          active
                            ? 'border-[#181615] bg-white'
                            : 'border-[#E5E0D8] bg-[#FAF8F5] hover:border-[#A8A096]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#181615]">
                            {item.name}
                          </span>
                          <span className="text-xs font-mono-num text-[#181615] shrink-0">
                            ${item.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#6E675F]">
                          <span
                            className="w-2.5 h-2.5 border border-black/20 shrink-0"
                            style={{ backgroundColor: item.swatchHex }}
                          />
                          <span>{item.color}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.fabric}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot 3: Outerwear & Layer */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] p-5">
                <div className="text-xs text-[#6E675F] uppercase tracking-wider mb-1">
                  Layer 03 · Architectural Outer
                </div>
                <h3 className="text-sm font-semibold text-[#181615] mb-4">
                  Select Blazer, Trench or Wrap
                </h3>
                <div className="space-y-2.5">
                  {CAPSULE_STYLER_OPTIONS.outerwear.map((item) => {
                    const active = selectedOuterwear.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedOuterwear(item)}
                        className={`w-full text-left p-3 border transition-colors ${
                          active
                            ? 'border-[#181615] bg-white'
                            : 'border-[#E5E0D8] bg-[#FAF8F5] hover:border-[#A8A096]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#181615]">
                            {item.name}
                          </span>
                          <span className="text-xs font-mono-num text-[#181615] shrink-0">
                            ${item.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#6E675F]">
                          <span
                            className="w-2.5 h-2.5 border border-black/20 shrink-0"
                            style={{ backgroundColor: item.swatchHex }}
                          />
                          <span>{item.color}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.fabric}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Assembled Capsule Outfit Summary & Purchase */}
            <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#181615] p-6 space-y-5">
              <div>
                <div className="text-xs text-[#6E675F] uppercase tracking-wider">
                  Your Curated 3-Piece Ensemble
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#181615] mt-1">
                  Bespoke Capsule Pairing
                </h3>
              </div>

              {/* Color Harmony Swatch Bar */}
              <div className="flex items-center gap-3 p-3 bg-[#F4F0EA] border border-[#E5E0D8]">
                <div className="flex -space-x-1">
                  <span
                    className="w-6 h-6 border border-black/20"
                    style={{ backgroundColor: selectedTop.swatchHex }}
                    title={selectedTop.color}
                  />
                  <span
                    className="w-6 h-6 border border-black/20"
                    style={{ backgroundColor: selectedBottom.swatchHex }}
                    title={selectedBottom.color}
                  />
                  <span
                    className="w-6 h-6 border border-black/20"
                    style={{ backgroundColor: selectedOuterwear.swatchHex }}
                    title={selectedOuterwear.color}
                  />
                </div>
                <div className="text-xs text-[#4A443F]">
                  Palette: {selectedTop.color.split(' ')[0]} ·{' '}
                  {selectedBottom.color.split(' ')[0]} ·{' '}
                  {selectedOuterwear.color.split(' ')[0]}
                </div>
              </div>

              {/* Selected Pieces List */}
              <div className="divide-y divide-[#E5E0D8] text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[#6E675F] block">Top</span>
                    <span className="font-medium text-[#181615]">
                      {selectedTop.name}
                    </span>
                  </div>
                  <span className="font-mono-num text-[#181615]">
                    ${selectedTop.price}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[#6E675F] block">Bottom</span>
                    <span className="font-medium text-[#181615]">
                      {selectedBottom.name}
                    </span>
                  </div>
                  <span className="font-mono-num text-[#181615]">
                    ${selectedBottom.price}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[#6E675F] block">Outerwear</span>
                    <span className="font-medium text-[#181615]">
                      {selectedOuterwear.name}
                    </span>
                  </div>
                  <span className="font-mono-num text-[#181615]">
                    ${selectedOuterwear.price}
                  </span>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-[#57514A] mb-2">
                  Select Ensemble Size: <strong className="text-[#181615]">{capsuleSize}</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  {(['XS', 'S', 'M', 'L', 'XL'] as GarmentSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setCapsuleSize(sz)}
                      className={`flex-1 py-2 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        capsuleSize === sz
                          ? 'bg-[#181615] text-[#FAF8F5] border-[#181615]'
                          : 'bg-white text-[#181615] border-[#E5E0D8] hover:border-[#181615]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bundle Price Calculation */}
              <div className="pt-3 border-t border-[#E5E0D8] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6E675F]">
                  <span>Individual Garments Total</span>
                  <span className="font-mono-num line-through">
                    ${bundleMath.individualSum}
                  </span>
                </div>
                <div className="flex justify-between text-[#181615] font-medium">
                  <span>12% Complete Capsule Reduction</span>
                  <span className="font-mono-num">
                    -${bundleMath.savingsAmount}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#E5E0D8]">
                  <span className="text-sm font-semibold text-[#181615]">
                    Complete Capsule Price
                  </span>
                  <span className="text-xl font-semibold text-[#181615] font-mono-num">
                    ${bundleMath.bundlePrice}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCapsule}
                className="w-full py-3.5 px-5 bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27] text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                {capsuleAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Custom Capsule Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add 3-Piece Capsule — ${bundleMath.bundlePrice}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Size & Fit Calculator + Client Proof */
          <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#E5E0D8] p-6 sm:p-8 space-y-6">
              <div>
                <div className="text-xs text-[#6E675F] uppercase tracking-wider">
                  Italian Pattern Block Grading (XS – XL)
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#181615] mt-1">
                  Calculate Your Exact Maison Valéria Size
                </h3>
                <p className="text-xs text-[#57514A] mt-1">
                  Enter your body measurements in centimeters to receive your
                  tailored pattern recommendation across blazers, dresses, and
                  high-waisted trousers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="bust-input"
                    className="block text-xs font-medium text-[#181615] mb-1.5"
                  >
                    Bust Circumference:{' '}
                    <span className="font-mono-num font-semibold">
                      {bustCm} cm
                    </span>
                  </label>
                  <input
                    id="bust-input"
                    type="range"
                    min={76}
                    max={112}
                    value={bustCm}
                    onChange={(e) => setBustCm(Number(e.target.value))}
                    className="w-full accent-[#181615]"
                  />
                  <div className="flex justify-between text-[11px] text-[#787067] font-mono-num mt-1">
                    <span>76 cm</span>
                    <span>112 cm</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="waist-input"
                    className="block text-xs font-medium text-[#181615] mb-1.5"
                  >
                    Natural Waist:{' '}
                    <span className="font-mono-num font-semibold">
                      {waistCm} cm
                    </span>
                  </label>
                  <input
                    id="waist-input"
                    type="range"
                    min={58}
                    max={96}
                    value={waistCm}
                    onChange={(e) => setWaistCm(Number(e.target.value))}
                    className="w-full accent-[#181615]"
                  />
                  <div className="flex justify-between text-[11px] text-[#787067] font-mono-num mt-1">
                    <span>58 cm</span>
                    <span>96 cm</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hip-input"
                    className="block text-xs font-medium text-[#181615] mb-1.5"
                  >
                    Full Hip:{' '}
                    <span className="font-mono-num font-semibold">
                      {hipCm} cm
                    </span>
                  </label>
                  <input
                    id="hip-input"
                    type="range"
                    min={84}
                    max={120}
                    value={hipCm}
                    onChange={(e) => setHipCm(Number(e.target.value))}
                    className="w-full accent-[#181615]"
                  />
                  <div className="flex justify-between text-[11px] text-[#787067] font-mono-num mt-1">
                    <span>84 cm</span>
                    <span>120 cm</span>
                  </div>
                </div>
              </div>

              {/* Drape Preference */}
              <div>
                <span className="block text-xs font-medium text-[#181615] mb-2">
                  Preferred Silhouette Drape
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tailored', 'Signature', 'Relaxed'] as const).map(
                    (pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setFitPref(pref)}
                        className={`py-2 px-3 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                          fitPref === pref
                            ? 'bg-[#181615] text-[#FAF8F5] border-[#181615]'
                            : 'bg-white text-[#4A443F] border-[#E5E0D8] hover:border-[#181615]'
                        }`}
                      >
                        {pref} Fit
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Recommendation Readout */}
              <div className="p-5 bg-[#F4F0EA] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider text-[#6E675F]">
                    Recommended Pattern Size · {sizeRecommendation.fitConfidence}
                  </div>
                  <p className="text-xs text-[#4A443F] leading-relaxed max-w-md">
                    {sizeRecommendation.tailoringAdvice}
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className="block text-xs text-[#6E675F]">Size</span>
                  <span className="font-display text-4xl font-bold text-[#181615]">
                    {sizeRecommendation.recommendedSize}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Attributable Client Proof & Quantitative Craft Rigor */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] p-6 space-y-4">
                <div className="text-xs text-[#6E675F] uppercase tracking-wider">
                  Verified Client Fit & Provenance
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#E5E0D8]">
                  <div>
                    <div className="text-2xl font-semibold text-[#181615] font-mono-num">
                      97.4%
                    </div>
                    <div className="text-xs text-[#57514A] mt-0.5">
                      First-Try Fit Retention across 1,840 Complete Outfit Orders (Q1–Q3 2026)
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#181615] font-mono-num">
                      48 hrs
                    </div>
                    <div className="text-xs text-[#57514A] mt-0.5">
                      Insured Express Garment-Bag Dispatch from Milan & Paris
                    </div>
                  </div>
                </div>

                <blockquote className="space-y-3">
                  <p className="text-xs text-[#181615] leading-relaxed italic">
                    “Before ordering the Montaigne Espresso Wool Suit, I
                    struggled to find jackets that fit a 68cm waist without
                    pulling across the shoulders. Using the atelier pattern
                    guide in Size S, all three pieces arrived ready for our
                    annual partners summit in Geneva with zero alterations
                    needed.”
                  </p>
                  <footer className="text-xs text-[#6E675F]">
                    <strong className="text-[#181615] not-italic">
                      Claire Beauchamp
                    </strong>{' '}
                    · Managing Partner, Beauchamp & Associés Architecture, Lyon
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
