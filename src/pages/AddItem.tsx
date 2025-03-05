
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Link2, ImagePlus, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock data - this would come from Supabase in a real implementation
const mockWishlists = [
  { id: '1', name: 'Birthday Wishlist' },
  { id: '2', name: 'Anniversary Gifts' },
  { id: '3', name: 'Baby Shower Collection' },
];

const AddItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [selectedWishlist, setSelectedWishlist] = useState('');
  const [notes, setNotes] = useState('');
  const [urlError, setUrlError] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setUrlError('');
    setExtracted(false);
  };

  const validateUrl = (url: string) => {
    const isAmazonUrl = url.includes('amazon.in') || url.includes('amazon.com');
    const isFlipkartUrl = url.includes('flipkart.com');
    
    if (!isAmazonUrl && !isFlipkartUrl) {
      return "Please enter a valid Amazon.in or Flipkart URL";
    }
    
    return "";
  };

  const extractDetails = () => {
    const error = validateUrl(url);
    if (error) {
      setUrlError(error);
      return;
    }
    
    setLoading(true);
    
    // Simulating API call to extract product details
    setTimeout(() => {
      // Mock extracted data
      if (url.includes('amazon')) {
        setTitle('Apple iPhone 15 (128 GB) - Black');
        setPrice('79900');
      } else if (url.includes('flipkart')) {
        setTitle('Samsung Galaxy S23 Ultra 5G (Green, 256 GB)');
        setPrice('124999');
      }
      
      setLoading(false);
      setExtracted(true);
      
      toast({
        title: "Details extracted!",
        description: "Product information has been retrieved successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setPrice('');
    setSelectedWishlist('');
    setNotes('');
    setExtracted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !title || !price || !selectedWishlist) {
      toast({
        title: "Missing information",
        description: "Please fill all the required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulating API call to save the product
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Item added!",
        description: "Your item has been added to your wishlist.",
        duration: 3000,
      });
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
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
            <h1 className="text-xl font-medium">Add to Wishlist</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetForm}
            disabled={!url && !title && !price}
          >
            Reset
          </Button>
        </div>
      </div>
      
      <main className="px-4 py-6 max-w-md mx-auto pt-16">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="product-url">Product URL</Label>
            <div className="relative">
              <Input
                id="product-url"
                placeholder="Paste Amazon or Flipkart product URL"
                value={url}
                onChange={handleUrlChange}
                className={`pl-10 ${urlError ? 'border-red-500' : ''}`}
              />
              <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              
              {url && !loading && !extracted && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={extractDetails}
                >
                  Extract
                </Button>
              )}
              
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              )}
              
              {extracted && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            
            {urlError && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {urlError}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-title">Product Title</Label>
            <Input
              id="product-title"
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-price">Price (₹)</Label>
            <Input
              id="product-price"
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wishlist">Add to Wishlist</Label>
            <Select value={selectedWishlist} onValueChange={setSelectedWishlist}>
              <SelectTrigger>
                <SelectValue placeholder="Select a wishlist" />
              </SelectTrigger>
              <SelectContent>
                {mockWishlists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific details about this item"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={submitting || !url || !title || !price || !selectedWishlist}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Wishlist'
              )}
            </Button>
          </div>
        </motion.form>
      </main>
    </div>
  );
};

export default AddItem;
