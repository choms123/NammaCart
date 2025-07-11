import React, { useState, useEffect } from 'react';
import { RotateCcw, ShoppingBag, Plus } from 'lucide-react';
import { Order, CartItem } from '../types';
import { storage } from '../utils/storage';

interface ReorderPageProps {
  onReorder: (items: CartItem[]) => void;
  onNavigate: (page: string) => void;
  onAddToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ReorderPage: React.FC<ReorderPageProps> = ({
  onReorder,
  onNavigate,
  onAddToast
}) => {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    const order = storage.getLastOrder();
    setLastOrder(order);
  }, []);

  const handleReorder = () => {
    if (!lastOrder) {
      onAddToast('No previous order found', 'error');
      return;
    }

    onReorder(lastOrder.items);
    onAddToast('Your last order has been added to cart!', 'success');
    onNavigate('cart');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Previous Orders</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reorder</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Last Order</h2>
              <p className="text-gray-600">Placed on {formatDate(lastOrder.timestamp)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">${lastOrder.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Order #{lastOrder.id}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-gray-700">{lastOrder.address}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Time Slot</h3>
              <p className="text-gray-700">{lastOrder.timeSlot}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Payment Method</h3>
              <p className="text-gray-700">{lastOrder.paymentMethod}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {lastOrder.items.map(item => (
                <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                    <p className="text-gray-600 text-sm">{item.product.description}</p>
                    <p className="text-blue-600 font-bold">${item.product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-bold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reorder Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReorder}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reorder This Cart</span>
            </button>
          </div>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Want to modify your order?</p>
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add More Items</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReorderPage;