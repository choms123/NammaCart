import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { products } from '../data/products';
import { formatCurrency } from '../utils/storage';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Namaste! 🙏 I\'m your shopping assistant. How can I help you today?',
      isBot: true,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('tea') || message.includes('chai')) {
      const teas = products.filter(p => p.name.toLowerCase().includes('tea'));
      return `Perfect for chai time! ☕ I recommend: ${teas.map(p => `${p.name} (${formatCurrency(p.price)})`).join(', ')}. Would you like me to add any to your cart?`;
    }
    
    if (message.includes('grocery') || message.includes('groceries') || message.includes('food')) {
      const groceries = products.filter(p => p.category === 'Groceries');
      return `Great! Here are some popular groceries: ${groceries.slice(0, 3).map(p => `${p.name} (${formatCurrency(p.price)})`).join(', ')}. All delivered in 10 minutes! 🛒`;
    }
    
    if (message.includes('electronics') || message.includes('mobile') || message.includes('phone')) {
      const electronics = products.filter(p => p.category === 'Electronics');
      return `Check out these electronics: ${electronics.map(p => `${p.name} (${formatCurrency(p.price)})`).join(', ')}. Fast delivery guaranteed! ⚡`;
    }
    
    if (message.includes('household') || message.includes('cleaning') || message.includes('detergent')) {
      const household = products.filter(p => p.category === 'Household');
      return `For household needs: ${household.slice(0, 3).map(p => `${p.name} (${formatCurrency(p.price)})`).join(', ')}. Keep your home clean and fresh! 🏠`;
    }
    
    if (message.includes('order') || message.includes('delivery') || message.includes('track')) {
      return 'Your order will be delivered in under 10 minutes! 🚚 You can track your order in real-time from the Track section. Need help with anything specific?';
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('rupees')) {
      return 'All our prices are in Indian Rupees (₹). We offer competitive prices with free delivery on orders above ₹500! 💰';
    }
    
    if (message.includes('discount') || message.includes('offer') || message.includes('deal')) {
      return 'Check out our rewards program! 🎁 Earn points with every order and unlock exclusive discounts. Free delivery on orders above ₹500!';
    }

    if (message.includes('maggi') || message.includes('noodles')) {
      const maggi = products.find(p => p.name.toLowerCase().includes('maggi'));
      return maggi ? `${maggi.name} is available for ${formatCurrency(maggi.price)}! Perfect for a quick meal. 🍜` : 'Let me check our noodles selection for you!';
    }
    
    return 'I can help you find groceries, electronics, household items, and more! All delivered in 10 minutes. What are you looking for today? 🛍️';
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        isBot: true,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="font-bold">Shopping Assistant</h3>
            <p className="text-sm opacity-90">Ask me anything in Hindi or English!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;