import { CartItem, Order, User } from '../types';

const CART_KEY = 'quickcommerce_cart';
const USER_KEY = 'quickcommerce_user';
const LAST_ORDER_KEY = 'quickcommerce_last_order';
const CURRENT_ORDER_KEY = 'quickcommerce_current_order';

export const storage = {
  // Cart operations
  getCart: (): CartItem[] => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart: (cart: CartItem[]): void => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  // User operations
  getUser: (): User => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : { points: 0, level: 'Bronze', ordersCount: 0 };
  },

  saveUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Order operations
  getLastOrder: (): Order | null => {
    const order = localStorage.getItem(LAST_ORDER_KEY);
    return order ? JSON.parse(order) : null;
  },

  saveLastOrder: (order: Order): void => {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  },

  // Current order tracking
  getCurrentOrder: (): Order | null => {
    const order = localStorage.getItem(CURRENT_ORDER_KEY);
    return order ? JSON.parse(order) : null;
  },

  saveCurrentOrder: (order: Order): void => {
    localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(order));
  },

  clearCurrentOrder: (): void => {
    localStorage.removeItem(CURRENT_ORDER_KEY);
  },

  // Product operations (for admin)
  getProducts: () => {
    const products = localStorage.getItem('quickcommerce_products');
    return products ? JSON.parse(products) : [];
  },

  saveProducts: (products: any[]) => {
    localStorage.setItem('quickcommerce_products', JSON.stringify(products));
  }
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

export const getTimeBasedGreeting = (): string => {
  const timeOfDay = getTimeOfDay();
  const greetings = {
    morning: '🌅 Good Morning! Start your day right',
    afternoon: '☀️ Good Afternoon! Get what you need',
    evening: '🌆 Good Evening! Quick delivery awaits',
    night: '🌙 Late Night? We deliver in 10 minutes'
  };
  return greetings[timeOfDay];
};

export const generateOrderId = (): string => {
  const prefix = 'QC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};