
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '@/components/layout/BottomNav';
import ProductCard, { ProductCardProps } from '@/components/ui/wishlist/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LinkCaptureSheet from '@/components/wishlist/LinkCaptureSheet';

// Import our new components
import WishlistHeader from '@/components/wishlist/WishlistHeader';
import WishlistInfo from '@/components/wishlist/WishlistInfo';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import WishlistLoading from '@/components/wishlist/WishlistLoading';
import WishlistError from '@/components/wishlist/WishlistError';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface WishlistDetails {
  id: string;
  title: string;
  occasion: string;
  isPrivate: boolean;
  description?: string;
}

const Wishlist = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [wishlist, setWishlist] = useState<WishlistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLinkSheet, setShowLinkSheet] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const fetchWishlistDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch wishlist details with a simplified query to avoid RLS recursion issues
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists')
          .select(`
            id,
            title,
            description,
            is_private,
            occasions(name)
          `)
          .eq('id', id)
          .single();

        if (wishlistError) {
          console.error('Error fetching wishlist:', wishlistError);
          setError(`Failed to load wishlist: ${wishlistError.message}`);
          toast({
            title: "Error",
            description: "Failed to load wishlist details",
            variant: "destructive",
          });
          return;
        }

        // Fetch items in the wishlist
        const { data: itemsData, error: itemsError } = await supabase
          .from('wishlist_items')
          .select('*')
          .eq('wishlist_id', id)
          .order('created_at', { ascending: false });

        if (itemsError) {
          console.error('Error fetching wishlist items:', itemsError);
          setError(`Failed to load wishlist items: ${itemsError.message}`);
          toast({
            title: "Error",
            description: "Failed to load wishlist items",
            variant: "destructive",
          });
          return;
        }

        const formattedWishlist: WishlistDetails = {
          id: wishlistData.id,
          title: wishlistData.title,
          occasion: wishlistData.occasions?.name || 'General',
          isPrivate: wishlistData.is_private,
          description: wishlistData.description || undefined
        };

        const formattedItems: ProductCardProps[] = (itemsData || []).map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image_url,
          merchant: item.merchant,
          url: item.product_url
        }));

        setWishlist(formattedWishlist);
        setProducts(formattedItems);
      } catch (error) {
        console.error('Error in wishlist loading:', error);
        setError('An unexpected error occurred while loading the wishlist');
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistDetails();
  }, [id, user, toast]);

  const handleAddItem = () => {
    setShowLinkSheet(true);
  };

  const handleProductAdded = async () => {
    if (!id || !user) return;
    
    toast({
      title: "Success!",
      description: "Item added to your wishlist",
      variant: "default",
    });
    
    // Refresh the wishlist items
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('wishlist_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems: ProductCardProps[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image_url,
        merchant: item.merchant,
        url: item.product_url
      }));

      setProducts(formattedItems);
    } catch (error) {
      console.error('Error refreshing wishlist items:', error);
      toast({
        title: "Error",
        description: "Failed to refresh wishlist items",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <WishlistHeader 
        title={wishlist?.title || ''}
        isPrivate={wishlist?.isPrivate || false}
        loading={loading}
        error={error}
      />
      
      <main className="px-4 py-6 max-w-md mx-auto pt-16">
        {loading ? (
          <WishlistLoading />
        ) : error ? (
          <WishlistError error={error} />
        ) : (
          <>
            <WishlistInfo
              occasion={wishlist?.occasion || 'General'}
              title={wishlist?.title || ''}
              description={wishlist?.description}
              itemCount={products.length}
              onAddItem={handleAddItem}
            />
            
            {products.length === 0 ? (
              <EmptyWishlist onAddItem={handleAddItem} />
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </main>
      
      <BottomNav />
      
      {user && wishlist && (
        <LinkCaptureSheet 
          open={showLinkSheet} 
          onOpenChange={setShowLinkSheet} 
          onProductAdded={handleProductAdded}
          preSelectedWishlistId={id}
        />
      )}
    </div>
  );
};

export default Wishlist;
