import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  Truck,
  Tag,
} from 'lucide-react';
import {
  calculateCartSummary,
  validateCheckoutInput,
  FREE_DELIVERY_THRESHOLD_BDT,
  INSIDE_DHAKA_FEE_BDT,
  OUTSIDE_DHAKA_FEE_BDT,
  type CartItem,
  type CustomerCheckoutInput,
  type DeliveryZone,
  type OrderRecord,
} from '../utils/commerceLogic';
import { ResilientImage } from './ResilientImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  initialStep?: 'bag' | 'checkout';
  onClose: () => void;
  cartItems: CartItem[];
  currentUserUid: string | null;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCompleteOrder: (order: OrderRecord) => Promise<void>;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  initialStep = 'bag',
  onClose,
  cartItems,
  currentUserUid,
  onUpdateQuantity,
  onRemoveItem,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>(
    initialStep
  );
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );

  const [customer, setCustomer] = useState<CustomerCheckoutInput>({
    fullName: '',
    phone: '',
    district: '',
    address: '',
    deliveryZone: 'Inside Dhaka',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CustomerCheckoutInput, string>>
  >({});

  useEffect(() => {
    if (isOpen && step !== 'confirmed') {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const summary = calculateCartSummary(
    cartItems,
    appliedPromo,
    customer.deliveryZone
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedPromo(promoInput.trim().toUpperCase());
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutInput(customer);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const orderNum = `JB-${Math.floor(
      2045 + ((cartItems.length * 29 + summary.totalBdt) % 7900)
    )}`;
    const primaryItem = cartItems[0];
    const primaryOutfitTitle = cartItems
      .map((i) => `${i.title} (${i.size} ×${i.quantity})`)
      .join(' + ')
      .slice(0, 290);

    const itemSummaryList = cartItems
      .slice(0, 10)
      .map(
        (i) =>
          `${i.title} · Size ${i.size} · Qty ${i.quantity} · ৳${(
            i.unitPriceBdt * i.quantity
          ).toLocaleString()}`
      );

    const newOrder: OrderRecord = {
      id: `order-${orderNum.toLowerCase()}-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: '2026-11-05 · Just Now (BD Time)',
      customerUid: currentUserUid || 'guest-bd-customer',
      customerName: customer.fullName.trim(),
      phone: customer.phone.replace(/[\s-]/g, ''),
      district: customer.district.trim(),
      address: customer.address.trim(),
      deliveryZone: customer.deliveryZone,
      paymentMethod: 'Cash on Delivery',
      primaryOutfitTitle: primaryOutfitTitle || 'Jaybor Kurti Outfit',
      primaryOutfitImage:
        primaryItem?.imageUrl ||
        '/src/assets/images/kurti_blush_cotton_daily_1793898467065.jpg',
      itemSummaryList,
      items: [...cartItems],
      totalQuantity: summary.itemCount,
      subtotalBdt: summary.subtotalBdt,
      savingsBdt: summary.bundleSavingsBdt,
      discountBdt: summary.promoDiscountBdt,
      deliveryFeeBdt: summary.deliveryFeeBdt,
      totalBdt: summary.totalBdt,
      promoCodeApplied: summary.promoCodeValid ? appliedPromo : null,
      status: 'Pending Call Verification',
    };

    try {
      await onCompleteOrder(newOrder);
      setConfirmedOrder(newOrder);
      setStep('confirmed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('bag');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#2A1621]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-bag-title"
    >
      <div className="w-full max-w-lg bg-[#FFF9FB] h-full flex flex-col justify-between border-l border-[#EDD5E1] shadow-2xl overflow-hidden">
        {/* Top Drawer Bar */}
        <div className="px-6 py-5 border-b border-[#EDD5E1] flex items-center justify-between bg-white">
          <div>
            <h2
              id="shopping-bag-title"
              className="font-display text-2xl font-semibold text-[#2A1621]"
            >
              {step === 'bag' && `Your Kurti Bag (${summary.itemCount})`}
              {step === 'checkout' && 'Cash on Delivery (Bangladesh)'}
              {step === 'confirmed' && 'Order Placed Successfully'}
            </h2>
            <p className="text-xs text-[#6E4B5E]">
              {step === 'bag' &&
                (summary.amountToFreeDeliveryBdt === 0
                  ? 'Free Home Delivery unlocked across Bangladesh!'
                  : `Add ৳${summary.amountToFreeDeliveryBdt.toLocaleString()} more for Free Delivery (Free over ৳${FREE_DELIVERY_THRESHOLD_BDT.toLocaleString()})`)}
              {step === 'checkout' &&
                'No advance payment needed · Pay cash when your Kurti arrives'}
              {step === 'confirmed' &&
                `Order #${confirmedOrder?.orderNumber} saved to Jaybor Database`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 flex items-center justify-center border border-[#EDD5E1] rounded-lg text-[#2A1621] hover:bg-[#A83264] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 'bag' && (
            <>
              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <p className="font-display text-2xl text-[#2A1621]">
                    Your Kurti bag is empty.
                  </p>
                  <p className="text-xs text-[#6E4B5E] max-w-xs mx-auto leading-relaxed">
                    Browse our pastel cotton, handloom muslin, and festive
                    3-piece Kurtis with Cash on Delivery across Bangladesh.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#A83264] text-white rounded-lg text-xs font-medium uppercase tracking-wider hover:bg-[#8C2652] transition-colors whitespace-nowrap shrink-0"
                  >
                    Browse Jaybor Kurtis
                  </button>
                </div>
              ) : (
                <>
                  {/* Delivery Zone Selector right in Bag for transparent BDT calculation */}
                  <div className="p-3.5 bg-[#FCEEF4] border border-[#EDD5E1] rounded-xl space-y-2">
                    <span className="block text-xs font-medium text-[#2A1621]">
                      Select Delivery Zone in Bangladesh:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {
                            zone: 'Inside Dhaka' as DeliveryZone,
                            label: `Inside Dhaka (৳${INSIDE_DHAKA_FEE_BDT})`,
                          },
                          {
                            zone: 'Outside Dhaka' as DeliveryZone,
                            label: `Outside Dhaka (৳${OUTSIDE_DHAKA_FEE_BDT})`,
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.zone}
                          type="button"
                          onClick={() =>
                            setCustomer({
                              ...customer,
                              deliveryZone: opt.zone,
                            })
                          }
                          className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                            customer.deliveryZone === opt.zone
                              ? 'bg-[#A83264] text-white border-[#A83264]'
                              : 'bg-white text-[#5B2C44] border-[#EDD5E1] hover:border-[#A83264]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Itemized Kurti List */}
                  <div className="divide-y divide-[#EDD5E1] border-y border-[#EDD5E1]">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="py-4 flex gap-4 items-start"
                      >
                        <div className="w-20 h-24 bg-[#FCEEF4] rounded-lg shrink-0 overflow-hidden border border-[#EDD5E1]">
                          <ResilientImage
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-semibold text-[#2A1621] leading-snug">
                              {item.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.cartItemId)}
                              aria-label={`Remove ${item.title}`}
                              className="text-[#8F6B7E] hover:text-[#991B1B] transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-[#6E4B5E] mt-1 space-y-0.5">
                            <div>{item.category}</div>
                            <div>
                              Size:{' '}
                              <strong className="text-[#2A1621]">
                                {item.size}
                              </strong>{' '}
                              · Shade: {item.colorway}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center border border-[#EDD5E1] rounded-md bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.cartItemId, -1)
                                }
                                aria-label={`Decrease quantity of ${item.title}`}
                                className="w-7 h-7 flex items-center justify-center text-[#2A1621] hover:bg-[#FCEEF4]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-mono-num font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.cartItemId, 1)
                                }
                                aria-label={`Increase quantity of ${item.title}`}
                                className="w-7 h-7 flex items-center justify-center text-[#2A1621] hover:bg-[#FCEEF4]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-mono-num font-semibold text-[#A83264]">
                                ৳
                                {(
                                  item.unitPriceBdt * item.quantity
                                ).toLocaleString()}
                              </span>
                              {item.originalUnitPriceBdt >
                                item.unitPriceBdt && (
                                <span className="block text-[11px] font-mono-num text-[#8F6B7E] line-through">
                                  ৳
                                  {(
                                    item.originalUnitPriceBdt * item.quantity
                                  ).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label
                      htmlFor="promo-code-input"
                      className="block text-xs font-medium text-[#6E4B5E]"
                    >
                      Jaybor Promo Code (Try{' '}
                      <span className="font-mono-num font-semibold text-[#A83264]">
                        JAYBOR10
                      </span>{' '}
                      for 10% off)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[#8F6B7E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="promo-code-input"
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="JAYBOR10"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] focus:outline-none focus:border-[#A83264]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-medium bg-[#FCEEF4] text-[#2A1621] border border-[#EDD5E1] rounded-lg hover:bg-[#A83264] hover:text-white transition-colors whitespace-nowrap shrink-0"
                      >
                        Apply Code
                      </button>
                    </div>
                    {summary.promoMessage && (
                      <p
                        className={`text-xs ${
                          summary.promoCodeValid
                            ? 'text-[#A83264] font-medium'
                            : 'text-[#991B1B]'
                        }`}
                      >
                        {summary.promoMessage}
                      </p>
                    )}
                  </form>
                </>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form
              id="checkout-verification-form"
              onSubmit={handlePlaceOrder}
              className="space-y-4"
              noValidate
            >
              <div className="p-3.5 bg-[#FCEEF4] border border-[#EDD5E1] rounded-xl text-xs text-[#5B2C44] flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#A83264] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2A1621] block">
                    100% Cash on Delivery Across Bangladesh
                  </strong>
                  Pay <strong>৳{summary.totalBdt.toLocaleString()}</strong> in
                  cash to the Steadfast / Pathao delivery rider when you receive
                  your Kurti package.
                </div>
              </div>

              {/* Delivery Zone Switcher */}
              <div>
                <span className="block text-xs font-medium text-[#2A1621] mb-1.5">
                  Delivery Area *
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCustomer({ ...customer, deliveryZone: 'Inside Dhaka' })
                    }
                    className={`p-2.5 text-left border rounded-lg text-xs transition-colors ${
                      customer.deliveryZone === 'Inside Dhaka'
                        ? 'border-[#A83264] bg-[#FCEEF4] font-semibold text-[#2A1621]'
                        : 'border-[#EDD5E1] bg-white text-[#6E4B5E]'
                    }`}
                  >
                    <div>Inside Dhaka City</div>
                    <div className="text-[11px] font-normal text-[#6E4B5E] font-mono-num">
                      Charge: ৳{INSIDE_DHAKA_FEE_BDT} (24–48 hrs)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCustomer({
                        ...customer,
                        deliveryZone: 'Outside Dhaka',
                      })
                    }
                    className={`p-2.5 text-left border rounded-lg text-xs transition-colors ${
                      customer.deliveryZone === 'Outside Dhaka'
                        ? 'border-[#A83264] bg-[#FCEEF4] font-semibold text-[#2A1621]'
                        : 'border-[#EDD5E1] bg-white text-[#6E4B5E]'
                    }`}
                  >
                    <div>Outside Dhaka (All BD)</div>
                    <div className="text-[11px] font-normal text-[#6E4B5E] font-mono-num">
                      Charge: ৳{OUTSIDE_DHAKA_FEE_BDT} (2–4 days)
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-fullname"
                  className="block text-xs font-medium text-[#2A1621] mb-1"
                >
                  Customer Full Name *
                </label>
                <input
                  id="checkout-fullname"
                  type="text"
                  value={customer.fullName}
                  onChange={(e) =>
                    setCustomer({ ...customer, fullName: e.target.value })
                  }
                  placeholder="Nusrat Jahan Mim"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] focus:outline-none focus:border-[#A83264]"
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-[#991B1B] mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    BD Mobile Number (11 Digits) *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    placeholder="01712345678"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] font-mono-num focus:outline-none focus:border-[#A83264]"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-[#991B1B] mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-district"
                    className="block text-xs font-medium text-[#2A1621] mb-1"
                  >
                    District / Thana *
                  </label>
                  <input
                    id="checkout-district"
                    type="text"
                    value={customer.district}
                    onChange={(e) =>
                      setCustomer({ ...customer, district: e.target.value })
                    }
                    placeholder="Dhanmondi, Dhaka"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] focus:outline-none focus:border-[#A83264]"
                  />
                  {formErrors.district && (
                    <p className="text-[11px] text-[#991B1B] mt-1">
                      {formErrors.district}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-[#2A1621] mb-1"
                >
                  Full Delivery Address (House, Road, Area) *
                </label>
                <textarea
                  id="checkout-address"
                  rows={2}
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="House 14, Road 7A, Dhanmondi R/A, Dhaka"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EDD5E1] rounded-lg text-[#2A1621] focus:outline-none focus:border-[#A83264]"
                />
                {formErrors.address && (
                  <p className="text-[11px] text-[#991B1B] mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-5 py-2">
              <div className="p-5 bg-white border border-[#A83264] rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#A83264] text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Order #{confirmedOrder.orderNumber} Confirmed — Cash on
                    Delivery
                  </span>
                </div>
                <p className="text-xs text-[#5B2C44] leading-relaxed">
                  Dhonnobad,{' '}
                  <strong className="text-[#2A1621]">
                    {confirmedOrder.customerName}
                  </strong>
                  ! Your Kurti order and outfit image details have been recorded
                  in the Jaybor Database. Our team will call{' '}
                  <strong className="text-[#2A1621] font-mono-num">
                    {confirmedOrder.phone}
                  </strong>{' '}
                  before dispatching to{' '}
                  <strong className="text-[#2A1621]">
                    {confirmedOrder.address}, {confirmedOrder.district}
                  </strong>
                  .
                </p>
                <div className="pt-2 border-t border-[#EDD5E1] flex justify-between text-xs text-[#6E4B5E]">
                  <span>Payment: Cash on Delivery ({confirmedOrder.deliveryZone})</span>
                  <span className="font-mono-num font-semibold text-[#A83264]">
                    Payable: ৳{confirmedOrder.totalBdt.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6E4B5E]">
                  Ordered Kurti & Customer Details
                </h3>
                <div className="divide-y divide-[#EDD5E1] border border-[#EDD5E1] rounded-xl bg-white p-3">
                  {confirmedOrder.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="py-2.5 flex gap-3 items-center text-xs"
                    >
                      <div className="w-12 h-14 rounded-md overflow-hidden bg-[#FCEEF4] border border-[#EDD5E1] shrink-0">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-[#2A1621] block truncate">
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-[#6E4B5E]">
                          Size {item.size} · {item.colorway} · Qty{' '}
                          {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono-num font-semibold text-[#2A1621]">
                        ৳{(item.unitPriceBdt * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Totals & Primary CTA */}
        {cartItems.length > 0 && step !== 'confirmed' && (
          <div className="p-6 bg-white border-t border-[#EDD5E1] space-y-4">
            <div className="space-y-1.5 text-xs">
              {summary.bundleSavingsBdt > 0 && (
                <div className="flex justify-between text-[#A83264] font-medium">
                  <span>Jaybor Kurti Offer Savings</span>
                  <span className="font-mono-num">
                    -৳{summary.bundleSavingsBdt.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#6E4B5E]">
                <span>Kurti Subtotal</span>
                <span className="font-mono-num">
                  ৳{summary.subtotalBdt.toLocaleString()}
                </span>
              </div>
              {summary.promoDiscountBdt > 0 && (
                <div className="flex justify-between text-[#A83264] font-medium">
                  <span>Promo Discount ({appliedPromo})</span>
                  <span className="font-mono-num">
                    -৳{summary.promoDiscountBdt.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#6E4B5E]">
                <span>Courier Charge ({customer.deliveryZone})</span>
                <span className="font-mono-num">
                  {summary.deliveryFeeBdt === 0
                    ? 'Free'
                    : `৳${summary.deliveryFeeBdt}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#EDD5E1]">
                <span className="text-sm font-semibold text-[#2A1621]">
                  Total Cash on Delivery
                </span>
                <span className="text-xl font-semibold text-[#A83264] font-mono-num">
                  ৳{summary.totalBdt.toLocaleString()}
                </span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 bg-[#A83264] text-white hover:bg-[#8C2652] rounded-lg text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Order Cash on Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="px-4 py-3.5 border border-[#EDD5E1] rounded-lg text-xs font-medium text-[#2A1621] hover:bg-[#FCEEF4] transition-colors whitespace-nowrap shrink-0"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  form="checkout-verification-form"
                  className="flex-1 py-3.5 px-6 bg-[#A83264] text-white hover:bg-[#8C2652] disabled:opacity-60 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                >
                  {isSubmitting
                    ? 'Saving Order...'
                    : `Confirm COD Order (৳${summary.totalBdt.toLocaleString()})`}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 bg-white border-t border-[#EDD5E1]">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3.5 px-6 bg-[#A83264] text-white hover:bg-[#8C2652] rounded-lg text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
            >
              Continue Shopping on Jaybor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
