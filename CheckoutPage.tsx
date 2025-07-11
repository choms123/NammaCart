import React, { useState } from 'react';
import { MapPin, Clock, CreditCard, Check } from 'lucide-react';
import { CartItem, Order } from '../types';
import { storage, generateOrderId, formatCurrency } from '../utils/storage';
import { createConfetti } from '../utils/confetti';

interface CheckoutPageProps {
  cart: CartItem[];
  onOrderComplete: (order: Order) => void;
  onNavigate: (page: string) => void;
  onAddToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  onOrderComplete,
  onNavigate,
  onAddToast
}) => {
  const [address, setAddress] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const timeSlots = [
    { id: '1', time: 'Next 10 minutes', available: true },
    { id: '2', time: '10-20 minutes', available: true },
    { id: '3', time: '20-30 minutes', available: true },
    { id: '4', time: '30-40 minutes', available: false },
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const deliveryFee = subtotal > 500 ? 0 : 25; // Free delivery above ₹500
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      onAddToast('Please enter your delivery address', 'error');
      return;
    }

    if (!selectedTimeSlot) {
      onAddToast('Please select a time slot', 'error');
      return;
    }

    if (!selectedPayment) {
      onAddToast('Please select a payment method', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = generateOrderId();
    const estimatedDelivery = Date.now() + (10 * 60 * 1000); // 10 minutes from now

    const order: Order = {
      id: orderId,
      items: cart,
      total,
      address,
      timeSlot: timeSlots.find(slot => slot.id === selectedTimeSlot)?.time || '',
      paymentMethod: paymentMethods.find(method => method.id === selectedPayment)?.name || '',
      timestamp: Date.now(),
      status: 'placed',
      estimatedDelivery
    };

    // Update user points
    const user = storage.getUser();
    user.points += Math.floor(total / 10); // 1 point per ₹10
    user.ordersCount += 1;
    if (user.points >= 500 && user.level === 'Bronze') user.level = 'Silver';
    if (user.points >= 1000 && user.level === 'Silver') user.level = 'Gold';
    storage.saveUser(user);

    storage.saveLastOrder(order);
    storage.saveCurrentOrder(order);
    onOrderComplete(order);
    createConfetti();
    onAddToast(`Order ${orderId} placed successfully! 🎉`, 'success');
    setIsProcessing(false);
    onNavigate('tracking');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            {/* Time Slot Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Select Time Slot</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timeSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                    disabled={!slot.available}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedTimeSlot === slot.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : slot.available
                        ? 'border-gray-300 hover:border-blue-300'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{slot.time}</span>
                      {selectedTimeSlot === slot.id && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm mt-1">
                      {slot.available ? 'Available' : 'Not Available'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                      </div>
                      {selectedPayment === method.id && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded"
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

              {/* Pricing */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-bold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-bold">
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {subtotal > 500 && (
                  <div className="text-green-600 text-sm">
                    🎉 Free delivery on orders above ₹500!
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 hover:scale-105'
                } text-white`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;