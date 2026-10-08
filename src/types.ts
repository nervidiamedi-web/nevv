export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string; // 'Face Cleanser' | 'Moisturizer' | 'Sunscreen' | 'Body Lotion' etc.
  size?: string;
  badge?: string;
  tag?: string; // 'Bestseller' | 'Popular' | 'Canadian Import' | 'Derm-Fav' | 'Mega Size' | 'SPF 50+ High Defense' | 'Intense Hydration'
  short_description?: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  image: string;
  images?: string[];
  image_urls?: string[];
  is_active?: boolean;
  skinConcern: string[]; // 'Dry Skin' | 'Oily Skin' | 'Acne-Prone' | 'Sensitive Skin' | 'Anti-Aging'
  ingredients: string[];
  fullIngredients: string;
  rating: number;
  reviewsCount: number;
  benefits: string[];
  usage: string;
  reviews?: Review[];
  metaTitle?: string;
  metaDescription?: string;
  seoUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id?: string;
  productId?: string;
  author?: string;
  name?: string;
  rating: number;
  comment?: string;
  text?: string;
  date?: string;
  verified?: boolean;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
  readTime: string;
  keyTakeaways?: string[];
  relatedProductIds?: string[];
  metaTitle?: string;
  metaDescription?: string;
  seoUrl?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
  // Backward compatibility helper
  product?: Product;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
}

export interface QuizAnswers {
  skinType: string;
  concern: string;
  sensitivity: string;
  ageGroup: string;
  budget: string;
}

export interface QuizRecommendation {
  routine: {
    step: number;
    type: string;
    productId: string;
    productName: string;
    instructions: string;
  }[];
  explanation: string;
  tips: string[];
}

export interface DBState {
  products: Product[];
  articles: Article[];
  orders: Order[];
  promoBanner: {
    text: string;
    visible: boolean;
  };
}
