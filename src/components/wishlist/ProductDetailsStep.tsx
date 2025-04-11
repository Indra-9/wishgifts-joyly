
import { motion } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductInfo } from '@/hooks/useProductLink';
import { WishlistOption } from '@/hooks/useWishlists';

interface ProductDetailsStepProps {
  productInfo: ProductInfo;
  wishlists: WishlistOption[];
  selectedWishlist: string;
  onWishlistChange: (value: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onBack: () => void;
  onAddToWishlist: () => void;
  loading: boolean;
}

const ProductDetailsStep = ({
  productInfo,
  wishlists,
  selectedWishlist,
  onWishlistChange,
  notes,
  onNotesChange,
  onBack,
  onAddToWishlist,
  loading
}: ProductDetailsStepProps) => {
  return (
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
          <Select value={selectedWishlist} onValueChange={onWishlistChange}>
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
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          className="flex-1"
          disabled={!selectedWishlist || loading}
          onClick={onAddToWishlist}
        >
          {loading ? (
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
  );
};

export default ProductDetailsStep;
