import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { SlidersHorizontal, Sparkles, Filter, ShoppingCart, RefreshCw, Star, Quote, CheckCircle, X, Zap } from 'lucide-react';
import { formatLKR } from '../lib/formatters';
import { toDirectImageUrl } from '../lib/imageUrl';
import SensitiveSkinHeroSection from './SensitiveSkinHeroSection';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product) => void;
  setSelectedProductId: (id: string | null) => void;
  setCurrentView: (view: string) => void;
}

export default function ProductCatalog({
  products,
  onAddToCart,
  onBuyNow,
  setSelectedProductId,
  setCurrentView
}: ProductCatalogProps) {
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<string>('rating');
  
  const [showFaqs, setShowFaqs] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', skinConcern: '' });
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  const skinConcerns = ['Sensitive Skin', 'Dry Skin', 'Oily Skin', 'Acne-Prone', 'Baby & Infant Care', 'Anti-Aging'];
  const categories = [
    { value: 'cleanser', label: 'Cleansers', image: 'https://i.imgur.com/QexihB2.png', description: 'Gentle & deep pore' },
    { value: 'cream', label: 'Moisturizers & Creams', image: 'https://i.imgur.com/1hfncF3.png', description: '24h Barrier defense' },
    { value: 'sunscreen', label: 'Sun Protection (SPF)', image: 'https://i.imgur.com/Tf2OUmd.png', description: 'Broad spectrum SPF 50+' },
    { value: 'baby', label: 'Baby Care', image: 'https://i.imgur.com/5not0r2.png', description: 'Safe from Day 1' },
    { value: 'serum', label: 'Serums & Actives', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200', description: 'Targeted cellular care' },
    { value: 'exfoliant', label: 'Exfoliants & Toners', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=200', description: 'Micro-exfoliation' }
  ];

  // Dynamic filtering of catalog
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesConcern = !selectedConcern || p.skinConcern.includes(selectedConcern);
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        const matchesPrice = p.price <= maxPrice;
        return matchesConcern && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return b.rating - a.rating; // Default by rating
      });
  }, [products, selectedConcern, selectedCategory, maxPrice, sortBy]);

  // Featured product for Oily Skin Showcase
  const oilyProduct = useMemo(() => {
    return products.find(p => 
      p.slug === 'cetaphil-oily-skin-cleanser-125ml' ||
      p.id === 'cetaphil-oily-skin-cleanser-125ml' ||
      p.slug?.includes('oily') ||
      p.name.toLowerCase().includes('oily')
    ) || products[0];
  }, [products]);

  const handleCardClick = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('pdp');
  };

  const resetFilters = () => {
    setSelectedConcern('');
    setSelectedCategory('');
    setMaxPrice(10000);
    setSortBy('rating');
  };

  return (
    <div>
      
      {/* DERMATOLOGIST-RECOMMENDED CLINICAL BRAND SECTION (CETAPHIL US INSPIRED) */}
      <SensitiveSkinHeroSection
        onCategorySelect={(cat) => setSelectedCategory(cat)}
        onShopNow={() => {
          const el = document.getElementById('catalog-grid-start');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFindProducts={() => {
          setCurrentView('quiz');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectConcern={(concern) => setSelectedConcern(concern)}
      />

      {/* 3. MAIN CATALOG SEGMENT */}
      <div id="catalog-grid-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Visual Category Filter Tabs with Images */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0082C8]">
                Interactive Formulation Filter
              </span>
              <h3 className="text-xl font-extrabold text-[#002D62] tracking-tight">
                Filter Formulations by Category
              </h3>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-xs font-bold text-[#0082C8] hover:underline cursor-pointer"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          {/* Filter Tabs Grid / Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            
            {/* Tab: All Formulations */}
            <button
              onClick={() => setSelectedCategory('')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-white border-[#0082C8] ring-2 ring-[#0082C8]/20 shadow-sm'
                  : 'bg-white border-[#E2EBF1] hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#EEF5F9] flex items-center justify-center mb-2 mx-auto">
                <Sparkles className="w-6 h-6 text-[#0082C8]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-extrabold text-[#002D62] leading-tight">All Solutions</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{products.length} Products</p>
              </div>
            </button>

            {/* Dynamic Category Tabs with Images */}
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.value).length;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-white border-[#0082C8] ring-2 ring-[#0082C8]/20 shadow-sm'
                      : 'bg-white border-[#E2EBF1] hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E2EBF1] p-1 flex items-center justify-center mb-2 mx-auto overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-extrabold leading-tight truncate ${isSelected ? 'text-[#0082C8]' : 'text-[#0A1C2A]'}`}>
                      {cat.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </p>
                  </div>
                </button>
              );
            })}

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border border-[#E2EBF1] rounded-2xl p-5 space-y-6 sticky top-24 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-[#002D62] uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-[#0082C8]" />
                  Prescription Filters
                </h3>
                <button onClick={resetFilters} className="text-[10px] font-semibold text-gray-400 hover:text-red-500 cursor-pointer">
                  Reset
                </button>
              </div>

              {/* Formulation Type list with Images */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Formulation Type</p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`text-left text-xs px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                      selectedCategory === ''
                        ? 'bg-[#EEF5F9] text-[#0082C8] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-[#0082C8] font-bold text-[9px]">
                      All
                    </div>
                    <span>All Formulations</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`text-left text-xs px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-2.5 cursor-pointer ${
                        selectedCategory === cat.value
                          ? 'bg-[#EEF5F9] text-[#0082C8] font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin concern list */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skin Concern</p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedConcern('')}
                    className={`text-left text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                      selectedConcern === ''
                        ? 'bg-[#EEF5F9] text-[#0082C8] font-bold'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    All Concerns
                  </button>
                  {skinConcerns.map(concern => (
                    <button
                      key={concern}
                      onClick={() => setSelectedConcern(concern)}
                      className={`text-left text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        selectedConcern === concern
                          ? 'bg-[#EEF5F9] text-[#0082C8] font-bold'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Price Range</span>
                  <span className="text-[#002D62] font-bold">Rs. {maxPrice.toLocaleString()} max</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0082C8] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>LKR 500</span>
                  <span>LKR 15,000</span>
                </div>
              </div>

              {/* Baby Care Dedicated Banner in Sidebar */}
              <div className="bg-[#EEF5F9] border border-[#D1E5F2] rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://i.imgur.com/5not0r2.png"
                    alt="Baby care"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 object-contain bg-white rounded-lg p-0.5 border border-blue-100"
                  />
                  <h4 className="text-xs font-bold text-[#002D62]">Cetaphil Baby™</h4>
                </div>
                <p className="text-[10px] text-gray-600 leading-snug">
                  Pediatrician recommended infant skincare, shampoos &amp; organic calendula lotions.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('baby');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-center text-[10px] font-bold text-[#0082C8] hover:underline pt-1 block cursor-pointer"
                >
                  Visit Dedicated Baby Page →
                </button>
              </div>

            </div>
          </aside>

          {/* Grid Products Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Dedicated Baby banner if baby category selected */}
            {selectedCategory === 'baby' && (
              <div className="bg-gradient-to-r from-[#EEF5F9] to-blue-50 border border-[#D1E5F2] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#D1E5F2] p-1 flex items-center justify-center shrink-0">
                    <img
                      src="https://i.imgur.com/5not0r2.png"
                      alt="Baby Care"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#002D62]">
                      Looking for the Full Cetaphil Baby™ Experience?
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      Explore pediatric 3-step protocols, tear-free formulas, and Sri Lankan parents' reviews.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentView('baby');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#002D62] hover:bg-[#0082C8] text-white text-xs font-bold rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                >
                  Open Baby Page →
                </button>
              </div>
            )}
            
            {/* Sorting header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E2EBF1] rounded-2xl px-5 py-3 text-xs shadow-xs">
              <span className="font-semibold text-gray-500">
                Showing {filteredProducts.length} of {products.length} formulations
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-0 font-bold text-[#002D62] py-0 focus:ring-0 outline-none cursor-pointer"
                >
                  <option value="rating">Dermatologist Rating</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Zero state matches */}
            {filteredProducts.length === 0 && (
              <div className="bg-white border border-[#E2EBF1] rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#002D62]">No formulations match filters</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Adjust your price threshold, choose 'All Solutions', or reset your target concerns to browse clinical items.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[#002D62] hover:bg-[#0082C8] text-white px-5 py-2.5 rounded-full cursor-pointer transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E2EBF1] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#0082C8]/50 transition-all flex flex-col group relative"
                >
                  
                  {/* Banner ribbon badge / Tag */}
                  {(product.badge || product.tag) && (
                    <span className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest ${
                      (product.badge || product.tag) === 'Bestseller'
                        ? 'bg-[#EEF5F9] text-[#0082C8] border border-[#D1E5F2]'
                        : (product.badge || product.tag) === 'New'
                        ? 'bg-[#E6F4EA] text-[#43B02A] border border-[#C8E6C9]'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {product.badge || product.tag}
                    </span>
                  )}

                  {/* Product Image click block */}
                  <div
                    onClick={() => handleCardClick(product.id)}
                    className="relative w-full h-52 bg-white cursor-pointer overflow-hidden p-4 flex items-center justify-center border-b border-gray-100"
                  >
                    <img
                      src={toDirectImageUrl(product.image_url || product.image, product.slug || product.id)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain group-hover:scale-106 transition-transform duration-300"
                    />
                  </div>

                  {/* Card Content info */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-[#0082C8]">{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{(product.rating || 5).toFixed(1)}</span>
                          <span className="text-gray-400 text-[8px] font-medium lowercase">
                            ({product.reviews?.length || product.reviewsCount || 0} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between gap-1.5">
                        <h3
                          onClick={() => handleCardClick(product.id)}
                          className="text-xs font-bold text-[#0A1C2A] leading-snug group-hover:text-[#0082C8] hover:underline cursor-pointer line-clamp-2 min-h-8 transition-colors flex-grow"
                        >
                          {product.name}
                        </h3>
                        {product.size && (
                          <span className="text-[10px] font-bold text-[#002D62] bg-[#EEF5F9] px-2 py-0.5 rounded-md border border-[#D1E5F2] whitespace-nowrap shrink-0">
                            {product.size}
                          </span>
                        )}
                      </div>

                      {/* Short Description */}
                      {product.short_description ? (
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {product.short_description}
                        </p>
                      ) : product.description ? (
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {product.description.replace(/^###.*$/gm, '').trim()}
                        </p>
                      ) : null}

                      {/* Ingredients small tags */}
                      {product.ingredients && product.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {product.ingredients.slice(0, 2).map((ing, idx) => (
                            <span key={idx} className="bg-[#F4F8FA] text-gray-600 text-[8px] font-semibold px-2 py-0.5 rounded-full border border-gray-100">
                              {ing}
                            </span>
                          ))}
                          {product.ingredients.length > 2 && (
                            <span className="text-[8px] text-gray-400 mt-0.5 ml-0.5">+{product.ingredients.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2.5">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Price</span>
                          <span className="text-sm sm:text-base font-black text-[#002D62]">{formatLKR(product.price)}</span>
                        </div>

                        <div>
                          {product.stock <= 0 ? (
                            <span className="text-[9px] text-red-600 font-bold uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                              Out of Stock
                            </span>
                          ) : product.stock <= 10 ? (
                            <span className="text-[9px] text-amber-700 font-bold uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Low Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="text-[9px] text-[#43B02A] font-bold uppercase bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                              In Stock ({product.stock})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons: Add to Cart and Buy Now */}
                      <div className="flex gap-2">
                        <button
                          disabled={product.stock <= 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product, 1);
                            const btn = document.getElementById(`grid-add-${product.id}`);
                            if (btn) {
                              btn.innerText = "Added ✓";
                              setTimeout(() => { if (btn) btn.innerText = "Add to Cart"; }, 1800);
                            }
                          }}
                          id={`grid-add-${product.id}`}
                          className={`flex-1 text-[10px] font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition-all ${
                            product.stock <= 0
                              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200'
                              : 'border-2 border-[#002D62] text-[#002D62] hover:bg-[#EEF5F9] cursor-pointer'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>

                        <button
                          disabled={product.stock <= 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyNow(product);
                          }}
                          className={`flex-1 text-[10px] font-extrabold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 shadow-xs transition-all ${
                            product.stock <= 0
                              ? 'opacity-40 cursor-not-allowed bg-gray-300 text-gray-500'
                              : 'bg-[#0082C8] hover:bg-[#006EA8] text-white cursor-pointer hover:shadow-md'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </main>

        </div>

        {/* 3. SHOWCASE HERO SECTION (Advanced Defense & Repair and Renew Serum) */}
        <section className="mt-16 pt-16 border-t border-[#E2EBF1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002D62] leading-tight tracking-tight">
                Advanced Defense <br />
                &amp; Repair and Renew <br />
                Serum
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                A daily antioxidant serum designed to visibly transform stressed sensitive skin, for stronger skin against daily stressors.
              </p>
              <div>
                <button
                  onClick={() => {
                    const serumProduct = products.find(p => p.name.toLowerCase().includes('serum') || p.id === 'serum-1' || p.category === 'serum');
                    if (serumProduct) {
                      handleCardClick(serumProduct.id);
                    } else {
                      const el = document.getElementById('catalog-grid-start');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-[#002D62] hover:bg-[#0082C8] text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 transform hover:translate-x-1 cursor-pointer shadow-md"
                >
                  Find Out More <span className="text-sm">→</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] group bg-gray-900">
              <img
                src="https://i.imgur.com/MaN4IE9.jpeg"
                alt="Advanced Defense &amp; Repair and Renew Serum"
                className="w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "/src/assets/images/advanced_defense_serum_hero.jpg";
                }}
              />
              {/* Overlay with radial vignette and bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              
              {/* Badges on Top Left */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-[9px] font-extrabold text-white bg-black/40 backdrop-blur-md rounded-full border border-white/20 uppercase tracking-widest">
                  New
                </span>
                <span className="px-3 py-1 text-[9px] font-extrabold text-white bg-black/40 backdrop-blur-md rounded-full border border-white/20 uppercase tracking-widest">
                  AM | PM
                </span>
                <span className="px-3 py-1 text-[9px] font-extrabold text-white bg-black/40 backdrop-blur-md rounded-full border border-white/20 uppercase tracking-widest">
                  Serums
                </span>
              </div>

              {/* Text on Bottom Left */}
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md">
                  Repairs by Night
                </h3>
                <p className="text-white/80 text-[11px] max-w-sm leading-relaxed font-medium">
                  Restore your skin’s defense system with advanced physiological nourishment. Engineered for deep cellular barrier hydration.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. TARGETED OILY SKIN DEFENSE & CARE SHOWCASE */}
        <section className="mt-20 pt-16 border-t border-[#E2EBF1]">
          <div className="bg-gradient-to-br from-[#F4F9FD] via-white to-[#EBF4FA] rounded-3xl border border-[#D5E6F2] p-6 sm:p-10 lg:p-14 shadow-sm overflow-hidden relative">
            {/* Subtle decorative background glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0082C8]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#43B02A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Image Showcase from user URL https://imgur.com/a/ubdzYUt */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div 
                  onClick={() => oilyProduct && handleCardClick(oilyProduct.id)}
                  className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-[#E2EBF1] group cursor-pointer aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center p-4 sm:p-6"
                >
                  <img
                    src="https://i.imgur.com/u04vmdz.png"
                    alt="Cetaphil Oily Skin Cleanser - Deep Cleansing &amp; Barrier Defense for Oily Skin"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges on Top Left & Right */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-[9px] font-extrabold text-white bg-[#002D62] rounded-full uppercase tracking-wider shadow-sm">
                      Bestseller
                    </span>
                    <span className="px-3 py-1 text-[9px] font-extrabold text-white bg-[#43B02A] rounded-full uppercase tracking-wider shadow-sm">
                      Removes 99% Excess Oil
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-[9px] font-extrabold text-[#002D62] bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 uppercase tracking-wider shadow-xs">
                      125ml
                    </span>
                  </div>

                  {/* Bottom Hover Pill */}
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm text-[#002D62] font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md group-hover:bg-[#002D62] group-hover:text-white transition-all">
                      <Sparkles className="w-3.5 h-3.5 text-[#0082C8] group-hover:text-white" />
                      View Formula Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Title with oily skin, detailed mention of product, and actions */}
              <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
                
                {/* Pre-title tag */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#0082C8] bg-white px-3.5 py-1 rounded-full border border-[#D0E5F2] shadow-xs">
                    Targeted Care · Oily &amp; Combination Skin
                  </span>
                </div>

                {/* Title including Oily Skin */}
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002D62] tracking-tight leading-tight">
                    Deep Cleansing &amp; Barrier Defense for Oily Skin
                  </h2>
                  <h3 className="text-sm sm:text-base font-bold text-[#0082C8]">
                    Cetaphil Oily Skin Cleanser (125ml)
                  </h3>
                </div>

                {/* Product Description */}
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Specifically formulated for oily, combination, or acne-prone skin. This gentle low-lather foaming gel cleanser is clinically proven to deep clean pores, eliminate excess sebum, and remove 99% of impurities, dirt, and makeup without stripping the skin's essential moisture barrier.
                </p>

                {/* Key Clinical Benefits Bullet Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#E2EBF1]">
                    <CheckCircle className="w-4 h-4 text-[#43B02A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D62] block text-[11px] font-bold">Triple Hydration Complex</strong>
                      <span className="text-[11px] text-gray-500">Niacinamide (B3), Panthenol (B5) &amp; Glycerin</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#E2EBF1]">
                    <CheckCircle className="w-4 h-4 text-[#43B02A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D62] block text-[11px] font-bold">5 Signs of Sensitivity</strong>
                      <span className="text-[11px] text-gray-500">Defends barrier against tightness &amp; irritation</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#E2EBF1]">
                    <CheckCircle className="w-4 h-4 text-[#43B02A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D62] block text-[11px] font-bold">Non-Comedogenic</strong>
                      <span className="text-[11px] text-gray-500">Soap-free &amp; hypoallergenic pore defense</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-[#E2EBF1]">
                    <CheckCircle className="w-4 h-4 text-[#43B02A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D62] block text-[11px] font-bold">Pore Tightening Foam</strong>
                      <span className="text-[11px] text-gray-500">Reduces enlarged pores &amp; daytime shine</span>
                    </div>
                  </div>
                </div>

                {/* Price, Stock & Actions */}
                <div className="pt-3 border-t border-[#D5E6F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Official Price</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#002D62]">
                        {formatLKR(oilyProduct?.price || 4800)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        In Stock (250)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {oilyProduct && (
                      <>
                        <button
                          onClick={() => {
                            onAddToCart(oilyProduct, 1);
                            const btn = document.getElementById('oily-sec-add-btn');
                            if (btn) {
                              btn.innerText = "Added ✓";
                              setTimeout(() => { if (btn) btn.innerText = "Add to Cart"; }, 1800);
                            }
                          }}
                          id="oily-sec-add-btn"
                          className="px-5 py-3 border-2 border-[#002D62] text-[#002D62] hover:bg-[#EEF5F9] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => onBuyNow(oilyProduct)}
                          className="px-6 py-3 bg-[#0082C8] hover:bg-[#006EA8] text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 5. CLINICALLY PROVEN: TESTIMONIALS SECTION */}
        <section className="mt-24 pt-16 border-t border-[#E2EBF1] bg-gradient-to-b from-white to-[#F4F8FA]/60 rounded-3xl p-8 sm:p-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-[#43B02A] bg-[#E6F4EA] px-3.5 py-1 rounded-full border border-[#C8E6C9] inline-block">
              Clinical Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002D62] tracking-tight leading-tight">
              Real Skin, Proven Transformations
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              We asked real users and leading clinical dermatologists to evaluate our formulations. Here are their verified skin results.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1: Sensitive Skin */}
            <div className="bg-white rounded-2xl border border-[#E2EBF1] shadow-xs p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#0082C8] transition-colors duration-300">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#43B02A]" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#43B02A]/20" />
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed">
                  "I was highly skeptical of using any active acid combinations because my sensitive skin flares up so easily. Cetaphil keeps my skin completely calm while revealing an incredible, soft glow."
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EEF5F9] flex items-center justify-center font-extrabold text-[#0082C8] text-xs uppercase">
                    SM
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#002D62]">Sarah M.</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Age 29 • Verified User</p>
                  </div>
                </div>

                {/* Skin Metric */}
                <div className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#43B02A] px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Redness Reduced by 85%
                </div>
              </div>
            </div>

            {/* Testimonial 2: Dermatologist Endorsement */}
            <div className="bg-[#002D62] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0082C8]/20 rounded-full blur-3xl" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-[8px] font-black uppercase tracking-wider bg-[#43B02A] text-white rounded-full">
                    Clinical Recommendation
                  </span>
                  <Quote className="w-5 h-5 text-white/20" />
                </div>
                
                <p className="text-blue-100 text-xs sm:text-sm italic leading-relaxed">
                  "This specific multi-acid approach respects the skin’s natural lipid matrix. By carefully coupling physiological ceramides and hydrating agents alongside gentle actives, users get cellular turnover without barrier damage."
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0082C8] flex items-center justify-center font-extrabold text-white text-xs">
                    EV
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Dr. Evelyn Vance, MD</h4>
                    <p className="text-[10px] text-blue-200/70 font-bold uppercase tracking-wider">Board Certified Dermatologist</p>
                  </div>
                </div>

                {/* Skin Metric */}
                <div className="inline-flex items-center gap-1.5 bg-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-white/10">
                  <CheckCircle className="w-3.5 h-3.5 text-[#E6F4EA]" />
                  Barrier-Safe Formula
                </div>
              </div>
            </div>

            {/* Testimonial 3: Oily & Acne-Prone Skin */}
            <div className="bg-white rounded-2xl border border-[#E2EBF1] shadow-xs p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#0082C8] transition-colors duration-300">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#43B02A]" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#43B02A]/20" />
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm italic leading-relaxed">
                  "Cetaphil has completely transformed my stubborn oily patches. My morning shine is controlled, pores are cleaner, and the texture has refined without feeling dry or taut."
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EEF5F9] flex items-center justify-center font-extrabold text-[#0082C8] text-xs uppercase">
                    DK
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#002D62]">David K.</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Age 34 • Verified Buyer</p>
                  </div>
                </div>

                {/* Skin Metric */}
                <div className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#43B02A] px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                  <CheckCircle className="w-3.5 h-3.5" />
                  90% Reduction in Blackheads
                </div>
              </div>
            </div>

          </div>

          {/* Clinical Banner Footer */}
          <div className="mt-12 p-4 bg-[#E6F4EA]/50 border border-[#C8E6C9] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[11px] text-gray-600 font-medium">
              *All participants evaluated products over a rigorous 4-week period. Dermatologist endorsements represent objective skin barrier evaluations.
            </p>
            <span className="text-[10px] font-black uppercase text-[#43B02A] tracking-wider whitespace-nowrap">
              Dermatologically Tested
            </span>
          </div>

        </section>

        {/* 6. DERMATOLOGIST-DEVELOPED CALLOUT & FAQ SECTION */}
        <section className="mt-8">
          <div className="bg-[#F4F8FA] rounded-3xl py-12 px-6 sm:px-12 text-center border border-[#E2EBF1] space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#43B02A] block">
                Cetaphil is developed with dermatologists
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#002D62] tracking-tight">
                Have Questions?
              </h2>
            </div>

            {/* Buttons aligned side-by-side on desktop */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => {
                  setIsContactOpen(true);
                  setContactSubmitted(false);
                }}
                className="w-full sm:w-auto min-w-[200px] border-2 border-[#002D62] bg-white hover:bg-[#EEF5F9] text-[#002D62] font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-xs"
              >
                Contact Us
              </button>
              <button
                onClick={() => {
                  setShowFaqs(!showFaqs);
                  if (!showFaqs) {
                    setTimeout(() => {
                      document.getElementById('faq-accordion-block')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="w-full sm:w-auto min-w-[200px] bg-[#002D62] hover:bg-[#0082C8] text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-md"
              >
                {showFaqs ? "Hide FAQ Section" : "See Our FAQ"}
              </button>
            </div>

            {/* Interactive FAQs Accordion */}
            {showFaqs && (
              <div id="faq-accordion-block" className="mt-12 bg-white rounded-2xl border border-[#E2EBF1] text-left p-6 sm:p-8 max-w-3xl mx-auto space-y-4 shadow-sm animate-fade-in">
                <h3 className="text-xs font-black text-[#002D62] uppercase tracking-wider mb-6 border-b border-gray-100 pb-3">
                  Frequently Asked Questions (Cetaphil Care)
                </h3>
                
                <div className="space-y-4 divide-y divide-gray-100">
                  <div className="pt-3">
                    <h4 className="text-xs font-black text-[#002D62] flex items-center gap-2">
                      <span className="text-[#43B02A] font-mono font-bold">Q1.</span>
                      What makes Cetaphil safe for the most sensitive skin?
                    </h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-6">
                      Cetaphil formulas are clinically formulated to defend against the 5 signs of skin sensitivity: weakened skin barrier, dryness, irritation, roughness, and tightness. We use dermatologist-backed ingredients like Niacinamide, Panthenol, and Glycerin with zero harsh fragrances or pore-clogging agents.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xs font-black text-[#002D62] flex items-center gap-2">
                      <span className="text-[#43B02A] font-mono font-bold">Q2.</span>
                      Can Cetaphil Moisturizing Cream be used on both face and body?
                    </h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-6">
                      Yes! Cetaphil Moisturizing Cream is clinically formulated to provide intensive 48-hour hydration for the face, hands, elbows, knees, and severely dry skin areas without clogging pores or feeling greasy.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xs font-black text-[#002D62] flex items-center gap-2">
                      <span className="text-[#43B02A] font-mono font-bold">Q3.</span>
                      Which Cetaphil cleanser is best for my skin type?
                    </h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-6">
                      For normal, dry, or sensitive skin, Cetaphil Gentle Skin Cleanser preserves your moisture barrier. For oily, combination, or acne-prone skin, Cetaphil Oily Skin Cleanser deep cleans pores and eliminates excess sebum without over-drying.
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xs font-black text-[#002D62] flex items-center gap-2">
                      <span className="text-[#43B02A] font-mono font-bold">Q4.</span>
                      Are these formulas tested by dermatologists?
                    </h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-6">
                      Absolutely. All Cetaphil solutions undergo rigorous, independent clinical evaluations to guarantee maximum efficacy, low irritancy index, and optimal barrier safety on all skin types.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Interactive Contact Us Modal Overlay */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-fade-in">
            {/* Modal Header */}
            <div className="bg-[#002D62] text-white p-6 relative">
              <button
                onClick={() => setIsContactOpen(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#43B02A] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full">
                Clinical Support Desk
              </span>
              <h3 className="text-lg font-extrabold mt-3 tracking-tight">Contact Cetaphil Experts</h3>
              <p className="text-blue-100 text-[11px] leading-relaxed mt-1">
                Have a skin concern or product inquiry? Ask our board-certified clinical professionals.
              </p>
            </div>

            {/* Modal Body / Form */}
            <div className="p-6">
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#E6F4EA] text-[#43B02A] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-[#002D62] text-sm">Message Transmitted</h4>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Thank you for reaching out. One of our specialist clinical staff will review your case and respond to <strong>{contactForm.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsContactOpen(false)}
                    className="mt-4 px-6 py-2 bg-[#002D62] hover:bg-[#0082C8] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-3 py-2 border border-[#E2EBF1] rounded-xl text-xs focus:ring-2 focus:ring-[#0082C8] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 border border-[#E2EBF1] rounded-xl text-xs focus:ring-2 focus:ring-[#0082C8] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Primary Skin Concern</label>
                    <select
                      value={contactForm.skinConcern}
                      onChange={(e) => setContactForm({ ...contactForm, skinConcern: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2EBF1] rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#0082C8] outline-none"
                    >
                      <option value="">Select concern...</option>
                      <option value="sensitive">Sensitive Skin Flaring</option>
                      <option value="oily">Excess Oily / Pores</option>
                      <option value="dry">Dry / Flaking Skin</option>
                      <option value="aging">Fine Lines &amp; Renewal</option>
                      <option value="other">General Formula Usage</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Your Message</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your skin query or formula questions..."
                      className="w-full px-3 py-2 border border-[#E2EBF1] rounded-xl text-xs focus:ring-2 focus:ring-[#0082C8] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#002D62] hover:bg-[#0082C8] text-white text-xs font-extrabold uppercase py-3 rounded-full tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    Submit Clinical Query
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
