import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, ExternalLink, ShoppingBag, AlertTriangle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import confetti from 'canvas-confetti';
import { LinkCacheType } from '@/integrations/supabase/custom-types';

interface ProductInfo {
  title: string;
  price: number;
  image_url: string;
  merchant: 'amazon' | 'flipkart' | 'other';
}

interface LinkCaptureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
}

const LinkCaptureSheet = ({ open, onOpenChange, onProductAdded }: LinkCaptureSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [addToWishlistLoading, setAddToWishlistLoading] = useState(false);
  const [step, setStep] = useState<'link' | 'details' | 'wishlist'>('link');
  const [selectedWishlist, setSelectedWishlist] = useState<string>('');
  const [wishlists, setWishlists] = useState<Array<{id: string, title: string}>>([]);
  const [notes, setNotes] = useState('');
  const [scrapingError, setScrapingError] = useState(false);

  // When the sheet opens, reset state and fetch wishlists
  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (user) {
        fetchWishlists();
      }
    } else {
      setTimeout(() => {
        setUrl('');
        setProductInfo(null);
        setStep('link');
        setSelectedWishlist('');
        setNotes('');
        setScrapingError(false);
      }, 300); // Reset after animation completes
    }
    onOpenChange(open);
  };

  const fetchWishlists = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id, title')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWishlists(data || []);
      if (data && data.length > 0) {
        setSelectedWishlist(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      toast({
        title: "Error",
        description: "Failed to load your wishlists",
        variant: "destructive",
      });
    }
  };

  const determineMerchant = (url: string): 'amazon' | 'flipkart' | 'other' => {
    if (url.includes('amazon')) return 'amazon';
    if (url.includes('flipkart')) return 'flipkart';
    return 'other';
  };

  const handleFetchInfo = async () => {
    if (!url.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid product URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setScrapingError(false);

    try {
      // In a real implementation, you would call an Edge Function to scrape the data
      // For now, we'll simulate a response based on the URL domain
      
      // Check if URL is cached
      const { data: cachedData, error: cacheError } = await supabase
        .from('link_cache')
        .select('title, price, image_url, merchant')
        .eq('url', url)
        .single();
      
      if (!cacheError && cachedData) {
        setProductInfo({
          title: cachedData.title || 'Product Title',
          price: cachedData.price || 0,
          image_url: cachedData.image_url || '',
          merchant: cachedData.merchant as any || determineMerchant(url)
        });
        setStep('details');
        return;
      }

      // Simulate fetching product info
      // In production, this would call your scraping edge function
      setTimeout(() => {
        const merchant = determineMerchant(url);
        
        // Mock data based on merchant
        let mockData: ProductInfo;
        
        if (merchant === 'amazon') {
          mockData = {
            title: 'Amazon Product - ' + Math.floor(Math.random() * 1000),
            price: Math.floor(Math.random() * 10000) + 1000,
            image_url: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg',
            merchant: 'amazon'
          };
        } else if (merchant === 'flipkart') {
          mockData = {
            title: 'Flipkart Product - ' + Math.floor(Math.random() * 1000),
            price: Math.floor(Math.random() * 10000) + 1000,
            image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/u/h/j/mobile-f45-smartphone-tecno-original-imagsm4r2gr3shvx.jpeg',
            merchant: 'flipkart'
          };
        } else {
          // Simulate error for other merchants
          throw new Error('Unsupported merchant');
        }
        
        // Cache the result
        const cacheEntry = {
          url,
          title: mockData.title,
          price: mockData.price,
          image_url: mockData.image_url,
          merchant: mockData.merchant
        };
        
        supabase
          .from('link_cache')
          .insert(cacheEntry)
          .then(({ error }) => {
            if (error) console.error('Error caching link data:', error);
          });
        
        setProductInfo(mockData);
        setStep('details');
      }, 1500);
    } catch (error) {
      console.error('Error fetching product info:', error);
      setScrapingError(true);
      toast({
        title: "Failed to extract product details",
        description: "We couldn't read the product details from this URL. Please check if it's valid.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!productInfo || !selectedWishlist) return;
    
    setAddToWishlistLoading(true);
    
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: selectedWishlist,
          title: productInfo.title,
          price: productInfo.price,
          image_url: productInfo.image_url,
          merchant: productInfo.merchant,
          product_url: url,
          notes: notes
        });
      
      if (error) throw error;
      
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Success!",
        description: "Product added to your wishlist",
        variant: "default",
      });
      
      onOpenChange(false);
      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
    } finally {
      setAddToWishlistLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] sm:max-w-md sm:mx-auto rounded-t-xl p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <Paperclip className="mr-2 h-5 w-5 text-primary" />
            Add Product to Wishlist
          </SheetTitle>
        </SheetHeader>
        
        <div className="p-4 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 'link' && (
              <motion.div
                key="step-link"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  <Label htmlFor="product-url">Product URL from Amazon or Flipkart</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="product-url"
                      placeholder="https://www.amazon.in/product-name/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => window.open('https://www.amazon.in', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {scrapingError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Failed to extract product details</p>
                      <p className="text-sm mt-1">
                        We only support Amazon.in and Flipkart links. Make sure you're copying the full product URL.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="p-4 border rounded-md bg-blue-50 mb-6">
                  <h3 className="text-sm font-medium mb-2 text-blue-700">How to add products:</h3>
                  <ol className="text-xs text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <span className="font-bold mr-1">1.</span>
                      <span>Browse Amazon.in or Flipkart and find a product</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-1">2.</span>
                      <span>Copy the product URL from your browser</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-1">3.</span>
                      <span>Paste it here and click "Fetch Details"</span>
                    </li>
                  </ol>
                </div>
                
                <Button 
                  onClick={handleFetchInfo} 
                  className="w-full"
                  disabled={!url.trim() || loading}
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Fetching Details...
                    </>
                  ) : 'Fetch Details'}
                </Button>
              </motion.div>
            )}
            
            {step === 'details' && productInfo && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex mb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-4">
                    {productInfo.image_url ? (
                      <img 
                        src={productInfo.image_url} 
                        alt={productInfo.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2">{productInfo.title}</h3>
                    <div className="flex items-center mt-1 mb-2">
                      <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded capitalize">
                        {productInfo.merchant}
                      </span>
                    </div>
                    <p className="text-lg font-semibold">₹{productInfo.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="wishlist">Add to Wishlist</Label>
                    <Select value={selectedWishlist} onValueChange={setSelectedWishlist}>
                      <SelectTrigger id="wishlist" className="mt-1.5">
                        <SelectValue placeholder="Select a wishlist" />
                      </SelectTrigger>
                      <SelectContent>
                        {wishlists.length === 0 ? (
                          <SelectItem value="__empty" disabled>No wishlists found</SelectItem>
                        ) : (
                          wishlists.map(wishlist => (
                            <SelectItem key={wishlist.id} value={wishlist.id}>
                              {wishlist.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any specific details, color preference, etc."
                      className="mt-1.5"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep('link')}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    disabled={!selectedWishlist || addToWishlistLoading}
                    onClick={handleAddToWishlist}
                  >
                    {addToWishlistLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Add to Wishlist
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LinkCaptureSheet;
