import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Package, Truck, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { Order, TrackingUpdate } from '../types';
import { storage, formatCurrency } from '../utils/storage';

interface TrackingPageProps {
  onNavigate: (page: string) => void;
  onAddToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ onNavigate, onAddToast }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  useEffect(() => {
    const order = storage.getCurrentOrder();
    if (order) {
      setCurrentOrder(order);
      simulateTracking(order);
    }
  }, []);

  const simulateTracking = (order: Order) => {
    const updates: TrackingUpdate[] = [
      {
        status: 'placed',
        message: 'Order placed successfully',
        timestamp: order.timestamp,
        location: 'QuickCommerce Hub'
      }
    ];

    setTrackingUpdates(updates);

    // Simulate real-time updates
    const intervals = [
      { delay: 2000, status: 'confirmed', message: 'Order confirmed by store', location: 'Local Store' },
      { delay: 4000, status: 'preparing', message: 'Your order is being prepared', location: 'Local Store' },
      { delay: 6000, status: 'out_for_delivery', message: 'Out for delivery', location: 'On the way' },
    ];

    intervals.forEach(({ delay, status, message, location }) => {
      setTimeout(() => {
        const newUpdate: TrackingUpdate = {
          status,
          message,
          timestamp: Date.now(),
          location
        };
        setTrackingUpdates(prev => [...prev, newUpdate]);
        
        if (order) {
          const updatedOrder = { ...order, status: status as Order['status'] };
          setCurrentOrder(updatedOrder);
          storage.saveCurrentOrder(updatedOrder);
        }

        if (status === 'out_for_delivery') {
          onAddToast('Your order is out for delivery! 🚚', 'info');
        }
      }, delay);
    });

    // Update estimated time
    const updateTime = () => {
      if (order) {
        const remaining = order.estimatedDelivery - Date.now();
        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setEstimatedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setEstimatedTime('Delivered!');
          // Simulate delivery
          setTimeout(() => {
            const deliveredUpdate: TrackingUpdate = {
              status: 'delivered',
              message: 'Order delivered successfully',
              timestamp: Date.now(),
              location: 'Your Address'
            };
            setTrackingUpdates(prev => [...prev, deliveredUpdate]);
            if (order) {
              const deliveredOrder = { ...order, status: 'delivered' as Order['status'] };
              setCurrentOrder(deliveredOrder);
              storage.saveCurrentOrder(deliveredOrder);
              storage.clearCurrentOrder();
            }
            onAddToast('Order delivered successfully! 🎉', 'success');
          }, 2000);
        }
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    // Clear timer after 15 minutes
    setTimeout(() => clearInterval(timer), 15 * 60 * 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'preparing':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'out_for_delivery':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Orders</h2>
          <p className="text-gray-600 mb-6">You don't have any orders to track right now.</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order #{currentOrder.id}</h2>
              <p className="text-gray-600">
                Placed on {new Date(currentOrder.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(currentOrder.total)}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Estimated Delivery</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{estimatedTime}</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Your order will be delivered within 10 minutes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h3>
              
              <div className="space-y-6">
                {trackingUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(update.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{update.message}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(update.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {update.location && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {update.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Partner Info */}
            {currentOrder.status === 'out_for_delivery' && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Partner</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">RK</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Delivery Partner</p>
                    <p className="text-sm text-gray-600">Vehicle: Bike (MH 12 AB 1234)</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Details</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-6">
                {currentOrder.items.map(item => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-sm text-gray-600">{currentOrder.address}</p>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                <p className="text-sm text-gray-600">{currentOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium">Contact Support</span>
                  <p className="text-sm text-gray-600">Get help with your order</p>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium">Report an Issue</span>
                  <p className="text-sm text-gray-600">Something wrong with your order?</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;