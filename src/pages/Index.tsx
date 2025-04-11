
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Gift } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WishlistCard, { WishlistCardProps } from '@/components/ui/wishlist/WishlistCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LinkCaptureSheet from '@/components/wishlist/LinkCaptureSheet';
import { useUserRewards } from '@/hooks/useUserRewards';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  const { user } = useAuth();
  const { currentTier, karmaPoints, progress, nextTier } = useUserRewards();
  const [wishlists, setWishlists] = useState<WishlistCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkSheet, setShowLinkSheet] = useState(false);

  useEffect(() => {
    // Fetch wishlists from Supabase
    const fetchWishlists = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select(`
            id, 
            title, 
            is_private,
            thumbnail_url,
            occasions(name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // For each wishlist, count the number of items
        const wishlistsWithCounts = await Promise.all(
          (data || []).map(async (wishlist) => {
            const { count, error: countError } = await supabase
              .from('wishlist_items')
              .select('id', { count: 'exact', head: true })
              .eq('wishlist_id', wishlist.id);
            
            if (countError) throw countError;
            
            return {
              id: wishlist.id,
              title: wishlist.title,
              occasion: wishlist.occasions?.name || 'General',
              itemCount: count || 0,
              isPrivate: wishlist.is_private,
              thumbnail: wishlist.thumbnail_url
            };
          })
        );
        
        setWishlists(wishlistsWithCounts);
      } catch (error) {
        console.error('Error fetching wishlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [user]);

  const handleProductAdded = () => {
    // Refresh wishlists after adding a product
    const fetchWishlists = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select(`
            id, 
            title, 
            is_private,
            thumbnail_url,
            occasions(name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // For each wishlist, count the number of items
        const wishlistsWithCounts = await Promise.all(
          (data || []).map(async (wishlist) => {
            const { count, error: countError } = await supabase
              .from('wishlist_items')
              .select('id', { count: 'exact', head: true })
              .eq('wishlist_id', wishlist.id);
            
            if (countError) throw countError;
            
            return {
              id: wishlist.id,
              title: wishlist.title,
              occasion: wishlist.occasions?.name || 'General',
              itemCount: count || 0,
              isPrivate: wishlist.is_private,
              thumbnail: wishlist.thumbnail_url
            };
          })
        );
        
        setWishlists(wishlistsWithCounts);
      } catch (error) {
        console.error('Error fetching wishlists:', error);
      }
    };

    fetchWishlists();
  };

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

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Wishlists</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => setShowLinkSheet(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
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
              {wishlists.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Gift className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No wishlists yet</h3>
                  <p className="text-gray-500 mb-6">Create your first wishlist to get started</p>
                  <Button>Create a Wishlist</Button>
                </div>
              ) : (
                wishlists.map((wishlist) => (
                  <WishlistCard key={wishlist.id} {...wishlist} />
                ))
              )}
            </motion.div>
          )}
        </div>
      </main>
      
      <BottomNav />
      
      <LinkCaptureSheet 
        open={showLinkSheet} 
        onOpenChange={setShowLinkSheet} 
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default Index;
