import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Droplets, 
  ArrowRight, 
  Building2, 
  HeartHandshake, 
  Copy, 
  Check 
} from 'lucide-react';

interface WhyCetaphilPageProps {
  setCurrentView: (view: string) => void;
  setSelectedProductId?: (id: string | null) => void;
}

export default function WhyCetaphilPage({ setCurrentView }: WhyCetaphilPageProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info.nervidia.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-nervidia-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0A1C2A]">
      {/* Top Breadcrumb / Navigation indicator */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentView('shop');
                window.history.pushState(null, '', '/');
              }}
              className="hover:text-[#0082C8] transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="font-semibold text-[#002D62]">Why Cetaphil — Nervidia Sri Lanka</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0082C8] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Dealer in Sri Lanka</span>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF5F9] via-white to-[#f8f9ff] pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Partner Badge */}
              <div className="inline-flex items-center gap-3 bg-white px-3.5 py-2 rounded-full border border-blue-100 shadow-xs">
                <img
                  src="https://i.imgur.com/IZwtACZ.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/src/assets/images/nervidia_logo.png';
                  }}
                  alt="Nervidia Logo"
                  referrerPolicy="no-referrer"
                  className="h-6 w-auto object-contain rounded-full"
                />
                <span className="text-xs font-semibold text-[#002D62] tracking-wide">
                  Nervidia Healthcare &amp; Skincare
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0082C8]" />
                <span className="text-[11px] font-bold text-[#0082C8] uppercase tracking-wider">
                  Authorized Dealer
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#002D62] tracking-tight leading-[1.15]">
                Why Cetaphil
              </h1>

              {/* Supporting text */}
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl font-normal">
                Discover Cetaphil with Nervidia, an authorized dealer in Sri Lanka for selected internationally recognized brands.
              </p>

              {/* Value points */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#0082C8] flex-shrink-0" />
                  <span className="font-medium text-[#0A1C2A]">100% Authentic Products</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#43B02A] flex-shrink-0" />
                  <span className="font-medium text-[#0A1C2A]">Direct Local Distribution</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#002D62] text-white text-sm font-bold rounded-xl hover:bg-[#001D40] transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Nervidia
                </button>
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.history.pushState(null, '', '/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#002D62] text-sm font-bold rounded-xl border border-gray-200 hover:border-[#0082C8] hover:text-[#0082C8] transition-all cursor-pointer"
                >
                  Explore Cetaphil Products
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#0082C8]/10 to-[#43B02A]/10 rounded-3xl filter blur-xl opacity-70" />
                
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
                  {/* Co-branding logos display */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Authorized Dealer
                      </span>
                      <img
                        src="https://i.imgur.com/IZwtACZ.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/src/assets/images/nervidia_logo.png';
                        }}
                        alt="Nervidia"
                        referrerPolicy="no-referrer"
                        className="h-14 w-auto object-contain mt-1"
                      />
                    </div>
                    <div className="text-gray-300 text-lg font-light">✕</div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Global Brand
                      </span>
                      <img
                        src="https://i.imgur.com/DCJMlkw.png"
                        alt="Cetaphil"
                        referrerPolicy="no-referrer"
                        className="h-10 w-auto object-contain mt-2"
                      />
                    </div>
                  </div>

                  {/* Skincare Product Image */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#EEF5F9] to-white p-4 flex items-center justify-center">
                    <img
                      src="https://i.imgur.com/stYPYVz.jpeg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/src/assets/images/banner_slide_1.jpg';
                      }}
                      alt="Cetaphil Skincare Range"
                      referrerPolicy="no-referrer"
                      className="w-full h-56 sm:h-64 object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Trust statement */}
                  <div className="bg-[#f8f9ff] rounded-2xl p-4 border border-blue-50 text-xs text-gray-600 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#0082C8] flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Nervidia supplies authentic Cetaphil products to healthcare professionals, pharmacies, and consumers across Sri Lanka.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0082C8] bg-[#EEF5F9] px-3.5 py-1 rounded-full border border-[#D1E5F2]">
              About Nervidia
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002D62] tracking-tight">
              Our Story
            </h2>
            <div className="w-16 h-1 bg-[#0082C8] mx-auto rounded-full mt-2" />
          </div>

          <div className="bg-[#f8f9ff] rounded-3xl p-8 sm:p-12 border border-blue-50 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200/60">
              <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shadow-2xs">
                <Building2 className="w-6 h-6 text-[#002D62]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#002D62]">
                  Nervidia — Connecting Sri Lanka with Trusted Healthcare &amp; Skincare
                </h3>
                <p className="text-xs text-gray-500">
                  Authorized Dealer for Internationally Recognized Brands
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              Nervidia operates in Sri Lanka as an authorized dealer for internationally recognized brands, including Cetaphil, and distributes a range of recognized brands in the local market. Emphasizing a steadfast commitment to quality, Nervidia focuses on connecting Sri Lankan customers with trusted brands that prioritize gentle, dependable care.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0082C8] flex items-center justify-center font-bold text-sm mb-3">
                  01
                </div>
                <h4 className="text-sm font-bold text-[#002D62] mb-1">Authorized Channel</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Direct authorized supply line for selected global brands in Sri Lanka.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0082C8] flex items-center justify-center font-bold text-sm mb-3">
                  02
                </div>
                <h4 className="text-sm font-bold text-[#002D62] mb-1">Local Market Access</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Distributing recognized healthcare and skincare products across the island.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0082C8] flex items-center justify-center font-bold text-sm mb-3">
                  03
                </div>
                <h4 className="text-sm font-bold text-[#002D62] mb-1">Customer Dedication</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fostering enduring customer trust through genuine, dependable products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CETAPHIL */}
      <section className="py-16 sm:py-20 bg-[#f8f9ff] border-y border-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0082C8] bg-white px-3.5 py-1 rounded-full border border-blue-100">
              Gentle Sensitive Skin Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002D62] tracking-tight">
              Why Cetaphil
            </h2>
            <div className="w-16 h-1 bg-[#0082C8] mx-auto rounded-full mt-2" />
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Cetaphil is a globally recognized skincare brand dedicated to gentle, non-irritating formulations designed specifically for sensitive and everyday skin needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0082C8] flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#002D62] mb-2.5">
                Gentle Formulations
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Formulated to cleanse and moisturize sensitive skin gently, helping preserve skin comfort without causing dryness or harshness.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#43B02A] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#002D62] mb-2.5">
                Skin Barrier Support
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Carefully balanced ingredients help support and maintain the natural skin barrier against everyday environmental elements.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0082C8] flex items-center justify-center mb-6">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#002D62] mb-2.5">
                Daily Hydration &amp; Cleansing
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                From gentle skin cleansers to moisturizing lotions and creams, Cetaphil provides complete, step-by-step skincare essentials for the whole family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR INGREDIENTS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0082C8] bg-[#EEF5F9] px-3.5 py-1 rounded-full border border-[#D1E5F2]">
              Active Ingredient Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002D62] tracking-tight">
              Our Ingredients
            </h2>
            <div className="w-16 h-1 bg-[#0082C8] mx-auto rounded-full mt-2" />
            
            {/* Required exact copy */}
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-normal pt-2">
              Cetaphil uses a wide range of key active ingredients, such as niacinamide, ceramides and hyaluronic acid, each with unique and effective properties to address various skin concerns.
            </p>
          </div>

          {/* Three simple ingredient cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Card 1: Niacinamide */}
            <div className="bg-[#f8f9ff] rounded-3xl p-8 border border-blue-50 hover:border-blue-200 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#002D62] border border-blue-100 flex items-center justify-center font-bold text-lg mb-6 shadow-2xs">
                  B3
                </div>
                <h3 className="text-xl font-bold text-[#002D62] mb-2">
                  Niacinamide
                </h3>
                <p className="text-xs font-semibold text-[#0082C8] uppercase tracking-wider mb-4">
                  Vitamin B3
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  An essential vitamin known for supporting skin smoothness, addressing uneven tone, and contributing to overall skin comfort and vitality.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0082C8]" />
                <span>Found in gentle cleansers &amp; lotions</span>
              </div>
            </div>

            {/* Card 2: Ceramides */}
            <div className="bg-[#f8f9ff] rounded-3xl p-8 border border-blue-50 hover:border-blue-200 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#002D62] border border-blue-100 flex items-center justify-center font-bold text-lg mb-6 shadow-2xs">
                  CR
                </div>
                <h3 className="text-xl font-bold text-[#002D62] mb-2">
                  Ceramides
                </h3>
                <p className="text-xs font-semibold text-[#0082C8] uppercase tracking-wider mb-4">
                  Essential Lipids
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Naturally occurring lipids that play an integral role in supporting the skin barrier and maintaining moisture retention within the skin surface.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0082C8]" />
                <span>Found in barrier-supporting creams</span>
              </div>
            </div>

            {/* Card 3: Hyaluronic Acid */}
            <div className="bg-[#f8f9ff] rounded-3xl p-8 border border-blue-50 hover:border-blue-200 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-[#002D62] border border-blue-100 flex items-center justify-center font-bold text-lg mb-6 shadow-2xs">
                  HA
                </div>
                <h3 className="text-xl font-bold text-[#002D62] mb-2">
                  Hyaluronic Acid
                </h3>
                <p className="text-xs font-semibold text-[#0082C8] uppercase tracking-wider mb-4">
                  Hydrating Agent
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  A powerful hydrating molecule that attracts and locks in hydration, helping skin feel soft, supple, and comfortably quenched.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0082C8]" />
                <span>Found in lightweight hydrating serums &amp; gels</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NERVIDIA IN SRI LANKA */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#f8f9ff] to-white border-t border-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#002D62] text-white rounded-3xl p-8 sm:p-14 shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0082C8] bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
                Authorized Dealer
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Trusted Brands, Local Access
              </h2>

              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
                Nervidia serves Sri Lanka as an authorized dealer for selected globally recognized brands, including Cetaphil, and distributes a range of well-known brands locally.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#43B02A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Authentic Distribution</h4>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      Guaranteeing Sri Lankan customers direct access to genuine healthcare and skincare formulations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  <HeartHandshake className="w-5 h-5 text-[#0082C8] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Reliable Local Support</h4>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      Dedicated inquiries, trade assistance, and customer service readily available in Sri Lanka.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT NERVIDIA */}
      <section id="contact-nervidia-section" className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0082C8] bg-[#EEF5F9] px-3.5 py-1 rounded-full border border-[#D1E5F2]">
              Customer &amp; Trade Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002D62] tracking-tight">
              Talk to Nervidia
            </h2>
            <div className="w-16 h-1 bg-[#0082C8] mx-auto rounded-full mt-2" />
            <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Have questions about Cetaphil products or local distribution in Sri Lanka? Reach out to our dedicated team.
            </p>
          </div>

          <div className="bg-[#f8f9ff] rounded-3xl p-8 sm:p-12 border border-blue-50 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Call Us Button */}
              <a
                href="tel:+94766449830"
                className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-transparent hover:border-[#0082C8] shadow-xs hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002D62] group-hover:bg-[#002D62] group-hover:text-white transition-colors flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-gray-500 font-medium">Direct Telephone</span>
                    <h4 className="text-base font-bold text-[#002D62]">Call Us</h4>
                    <p className="text-sm font-semibold text-[#0082C8] mt-0.5">+94 76 644 9830</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0082C8] group-hover:translate-x-1 transition-all" />
              </a>

              {/* WhatsApp Us Button */}
              <a
                href="https://wa.me/94766449830"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-transparent hover:border-[#43B02A] shadow-xs hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-[#43B02A] group-hover:bg-[#43B02A] group-hover:text-white transition-colors flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-gray-500 font-medium">Instant Messaging</span>
                    <h4 className="text-base font-bold text-[#002D62]">WhatsApp Us</h4>
                    <p className="text-sm font-semibold text-[#43B02A] mt-0.5">+94 76 644 9830</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#43B02A] group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            {/* Email info card - rendered exactly as supplied */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-[#EEF5F9] text-[#0082C8] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Company Inquiries Contact</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-mono font-bold text-[#002D62]">
                      info.nervidia.com
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#EEF5F9] hover:bg-[#D1E5F2] text-[#002D62] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-[#43B02A]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#0082C8]" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NERVIDIA FOOTER */}
      <footer className="bg-[#002D62] text-gray-200 border-t border-[#001D40] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Logo and summary */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white px-4 py-2 rounded-xl inline-flex items-center shadow-xs">
                <img
                  src="https://i.imgur.com/IZwtACZ.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/src/assets/images/nervidia_logo.png';
                  }}
                  alt="Nervidia Logo"
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-blue-100/80 leading-relaxed max-w-sm">
                Nervidia operates in Sri Lanka as an authorized dealer for internationally recognized brands, including Cetaphil, delivering authentic skincare and healthcare solutions across the nation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-blue-200/80">
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.history.pushState(null, '', '/');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Cetaphil Catalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('baby');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Baby Care Range
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('tips');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Skincare Tips &amp; Routines
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollToContact}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact Nervidia
                  </button>
                </li>
              </ul>
            </div>

            {/* Essential Contact Details */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                Contact Details
              </h4>
              <ul className="space-y-2.5 text-xs text-blue-200/90">
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0082C8]" />
                  <a href="tel:+94766449830" className="hover:text-white transition-colors font-medium">
                    +94 76 644 9830
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#43B02A]" />
                  <a href="https://wa.me/94766449830" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
                    +94 76 644 9830 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#0082C8]" />
                  <span className="font-mono text-white">info.nervidia.com</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-blue-200/60">
            <p>© {new Date().getFullYear()} Nervidia. All rights reserved. Authorized Dealer in Sri Lanka.</p>
            <p>Cetaphil® is a registered trademark of Galderma S.A.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
