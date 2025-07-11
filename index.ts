export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
  description: string;
  dietary?: string[];
  isTimeRelevant?: boolean;
  relevantTimes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  timeSlot: string;
  paymentMethod: string;
  timestamp: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: number;
}

export interface User {
  points: number;
  level: string;
  ordersCount: number;
  lastOrder?: Order;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
}

export interface FilterState {
  category: string;
  brand: string;
  priceRange: [number, number];
  dietary: string[];
}

export interface TrackingUpdate {
  status: string;
  message: string;
  timestamp: number;
  location?: string;
}