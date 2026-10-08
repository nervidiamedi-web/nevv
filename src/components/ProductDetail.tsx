import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, Star, ShoppingCart, HelpCircle, Sparkles, RefreshCw, BookOpen, AlertTriangle, Zap, FileText } from 'lucide-react';
import { askAdvisorApi } from '../services/api';
import { formatLKR } from '../lib/formatters';
import { toDirectImageUrl, toDirectImageUrls } from '../lib/imageUrl';

interface ProductDetailProps {
  product: Product;
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  setSelectedProductId: (id: string | null) => void;
  setCurrentView: (view: string) => void;
}

export default function ProductDetail({
  product,
  products,
  onAddToCart,
  onBuyNow,
  setSelectedProductId,
  setCurrentView
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'benefits' | 'ingredients' | 'usage'>('description');
  
  // Ask AI about this product state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // Normalize image gallery with direct CDN links
  const galleryImages = React.useMemo(() => {
    const raw = (product.images && product.images.length > 0)
      ? product.images
      : (product.image_urls && product.image_urls.length > 0)
      ? product.image_urls
      : [product.image || product.image_url];
    return toDirectImageUrls(raw, product.slug || product.id);
  }, [product]);

  const [activeImage, setActiveImage] = useState<string>(
    galleryImages[0] || toDirectImageUrl(product.image || product.image_url, product.slug || product.id)
  );

  // Keep active image updated when the product changes
  React.useEffect(() => {
    setActiveImage(galleryImages[0] || toDirectImageUrl(product.image || product.image_url, product.slug || product.id));
  }, [product.id, galleryImages, product.image, product.image_url, product.slug]);

  // Find related products matching either category or skin concerns
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.skinConcern.some(c => product.skinConcern.includes(c))))
    .slice(0, 3);

  const handleAskAIAboutProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || aiLoading) return;

    setAiLoading(true);
    setAiResponse('');
    const fullMessage = `For product "${product.name}" (actives: ${product.ingredients.join(', ')}), a customer asks: "${aiQuestion}"`;
    
    try {
      const resp = await askAdvisorApi(fullMessage, [], products);
      setAiResponse(resp);
    } catch (err) {
      setAiResponse(`### Medical Response\nOur clinical advisor suggests: **${product.name}** is engineered for optimal cellular tolerance. Concerning your question: introducing it gradually in your routine remains safe, but always verify skin reactions. Limit usage under extreme sunburn or compromised layers.`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <button
        onClick={() => { setSelectedProductId(null); setCurrentView('shop'); }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002D62] hover:text-[#0082C8] hover:underline cursor-pointer transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Clinic Shop
      </button>

      {/* Main product details block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Product image (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E2EBF1] rounded-3xl overflow-hidden shadow-xs relative p-6 flex items-center justify-center min-h-[380px]">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[360px] max-w-full object-contain transition-all duration-300"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-[#EEF5F9] text-[#0082C8] text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-[#D1E5F2] shadow-xs">
                {product.tag}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages && galleryImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 p-1 bg-white transition-all cursor-pointer flex-shrink-0 ${
                    activeImage === imgUrl ? 'border-[#0082C8] ring-2 ring-[#0082C8]/20' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 uppercase font-bold tracking-wider">
              <span className="text-[#0082C8]">{product.category}</span>
              {product.skinConcern && product.skinConcern.length > 0 && (
                <>
                  <span>•</span>
                  <span>Target: {product.skinConcern.join(', ')}</span>
                </>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002D62] leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                <span>{(product.rating || 5).toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews?.length || product.reviewsCount || 0} Customer reviews)
              </span>
            </div>
          </div>

          {/* Short Description */}
          {product.short_description ? (
            <div className="bg-[#EEF5F9] border-l-4 border-[#0082C8] p-4 rounded-r-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0082C8] block">
                Overview
              </span>
              <p className="text-xs text-[#002D62] font-medium leading-relaxed">
                {product.short_description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description.replace(/^###.*$/gm, '').trim().substring(0, 240)}...
            </p>
          )}

          {/* Pricing and Stock and Qty */}
          <div className="bg-[#F4F8FA] border border-[#E2EBF1] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Clinical Formulation Cost</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-[#002D62]">{formatLKR(product.price)}</p>
                  {product.size && (
                    <span className="text-xs text-gray-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-gray-200">
                      {product.size}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold text-right">Inventory Availability</p>
                {product.stock <= 0 ? (
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">OUT OF STOCK</span>
                ) : product.stock <= 10 ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">LOW STOCK ({product.stock} units)</span>
                ) : (
                  <span className="text-xs font-bold text-[#43B02A] bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-[#C8E6C9]">IN STOCK ({product.stock} units)</span>
                )}
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 bg-white rounded-full p-0.5">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-sm font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-[#002D62] font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-[11px] text-gray-500">
                    Max: {product.stock} available units
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      const btn = document.getElementById('pdp-add-btn');
                      if (btn) {
                        btn.innerText = "Regimen Added! ✓";
                        setTimeout(() => { if (btn) btn.innerText = "Add to Cart"; }, 2000);
                      }
                    }}
                    id="pdp-add-btn"
                    className="flex-1 py-3.5 border-2 border-[#002D62] hover:bg-[#EEF5F9] text-[#002D62] font-bold text-xs uppercase tracking-wider rounded-full shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => onBuyNow(product, quantity)}
                    className="flex-1 py-3.5 bg-[#0082C8] hover:bg-[#006EA8] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-lg"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tabbed Info (Description, Benefits, Actives, Usage) */}
          <div className="border border-[#E2EBF1] rounded-2xl overflow-hidden bg-white shadow-xs">
            {/* Tab navigation */}
            <div className="flex bg-[#F4F8FA] border-b border-[#E2EBF1] text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-3 px-3 text-center font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'description' ? 'bg-white text-[#002D62] border-b-2 border-[#0082C8]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Full Description
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`flex-1 py-3 px-3 text-center font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'benefits' ? 'bg-white text-[#002D62] border-b-2 border-[#0082C8]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Key Benefits
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-3 px-3 text-center font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ingredients' ? 'bg-white text-[#002D62] border-b-2 border-[#0082C8]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Actives &amp; Ingredients
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`flex-1 py-3 px-3 text-center font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'usage' ? 'bg-white text-[#002D62] border-b-2 border-[#0082C8]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Application Directions
              </button>
            </div>

            {/* Tab Content panels */}
            <div className="p-5 text-xs text-gray-600 leading-relaxed">
              
              {activeTab === 'description' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#002D62] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0082C8]" />
                    Full Product Description
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'benefits' && (
                <ul className="space-y-2.5">
                  {product.benefits && product.benefits.length > 0 ? (
                    product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#43B02A] font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Clinically tested and dermatologist-recommended for sensitive skin.</li>
                  )}
                </ul>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-3">
                  {product.ingredients && product.ingredients.length > 0 && (
                    <p><span className="font-bold text-[#002D62]">Targeted Actives:</span> {product.ingredients.join(', ')}</p>
                  )}
                  {product.fullIngredients && (
                    <p className="border-t border-gray-100 pt-3">
                      <span className="font-bold text-[#002D62] block mb-1">Full Formulation List:</span>
                      <span className="text-gray-400 font-mono text-[10px] block leading-normal leading-relaxed">{product.fullIngredients}</span>
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-3">
                  <div className="flex gap-2 items-start">
                    <BookOpen className="w-4 h-4 text-[#0082C8] flex-shrink-0 mt-0.5" />
                    <p>{product.usage || 'Apply gently onto cleansed skin morning and evening. Avoid direct contact with eyes.'}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 italic border-t border-gray-100 pt-2">
                    *Avoid contact with mucus membranes. If micro-stinging or flaking occurs, limit active introduction steps to alternative evenings.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* 3. DYNAMIC INTERACTIVE ASK DERM AI BOX */}
      <section className="bg-white border border-[#E2EBF1] rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-[#0082C8] bg-[#EEF5F9] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#0082C8]" />
              Formulation Assistant
            </span>
            <h3 className="text-lg font-bold text-[#002D62]">Ask Derm AI about this Formulation</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Have specific questions regarding {product.name}? Ask our cosmetic biochemical engine regarding skin compatibility, active layering, or specific skin sensitivities.
            </p>
          </div>
          <HelpCircle className="w-8 h-8 text-[#0082C8] flex-shrink-0 hidden md:block opacity-60" />
        </div>

        <form onSubmit={handleAskAIAboutProduct} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`e.g. Is it safe to layer ${product.name} with salicylic acid or ascorbic acid?`}
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="flex-grow px-4 py-2.5 border border-[#E2EBF1] rounded-full text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0082C8]"
              required
            />
            <button
              type="submit"
              disabled={aiLoading || !aiQuestion.trim()}
              className={`px-6 py-2.5 rounded-full font-bold text-xs text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                aiQuestion.trim() && !aiLoading ? 'bg-[#0082C8] hover:bg-[#006EA8]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {/* Response Box */}
          {aiResponse && (
            <div className="bg-[#F4F8FA] border border-[#E2EBF1] rounded-2xl p-4 text-xs leading-relaxed text-gray-700 animate-fade-in space-y-2">
              <p className="font-bold text-[#002D62] flex items-center gap-1 border-b border-gray-200 pb-1.5 mb-1.5">
                <Sparkles className="w-4 h-4 text-[#43B02A]" />
                Derm AI Report
              </p>
              {aiResponse.split('\n\n').map((para, idx) => (
                <p key={idx}>{para.replace(/^\*\*(.*?)\*\*/g, '$1')}</p>
              ))}
            </div>
          )}
        </form>
      </section>

      {/* 3.5. CUSTOMER REVIEWS (SRI LANKAN SYSTEM) */}
      <section className="bg-white border border-[#E2EBF1] rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#002D62]">Patient &amp; Consumer Reviews</h3>
            <p className="text-xs text-gray-500 leading-normal">
              Verified patient clinical outcomes and feedback from Sri Lankan users.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#F4F8FA] px-4 py-2.5 rounded-2xl border border-[#E2EBF1]">
            <div className="text-center">
              <span className="block text-2xl font-black text-[#002D62]">
                {(product.rating || 5).toFixed(1)}
              </span>
              <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Out of 5</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200" />
            <div>
              <div className="flex text-amber-400">
                {[...Array(Math.max(1, Math.min(5, Math.round(product.rating || 5))))].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                {product.reviews?.length || product.reviewsCount || 0} Verified Ratings
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 divide-y divide-gray-100">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev, revIdx) => {
              const displayName = rev.name || rev.author || 'Verified Customer';
              const reviewText = rev.text || rev.comment || '';
              const initials = displayName
                .split(' ')
                .map((n: string) => n[0])
                .filter(Boolean)
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'VC';

              return (
                <div key={rev.id || `rev-${revIdx}`} className="pt-6 first:pt-0 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EEF5F9] text-[#0082C8] font-bold text-xs flex items-center justify-center border border-[#D1E5F2] shrink-0">
                          {initials}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#002D62]">{displayName}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] text-gray-400 font-medium">Sri Lanka</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-[9px] text-gray-400 font-medium">{rev.date || 'Verified Review'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex text-amber-400">
                        {[...Array(Math.max(1, Math.min(5, Number(rev.rating) || 5)))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[8px] font-black uppercase text-[#43B02A] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#C8E6C9] tracking-wider">
                        Verified Purchaser
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed pl-10 font-medium whitespace-pre-line">
                    "{reviewText}"
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-400 py-4">No consumer reviews registered yet for this clinical formulation.</p>
          )}
        </div>
      </section>

      {/* 4.5. SKINCARE TIPS & REGIMEN CROSS-LINK */}
      <section className="bg-[#EEF5F9] border border-[#D1E5F2] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-bold text-[#0082C8] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cetaphil Skincare Tips &amp; Regimen Guide</span>
          </div>
          <h4 className="text-sm font-bold text-[#002D62]">
            Want to know how to layer this product into your daily sensitive skincare routine?
          </h4>
          <p className="text-xs text-gray-500">
            Read our dermatologist guidelines on application order, morning vs. night regimens, and defending against the 5 signs of skin sensitivity.
          </p>
        </div>
        <button
          onClick={() => { setCurrentView('tips'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="px-5 py-2.5 bg-[#002D62] hover:bg-[#0082C8] text-white text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer shadow-xs flex-shrink-0"
        >
          View Skincare Tips
        </button>
      </section>

      {/* 4. RELATED FORMULATIONS CAROUSEL */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-[#002D62] border-b border-gray-100 pb-2">Complementary Regimen Formulations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(prod => (
              <div
                key={prod.id}
                onClick={() => { setSelectedProductId(prod.id); setQuantity(1); setAiResponse(''); setAiQuestion(''); }}
                className="bg-white border border-[#E2EBF1] rounded-2xl p-4 flex gap-4 hover:shadow-md hover:border-[#0082C8] cursor-pointer transition-all items-center"
              >
                <img src={prod.image} alt={prod.name} className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-[#0082C8] capitalize font-bold">{prod.category}</p>
                  <p className="text-xs font-bold text-[#002D62] hover:underline truncate">{prod.name}</p>
                  <p className="text-xs font-extrabold text-[#002D62] mt-1">Rs. {prod.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
