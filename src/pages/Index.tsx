
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WishlistCard, { WishlistCardProps } from '@/components/ui/wishlist/WishlistCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LinkCaptureSheet from '@/components/wishlist/LinkCaptureSheet';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import RewardsCard from '@/components/home/RewardsCard';
import WishlistsHeader from '@/components/home/WishlistsHeader';
import NoWishlists from '@/components/home/NoWishlists';
import AuthRequired from '@/components/home/AuthRequired';
import WishlistsLoading from '@/components/home/WishlistsLoading';

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
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [wishlists, setWishlists] = useState<WishlistCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkSheet, setShowLinkSheet] = useState(false);

  useEffect(() => {
    const fetchWishlists = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Simplified query to avoid RLS recursion issues
        const { data, error } = await supabase
          .from('wishlists')
          .select(`
            id, 
            title, 
            is_private,
            thumbnail_url,
            occasions(name)
          `)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching wishlists:', error);
          toast({
            title: "Error loading wishlists",
            description: "Please try again later",
            variant: "destructive",
          });
          throw error;
        }
        
        const wishlistsWithCounts = await Promise.all(
          (data || []).map(async (wishlist) => {
            const { count, error: countError } = await supabase
              .from('wishlist_items')
              .select('id', { count: 'exact', head: true })
              .eq('wishlist_id', wishlist.id);
            
            if (countError) {
              console.error('Error getting item count:', countError);
              throw countError;
            }
            
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

    if (!authLoading) {
      fetchWishlists();
    }
  }, [user, authLoading, toast]);

  const handleProductAdded = () => {
    if (!user) return;
    
    toast({
      title: "Success!",
      description: "Item added to your wishlist",
      variant: "default",
    });
    
    // Simplified function to fetch updated wishlists
    const refreshWishlists = async () => {
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
          .eq('user_id', user.id);
        
        if (error) throw error;
        
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
        console.error('Error refreshing wishlists:', error);
      }
    };

    refreshWishlists();
  };

  const handleCreateWishlist = () => {
    // Navigate to create wishlist page or open modal
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-16">
      <Header />
      
      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="mb-6">
          {!authLoading && user && <RewardsCard />}

          <WishlistsHeader 
            onAddItem={() => setShowLinkSheet(true)}
            isUserLoggedIn={!!user}
          />
          
          {/* Show auth loading state */}
          {authLoading && <WishlistsLoading />}
          
          {/* Show data loading state */}
          {!authLoading && loading && <WishlistsLoading />}
          
          {/* Show actual data */}
          {!authLoading && !loading && user && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4"
            >
              {wishlists.length === 0 ? (
                <NoWishlists onCreateWishlist={handleCreateWishlist} />
              ) : (
                wishlists.map((wishlist) => (
                  <WishlistCard key={wishlist.id} {...wishlist} />
                ))
              )}
            </motion.div>
          )}
          
          {/* Show logged out state */}
          {!authLoading && !user && <AuthRequired />}
        </div>
      </main>
      
      <BottomNav />
      
      {user && (
        <LinkCaptureSheet 
          open={showLinkSheet} 
          onOpenChange={setShowLinkSheet} 
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
};

export default Index;
