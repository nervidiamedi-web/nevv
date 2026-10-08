import React, { useState, useEffect } from 'react';
import { Product, Article, Order, CartItem } from './types';
import { fetchDatabaseState, fetchActiveProductsFromSupabase, reorderApi } from './services/api';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import BabyProductsPage from './components/BabyProductsPage';
import SkinQuiz from './components/SkinQuiz';
import AIConsult from './components/AIConsult';
import BlogSection from './components/BlogSection';
import SkincareTipsPage from './components/SkincareTipsPage';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import UserDashboard from './components/UserDashboard';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation Router states
  const [currentView, setCurrentView] = useState<string>('shop');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Full-stack DB state
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoBanner, setPromoBanner] = useState({ text: '', visible: false });
  
  // App infrastructure states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Shopping Cart states
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const cached = localStorage.getItem('cetaphil_cart_items');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutDiscountMultiplier, setCheckoutDiscountMultiplier] = useState(1);
  const [checkoutDiscountCodeUsed, setCheckoutDiscountCodeUsed] = useState('');

  // Temporary Buy Now checkout state
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  // Source of current checkout: 'cart' | 'buy_now'
  const [checkoutSource, setCheckoutSource] = useState<'cart' | 'buy_now'>('cart');

  // Fetch full clinical database state on initial render
  const fetchDB = async () => {
    try {
      // 1. Prioritize active products loaded from Supabase
      const sbProducts = await fetchActiveProductsFromSupabase();
      const data = await fetchDatabaseState();
      
      if (sbProducts && sbProducts.length > 0) {
        setProducts(sbProducts);
      } else {
        setProducts(data.products || []);
      }

      setArticles(data.articles || []);
      setOrders(data.orders || []);
      setPromoBanner(data.promoBanner || { text: '', visible: false });
      setError(null);
    } catch (err: any) {
      console.warn("Could not fetch remote state, fallback handled", err);
      setError(err?.message || "Failed to load database state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDB();
  }, []);

  // CART OPERATIONS
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      let updated: CartItem[];

      if (existing) {
        // Respect maximum stock limits
        const targetQty = Math.min(product.stock, existing.quantity + quantity);
        updated = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: targetQty, stock: product.stock, price: Number(product.price) }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url || product.image,
          quantity: Math.min(product.stock, quantity),
          stock: Number(product.stock),
          product: product
        };
        updated = [...prevCart, newItem];
      }

      try {
        localStorage.setItem('cetaphil_cart_items', JSON.stringify(updated));
      } catch {}

      return updated;
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const targetProduct = products.find(p => p.id === productId);
    const maxStock = targetProduct ? targetProduct.stock : 999;
    const boundedQuantity = Math.max(1, Math.min(maxStock, quantity));

    setCart(prevCart => {
      const updated = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: boundedQuantity } : item
      );
      try {
        localStorage.setItem('cetaphil_cart_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => {
      const updated = prevCart.filter(item => item.id !== productId);
      try {
        localStorage.setItem('cetaphil_cart_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // BUY NOW HANDLER:
  // 1. Check whether product stock > 0
  // 2. Clear any previous temporary checkout item
  // 3. Add selected product to temporary checkout state with quantity 1
  // 4. Navigate directly to the checkout page
  // 5. Checkout page shows only the selected product and quantity 1
  // 6. Normal cart remains available if returning to shop
  const handleBuyNow = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url || product.image,
      quantity: Math.min(product.stock, Math.max(1, quantity)),
      stock: Number(product.stock),
      product: product
    };

    setBuyNowItem(item);
    setCheckoutSource('buy_now');
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NORMAL CART CHECKOUT HANDLER
  const handleCheckoutInitiated = (discountMultiplier = 1, discountCodeUsed = '') => {
    setCheckoutDiscountMultiplier(discountMultiplier);
    setCheckoutDiscountCodeUsed(discountCodeUsed);
    setCheckoutSource('cart');
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CHECKOUT QUANTITY CONTROLS
  const handleUpdateCheckoutQuantity = (productId: string, quantity: number) => {
    if (checkoutSource === 'buy_now') {
      if (buyNowItem && buyNowItem.id === productId) {
        const bounded = Math.max(1, Math.min(buyNowItem.stock, quantity));
        setBuyNowItem({ ...buyNowItem, quantity: bounded });
      }
    } else {
      handleUpdateCartQuantity(productId, quantity);
    }
  };

  const handleRemoveCheckoutItem = (productId: string) => {
    if (checkoutSource === 'buy_now') {
      setBuyNowItem(null);
    } else {
      handleRemoveFromCart(productId);
    }
  };

  // SUCCESSFUL ORDER CALLBACK
  const handleOrderSuccess = (orderId: string, details: any) => {
    // Clear normal cart only if the ordered products came from the normal cart
    if (details.fromCart) {
      setCart([]);
      try {
        localStorage.removeItem('cetaphil_cart_items');
      } catch {}
    }
    // Clear temporary checkout state
    setBuyNowItem(null);

    // Update local product inventory levels from placed order
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderedItem = details.items.find((item: any) => item.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      })
    );

    // Record order in customer's order history state for UserDashboard
    const newOrderRecord: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: details.items.map((it: any) => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image_url || it.product?.image || ''
      })),
      subtotal: details.total,
      shipping: 0,
      tax: 0,
      total: details.total,
      status: 'Pending',
      shippingAddress: {
        fullName: details.customerName,
        email: 'customer@order.com',
        phone: details.phone,
        address: details.address,
        city: details.city,
        zipCode: ''
      },
      paymentMethod: 'Cash on Delivery'
    };
    setOrders(prevOrders => [newOrderRecord, ...prevOrders]);

    // Re-verify stocks from Supabase in the background
    fetchDB();
  };

  const handleReorder = async (orderId: string): Promise<void> => {
    try {
      const data = await reorderApi(orderId);
      setOrders(prevOrders => [data.order, ...prevOrders]);
      // Re-verify stocks
      setProducts(prevProducts =>
        prevProducts.map(p => {
          const orderedItem = data.order.items.find((item: any) => item.productId === p.id);
          if (orderedItem) {
            return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Could not place reorder", err);
    }
  };

  // Find currently active product (if view is pdp)
  const activeProduct = products.find(p => p.id === selectedProductId);

  // Active items for the checkout page
  const activeCheckoutItems = checkoutSource === 'buy_now'
    ? (buyNowItem ? [buyNowItem] : [])
    : cart;

  // App loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-4">
        <img
          src="https://i.imgur.com/DCJMlkw.png"
          alt="Cetaphil"
          className="h-12 w-auto object-contain mb-4 animate-pulse"
          referrerPolicy="no-referrer"
        />
        <div className="relative w-8 h-8 mb-4">
          <div className="absolute inset-0 rounded-full border-3 border-blue-100 border-t-[#001e40] animate-spin" />
        </div>
        <p className="text-xs font-bold text-[#001e40] uppercase tracking-widest">
          Loading Cetaphil Skincare Catalog...
        </p>
      </div>
    );
  }

  // App error fallback screen
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#001e40]">Clinic Systems Delayed</h2>
        <p className="text-xs text-gray-500 leading-relaxed">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(null); fetchDB(); }}
          className="px-4 py-2 bg-[#001e40] text-white text-xs font-bold rounded-lg hover:opacity-90 cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans flex flex-col">
      {/* Sticky Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSelectedProductId={setSelectedProductId}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        products={products}
        promoBanner={promoBanner}
      />

      {/* Main Container Views Switch Router */}
      <main className="flex-grow">
        {currentView === 'shop' && (
          <ProductCatalog
            products={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            setSelectedProductId={setSelectedProductId}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'baby' && (
          <BabyProductsPage
            products={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            setSelectedProductId={setSelectedProductId}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'pdp' && activeProduct && (
          <ProductDetail
            product={activeProduct}
            products={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            setSelectedProductId={setSelectedProductId}
            setCurrentView={setCurrentView}
          />
        )}

        {(currentView === 'blog' || currentView === 'tips') && (
          <SkincareTipsPage
            articles={articles}
            products={products}
            onAddToCart={handleAddToCart}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentView === 'quiz' && (
          <SkinQuiz
            products={products}
            onAddToCart={handleAddToCart}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentView === 'consult' && (
          <AIConsult
            products={products}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            checkoutItems={activeCheckoutItems}
            checkoutSource={checkoutSource}
            onUpdateQuantity={handleUpdateCheckoutQuantity}
            onRemoveItem={handleRemoveCheckoutItem}
            onOrderSuccess={handleOrderSuccess}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'profile' && (
          <UserDashboard
            orders={orders}
            onReorder={handleReorder}
            setCurrentView={setCurrentView}
            setSelectedProductId={setSelectedProductId}
          />
        )}
      </main>

      {/* Slide-out Shopping Cart Drawer */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckoutInitiated}
      />

      {/* Global Footer */}
      <Footer setCurrentView={setCurrentView} setSelectedProductId={setSelectedProductId} />
    </div>
  );
}
