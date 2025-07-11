import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, ShoppingCart, RotateCcw, Gift, Settings, Menu, X, MapPin } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ProductCatalog from './pages/ProductCatalog';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ReorderPage from './pages/ReorderPage';
import RewardsPage from './pages/RewardsPage';
import AdminPanel from './pages/AdminPanel';
import TrackingPage from './pages/TrackingPage';
import ChatAssistant from './components/ChatAssistant';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { CartItem, Product, Order } from './types';
import { storage } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const savedCart = storage.getCart();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    storage.saveCart(cart);
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    addToast(`${product.name} added to cart!`, 'success');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    setCart(cart.filter(item => item.product.id !== productId));
    if (item) {
      addToast(`${item.product.name} removed from cart`, 'info');
    }
  };

  const handleOrderComplete = (order: Order) => {
    setCart([]);
    storage.clearCart();
  };

  const handleReorder = (items: CartItem[]) => {
    setCart(items);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'catalog', label: 'Shop', icon: ShoppingBag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'tracking', label: 'Track', icon: MapPin },
    { id: 'reorder', label: 'Reorder', icon: RotateCcw },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <LandingPage
            onNavigate={setCurrentPage}
            onSearch={handleSearch}
          />
        );
      case 'catalog':
        return (
          <ProductCatalog
            searchQuery={searchQuery}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onAddToast={addToast}
          />
        );
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onNavigate={setCurrentPage}
            onAddToast={addToast}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cart={cart}
            onOrderComplete={handleOrderComplete}
            onNavigate={setCurrentPage}
            onAddToast={addToast}
          />
        );
      case 'tracking':
        return (
          <TrackingPage
            onNavigate={setCurrentPage}
            onAddToast={addToast}
          />
        );
      case 'reorder':
        return (
          <ReorderPage
            onReorder={handleReorder}
            onNavigate={setCurrentPage}
            onAddToast={addToast}
          />
        );
      case 'rewards':
        return <RewardsPage onAddToast={addToast} />;
      case 'admin':
        return <AdminPanel onAddToast={addToast} />;
      default:
        return (
          <LandingPage
            onNavigate={setCurrentPage}
            onSearch={handleSearch}
          />
        );
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center mr-2">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-orange-500">Namma</span><span className="text-green-500">Cart</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === item.id
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'cart' && cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigationItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`relative w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.id === 'cart' && cartItemCount > 0 && (
                      <span className="absolute right-3 top-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{renderPage()}</main>

      {/* Chat Assistant */}
      <ChatAssistant />

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

export default App;