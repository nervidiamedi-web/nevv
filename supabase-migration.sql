-- ==============================================================================
-- SUPABASE MIGRATION & SEED SCRIPT
-- Cetaphil Clinical E-Commerce Products Update
-- ==============================================================================

-- 1. Safely add missing columns to public.products if they do not exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price numeric;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_urls text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer DEFAULT 250;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Ensure unique constraint on slug so ON CONFLICT (slug) works smoothly
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key'
    ) THEN
        BEGIN
            ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
        EXCEPTION
            WHEN duplicate_table THEN NULL;
            WHEN duplicate_object THEN NULL;
            WHEN others THEN NULL;
        END;
    END IF;
END $$;

-- 3. Upsert products safely using slug as unique key
INSERT INTO public.products (
  slug,
  name,
  category,
  size,
  badge,
  short_description,
  description,
  price,
  stock,
  is_active,
  image_urls,
  image_url,
  reviews,
  updated_at
)
VALUES
  -- Product 1: Cetaphil Oily Skin Cleanser (125ml)
  (
    'cetaphil-oily-skin-cleanser-125ml',
    'Cetaphil Oily Skin Cleanser (125ml)',
    'Face Cleanser',
    '125ml',
    'Bestseller',
    'A gentle, low-lather foaming gel cleanser clinically proven to deep clean pores, remove 99% of excess oil, dirt, and makeup, and improve the appearance of oily, combination, or acne-prone skin without stripping its natural moisture.',
    'Cetaphil Oily Skin Cleanser is specifically formulated for individuals dealing with oily, combination, or acne-prone skin. Enriched with a dermatologist-backed blend of Niacinamide (Vitamin B3), Panthenol (Pro-Vitamin B5), and hydrating Glycerin, this face wash strengthens the skin barrier while preserving its natural moisture. Its non-comedogenic, soap-free, and hypoallergenic formula transforms from a low-lather gel into a soft foam to deep-cleanse pores, eliminate excess sebum, and reduce the appearance of enlarged pores. Clinically tested to defend against the five signs of skin sensitivity—dryness, irritation, roughness, tightness, and a weakened skin barrier—it leaves the skin feeling clean, fresh, balanced, and residue-free. Ideal for daily morning and evening use.',
    4800,
    250,
    true,
    ARRAY['https://i.imgur.com/QexihB2.png', 'https://i.imgur.com/iVPPYxM.png'],
    'https://i.imgur.com/QexihB2.png',
    '[
      {
        "rating": 5,
        "text": "Godak hoda product ekak. සති දෙකක් විතර පාවිච්චි කරද්දි ලොකු වෙනසක් පෙනුනා. Face එක fresh පිට තියෙනවා දවසම."
      },
      {
        "rating": 5,
        "text": "Oily skin එකට ගොඩක් හොඳයි. මූණ සෝදපුවාම තෙල් ගතිය සේරම නැති වෙනවා ඒත් මූණ වේලෙන්නේ (dry ) නෑ. Pimples එන එකත් ගොඩක් අඩු වුනා. Highly recommended!"
      }
    ]'::jsonb,
    now()
  ),

  -- Product 2: Cetaphil Gentle Skin Cleanser 125ml
  (
    'cetaphil-gentle-skin-cleanser-125ml',
    'Cetaphil Gentle Skin Cleanser - Gentle Face Wash for Dry Sensitive Skin 125ml',
    'Face Cleanser',
    '125ml',
    'Popular',
    'A mild soap-free, fragrance-free cleanser that cleanses without irritation. It is pH-balanced, non-comedogenic, and helps retain the skin''s natural moisture barrier.',
    'This best-selling cleanser uses Micellar Technology to gently yet effectively remove dirt, makeup, and impurities while providing continuous hydration to protect against dryness. It can be used with or without water and can also serve as a light makeup remover. Dermatologically tested and clinically proven to be gentle on skin. Suitable for sensitive, dry, or normal skin.',
    3210,
    250,
    true,
    ARRAY['https://i.imgur.com/IxpPRLh.png', 'https://i.imgur.com/8S7otzn.png', 'https://i.imgur.com/hmQjviF.png', 'https://i.imgur.com/Slx1IRz.png', 'https://i.imgur.com/3dESHXI.png'],
    'https://i.imgur.com/IxpPRLh.png',
    '[
      {
        "rating": 5,
        "text": "Fast delivery, original product and well packed. I ordered this Cetaphil Gentle Skin Cleanser for the 3rd time and the quality is still perfect. Gentle on skin and worth the price. Highly recommended!"
      },
      {
        "rating": 5,
        "text": "REALLY FAST DELIVERY.. AND VERY CAREFULLY PACKAGED. The product itself looks decent. This is the made in Indian version I suppose, but I did some research and it is good. I would say it is original even though it is not made in Canada. I''ll update after a few weeks of using the product."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 3: Cetaphil Daily Facial Cleanser 591ml
  (
    'cetaphil-daily-facial-cleanser-591ml',
    'Cetaphil Daily Facial Cleanser 20 fl oz 591ml',
    'Face Cleanser',
    '20 fl oz / 591ml',
    'Canadian Import',
    'A gentle, soap-free daily facial cleanser designed for sensitive, combination, and oily skin.',
    'Cetaphil Daily Facial Cleanser is a dermatologist-recommended, non-comedogenic cleansing formula specially formulated for sensitive, combination, and oily skin types. Manufactured in Canada, this cleanser removes impurities, surface oils, and everyday buildup without stripping essential moisture. Enriched with Glycerin, Niacinamide (Vitamin B3 ), and Panthenol (Pro-Vitamin B5), it reinforces the natural skin barrier and leaves the face feeling clean, refreshed, and comfortable. Its soap-free formula is suitable for daily morning and evening use. Apply to wet skin, massage gently into a foam, and rinse thoroughly. For external use only. Avoid direct contact with eyes. Store in a cool, dry place.',
    13500,
    250,
    true,
    ARRAY['https://i.imgur.com/6dMsLux.png', 'https://i.imgur.com/0V0aKvE.png', 'https://i.imgur.com/Gqr4XQJ.png'],
    'https://i.imgur.com/6dMsLux.png',
    '[
      {
        "rating": 5,
        "text": "The best cleanser for oily, sensitive skin! I''ve been using this Cetaphil cleanser for over a month, and it''s a game changer. It removes all the excess oil and daily dirt without leaving my skin feeling tight or dry. The 591ml bottle lasts a really long time, making it great value for money."
      },
      {
        "rating": 5,
        "text": "සංවේදී සමට ඉතාම සුදුසු සෝදන නිපැයුමක්! තෙල් සහිත සහ මගේ වගේ sensitivity තියෙන සමකට මේක ගොඩක් හොදයි. මූණ හුඟක් වියළෙන්නේ නැතුව ලස්සනට පිරිසිදු වෙනවා. දිනපතා පාවිච්චි කරන්න බය නැතුව ගන්න පුළුවන් හොදම product එකක්."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 4: Cetaphil Moisturizing Cream 85g
  (
    'cetaphil-moisturizing-cream-85g',
    'Cetaphil Moisturizing Cream Very Dry To Normal Skin 85g',
    'Moisturizer',
    '85g',
    'Derm-Fav',
    'A rich, dermatologist-recommended cream that provides deep, long-lasting hydration for dry to very dry, sensitive skin.',
    'Cetaphil Moisturizing Cream 85g is a rich, clinically proven formula created to provide intensive hydration wherever the skin needs it most. Designed for normal to dry, sensitive skin, this fragrance-free and non-greasy cream instantly soothes and moisturizes the face, hands, feet, knees, elbows, and other dry areas. It absorbs quickly without leaving a greasy residue and is suitable for daily use. It is lanolin-free and formulated without common irritants. Suitable for daily dry skin care and sensitive skin.',
    5200,
    250,
    true,
    ARRAY['https://i.imgur.com/7Ffa5wT.png', 'https://i.imgur.com/ckg9mOL.png', 'https://i.imgur.com/1hfncF3.png'],
    'https://i.imgur.com/7Ffa5wT.png',
    '[
      {
        "rating": 5,
        "text": "Unbelievable hydration for ultra-sensitive skin! This cream saved my severely dry patches. It feels rich without being overly heavy, and within a few days, my skin barrier felt completely healed. Love that it has no fragrance or harsh ingredients."
      },
      {
        "rating": 5,
        "text": "වියළි සමට තියෙන හොඳම cream එකක්! මගේ සම ගොඩක් dry වෙනවා. මේ cream එක පාවිච්චි කරන්න පටන් ගත්තට පස්සේ සම ගොඩක් සිනිඳු වුණා. Sensitive skin තියෙන අයටත් කිසිම අතුරු ආබාධයක් නැතුව පාවිච්චි කරන්න පුළුවන් ඉතාම හොඳ product එකක්."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 5: Cetaphil Moisturizing Cream 453g
  (
    'cetaphil-moisturizing-cream-453g',
    'Cetaphil Moisturizing Cream Dry to Very Dry Skin 453g',
    'Moisturizer',
    '453g',
    'Mega Size',
    'A rich, non-greasy cream clinically proven to provide immediate and long-lasting 48-hour hydration while restoring the skin''s natural moisture barrier.',
    'Cetaphil Moisturizing Cream Dry to Very Dry Skin 453g is formulated to provide long-lasting hydration while restoring the skin''s natural barrier. It is clinically proven to provide immediate and long-lasting 48-hour relief for dry to very dry, sensitive skin. The fragrance-free and paraben-free formula is suitable for daily use on the face and body. Apply liberally after cleansing and patting the skin dry. Use as often as needed. Key ingredients include Aqua, Glycerin, Petrolatum, Dicaprylyl Ether, Dimethicone, Glyceryl Stearate, Cetyl Alcohol, Sunflower Seed Oil, Panthenol, Niacinamide, Almond Oil, Tocopherol, and other supporting ingredients.',
    10800,
    250,
    true,
    ARRAY['https://i.imgur.com/Uqn2O2G.png', 'https://i.imgur.com/8sIeirH.png', 'https://i.imgur.com/EKxqjk2.png', 'https://i.imgur.com/7g9tPAY.png'],
    'https://i.imgur.com/Uqn2O2G.png',
    '[
      {
        "name": "Preshila De silva",
        "rating": 5,
        "text": "ඔයාලා මං order කරපු product එකම ඉක්මනින්ම මට deliver කරලා තිබුනා...👍 ඒ වගේම ඒක ලැබුනට පස්සෙත් call කරලා හොද customer service එකක් දුන්නා...ඒක ගොඩක් වටිනවා 🥰"
      },
      {
        "name": "Mihiri Weerasinghe",
        "rating": 5,
        "text": "Your customer service is so friendly. The products gave me such great results, and I''m honestly so happy with my experience. Thank you ✨"
      }
    ]'::jsonb,
    now()
  ),

  -- Product 6: Cetaphil Sun SPF 50+ Light Gel 50ml
  (
    'cetaphil-sun-spf-50-light-gel-50ml',
    'Cetaphil Sun SPF 50+ Light Gel - High Protection Sunscreen for Sensitive Skin 50ml',
    'Sunscreen',
    '50ml',
    'SPF 50+ High Defense',
    'A lightweight, fast-absorbing SPF 50+ gel sunscreen that provides broad-spectrum UVA, UVB, and infrared protection while nourishing the skin with Vitamin E.',
    'Cetaphil Sun SPF 50+ Light Gel delivers very high sun protection for indoor and outdoor exposure. This gel-based sunscreen is lightweight, fast-absorbing, water-resistant, sweat-resistant, non-comedogenic, hypoallergenic, and dermatologically tested. It is suitable for all skin types, including sensitive skin. Enriched with Vitamin E, it hydrates the skin and helps protect against sunburn, redness, premature aging, roughness, and skin darkening. Unscented. Apply generously and evenly to the face, neck, hands, and feet 15–20 minutes before sun exposure. Reapply every two hours when outdoors, swimming, or sweating heavily.',
    10400,
    250,
    true,
    ARRAY['https://i.imgur.com/Tf2OUmd.png', 'https://i.imgur.com/01Rpycp.png', 'https://i.imgur.com/zYrM2YF.png'],
    'https://i.imgur.com/Tf2OUmd.png',
    '[
      {
        "rating": 5,
        "text": "මේ sunscreen එක ඇත්තටම ගොඩක් හොඳයි. ගෑවට පස්සේ තෙල් ගතියක් හෝ ඇලෙන ගතියක් කොහෙත්ම දැනෙන්නේ නැහැ. මගේ sensitive skin එකට කිසිම අසාත්මිකතාවයක් ආවේ නෑ."
      },
      {
        "rating": 5,
        "text": "Absolutely love the light gel texture! It blends completely clear without leaving any white cast, sits great under makeup, and gives solid sun protection throughout the day."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 7: Cetaphil DAM Lotion 100g
  (
    'cetaphil-dam-lotion-100g',
    'Cetaphil DAM Lotion - Ultra Hydrating Deep Moisturizing Body Lotion 100g',
    'Body Lotion',
    '100g',
    'Intense Hydration',
    'A clinically proven ultra-hydrating daily lotion designed to replenish, nourish, and protect continuously dry and sensitive skin for up to 48 hours.',
    'Cetaphil DAM Daily Advance Ultra Hydrating Lotion is an advanced, fragrance-free moisturizing formula for dry to very dry, sensitive skin. It contains Shea Butter, Niacinamide, Panthenol, Glycerin, Sunflower Oil, Macadamia Nut Oil, and Vitamin E. The lotion helps replenish the skin''s natural lipid barrier and lock in moisture. It is non-greasy, fast-absorbing, hypoallergenic, non-comedogenic, fragrance-free, paraben-free, sulphate-free, and dermatologically tested for sensitive skin. Ideal for daily use on the face and body.',
    5400,
    250,
    true,
    ARRAY['https://i.imgur.com/WU1LTFZ.png', 'https://i.imgur.com/LTjqjnM.png', 'https://i.imgur.com/E7QHfUB.png', 'https://i.imgur.com/iwEwnHr.png'],
    'https://i.imgur.com/WU1LTFZ.png',
    '[
      {
        "rating": 5,
        "text": "මගේ තියෙන්නේ ගොඩක් dry skin එකක්. මේ lotion එක පාවිච්චි කරන්න ගත්තට පස්සේ සම හොඳටම soft වුණා. ගෑවට පස්සේ තෙල් ගතියක් හිටින්නේ නැති නිසා දවස පුරාම කිසිම අපහසුවක් නැතුව ඉන්න පුළුවන්. Highly recommend කරනවා!"
      },
      {
        "rating": 5,
        "text": "This lotion is a lifesaver for chronically dry, flaky skin. It absorbs very quickly without feeling greasy or heavy, and it keeps my skin fully hydrated all day long without causing any breakouts."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 8: Cetaphil Baby Daily Lotion 400ml
  (
    'cetaphil-baby-daily-lotion-400ml',
    'Cetaphil Baby Daily Lotion – Hydrating Baby Body Lotion with Shea Butter & Olive Oil 400ml',
    'Baby Care',
    '400ml',
    'Pediatrician Choice',
    'Specially formulated to soothe, moisturize, and protect a baby''s delicate and sensitive skin from dryness around the clock with Organic Calendula, Shea Butter, and Olive Oil.',
    'Specially formulated to soothe, moisturize, and protect a baby''s delicate and sensitive skin from dryness around the clock. Dermatologist tested and clinically proven gentle for newborn and toddler skin; blends organic calendula extract with sweet almond oil, sunflower seed oil, and Vitamin E. Lightweight, non-greasy, absorbs quickly, hydrated for up to 24 hours. Formula Safety: Hypoallergenic, free from harsh chemicals/parabens/colorants, dermatologically tested, pediatrician recommended. Volume: 400ml.',
    8950,
    250,
    true,
    ARRAY['https://i.imgur.com/5not0r2.png', 'https://i.imgur.com/Y6MqQmH.png', 'https://i.imgur.com/7Ok6f5V.png', 'https://i.imgur.com/4UCc09l.png'],
    'https://i.imgur.com/5not0r2.png',
    '[
      {
        "rating": 5,
        "text": "බබාගෙ ඇඟේ ගාන්න ඇත්තටම ගොඩක් හොඳ lotion එකක්... 400ml බෝතලය ගොඩක් කල් පාවිච්චි කරන්නත් පුළුවන්."
      },
      {
        "rating": 5,
        "text": "Hands down the best lotion for babies with dry or sensitive skin. It absorbs almost instantly without leaving any greasy film, and it keeps my baby''s skin smooth and well-moisturized all day long."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 9: Cetaphil Baby Daily Moisturizing Lotion with Organic Calendula 400ml
  (
    'cetaphil-baby-calendula-lotion-400ml',
    'Cetaphil Baby Daily Moisturizing Lotion with Organic Calendula – Gentle Hydrating Baby Lotion 400ml',
    'Baby Care',
    '400ml',
    'Organic Calendula',
    'Provides 24-hour hydration, nourishment, and barrier protection for delicate baby skin with Organic Calendula, Sweet Almond Oil, and Shea Butter.',
    'Provides 24-hour hydration, nourishment, and barrier protection for delicate baby skin. Blends calming organic calendula flower extract with sweet almond oil, sunflower oil, and shea butter; enriched with Vitamin E and Pro-Vitamin B5. Absorbs rapidly, non-sticky. Dermatologically tested, hypoallergenic, safe from Day 1.',
    9900,
    250,
    true,
    ARRAY['https://i.imgur.com/HPN0BfO.png', 'https://i.imgur.com/hgwfgL3.png', 'https://i.imgur.com/oNtihl5.png', 'https://i.imgur.com/eCQxLEd.png', 'https://i.imgur.com/3NY1yBx.png'],
    'https://i.imgur.com/HPN0BfO.png',
    '[
      {
        "rating": 5,
        "text": "බබා ඉපදුන දවස්වල ඉඳන්ම පාවිච්චි කරන්න පුළුවන් සුපිරි lotion එකක්... බබාගෙ හමේ තියෙන වියළි ගතිය සම්පූර්ණයෙන්ම නැතිවෙලා හම ගොඩක් soft වුණා."
      },
      {
        "rating": 5,
        "text": "Absolutely wonderful moisturizer for delicate baby skin. It smells lovely with a subtle almond scent, hydrates all day long, and didn''t trigger any rash or irritation on my newborn''s sensitive skin."
      }
    ]'::jsonb,
    now()
  ),

  -- Product 10: Cetaphil Baby Shampoo 200ml
  (
    'cetaphil-baby-shampoo-200ml',
    'Cetaphil Baby Shampoo 200ml',
    'Baby Care',
    '200ml',
    'Tear-Free',
    'Specially formulated to gently cleanse a baby''s delicate hair and scalp with natural soothing Chamomile, Wheat Proteins, and Aloe Vera.',
    'Specially formulated to gently cleanse a baby''s delicate hair and scalp. Pediatrician-recommended, tear-free shampoo for a soothing bath time, leaving hair soft, manageable, and comfortable. A gentle, pediatrician-recommended formula for a baby''s delicate scalp and hair. Enriched with natural soothing chamomile extract, cleanses without stripping essential natural moisture.',
    5850,
    250,
    true,
    ARRAY['https://i.imgur.com/Wm9vTlr.png', 'https://i.imgur.com/mx6Utqy.png', 'https://i.imgur.com/j5wbDu7.png', 'https://i.imgur.com/DNdogMN.png'],
    'https://i.imgur.com/Wm9vTlr.png',
    '[
      {
        "rating": 5,
        "text": "Very gentle product for babies! My baby''s scalp is very sensitive, but this shampoo cleans softly without causing any redness or irritation. Doesn''t burn the eyes at all."
      },
      {
        "rating": 5,
        "text": "මගෙ බබාට ගොඩක් හොදට ගැළපුණා. සුවඳත් හරිම සූදින්, කොණ්ඩෙ හරිම සිනිඳු වෙනවා. ඇස් වලට ගියත් රිදෙන්නෙ නැති නිසා බබා බය නැතුව නානවා."
      }
    ]'::jsonb,
    now()
  )

ON CONFLICT (slug)
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  size = EXCLUDED.size,
  badge = EXCLUDED.badge,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  image_urls = EXCLUDED.image_urls,
  image_url = EXCLUDED.image_url,
  reviews = EXCLUDED.reviews,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 4. Explicit direct update to guarantee all 10 existing rows have their exact image_url set
UPDATE public.products SET image_url = 'https://i.imgur.com/QexihB2.png', image_urls = ARRAY['https://i.imgur.com/QexihB2.png', 'https://i.imgur.com/iVPPYxM.png'] WHERE slug = 'cetaphil-oily-skin-cleanser-125ml';
UPDATE public.products SET image_url = 'https://i.imgur.com/IxpPRLh.png', image_urls = ARRAY['https://i.imgur.com/IxpPRLh.png', 'https://i.imgur.com/8S7otzn.png', 'https://i.imgur.com/hmQjviF.png', 'https://i.imgur.com/Slx1IRz.png', 'https://i.imgur.com/3dESHXI.png'] WHERE slug = 'cetaphil-gentle-skin-cleanser-125ml';
UPDATE public.products SET image_url = 'https://i.imgur.com/6dMsLux.png', image_urls = ARRAY['https://i.imgur.com/6dMsLux.png', 'https://i.imgur.com/0V0aKvE.png', 'https://i.imgur.com/Gqr4XQJ.png'] WHERE slug = 'cetaphil-daily-facial-cleanser-591ml';
UPDATE public.products SET image_url = 'https://i.imgur.com/7Ffa5wT.png', image_urls = ARRAY['https://i.imgur.com/7Ffa5wT.png', 'https://i.imgur.com/ckg9mOL.png', 'https://i.imgur.com/1hfncF3.png'] WHERE slug = 'cetaphil-moisturizing-cream-85g';
UPDATE public.products SET image_url = 'https://i.imgur.com/Uqn2O2G.png', image_urls = ARRAY['https://i.imgur.com/Uqn2O2G.png', 'https://i.imgur.com/8sIeirH.png', 'https://i.imgur.com/EKxqjk2.png', 'https://i.imgur.com/7g9tPAY.png'] WHERE slug = 'cetaphil-moisturizing-cream-453g';
UPDATE public.products SET image_url = 'https://i.imgur.com/Tf2OUmd.png', image_urls = ARRAY['https://i.imgur.com/Tf2OUmd.png', 'https://i.imgur.com/01Rpycp.png', 'https://i.imgur.com/zYrM2YF.png'] WHERE slug = 'cetaphil-sun-spf-50-light-gel-50ml';
UPDATE public.products SET image_url = 'https://i.imgur.com/WU1LTFZ.png', image_urls = ARRAY['https://i.imgur.com/WU1LTFZ.png', 'https://i.imgur.com/LTjqjnM.png', 'https://i.imgur.com/E7QHfUB.png', 'https://i.imgur.com/iwEwnHr.png'] WHERE slug = 'cetaphil-dam-lotion-100g';
UPDATE public.products SET image_url = 'https://i.imgur.com/5not0r2.png', image_urls = ARRAY['https://i.imgur.com/5not0r2.png', 'https://i.imgur.com/Y6MqQmH.png', 'https://i.imgur.com/7Ok6f5V.png', 'https://i.imgur.com/4UCc09l.png'] WHERE slug = 'cetaphil-baby-daily-lotion-400ml';
UPDATE public.products SET image_url = 'https://i.imgur.com/HPN0BfO.png', image_urls = ARRAY['https://i.imgur.com/HPN0BfO.png', 'https://i.imgur.com/hgwfgL3.png', 'https://i.imgur.com/oNtihl5.png', 'https://i.imgur.com/eCQxLEd.png', 'https://i.imgur.com/3NY1yBx.png'] WHERE slug = 'cetaphil-baby-calendula-lotion-400ml';
UPDATE public.products SET image_url = 'https://i.imgur.com/Wm9vTlr.png', image_urls = ARRAY['https://i.imgur.com/Wm9vTlr.png', 'https://i.imgur.com/mx6Utqy.png', 'https://i.imgur.com/j5wbDu7.png', 'https://i.imgur.com/DNdogMN.png'] WHERE slug = 'cetaphil-baby-shampoo-200ml';

