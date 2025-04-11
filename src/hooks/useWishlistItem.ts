
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { ProductInfo } from './useProductLink';

export const useWishlistItem = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [addToWishlistLoading, setAddToWishlistLoading] = useState(false);

  const addItemToWishlist = async (url: string, productInfo: ProductInfo, wishlistId: string) => {
    if (!productInfo || !wishlistId) return false;
    
    setAddToWishlistLoading(true);
    
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlistId,
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
      
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
      return false;
    } finally {
      setAddToWishlistLoading(false);
    }
  };

  return {
    notes,
    setNotes,
    addToWishlistLoading,
    addItemToWishlist,
  };
};
