import { create } from 'zustand';

export type Product = {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryEn?: string;
  rating?: number;
  description?: string;
  descriptionEn?: string;
  specs?: { label: string; labelEn?: string; value: string; valueEn?: string }[];
  isNew?: boolean;
};

export type CartItem = Product & {
  quantity: number;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  trackingStep?: number;
  customer?: CustomerInfo;
};

interface ShopState {
  cart: CartItem[];
  orders: Order[];
  favorites: string[];
  currentView: 'home' | 'product' | 'cart' | 'checkout' | 'tracking' | 'rating' | 'history' | 'room-configurator';
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  placeOrder: (order: Order) => void;
  setCurrentView: (view: ShopState['currentView']) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedOrder: (order: Order | null) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  cart: [],
  orders: [],
  favorites: [],
  currentView: 'home',
  selectedProduct: null,
  selectedOrder: null,

  addToCart: (product) => set((state) => {
    const existing = state.cart.find((p) => p.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((p) => p.id !== productId),
  })),

  updateQuantity: (productId, delta) => set((state) => ({
    cart: state.cart.map((p) => {
      if (p.id === productId) {
        return { ...p, quantity: Math.max(1, p.quantity + delta) };
      }
      return p;
    }),
  })),

  clearCart: () => set({ cart: [] }),

  toggleFavorite: (productId) => set((state) => {
    if (state.favorites.includes(productId)) {
      return { favorites: state.favorites.filter((id) => id !== productId) };
    }
    return { favorites: [...state.favorites, productId] };
  }),

  placeOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
    cart: [],
    currentView: 'tracking',
    selectedOrder: order
  })),

  setCurrentView: (view) => set({ currentView: view }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));