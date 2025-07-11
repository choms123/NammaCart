import React from 'react';
import { Plus, Minus, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/storage';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAddToCart,
  onUpdateQuantity
}) => {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
            <AlertTriangle className="w-3 h-3" />
            Only {product.stock} left!
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-orange-600">{formatCurrency(product.price)}</span>
          <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{product.brand}</span>
        </div>
        
        {product.dietary && product.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.dietary.map(diet => (
              <span
                key={diet}
                className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200"
              >
                {diet}
              </span>
            ))}
          </div>
        )}
        
        {quantity === 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white hover:scale-105 shadow-md'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-lg px-4">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors disabled:bg-gray-300 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;