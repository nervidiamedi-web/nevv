import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface SensitiveSkinHeroSectionProps {
  onCategorySelect?: (category: string) => void;
  onShopNow?: () => void;
  onFindProducts?: () => void;
  onSelectConcern?: (concern: string) => void;
}

export default function SensitiveSkinHeroSection({
  onCategorySelect,
  onShopNow,
  onFindProducts,
  onSelectConcern
}: SensitiveSkinHeroSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All Cleansers');
  const [activeSignIndex, setActiveSignIndex] = useState<number | null>(null);

  // Auto sliding banner states
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  const categories = [
    { id: 'cleansers', label: 'All Cleansers', filterValue: 'cleanser' },
    { id: 'moisturizers', label: 'All Moisturizers', filterValue: 'cream' },
    { id: 'facial', label: 'Facial', filterValue: 'cleanser' },
    { id: 'sunscreens', label: 'Sunscreens', filterValue: 'sunscreen' },
    { id: 'body', label: 'Body', filterValue: 'cream' },
    { id: 'baby', label: 'Baby Skincare', filterValue: 'baby' },
    { id: 'serums', label: 'Serums', filterValue: 'serum' },
  ];

  // 3 Distinct slides tailored specifically to the website's clinical sensitive skin collection
  const heroSlides = [
    {
      id: 'nourishing-hydration',
      kicker: 'Dermatologist Recommended Care · Clinically Tested',
      headline: 'Shop our new Nourishing and Hydration Lotion and Cream',
      supportingCopy: 'Gentle, nourishing care designed to hydrate sensitive skin and support a healthy skin barrier.',
      badges: ['Fragrance-Free', 'Non-Comedogenic', '48-Hour Moisture Defense'],
      primaryBtn: {
        text: 'Shop Now',
        type: 'shop',
        targetCategory: 'cream'
      },
      secondaryBtn: {
        text: 'Learn More',
        targetId: 'sensitive-skin-education'
      },
      image: '/src/assets/images/nourishing_lotion_cream_1791538479858.jpg',
      alt: 'Nourishing body lotion and hydrating facial cream on clean travertine stone in soft morning daylight',
      productName: 'Derma·Sense Hydration Duo',
      productSub: 'Enriched with Ceramides & Hyaluronic Acid',
      gradient: 'from-[#F5F8FA] via-[#FAF8F5] to-white',
      accentColor: '#0082C8',
      tagText: 'New Nourishing Care'
    },
    {
      id: 'five-signs-defense',
      kicker: 'The Clinical Promise · 5 Signs of Skin Sensitivity',
      headline: 'Defend Your Sensitive Skin Against 5 Key Stressors',
      supportingCopy: 'Clinically proven formulas to strengthen the moisture barrier, soothe irritation, soften roughness, relieve tightness, and prevent dryness.',
      badges: ['Niacinamide & Panthenol', 'Hypoallergenic', 'Barrier Restorative'],
      primaryBtn: {
        text: 'Explore 5 Signs Care',
        type: 'scroll-sign',
        targetId: 'sensitive-skin-education'
      },
      secondaryBtn: {
        text: 'Take Skin Quiz',
        type: 'quiz'
      },
      image: '/src/assets/images/gentle_skin_regimen_1791539095380.jpg',
      alt: 'Gentle skin cleanser and barrier restorative lotion on clean stone pedestal',
      productName: 'Derma·Care Gentle Regimen',
      productSub: 'Clinically Proven 5-Sign Barrier Defense',
      gradient: 'from-[#F0F7FA] via-[#F4FAF7] to-white',
      accentColor: '#43B02A',
      tagText: '#1 Dermatologist Formula'
    },
    {
      id: 'oily-skin-defense',
      kicker: 'Targeted Care · Oily, Acne-Prone & Combination Skin',
      headline: 'Deep Pore Cleansing & Barrier Defense for Oily Skin',
      supportingCopy: 'Our clinically tested low-lather foaming cleanser removes 99% of excess oil, dirt, and pollution without stripping essential moisture.',
      badges: ['Removes 99% Excess Sebum', 'Soap-Free', 'Pore Tightening'],
      primaryBtn: {
        text: 'Shop Oily Skin Care',
        type: 'shop',
        targetCategory: 'cleanser'
      },
      secondaryBtn: {
        text: 'View Clinical Details',
        type: 'scroll-oily',
        targetConcern: 'Oily Skin'
      },
      image: '/src/assets/images/oily_cleanser_hero_1791539120476.jpg',
      alt: 'Deep pore cleansing gel bottle on travertine stone with natural morning water reflections',
      productName: 'Derma·Clarity Deep Pore Gel',
      productSub: 'Salicylic Acid, Zinc PCA & Vitamin B3',
      gradient: 'from-[#F2F8FD] via-[#EEF5FB] to-white',
      accentColor: '#0082C8',
      tagText: 'Pore & Oil Defense'
    }
  ];

  // Auto-slide effect every 5 seconds, paused on hover/focus or user pause
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, currentSlide]);

  // Handle Touch Swipes for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const handleCategoryClick = (cat: typeof categories[0]) => {
    setActiveCategory(cat.label);
    if (onCategorySelect) {
      onCategorySelect(cat.filterValue);
    }
    const target = document.getElementById('catalog-grid-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrimaryBtnClick = (slide: typeof heroSlides[0]) => {
    if (slide.primaryBtn.type === 'shop') {
      if (onCategorySelect && slide.primaryBtn.targetCategory) {
        onCategorySelect(slide.primaryBtn.targetCategory);
      }
      if (onShopNow) onShopNow();
      const target = document.getElementById('catalog-grid-start');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (slide.primaryBtn.type === 'scroll-sign') {
      const el = document.getElementById('sensitive-skin-education');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSecondaryBtnClick = (slide: typeof heroSlides[0]) => {
    if (slide.secondaryBtn.type === 'quiz') {
      if (onFindProducts) onFindProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (slide.secondaryBtn.type === 'scroll-oily') {
      if (onSelectConcern && slide.secondaryBtn.targetConcern) {
        onSelectConcern(slide.secondaryBtn.targetConcern);
      }
      const target = document.getElementById('catalog-grid-start');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else {
      const target = document.getElementById('sensitive-skin-education');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sensitiveSkinSigns = [
    {
      id: 'dryness',
      title: 'Dryness',
      concernFilter: 'Dry Skin',
      explanation: 'Hydrating ingredients such as glycerin and shea butter help support the skin barrier and retain moisture.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="M9.5 13.5a3 3 0 0 0 5 0" />
        </svg>
      )
    },
    {
      id: 'irritation',
      title: 'Irritation',
      concernFilter: 'Sensitive Skin',
      explanation: 'Gentle, soothing formulas help care for skin prone to redness, itching, burning, or stinging.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9-4 0-7.5 2.6-8.6 6.3C3 10.1 3 11 3 12a9 9 0 0 0 9 9z" />
          <path d="M8 12c1.5 2 4.5 2 6 0" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="15" cy="9" r="1" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'roughness',
      title: 'Roughness',
      concernFilter: 'Rough & Bumpy',
      explanation: 'Gentle cleansing and moisturizing help smooth uneven, flaky skin without over-drying.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7c3-2 6-2 9 0s6 2 9 0" />
          <path d="M3 12c3-2 6-2 9 0s6 2 9 0" />
          <path d="M3 17c3-2 6-2 9 0s6 2 9 0" />
        </svg>
      )
    },
    {
      id: 'tightness',
      title: 'Tightness',
      concernFilter: 'Dry Skin',
      explanation: 'Hydrating skincare helps address the uncomfortable tight feeling associated with dehydrated skin.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
          <path d="M9 15l-2 2" />
          <path d="M15 9l2-2" />
        </svg>
      )
    },
    {
      id: 'barrier',
      title: 'A Weakened Skin Barrier',
      concernFilter: 'Sensitive Skin',
      explanation: 'Skin-essential vitamins and nourishing ingredients help maintain, strengthen, and restore the skin barrier.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      )
    }
  ];

  const handleSignCardClick = (sign: typeof sensitiveSkinSigns[0], idx: number) => {
    setActiveSignIndex(idx);
    if (onSelectConcern) {
      onSelectConcern(sign.concernFilter);
    }
    const target = document.getElementById('catalog-grid-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="w-full bg-white text-[#002D62] selection:bg-[#E8F2FA] selection:text-[#002D62]">
      
      {/* 1. CATEGORY NAVIGATION ROW */}
      <nav 
        aria-label="Product Categories"
        className="border-b border-[#E8EFF5] bg-white sticky top-[64px] sm:top-[72px] z-20 backdrop-blur-md bg-white/95"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar py-3.5 space-x-1 sm:space-x-6 scroll-smooth">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-200 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-[#002D62] ${
                    isActive
                      ? 'text-[#002D62] font-bold'
                      : 'text-[#4A607A] hover:text-[#002D62]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isActive && (
                    <span 
                      aria-hidden="true"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#002D62] rounded-full transition-all duration-300" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. AUTO-SLIDING PROMOTIONAL HERO BANNER (3 SLIDES) */}
      <section 
        aria-label="Promotional Carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative bg-gradient-to-b ${currentSlideData.gradient} border-b border-[#E8EFF5] overflow-hidden transition-colors duration-700 focus:outline-none`}
      >
        {/* Subtle decorative background shapes */}
        <div 
          aria-hidden="true" 
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#E8F2FA]/60 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
        />
        <div 
          aria-hidden="true" 
          className="absolute top-1/2 -right-32 w-96 h-96 bg-[#F5EFE6]/50 rounded-full blur-3xl pointer-events-none transition-all duration-700" 
        />

        {/* Carousel Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative">
          
          {/* Active Slide Presentation */}
          <div 
            key={currentSlideData.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center animate-fade-in"
          >
            
            {/* Left Column: Editorial Product Messaging */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 order-1 text-left">
              
              {/* Clinical Kicker Label */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0082C8]">
                <span>{currentSlideData.kicker}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002D62] tracking-tight leading-[1.18] min-h-[72px] sm:min-h-[96px] md:min-h-[114px] flex items-center">
                {currentSlideData.headline}
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base md:text-lg text-[#3E526A] font-normal leading-relaxed max-w-xl min-h-[48px] sm:min-h-[56px]">
                {currentSlideData.supportingCopy}
              </p>

              {/* Editorial Feature Highlights */}
              <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-5 text-xs text-[#4A607A] font-medium">
                {currentSlideData.badges.map((badge, bIdx) => (
                  <span key={bIdx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0082C8]" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* CTA Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => handlePrimaryBtnClick(currentSlideData)}
                  className="px-8 py-3.5 bg-[#002D62] hover:bg-[#001D40] text-white font-bold text-sm tracking-wide rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#002D62] focus-visible:outline-offset-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {currentSlideData.primaryBtn.text}
                </button>

                <button
                  type="button"
                  onClick={() => handleSecondaryBtnClick(currentSlideData)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#002D62] hover:text-[#0082C8] underline-offset-4 hover:underline transition-colors cursor-pointer py-2 focus-visible:outline-2 focus-visible:outline-[#002D62]"
                >
                  <span>{currentSlideData.secondaryBtn.text}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: Original Product Photography */}
            <div className="lg:col-span-6 order-2">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Soft backdrop frame */}
                <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E5EDF4] shadow-sm hover:shadow-md transition-shadow duration-500">
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.alt}
                    className="w-full h-auto max-h-[440px] sm:max-h-[480px] object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                    loading="eager"
                  />
                  
                  {/* Subtle lower credential bar */}
                  <div className="px-5 py-3.5 bg-white/95 backdrop-blur-sm border-t border-[#EEF2F6] flex items-center justify-between text-xs text-[#4A607A]">
                    <span className="font-semibold text-[#002D62]">{currentSlideData.productName}</span>
                    <span className="text-[11px] text-[#6B7F96]">{currentSlideData.productSub}</span>
                  </div>
                </div>

                {/* Subtle soft shadow grounding */}
                <div 
                  aria-hidden="true" 
                  className="w-4/5 h-6 mx-auto bg-black/5 blur-xl rounded-full -mt-2 pointer-events-none" 
                />

              </div>
            </div>

          </div>

          {/* Carousel Controls: Arrows + Indicators + Pause/Play */}
          <div className="mt-8 pt-4 border-t border-[#E8EFF5]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left: Interactive Slide Track / Dots */}
            <div className="flex items-center gap-2.5">
              {heroSlides.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${slide.headline}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group relative h-2.5 transition-all duration-300 rounded-full cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-[#002D62] ${
                      isActive ? 'w-10 bg-[#002D62]/20' : 'w-2.5 bg-[#CBD8E5] hover:bg-[#9BB4CC]'
                    }`}
                  >
                    {/* Animated 3-second timer bar indicator inside active pill */}
                    {isActive && (
                      <span 
                        key={`progress-${currentSlide}-${isPaused}`}
                        className={`absolute left-0 top-0 bottom-0 bg-[#002D62] rounded-full pointer-events-none ${
                          isPaused ? 'w-full' : 'slide-progress-3s'
                        }`} 
                      />
                    )}
                  </button>
                );
              })}

              <span className="text-[11px] font-bold text-[#6B7F96] ml-2">
                0{currentSlide + 1} / 0{heroSlides.length}
              </span>
            </div>

            {/* Right: Previous / Next Buttons & Play/Pause */}
            <div className="flex items-center gap-2">
              {/* Play/Pause Button for accessibility */}
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume auto-sliding banner' : 'Pause auto-sliding banner'}
                className="w-8 h-8 rounded-full border border-[#D5E3EE] bg-white hover:bg-[#EEF5F9] text-[#002D62] flex items-center justify-center transition-colors cursor-pointer text-xs"
                title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              {/* Prev Button */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-9 h-9 rounded-full border border-[#D5E3EE] bg-white hover:bg-[#EEF5F9] text-[#002D62] hover:text-[#0082C8] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-9 h-9 rounded-full border border-[#D5E3EE] bg-white hover:bg-[#EEF5F9] text-[#002D62] hover:text-[#0082C8] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SENSITIVE-SKIN EDUCATION SECTION */}
      <section 
        id="sensitive-skin-education"
        aria-labelledby="education-heading"
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E8EFF5]"
      >
        <div className="max-w-[700px] mx-auto text-center space-y-4">
          
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0082C8] block">
            Clinical Understanding
          </span>

          <h2 
            id="education-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002D62] tracking-tight leading-snug"
          >
            Care for your sensitive skin
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#3E526A] font-normal leading-relaxed pt-1">
            70% of people around the world say that they have some degree of skin sensitivity. Our products are developed with dermatologists and clinically tested to defend against common signs of sensitivity while helping improve skin resilience.
          </p>

        </div>

        {/* 4. FIVE SIGNS OF SENSITIVE SKIN */}
        <div className="max-w-7xl mx-auto mt-12 sm:mt-16">
          
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-[#6B7F96] uppercase tracking-wider">
              Defending Against 5 Common Indicators
            </p>
          </div>

          {/* Cards Grid / Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {sensitiveSkinSigns.map((sign, idx) => {
              const isSelected = activeSignIndex === idx;
              return (
                <div
                  key={sign.id}
                  onClick={() => handleSignCardClick(sign, idx)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSignCardClick(sign, idx);
                    }
                  }}
                  className={`group relative rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-[#F2F7FA] border-[#0082C8] ring-2 ring-[#0082C8]/20 shadow-xs'
                      : 'bg-[#FCFDFE] hover:bg-[#F9FBFC] border-[#E5EDF4] hover:border-[#CCDDEB] shadow-xs hover:shadow-sm'
                  } focus-visible:outline-2 focus-visible:outline-[#002D62]`}
                >
                  <div className="space-y-4">
                    {/* Icon container: minimal original line icon */}
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E5EDF4] flex items-center justify-center text-[#0082C8] group-hover:text-[#002D62] group-hover:border-[#CCE0F0] transition-colors shadow-2xs">
                      {sign.icon}
                    </div>

                    {/* Short Heading */}
                    <h3 className="text-base font-bold text-[#002D62] tracking-tight group-hover:text-[#0082C8] transition-colors">
                      {sign.title}
                    </h3>

                    {/* Concise Explanation */}
                    <p className="text-xs text-[#4A607A] leading-relaxed">
                      {sign.explanation}
                    </p>
                  </div>

                  {/* Card bottom hint */}
                  <div className="mt-6 pt-4 border-t border-[#EEF3F7] flex items-center justify-between text-[11px] font-semibold text-[#0082C8] group-hover:text-[#002D62] transition-colors">
                    <span>Explore Care</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-[#6B7F96]">
              Click any sign to filter dermatologist-approved formulas engineered to address that specific concern.
            </p>
          </div>

        </div>
      </section>

      {/* 5. PRODUCT FINDER CALL-TO-ACTION */}
      <section 
        aria-label="Personalized Product Finder"
        className="w-full bg-[#EEF5F9] border-b border-[#DEE8F0] py-14 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Decorative minimal skincare shapes (uncluttered) */}
        <div 
          aria-hidden="true" 
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-[#D5E3EE] opacity-60 pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-[#D5E3EE] opacity-60 pointer-events-none" 
        />
        
        {/* Subtle decorative bottle silhouette on desktop */}
        <div 
          aria-hidden="true"
          className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none"
        >
          <svg width="120" height="180" viewBox="0 0 120 180" fill="none" stroke="#002D62" strokeWidth="2">
            <rect x="40" y="8" width="40" height="24" rx="4" />
            <rect x="52" y="0" width="16" height="8" rx="2" />
            <rect x="25" y="36" width="70" height="136" rx="16" />
            <line x1="38" y1="75" x2="82" y2="75" strokeDasharray="3 3" />
            <line x1="38" y1="95" x2="72" y2="95" />
            <line x1="38" y1="110" x2="64" y2="110" />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
          
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0082C8] block">
            Custom Regimen
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002D62] tracking-tight">
            Find the right care for your skin
          </h2>

          <p className="text-sm sm:text-base text-[#3E526A] font-normal leading-relaxed max-w-xl mx-auto">
            Explore personalized skincare solutions for cleansing, moisturizing, and protecting sensitive skin.
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                if (onFindProducts) {
                  onFindProducts();
                } else {
                  const target = document.getElementById('catalog-grid-start');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#002D62] hover:bg-[#001D40] text-white font-bold text-sm tracking-wide rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#002D62] focus-visible:outline-offset-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Find My Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </section>
  );
}
