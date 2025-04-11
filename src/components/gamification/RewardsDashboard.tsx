
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Gift } from 'lucide-react';
import { useUserRewards } from '@/hooks/useUserRewards';
import UserBadge from '@/components/gamification/UserBadge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface RewardsDashboardProps {
  showConfetti?: boolean;
}

const RewardsDashboard = ({ showConfetti = false }: RewardsDashboardProps) => {
  const { badges, currentTier, nextTier, karmaPoints, progress, loading } = useUserRewards();

  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [showConfetti]);

  if (loading) {
    return (
      <div className="glass rounded-xl p-4 mb-6 animate-pulse">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-4 mb-6"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Award className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-medium">Rewards Level</h2>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          You're <span className="font-medium">{progress}%</span> of the way to{' '}
          {nextTier ? nextTier.name : 'Max Level'}
        </p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{karmaPoints} points</span>
          <span>
            {nextTier 
              ? `${nextTier.min_points} points for ${nextTier.name}`
              : `${currentTier?.name || 'Unranked'} (Max Level)`
            }
          </span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Level</h3>
              <div className="flex items-center mt-1">
                <span className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: currentTier?.color || '#C0C0C0' }}></span>
                <span>{currentTier?.name || 'Unranked'}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="text-primary">
              View All Rewards
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Badges</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges
              .sort((a, b) => (a.earned === b.earned) ? 0 : a.earned ? -1 : 1)
              .slice(0, 4)
              .map((badge) => (
                <UserBadge 
                  key={badge.id} 
                  id={badge.id}
                  name={badge.name} 
                  description={badge.description} 
                  icon={badge.icon} 
                  points={badge.points} 
                  earned={badge.earned}
                  earnedAt={badge.earnedAt}
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
            <p className="text-gray-500 max-w-sm">
              Complete actions like creating wishlists, connecting with friends, and gifting to earn badges
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Gifts</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Gift className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Gift History Yet</h3>
          <p className="text-gray-500 max-w-sm">
            When you purchase gifts for friends from their wishlists, they'll appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;
