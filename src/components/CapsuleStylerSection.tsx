import React, { useState } from 'react';
import { Ruler, PackageSearch, Search } from 'lucide-react';
import {
  recommendKurtiSize,
  type OrderRecord,
} from '../utils/commerceLogic';
import { ResilientImage } from './ResilientImage';

interface CapsuleStylerSectionProps {
  activeTab: 'sizing' | 'tracker';
  onTabChange: (tab: 'sizing' | 'tracker') => void;
  orders: OrderRecord[];
}

export const CapsuleStylerSection: React.FC<CapsuleStylerSectionProps> = ({
  activeTab,
  onTabChange,
  orders,
}) => {
  // Size Calculator State (Bangladeshi Chest Measurement in Inches)
  const [chestInches, setChestInches] = useState<number>(38);
  const [fitPref, setFitPref] = useState<'Regular' | 'Relaxed'>('Regular');

  // Order Tracker Lookup State
  const [lookupQuery, setLookupQuery] = useState<string>('');

  const sizeRec = recommendKurtiSize(chestInches, fitPref);

  const matchedOrders = orders.filter((ord) => {
    const q = lookupQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.phone.toLowerCase().includes(q) ||
      ord.customerName.toLowerCase().includes(q)
    );
  });

  return (
    <section
      id="size-and-tracker"
      className="py-14 sm:py-18 border-t border-[#EDD5E1] bg-[#FCEEF4]/70"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Section Header with Interactive Mode Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#EDD5E1]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6E4B5E] mb-2">
              <span>02. Jaybor Customer Care & Fit Studio</span>
              <span aria-hidden="true">·</span>
              <span>All 64 Districts in Bangladesh</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2A1621] tracking-tight">
              BD Kurti Size Guide & Live Order Tracker
            </h2>
          </div>

          {/* Functional Segmented Tab Bar */}
          <div
            className="inline-flex items-center gap-1 p-1 bg-[#F7E2EC] border border-[#EDD5E1] rounded-lg self-start"
            role="tablist"
            aria-label="Jaybor customer utilities"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sizing'}
              onClick={() => onTabChange('sizing')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'sizing'
                  ? 'bg-[#A83264] text-white shadow-xs'
                  : 'text-[#5B2C44] hover:text-[#2A1621]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>BD Kurti Size Calculator</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tracker'}
              onClick={() => onTabChange('tracker')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'tracker'
                  ? 'bg-[#A83264] text-white shadow-xs'
                  : 'text-[#5B2C44] hover:text-[#2A1621]'
              }`}
            >
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Track COD Order ({orders.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'sizing' ? (
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Interactive Chest Size Calculator & Chart */}
            <div className="lg:col-span-7 bg-[#FFF9FB] border border-[#EDD5E1] rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <div className="text-xs text-[#6E4B5E] uppercase tracking-wider">
                  Bangladeshi Boutique Grading (36" to 44" Chest)
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#2A1621] mt-1">
                  Find Your Perfect Jaybor Kurti Size
                </h3>
                <p className="text-xs text-[#6E4B5E] mt-1">
                  Slide to select your chest/bust measurement in inches and
                  choose how airy you prefer your Kurti fit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <label
                    htmlFor="chest-inches-input"
                    className="block text-xs font-medium text-[#2A1621] mb-2"
                  >
                    Your Chest / Bust Measurement:{' '}
                    <span className="font-mono-num font-semibold text-[#A83264]">
                      {chestInches} inches
                    </span>
                  </label>
                  <input
                    id="chest-inches-input"
                    type="range"
                    min={34}
                    max={45}
                    value={chestInches}
                    onChange={(e) => setChestInches(Number(e.target.value))}
                    className="w-full accent-[#A83264]"
                  />
                  <div className="flex justify-between text-[11px] text-[#6E4B5E] font-mono-num mt-1">
                    <span>34 in</span>
                    <span>38 in</span>
                    <span>42 in</span>
                    <span>45 in</span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#2A1621] mb-2">
                    Preferred Comfort Fit
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Regular', 'Relaxed'] as const).map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setFitPref(pref)}
                        className={`py-2.5 px-3 text-xs font-medium border rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                          fitPref === pref
                            ? 'bg-[#A83264] text-white border-[#A83264]'
                            : 'bg-white text-[#5B2C44] border-[#EDD5E1] hover:border-[#A83264]'
                        }`}
                      >
                        {pref} Fit
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendation Readout */}
              <div className="p-5 bg-[#FCEEF4] border border-[#EDD5E1] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider text-[#A83264] font-semibold">
                    Recommended Jaybor Size · {sizeRec.lengthNote}
                  </div>
                  <p className="text-xs text-[#5B2C44] leading-relaxed max-w-md">
                    {sizeRec.fitAdvice}
                  </p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className="block text-xs text-[#6E4B5E]">
                    Select Size
                  </span>
                  <span className="font-display text-3xl font-bold text-[#2A1621] font-mono-num">
                    {sizeRec.recommendedSize}
                  </span>
                </div>
              </div>

              {/* Standard BD Kurti Measurement Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EDD5E1] text-[#6E4B5E]">
                      <th className="py-2 pr-4 font-medium">Jaybor Size</th>
                      <th className="py-2 px-4 font-medium">Chest (Inches)</th>
                      <th className="py-2 px-4 font-medium">Kurti Length</th>
                      <th className="py-2 pl-4 font-medium">Pant Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDD5E1] font-mono-num text-[#2A1621]">
                    <tr>
                      <td className="py-2 pr-4 font-semibold">S (36")</td>
                      <td className="py-2 px-4">36 in</td>
                      <td className="py-2 px-4">41 in</td>
                      <td className="py-2 pl-4">38 in</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">M (38")</td>
                      <td className="py-2 px-4">38 in</td>
                      <td className="py-2 px-4">42 in</td>
                      <td className="py-2 pl-4">38 in</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">L (40")</td>
                      <td className="py-2 px-4">40 in</td>
                      <td className="py-2 px-4">42 in</td>
                      <td className="py-2 pl-4">38.5 in</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">XL (42")</td>
                      <td className="py-2 px-4">42 in</td>
                      <td className="py-2 px-4">43 in</td>
                      <td className="py-2 pl-4">39 in</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">XXL (44")</td>
                      <td className="py-2 px-4">44 in</td>
                      <td className="py-2 px-4">43 in</td>
                      <td className="py-2 pl-4">39 in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 5 Cols: Customer Proof & Delivery Guarantee */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFF9FB] border border-[#EDD5E1] rounded-xl p-6 space-y-4">
                <div className="text-xs text-[#6E4B5E] uppercase tracking-wider">
                  Loved by Customers Across Bangladesh
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#EDD5E1]">
                  <div>
                    <div className="text-2xl font-semibold text-[#A83264] font-mono-num">
                      24–48 hrs
                    </div>
                    <div className="text-xs text-[#6E4B5E] mt-0.5">
                      Home Delivery Inside Dhaka (৳70) & 2–4 Days Nationwide (৳130)
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#A83264] font-mono-num">
                      100% COD
                    </div>
                    <div className="text-xs text-[#6E4B5E] mt-0.5">
                      No advance payment needed — inspect your Kurti on arrival
                    </div>
                  </div>
                </div>

                <blockquote className="space-y-3">
                  <p className="text-xs text-[#2A1621] leading-relaxed italic">
                    “Ordered the Pookie Strawberry Blush Chikankari Kurti Set in
                    Size M (38") for my university classes at North South
                    University. The cotton is super soft for Dhaka's weather,
                    the stitch quality is exact, and I paid Cash on Delivery the
                    next afternoon!”
                  </p>
                  <footer className="text-xs text-[#6E4B5E]">
                    <strong className="text-[#2A1621] not-italic">
                      Farzana Afrin Ritu
                    </strong>{' '}
                    · Bashundhara R/A, Dhaka · Verified COD Buyer
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        ) : (
          /* Live Order Tracker with Ordered Outfit Image & Customer Details */
          <div className="pt-8 space-y-6">
            <div className="bg-[#FFF9FB] border border-[#EDD5E1] rounded-xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[#2A1621]">
                    Track Your Cash on Delivery Order
                  </h3>
                  <p className="text-xs text-[#6E4B5E]">
                    Search by your 11-digit Bangladesh mobile number (e.g.
                    01712345678), Order ID (e.g. JB-2041), or Customer Name.
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-[#8F6B7E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    aria-label="Search order by phone number or order ID"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Enter phone (017...) or JB-2041"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] focus:outline-none focus:border-[#A83264]"
                  />
                </div>
              </div>

              {matchedOrders.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#6E4B5E]">
                  No Cash on Delivery orders found matching "{lookupQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-white border border-[#EDD5E1] rounded-xl flex gap-4 items-start"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#FCEEF4] border border-[#EDD5E1] shrink-0">
                        <ResilientImage
                          src={ord.primaryOutfitImage}
                          alt={ord.primaryOutfitTitle}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-mono-num font-semibold text-[#A83264]">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] font-medium text-[#2A1621]">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#2A1621] truncate">
                          {ord.primaryOutfitTitle}
                        </div>
                        <div className="text-[11px] text-[#6E4B5E]">
                          Customer: <strong className="text-[#2A1621]">{ord.customerName}</strong> ·{' '}
                          <span className="font-mono-num">{ord.phone}</span>
                        </div>
                        <div className="text-[11px] text-[#6E4B5E] truncate">
                          Address: {ord.address}, {ord.district} ({ord.deliveryZone})
                        </div>
                        <div className="pt-1 flex items-center justify-between text-xs border-t border-[#FCEEF4]">
                          <span className="text-[#6E4B5E]">
                            Cash on Delivery Total
                          </span>
                          <span className="font-mono-num font-semibold text-[#2A1621]">
                            ৳{ord.totalBdt.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
