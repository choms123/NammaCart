import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Zap, Star, ChevronRight, Apple, Carrot, Cookie } from 'lucide-react';
import VoiceSearch from '../components/VoiceSearch';
import { getTimeBasedGreeting, getTimeOfDay, formatCurrency } from '../utils/storage';
import { products } from '../data/products';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [greeting, setGreeting] = useState('');
  const [timeBasedProducts, setTimeBasedProducts] = useState<any[]>([]);

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
    const currentTime = getTimeOfDay();
    const relevantProducts = products.filter(p => 
      p.isTimeRelevant && p.relevantTimes?.includes(currentTime)
    );
    setTimeBasedProducts(relevantProducts.slice(0, 3));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigate('catalog');
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setSearchQuery(transcript);
    onSearch(transcript);
    onNavigate('catalog');
  };

  const checkServiceability = () => {
    // Mock service check for Indian pincodes
    const serviceablePincodes = ['400001', '110001', '560001', '600001', '700001', '500001', '411001', '380001'];
    setIsServiceable(serviceablePincodes.includes(pincode));
  };

  const handleCategoryClick = (category: string) => {
    onSearch(category);
    onNavigate('catalog');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #f0fdf4 100%)' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%)' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-green-500 rounded-full mb-4 animate-bounce shadow-lg">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                <span className="text-orange-500">Namma</span><span className="text-green-500">Cart</span>
              </h1>
              <p className="text-xl text-gray-600 font-medium">Why wait, get now!</p>
            </div>

            {/* Typewriter Effect */}
            <div className="mb-8">
              <p className="text-2xl text-gray-700 mb-2">{greeting}</p>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                <span className="typewriter">Fresh groceries, fruits & snacks – in 10 minutes!</span>
              </div>
            </div>

            {/* Quick Category Buttons */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => handleCategoryClick('Vegetables')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-md"
              >
                <Carrot className="w-5 h-5" />
                <span>Vegetables</span>
              </button>
              <button
                onClick={() => handleCategoryClick('Fruits')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-md"
              >
                <Apple className="w-5 h-5" />
                <span>Fruits</span>
              </button>
              <button
                onClick={() => handleCategoryClick('Snacks')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-md"
              >
                <Cookie className="w-5 h-5" />
                <span>Snacks</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center bg-white rounded-full shadow-lg p-2 border border-gray-100">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for vegetables, fruits, snacks..."
                  className="flex-1 px-4 py-3 focus:outline-none bg-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <VoiceSearch onResult={handleVoiceResult} />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-6 py-3 rounded-full ml-2 transition-colors shadow-md"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center bg-white rounded-lg shadow-md p-2 border border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode (e.g., 400001)"
                  className="flex-1 px-3 py-2 focus:outline-none bg-transparent"
                />
                <button
                  onClick={checkServiceability}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Check
                </button>
              </div>
              {isServiceable !== null && (
                <div className={`mt-2 p-2 rounded-md ${isServiceable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isServiceable ? '✅ 10-minute delivery available!' : '❌ Service coming soon to your area'}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Start Shopping
              <ChevronRight className="inline w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose NammaCart?</h2>
            <p className="text-xl text-gray-600">India's fastest delivery service for fresh groceries & more</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-white border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">10-Minute Delivery</h3>
              <p className="text-gray-600">Lightning-fast delivery across major Indian cities</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-white border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fresh & Quality</h3>
              <p className="text-gray-600">Farm-fresh vegetables, fruits and quality products</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-white border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Shopping</h3>
              <p className="text-gray-600">Voice search in Hindi/English and AI recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time-Based Recommendations */}
      {timeBasedProducts.length > 0 && (
        <div className="py-16" style={{ backgroundColor: '#fafafa' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect for Right Now</h2>
              <p className="text-xl text-gray-600">Curated picks for this time of day</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {timeBasedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">{formatCurrency(product.price)}</span>
                      <button
                        onClick={() => onNavigate('catalog')}
                        className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Categories */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Everything you need, delivered in minutes</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Vegetables', icon: '🥕', color: 'bg-green-50 text-green-700 border-green-200', category: 'Vegetables' },
              { name: 'Fruits', icon: '🍎', color: 'bg-orange-50 text-orange-700 border-orange-200', category: 'Fruits' },
              { name: 'Snacks', icon: '🍪', color: 'bg-purple-50 text-purple-700 border-purple-200', category: 'Snacks' },
              { name: 'Groceries', icon: '🛒', color: 'bg-blue-50 text-blue-700 border-blue-200', category: 'Groceries' },
              { name: 'Electronics', icon: '📱', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', category: 'Electronics' },
              { name: 'Household', icon: '🏠', color: 'bg-pink-50 text-pink-700 border-pink-200', category: 'Household' }
            ].map(category => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.category)}
                className={`p-6 rounded-lg ${category.color} hover:scale-105 transition-transform border shadow-sm`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-bold text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;