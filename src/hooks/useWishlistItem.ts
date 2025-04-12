
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import confetti from 'canvas-confetti';
import { ProductInfo } from './useProductLink';

export const useWishlistItem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [addToWishlistLoading, setAddToWishlistLoading] = useState(false);

  const addItemToWishlist = async (url: string, productInfo: ProductInfo, wishlistId: string) => {
    if (!productInfo || !wishlistId) return false;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      });
      return false;
    }
    
    setAddToWishlistLoading(true);
    
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlistId,
          user_id: user.id, // Include user_id explicitly to satisfy RLS
          title: productInfo.title,
          price: productInfo.price,
          image_url: productInfo.image_url,
          merchant: productInfo.merchant,
          product_url: url,
          notes: notes
        });
      
      if (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
      
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
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: `Failed to add product to wishlist: ${error.message || 'Unknown error'}`,
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
