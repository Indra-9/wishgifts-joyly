
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useWishlists } from '@/hooks/useWishlists';
import { useAuth } from '@/contexts/AuthContext';
import { useProductLink } from '@/hooks/useProductLink';
import { useWishlistItem } from '@/hooks/useWishlistItem';
import { Button } from '@/components/ui/button';

import LinkInputStep from './LinkInputStep';
import ProductDetailsStep from './ProductDetailsStep';

export interface LinkCaptureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded?: () => void;
  preSelectedWishlistId?: string;
}

const LinkCaptureSheet = ({ 
  open, 
  onOpenChange, 
  onProductAdded,
  preSelectedWishlistId
}: LinkCaptureSheetProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'link' | 'details'>('link');
  
  // Use our hooks to manage state and fetch data
  const { 
    url, 
    setUrl, 
    productInfo, 
    loading: productLoading, 
    scrapingError, 
    fetchProductInfo, 
    resetProductInfo 
  } = useProductLink();
  
  const {
    notes,
    setNotes,
    addToWishlistLoading,
    addItemToWishlist
  } = useWishlistItem();
  
  const { 
    wishlists, 
    selectedWishlist, 
    setSelectedWishlist,
    loading: wishlistsLoading, 
    error: wishlistsError 
  } = useWishlists(preSelectedWishlistId);

  // Reset state when sheet is closed
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    
    if (!newOpen) {
      setTimeout(() => {
        setCurrentStep('link');
        resetProductInfo();
        setNotes('');
      }, 300); // Delay to allow close animation
    }
  };

  const handleFetchInfo = async () => {
    const success = await fetchProductInfo();
    if (success) {
      setCurrentStep('details');
    }
  };

  const handleAddToWishlist = async () => {
    if (!productInfo || !selectedWishlist) return;
    
    const success = await addItemToWishlist(url, productInfo, selectedWishlist);
    
    if (success) {
      // Close the sheet
      onOpenChange(false);
      
      // Trigger callback if provided
      if (onProductAdded) {
        onProductAdded();
      }
      
      // Reset for next use
      setTimeout(() => {
        setCurrentStep('link');
        resetProductInfo();
        setNotes('');
      }, 300);
    }
  };

  // Show login message if not authenticated
  if (!user) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add to Wishlist</SheetTitle>
            <SheetDescription>
              Please log in to add items to your wishlist
            </SheetDescription>
          </SheetHeader>
          <div className="flex justify-center mt-8">
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // If no wishlists exist, show create wishlist message
  if (!wishlistsLoading && wishlists.length === 0 && !wishlistsError) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add to Wishlist</SheetTitle>
            <SheetDescription>
              Create a wishlist first to add items
            </SheetDescription>
          </SheetHeader>
          <div className="flex justify-center mt-8">
            <Button onClick={() => window.location.href = '/create-wishlist'}>
              Create Wishlist
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {currentStep === 'link' ? 'Add to Wishlist' : 'Product Details'}
          </SheetTitle>
          <SheetDescription>
            {currentStep === 'link' 
              ? 'Paste an Amazon or Flipkart product link' 
              : 'Review the details before adding to your wishlist'}
          </SheetDescription>
        </SheetHeader>
        
        {currentStep === 'link' ? (
          <LinkInputStep 
            url={url}
            onUrlChange={setUrl}
            onFetchInfo={handleFetchInfo}
            loading={productLoading}
            scrapingError={scrapingError}
          />
        ) : (
          <ProductDetailsStep 
            productInfo={productInfo!}
            wishlists={wishlists}
            selectedWishlist={selectedWishlist}
            onWishlistChange={setSelectedWishlist}
            notes={notes}
            onNotesChange={setNotes}
            onBack={() => setCurrentStep('link')}
            onAddToWishlist={handleAddToWishlist}
            loading={addToWishlistLoading}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default LinkCaptureSheet;
