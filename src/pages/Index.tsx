
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WishlistCard, { WishlistCardProps } from '@/components/ui/wishlist/WishlistCard';
import { Button } from '@/components/ui/button';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Mock data - this would come from Supabase in a real implementation
const mockWishlists: WishlistCardProps[] = [
  {
    id: '1',
    title: 'Birthday Wishlist',
    occasion: 'Birthday',
    itemCount: 12,
    isPrivate: true,
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Anniversary Gifts',
    occasion: 'Anniversary',
    itemCount: 8,
    isPrivate: false,
    thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Baby Shower Collection',
    occasion: 'Baby Shower',
    itemCount: 15,
    isPrivate: true
  }
];

const Index = () => {
  const [wishlists, setWishlists] = useState<WishlistCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch from Supabase
    const fetchData = async () => {
      setLoading(true);
      // In a real app, fetch from Supabase here
      setTimeout(() => {
        setWishlists(mockWishlists);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-16">
      <Header />
      
      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="mb-6">
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
              You've earned 320 points this month from gifting!
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full" 
                style={{ width: '65%' }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span>320 points</span>
              <span>500 points for Silver tier</span>
            </div>
          </motion.div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Wishlists</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              <Plus className="h-4 w-4 mr-1" />
              New List
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-t-xl" />
                  <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4"
            >
              {wishlists.map((wishlist) => (
                <WishlistCard key={wishlist.id} {...wishlist} />
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
