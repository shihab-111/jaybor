import React, { useState } from 'react';
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
  FREE_SHIPPING_THRESHOLD,
  type CartItem,
  type CustomerCheckoutInput,
  type OrderRecord,
} from '../utils/commerceLogic';
import { ResilientImage } from './ResilientImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCompleteOrder: (order: OrderRecord) => void;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );

  const [customer, setCustomer] = useState<CustomerCheckoutInput>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'COD',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CustomerCheckoutInput, string>>
  >({});

  if (!isOpen) return null;

  const summary = calculateCartSummary(cartItems, appliedPromo);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedPromo(promoInput.trim().toUpperCase());
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutInput(customer);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    const newOrder: OrderRecord = {
      orderId: `MV-${Math.floor(1050 + (cartItems.length * 17 + summary.total) % 8900)}`,
      createdAt: '2026-11-05 · Just Now',
      customer: { ...customer },
      items: [...cartItems],
      subtotal: summary.subtotal,
      bundleSavings: summary.bundleSavings,
      promoDiscount: summary.promoDiscount,
      shippingFee: summary.shippingFee,
      total: summary.total,
      promoCodeApplied: summary.promoCodeValid ? appliedPromo : null,
      status: 'Confirmed — Preparing Shipment',
    };

    setConfirmedOrder(newOrder);
    onCompleteOrder(newOrder);
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('bag');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-bag-title"
    >
      <div className="w-full max-w-lg bg-[#FAF8F5] h-full flex flex-col justify-between border-l border-[#E5E0D8] shadow-2xl overflow-hidden">
        {/* Top Drawer Bar */}
        <div className="px-6 py-5 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div>
            <h2
              id="shopping-bag-title"
              className="font-display text-2xl font-semibold text-[#181615]"
            >
              {step === 'bag' && `Shopping Bag (${summary.itemCount})`}
              {step === 'checkout' && 'Atelier Dispatch & Verification'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
            <p className="text-xs text-[#6E675F]">
              {step === 'bag' &&
                (summary.amountToFreeShipping === 0
                  ? 'Complimentary insured courier delivery unlocked'
                  : `Add $${summary.amountToFreeShipping} more for complimentary express delivery (Free over $${FREE_SHIPPING_THRESHOLD})`)}
              {step === 'checkout' &&
                'Cash on Delivery (COD) and direct card settlement supported'}
              {step === 'confirmed' &&
                `Reference ${confirmedOrder?.orderId} · Garment inspection scheduled`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 flex items-center justify-center border border-[#E5E0D8] text-[#181615] hover:bg-[#181615] hover:text-[#FAF8F5] transition-colors"
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
                  <p className="font-display text-2xl text-[#181615]">
                    Your shopping bag is currently empty.
                  </p>
                  <p className="text-xs text-[#6E675F] max-w-xs mx-auto leading-relaxed">
                    Explore our curated multi-piece female outfits or compose a
                    custom 3-piece wardrobe in the Capsule Styler for a 12% set
                    reduction.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#181615] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-[#2E2A27] transition-colors whitespace-nowrap shrink-0"
                  >
                    Explore Outfits Collection
                  </button>
                </div>
              ) : (
                <>
                  {/* Itemized List */}
                  <div className="divide-y divide-[#E5E0D8] border-y border-[#E5E0D8]">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="py-4 flex gap-4 items-start"
                      >
                        <div className="w-20 h-24 bg-[#EFECE6] shrink-0 overflow-hidden border border-[#E5E0D8]">
                          <ResilientImage
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-semibold text-[#181615] leading-snug">
                              {item.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.cartItemId)}
                              aria-label={`Remove ${item.title}`}
                              className="text-[#787067] hover:text-[#991B1B] transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-[#6E675F] mt-1 space-y-0.5">
                            <div>
                              {item.purchaseType}
                              {item.pieceName ? ` · ${item.pieceName}` : ''}
                            </div>
                            <div>
                              Size: <strong className="text-[#181615]">{item.size}</strong> · Color:{' '}
                              {item.colorway}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center border border-[#E5E0D8] bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateQuantity(item.cartItemId, -1)
                                }
                                aria-label={`Decrease quantity of ${item.title}`}
                                className="w-7 h-7 flex items-center justify-center text-[#181615] hover:bg-[#F4F0EA]"
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
                                className="w-7 h-7 flex items-center justify-center text-[#181615] hover:bg-[#F4F0EA]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-mono-num font-semibold text-[#181615]">
                                ${item.unitPrice * item.quantity}
                              </span>
                              {item.originalUnitPrice > item.unitPrice && (
                                <span className="block text-[11px] font-mono-num text-[#787067] line-through">
                                  ${item.originalUnitPrice * item.quantity}
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
                      className="block text-xs font-medium text-[#57514A]"
                    >
                      Private Client Code (Try <span className="font-mono-num font-semibold text-[#181615]">ATELIER15</span> for 15% off)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[#787067] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="promo-code-input"
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="ATELIER15"
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-medium bg-[#EFECE6] text-[#181615] border border-[#E5E0D8] hover:bg-[#181615] hover:text-[#FAF8F5] transition-colors whitespace-nowrap shrink-0"
                      >
                        Apply Code
                      </button>
                    </div>
                    {summary.promoMessage && (
                      <p
                        className={`text-xs ${
                          summary.promoCodeValid
                            ? 'text-[#0E4D3B]'
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
              <div className="p-3.5 bg-[#F4F0EA] border border-[#E5E0D8] text-xs text-[#4A443F] flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#181615] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#181615] block">
                    Express Garment-on-Hanger Courier
                  </strong>
                  Orders over ${FREE_SHIPPING_THRESHOLD} ship free. Cash on
                  Delivery (COD) orders are verified by phone prior to dispatch.
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-fullname"
                  className="block text-xs font-medium text-[#181615] mb-1"
                >
                  Recipient Full Name *
                </label>
                <input
                  id="checkout-fullname"
                  type="text"
                  value={customer.fullName}
                  onChange={(e) =>
                    setCustomer({ ...customer, fullName: e.target.value })
                  }
                  placeholder="Camille Laurent"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
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
                    htmlFor="checkout-email"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                    placeholder="camille@atelier.fr"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-[#991B1B] mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Phone (Courier Verification) *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-[#991B1B] mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-[#181615] mb-1"
                >
                  Street Address & Suite *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="24 Rue du Faubourg Saint-Honoré"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
                />
                {formErrors.address && (
                  <p className="text-[11px] text-[#991B1B] mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    City *
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer({ ...customer, city: e.target.value })
                    }
                    placeholder="Paris"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
                  />
                  {formErrors.city && (
                    <p className="text-[11px] text-[#991B1B] mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-postal"
                    className="block text-xs font-medium text-[#181615] mb-1"
                  >
                    Postal Code *
                  </label>
                  <input
                    id="checkout-postal"
                    type="text"
                    value={customer.postalCode}
                    onChange={(e) =>
                      setCustomer({ ...customer, postalCode: e.target.value })
                    }
                    placeholder="75008"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E0D8] text-[#181615] focus:outline-none focus:border-[#181615]"
                  />
                  {formErrors.postalCode && (
                    <p className="text-[11px] text-[#991B1B] mt-1">
                      {formErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <span className="block text-xs font-medium text-[#181615] mb-1.5">
                  Settlement Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCustomer({ ...customer, paymentMethod: 'COD' })
                    }
                    className={`p-3 text-left border text-xs transition-colors ${
                      customer.paymentMethod === 'COD'
                        ? 'border-[#181615] bg-white font-semibold text-[#181615]'
                        : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#57514A]'
                    }`}
                  >
                    <div>Cash on Delivery (COD)</div>
                    <div className="text-[11px] font-normal text-[#6E675F] mt-0.5">
                      Pay upon courier garment inspection
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCustomer({ ...customer, paymentMethod: 'CARD' })
                    }
                    className={`p-3 text-left border text-xs transition-colors ${
                      customer.paymentMethod === 'CARD'
                        ? 'border-[#181615] bg-white font-semibold text-[#181615]'
                        : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#57514A]'
                    }`}
                  >
                    <div>Atelier Direct Card</div>
                    <div className="text-[11px] font-normal text-[#6E675F] mt-0.5">
                      Immediate priority dispatch
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-6 py-4">
              <div className="p-5 bg-white border border-[#181615] space-y-3">
                <div className="flex items-center gap-2 text-[#0E4D3B] text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Order #{confirmedOrder.orderId} Confirmed — Preparing
                    Shipment
                  </span>
                </div>
                <p className="text-xs text-[#4A443F] leading-relaxed">
                  Thank you, <strong className="text-[#181615]">{confirmedOrder.customer.fullName}</strong>. Your
                  garments are being steamed and packed in breathable cotton
                  archival covers for dispatch to{' '}
                  <strong className="text-[#181615]">
                    {confirmedOrder.customer.address}, {confirmedOrder.customer.city}
                  </strong>
                  .
                </p>
                <div className="pt-2 border-t border-[#E5E0D8] flex justify-between text-xs text-[#6E675F]">
                  <span>Payment Terms: {confirmedOrder.customer.paymentMethod === 'COD' ? 'Cash on Delivery (Verified)' : 'Atelier Direct Card'}</span>
                  <span className="font-mono-num font-semibold text-[#181615]">
                    Total: ${confirmedOrder.total}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#57514A]">
                  Itemized Order Receipt
                </h3>
                <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] bg-white px-4">
                  {confirmedOrder.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="py-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-medium text-[#181615]">
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-[#6E675F]">
                          {item.purchaseType} · Size {item.size} · Qty{' '}
                          {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono-num font-medium text-[#181615]">
                        ${item.unitPrice * item.quantity}
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
          <div className="p-6 bg-white border-t border-[#E5E0D8] space-y-4">
            <div className="space-y-1.5 text-xs">
              {summary.bundleSavings > 0 && (
                <div className="flex justify-between text-[#0E4D3B] font-medium">
                  <span>Complete Outfit Set Savings</span>
                  <span className="font-mono-num">
                    -${summary.bundleSavings}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#57514A]">
                <span>Subtotal</span>
                <span className="font-mono-num">${summary.subtotal}</span>
              </div>
              {summary.promoDiscount > 0 && (
                <div className="flex justify-between text-[#0E4D3B] font-medium">
                  <span>Promo Reduction ({appliedPromo})</span>
                  <span className="font-mono-num">
                    -${summary.promoDiscount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#57514A]">
                <span>Insured Garment Courier</span>
                <span className="font-mono-num">
                  {summary.shippingFee === 0
                    ? 'Complimentary'
                    : `$${summary.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E5E0D8]">
                <span className="text-sm font-semibold text-[#181615]">
                  Total Due
                </span>
                <span className="text-xl font-semibold text-[#181615] font-mono-num">
                  ${summary.total}
                </span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27] text-xs font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="px-4 py-3.5 border border-[#E5E0D8] text-xs font-medium text-[#181615] hover:bg-[#F4F0EA] transition-colors whitespace-nowrap shrink-0"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  form="checkout-verification-form"
                  className="flex-1 py-3.5 px-6 bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27] text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                >
                  Confirm Order (${summary.total})
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 bg-white border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3.5 px-6 bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27] text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
            >
              Continue Exploring Maison Valéria
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
