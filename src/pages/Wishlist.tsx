
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Share2, MoreHorizontal, Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ProductCard, { ProductCardProps } from '@/components/ui/wishlist/ProductCard';
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
const mockProducts: ProductCardProps[] = [
  {
    id: '1',
    title: 'Apple AirPods Pro (2nd Generation)',
    price: 26900,
    image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg',
    merchant: 'amazon',
    url: 'https://www.amazon.in/Apple-AirPods-Pro-2nd-Generation/dp/B0BDHWDR12/'
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    price: 29990,
    image: 'https://m.media-amazon.com/images/I/61+btxzpfDL._SL1500_.jpg',
    merchant: 'flipkart',
    url: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm88ef1268cc399'
  },
  {
    id: '3',
    title: 'Samsung Galaxy S23 Ultra 5G (Green, 12GB, 256GB Storage)',
    price: 124999,
    image: 'https://m.media-amazon.com/images/I/51hqXIAVXAL._SL1500_.jpg',
    merchant: 'amazon',
    url: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Green-Storage/dp/B0BT9CXXXX/'
  }
];

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
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [wishlist, setWishlist] = useState<WishlistDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetch from Supabase
    const fetchData = async () => {
      setLoading(true);
      // In a real app, fetch from Supabase here based on the id
      setTimeout(() => {
        setWishlist({
          id: id || '1',
          title: 'Birthday Wishlist',
          occasion: 'Birthday',
          isPrivate: true,
          description: 'All the things I would love to get for my birthday this year.'
        });
        setProducts(mockProducts);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, [id]);

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
              {loading ? 'Loading...' : wishlist?.title}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {!loading && wishlist?.isPrivate && (
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
              <Button variant="outline" size="sm" className="text-primary">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
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
          </>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Wishlist;
