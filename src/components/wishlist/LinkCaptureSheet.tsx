
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Paperclip } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useProductLink } from '@/hooks/useProductLink';
import { useWishlists } from '@/hooks/useWishlists';
import { useWishlistItem } from '@/hooks/useWishlistItem';
import LinkInputStep from './LinkInputStep';
import ProductDetailsStep from './ProductDetailsStep';

interface LinkCaptureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
  preSelectedWishlistId?: string; // Added this property
}

const LinkCaptureSheet = ({ open, onOpenChange, onProductAdded, preSelectedWishlistId }: LinkCaptureSheetProps) => {
  const [step, setStep] = useState<'link' | 'details'>('link');
  
  const productLink = useProductLink();
  const wishlists = useWishlists(preSelectedWishlistId); // Pass the preSelectedWishlistId to useWishlists
  const wishlistItem = useWishlistItem();

  // When the sheet opens, reset state and fetch wishlists
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        productLink.resetProductInfo();
        setStep('link');
        wishlistItem.setNotes('');
      }, 300); // Reset after animation completes
    }
    onOpenChange(open);
  };

  const handleFetchInfo = async () => {
    const success = await productLink.fetchProductInfo();
    if (success) {
      setStep('details');
    }
  };

  const handleAddToWishlist = async () => {
    if (!productLink.productInfo) return;
    
    const success = await wishlistItem.addItemToWishlist(
      productLink.url, 
      productLink.productInfo, 
      wishlists.selectedWishlist
    );
    
    if (success) {
      onOpenChange(false);
      if (onProductAdded) onProductAdded();
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
              <LinkInputStep
                url={productLink.url}
                onUrlChange={productLink.setUrl}
                onFetchInfo={handleFetchInfo}
                loading={productLink.loading}
                scrapingError={productLink.scrapingError}
              />
            )}
            
            {step === 'details' && productLink.productInfo && (
              <ProductDetailsStep
                productInfo={productLink.productInfo}
                wishlists={wishlists.wishlists}
                selectedWishlist={wishlists.selectedWishlist}
                onWishlistChange={wishlists.setSelectedWishlist}
                notes={wishlistItem.notes}
                onNotesChange={wishlistItem.setNotes}
                onBack={() => setStep('link')}
                onAddToWishlist={handleAddToWishlist}
                loading={wishlistItem.addToWishlistLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LinkCaptureSheet;
