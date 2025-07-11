import React, { useState, useEffect } from 'react';
import { Filter, Search, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import VoiceSearch from '../components/VoiceSearch';
import { Product, CartItem, FilterState } from '../types';
import { products, categories, brands, dietaryOptions } from '../data/products';

interface ProductCatalogProps {
  searchQuery?: string;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onAddToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  searchQuery = '',
  cart,
  onAddToCart,
  onUpdateQuantity,
  onAddToast
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    brand: 'All',
    priceRange: [0, 500],
    dietary: []
  });
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loadCount, setLoadCount] = useState(9);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, loadCount));
  }, [filteredProducts, loadCount]);

  const applyFilters = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Brand filter
    if (filters.brand !== 'All') {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Dietary filter
    if (filters.dietary.length > 0) {
      filtered = filtered.filter(product =>
        product.dietary && filters.dietary.some(diet => product.dietary!.includes(diet))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleVoiceResult = (transcript: string) => {
    setSearchTerm(transcript);
    onAddToast(`Searching for: "${transcript}"`, 'info');
  };

  const getCartQuantity = (productId: string): number => {
    return cart.find(item => item.product.id === productId)?.quantity || 0;
  };

  const loadMore = () => {
    setLoadCount(prev => prev + 9);
  };

  const toggleDietaryFilter = (diet: string) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet]
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
              <VoiceSearch onResult={handleVoiceResult} onError={(error) => onAddToast(error, 'error')} />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white border-b shadow-sm border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [Number(e.target.value), prev.priceRange[1]] 
                    }))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      priceRange: [prev.priceRange[0], Number(e.target.value)] 
                    }))}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Dietary Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary</label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map(diet => (
                    <button
                      key={diet}
                      onClick={() => toggleDietaryFilter(diet)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors border ${
                        filters.dietary.includes(diet)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {displayedProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found matching your criteria</p>
            <button
              onClick={() => {
                setFilters({ category: 'All', brand: 'All', priceRange: [0, 500], dietary: [] });
                setSearchTerm('');
              }}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors shadow-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={getCartQuantity(product.id)}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>

            {displayedProducts.length < filteredProducts.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;