import React, { useState, useEffect } from 'react';
import { Star, Gift, Trophy, Zap } from 'lucide-react';
import { storage } from '../utils/storage';
import { User } from '../types';

interface RewardsPageProps {
  onAddToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const RewardsPage: React.FC<RewardsPageProps> = ({ onAddToast }) => {
  const [user, setUser] = useState<User>({ points: 0, level: 'Bronze', ordersCount: 0 });
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  useEffect(() => {
    const userData = storage.getUser();
    setUser(userData);
  }, []);

  const rewards = [
    {
      id: 'discount5',
      title: '5% Off Next Order',
      description: 'Get 5% discount on your next purchase',
      pointsRequired: 100,
      icon: '💰',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'discount10',
      title: '10% Off Next Order',
      description: 'Get 10% discount on your next purchase',
      pointsRequired: 250,
      icon: '💸',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'freedelivery',
      title: 'Free Delivery',
      description: 'Free delivery for your next 5 orders',
      pointsRequired: 150,
      icon: '🚚',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'premium',
      title: 'Premium Member',
      description: 'Unlock premium features for 1 month',
      pointsRequired: 500,
      icon: '👑',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const levels = [
    { name: 'Bronze', minPoints: 0, maxPoints: 499, color: 'bg-orange-100 text-orange-800' },
    { name: 'Silver', minPoints: 500, maxPoints: 999, color: 'bg-gray-100 text-gray-800' },
    { name: 'Gold', minPoints: 1000, maxPoints: Infinity, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const currentLevel = levels.find(level => 
    user.points >= level.minPoints && user.points <= level.maxPoints
  )!;

  const nextLevel = levels.find(level => level.minPoints > user.points);
  const progressPercentage = nextLevel 
    ? ((user.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const claimReward = (rewardId: string, pointsRequired: number) => {
    if (user.points < pointsRequired) {
      onAddToast('Not enough points to claim this reward', 'error');
      return;
    }

    const updatedUser = {
      ...user,
      points: user.points - pointsRequired
    };

    storage.saveUser(updatedUser);
    setUser(updatedUser);
    onAddToast('Reward claimed successfully! 🎉', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rewards & Loyalty</h1>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{user.points}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Current Level</p>
                <p className="text-2xl font-bold text-gray-900">{user.level}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Gift className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{user.ordersCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Level Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentLevel.color}`}>
              {currentLevel.name}
            </span>
            {nextLevel && (
              <span className="text-sm text-gray-600">
                {nextLevel.minPoints - user.points} points to {nextLevel.name}
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{currentLevel.minPoints} pts</span>
            {nextLevel && <span>{nextLevel.minPoints} pts</span>}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map(reward => (
              <div key={reward.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{reward.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{reward.title}</h3>
                      <p className="text-gray-600 text-sm">{reward.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${reward.color}`}>
                    {reward.pointsRequired} pts
                  </span>
                </div>
                
                <button
                  onClick={() => claimReward(reward.id, reward.pointsRequired)}
                  disabled={user.points < reward.pointsRequired}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    user.points >= reward.pointsRequired
                      ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {user.points >= reward.pointsRequired ? 'Claim Reward' : 'Not Enough Points'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">Place Orders</h3>
              <p className="text-sm text-gray-600">Earn 1 point per $1 spent</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">Write Reviews</h3>
              <p className="text-sm text-gray-600">Earn 10 points per review</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">Refer Friends</h3>
              <p className="text-sm text-gray-600">Earn 50 points per referral</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900">Complete Challenges</h3>
              <p className="text-sm text-gray-600">Earn bonus points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;