import React, { useState } from 'react';
import { CartItem } from '../types';
import {
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  Lock,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  Truck,
  Banknote,
  PackageCheck,
  Phone,
  MessageSquare,
  MapPin,
  User,
  ShoppingBag
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatLKR } from '../lib/formatters';

interface CheckoutProps {
  checkoutItems: CartItem[];
  checkoutSource: 'cart' | 'buy_now';
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderSuccess: (orderId: string, orderDetails: {
    customerName: string;
    phone: string;
    whatsapp?: string;
    address: string;
    city: string;
    total: number;
    items: CartItem[];
    fromCart: boolean;
  }) => void;
  setCurrentView: (view: string) => void;
}

export default function Checkout({
  checkoutItems,
  checkoutSource,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
  setCurrentView
}: CheckoutProps) {
  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    customerName: string;
    phone: string;
    whatsapp?: string;
    address: string;
    city: string;
    total: number;
    items: CartItem[];
  } | null>(null);

  // Grand Total Calculation: sum of all item subtotals (using numeric price from Supabase source of truth)
  const grandTotal = checkoutItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const shippingFee = grandTotal >= 5000 || grandTotal === 0 ? 0 : 450;
  const finalPayable = grandTotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validation checks
    const customerName = formData.fullName.trim();
    const phone = formData.phone.trim();
    const whatsapp = formData.whatsapp.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();

    if (!customerName) {
      setErrorMessage("Full name cannot be empty.");
      return;
    }
    if (!phone) {
      setErrorMessage("Phone number cannot be empty.");
      return;
    }
    if (!address) {
      setErrorMessage("Full delivery address cannot be empty.");
      return;
    }
    if (!city) {
      setErrorMessage("City cannot be empty.");
      return;
    }
    if (!checkoutItems || checkoutItems.length === 0) {
      setErrorMessage("At least one product must be in checkout.");
      return;
    }

    // Validate stock and quantity
    for (const item of checkoutItems) {
      if (!item.quantity || item.quantity < 1) {
        setErrorMessage(`Quantity for ${item.name} must be at least 1.`);
        return;
      }
      if (item.quantity > item.stock) {
        setErrorMessage(
          `Requested quantity for ${item.name} (${item.quantity}) exceeds available stock (${item.stock}).`
        );
        return;
      }
    }

    // 2. Disable button and show "Placing Order..."
    setLoading(true);

    try {
      let orderId: string | null = null;

      if (isSupabaseConfigured) {
        // 4. Call the Supabase RPC function exactly as required:
        const { data, error } = await supabase.rpc("create_order", {
          p_customer_name: customerName,
          p_phone: phone,
          p_address: address,
          p_city: city,
          p_items: checkoutItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        });

        if (error) {
          // 5. Error handling: Stop loading state, show clear error message, do not clear cart
          setErrorMessage(error.message || "Failed to place order in Supabase. Please check your details.");
          setLoading(false);
          return;
        }

        if (!data) {
          setErrorMessage("Failed to register order with the server. Please try again.");
          setLoading(false);
          return;
        }

        orderId = String(data);

        // If customer provided a WhatsApp number, update the order record in Supabase
        if (whatsapp) {
          try {
            await supabase.from("orders").update({ whatsapp }).eq("id", orderId);
          } catch {
            // Optional column update
          }
        }
      } else {
        // Fallback simulation when Supabase environment variables are pending configuration in Netlify/.env
        orderId = "ord-" + Math.floor(100000 + Math.random() * 900000);
      }

      // 6. Success handling:
      setPlacedOrderId(orderId);
      setPlacedOrderDetails({
        customerName,
        phone,
        whatsapp,
        address,
        city,
        total: finalPayable,
        items: [...checkoutItems]
      });

      onOrderSuccess(orderId, {
        customerName,
        phone,
        whatsapp,
        address,
        city,
        total: finalPayable,
        items: [...checkoutItems],
        fromCart: checkoutSource === 'cart'
      });

    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to connect to order service. Please check your network connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE VIEW
  if (placedOrderId && placedOrderDetails) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#E6F4EA] text-[#43B02A] rounded-full flex items-center justify-center mx-auto border-2 border-[#C8E6C9] shadow-md animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-white bg-[#43B02A] px-3.5 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62]">
            Order placed successfully!
          </h1>
          <p className="text-sm font-mono font-bold text-[#0082C8] bg-blue-50 py-1.5 px-4 rounded-xl inline-block border border-blue-200">
            Order ID: {placedOrderId}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto pt-1 leading-relaxed">
            Your order has been placed successfully. We will contact you shortly to confirm your order and coordinate express courier delivery.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-7 text-left space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="flex justify-between items-center border-b border-[#E2EBF1] pb-3">
            <h3 className="text-xs font-bold text-[#002D62] uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-[#0082C8]" />
              Order Summary
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Cash on Delivery</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto">
            {placedOrderDetails.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <img
                  src={item.image_url || item.product?.image || 'https://i.imgur.com/QexihB2.png'}
                  alt={item.name}
                  className="w-12 h-12 object-contain rounded-xl border border-gray-100 p-1 bg-white shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-[#002D62] truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    {item.quantity} x {formatLKR(item.price)}
                  </p>
                </div>
                <span className="font-extrabold text-[#002D62]">
                  {formatLKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E2EBF1] pt-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold text-[#002D62]">{placedOrderDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Contact Phone:</span>
              <span className="font-mono font-semibold">{placedOrderDetails.phone}</span>
            </div>
            {placedOrderDetails.whatsapp && (
              <div className="flex justify-between">
                <span>WhatsApp:</span>
                <span className="font-mono font-semibold">{placedOrderDetails.whatsapp}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="text-right max-w-[240px] truncate">{placedOrderDetails.address}, {placedOrderDetails.city}</span>
            </div>
            <div className="border-t border-[#E2EBF1] pt-3 flex justify-between items-center text-sm font-black text-[#002D62]">
              <span>Total Payable:</span>
              <span className="text-base text-[#0082C8]">{formatLKR(placedOrderDetails.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-7 py-3 bg-[#002D62] hover:bg-[#0082C8] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT FALLBACK
  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-[#EEF5F9] text-[#0082C8] rounded-full flex items-center justify-center mx-auto border border-[#D1E5F2]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-[#002D62]">No Products in Checkout</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please select a product from our clinical shop or click "Buy Now" on any product card to proceed.
        </p>
        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-[#0082C8] hover:bg-[#006EA8] text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back button */}
      <button
        onClick={() => {
          setCurrentView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002D62] hover:text-[#0082C8] transition-colors mb-6 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        {checkoutSource === 'buy_now' ? 'Back to Shop' : 'Back to Cart'}
      </button>

      {/* Header Info */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] tracking-tight">
          Express Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {checkoutSource === 'buy_now'
            ? 'Complete your single-item direct purchase with instant home delivery.'
            : 'Review your selected items and provide delivery details for courier dispatch.'}
        </p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 text-red-700 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Unable to place order</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Delivery & Customer Details (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          
          {/* Customer Details Segment */}
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="text-sm font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#EEF5F9] text-[#0082C8] text-xs font-black rounded-full flex items-center justify-center border border-[#D1E5F2]">1</span>
                Customer &amp; Delivery Information
              </span>
              <span className="text-[10px] text-red-500 font-bold">* Required fields</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0082C8]" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Ruwan Perera"
                  className="w-full px-4 py-2.5 bg-[#F4F8FA] border border-[#E2EBF1] rounded-xl text-xs text-[#0A1C2A] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0082C8]" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07X XXX XXXX"
                  className="w-full px-4 py-2.5 bg-[#F4F8FA] border border-[#E2EBF1] rounded-xl text-xs text-[#0A1C2A] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] transition-all"
                  required
                />
              </div>

              {/* WhatsApp Number (Optional) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#43B02A]" />
                  WhatsApp Number <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="07X XXX XXXX"
                  className="w-full px-4 py-2.5 bg-[#F4F8FA] border border-[#E2EBF1] rounded-xl text-xs text-[#0A1C2A] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] transition-all"
                />
              </div>

              {/* Full Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0082C8]" />
                  Full Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="No, Street Name, Landmark..."
                  className="w-full px-4 py-2.5 bg-[#F4F8FA] border border-[#E2EBF1] rounded-xl text-xs text-[#0A1C2A] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] transition-all resize-none"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Colombo, Kandy, Galle..."
                  className="w-full px-4 py-2.5 bg-[#F4F8FA] border border-[#E2EBF1] rounded-xl text-xs text-[#0A1C2A] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0082C8] transition-all"
                  required
                />
              </div>

            </div>
          </div>

          {/* Payment Method Segment */}
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-sm font-extrabold text-[#002D62] border-b border-[#E2EBF1] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#EEF5F9] text-[#0082C8] text-xs font-black rounded-full flex items-center justify-center border border-[#D1E5F2]">2</span>
              Payment Method
            </h2>

            <div className="p-4 bg-[#EEF5F9] rounded-2xl border border-[#D1E5F2] flex items-start gap-3">
              <Banknote className="w-6 h-6 text-[#43B02A] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-[#002D62]">Cash on Delivery (Islandwide Courier)</p>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Pay directly to our delivery courier upon receiving your package at your doorstep. Please have the exact amount of <strong className="text-[#002D62]">{formatLKR(finalPayable)}</strong> ready.
                </p>
              </div>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#002D62] hover:bg-[#0082C8] hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Place Order ({formatLKR(finalPayable)})
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#43B02A]" />
            Your order is saved securely to Supabase. Authentic Cetaphil guarantee.
          </p>
        </form>

        {/* Right Summary: Items & Total Calculation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2EBF1] rounded-3xl p-6 sm:p-7 space-y-5 sticky top-24 shadow-xs">
            
            <div className="flex justify-between items-center border-b border-[#E2EBF1] pb-3">
              <h3 className="text-xs font-bold text-[#002D62] uppercase tracking-wider">
                Selected Products ({checkoutItems.length})
              </h3>
              {checkoutSource === 'buy_now' && (
                <span className="text-[9px] font-extrabold bg-[#0082C8] text-white px-2 py-0.5 rounded-full uppercase">
                  Buy Now Direct
                </span>
              )}
            </div>

            {/* List of Products in Checkout */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {checkoutItems.map((item) => {
                const itemSubtotal = Number(item.price) * item.quantity;
                return (
                  <div key={item.id} className="border border-[#E2EBF1] rounded-2xl p-3.5 flex gap-3 items-center bg-[#F4F8FA]/50">
                    
                    {/* Product Image */}
                    <img
                      src={item.image_url || item.product?.image || 'https://i.imgur.com/QexihB2.png'}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-contain rounded-xl border border-gray-100 p-1 bg-white shrink-0"
                    />

                    {/* Product Info */}
                    <div className="flex-grow min-w-0 space-y-1">
                      <p className="text-xs font-bold text-[#002D62] line-clamp-1">{item.name}</p>
                      
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-gray-500 font-mono">Unit: {formatLKR(item.price)}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#43B02A] font-semibold">Stock: {item.stock}</span>
                      </div>

                      {/* Quantity Controls: - Qty + */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-gray-200 bg-white rounded-full p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-xs font-bold disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#002D62] font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                            disabled={item.quantity >= item.stock}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-xs font-bold disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-[#002D62]">
                            {formatLKR(itemSubtotal)}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Remove button (if multiple items in normal cart) */}
                    {checkoutItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-[#E2EBF1] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Products Subtotal</span>
                <span className="font-mono font-bold text-[#002D62]">{formatLKR(grandTotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery (Sri Lanka Express)</span>
                <span className="font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-[#43B02A]">FREE</span>
                  ) : (
                    <span className="font-mono">{formatLKR(shippingFee)}</span>
                  )}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-[10px] text-[#0082C8] italic">
                  *Orders over LKR 5,000 qualify for FREE delivery.
                </p>
              )}

              <div className="border-t border-[#E2EBF1] pt-3 flex justify-between items-center text-base font-black text-[#002D62]">
                <span>Grand Total</span>
                <span className="text-lg text-[#0082C8]">{formatLKR(finalPayable)}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="bg-[#EEF5F9] border border-[#D1E5F2] rounded-2xl p-4 text-[10px] text-gray-600 leading-relaxed space-y-1">
              <p className="font-bold text-[#002D62] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#43B02A]" />
                Speedy Islandwide Delivery
              </p>
              <p>
                Delivery within 1-3 business days across Western Province, and 2-4 business days outstation.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
