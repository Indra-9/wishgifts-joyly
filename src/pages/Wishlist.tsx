
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Share2, MoreHorizontal, Plus, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ProductCard, { ProductCardProps } from '@/components/ui/wishlist/ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import LinkCaptureSheet from '@/components/wishlist/LinkCaptureSheet';

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
  const navigate = useNavigate();
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
        // Fetch wishlist details
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
          if (wishlistError.code === 'PGRST116') {
            navigate('/');
            return;
          }
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
  }, [id, user, toast, navigate]);

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
            <h1 className="text-xl font-medium truncate">
              {loading ? 'Loading...' : error ? 'Error' : wishlist?.title}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {!loading && !error && wishlist?.isPrivate && (
              <span className="flex items-center text-amber-600 text-sm mr-1">
                <Lock className="h-4 w-4 mr-1" />
                Private
              </span>
            )}
            <Button variant="ghost" size="icon" className="text-primary rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <main className="px-4 py-6 max-w-md mx-auto pt-16">
        {loading ? (
          <div className="animate-pulse mt-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8" />
            
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-xl" />
                  <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Wishlist</h2>
            <p className="text-gray-500 mb-6 max-w-xs">
              {error}
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                {wishlist?.occasion}
              </span>
              <h2 className="text-2xl font-semibold mb-2">{wishlist?.title}</h2>
              {wishlist?.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {wishlist.description}
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{products.length} Items</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="text-lg font-medium mb-2">No items yet</h3>
                <p className="text-gray-500 mb-6">Add your first item to this wishlist</p>
                <Button onClick={handleAddItem}>Add Item</Button>
              </div>
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
