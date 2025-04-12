
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useUserRewards } from '@/hooks/useUserRewards';

const RewardsCard = () => {
  const { currentTier, karmaPoints, progress, nextTier } = useUserRewards();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-4 mb-6"
    >
      <div className="flex items-center space-x-2 mb-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-medium">My Rewards</h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        You've earned {karmaPoints} points on the platform!
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-gray-600 dark:text-gray-400">
        <span>{karmaPoints} points</span>
        <span>{nextTier ? `${nextTier.min_points} points for ${nextTier.name} tier` : `${currentTier?.name || 'Bronze'} tier`}</span>
      </div>
    </motion.div>
  );
};

export default RewardsCard;
