
import { motion } from 'framer-motion';
import { ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import RewardsDashboard from '@/components/gamification/RewardsDashboard';
import { useUserRewards, UserTier } from '@/hooks/useUserRewards';

const Rewards = () => {
  const navigate = useNavigate();
  const { tiers, currentTier } = useUserRewards();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">My Rewards</h1>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-primary rounded-full">
              <Award className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <main className="px-4 py-6 max-w-md mx-auto pt-16">
        <RewardsDashboard />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Rewards Levels</h2>
          <div className="space-y-3">
            {tiers.map((tier) => (
              <TierCard 
                key={tier.id}
                tier={tier}
                isCurrentTier={tier.name === currentTier?.name}
              />
            ))}
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
};

interface TierCardProps {
  tier: UserTier;
  isCurrentTier: boolean;
}

const TierCard = ({ tier, isCurrentTier }: TierCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-4 rounded-lg border ${
        isCurrentTier 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: `${tier.color}20` }}
          >
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: tier.color }}
            ></div>
          </div>
          
          <div>
            <h3 className="font-medium">{tier.name}</h3>
            <p className="text-sm text-gray-500">
              {tier.minPoints.toLocaleString()} - {tier.maxPoints.toLocaleString()} points
            </p>
          </div>
        </div>
        
        {isCurrentTier && (
          <div className="bg-primary/20 text-primary text-xs font-medium px-2 py-1 rounded-full">
            Current
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Rewards;
