
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Wishlist } from '@/types/supabase';

export interface WishlistOption {
  id: string;
  title: string;
}

export const useWishlists = (preSelectedWishlistId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlists, setWishlists] = useState<WishlistOption[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<string>(preSelectedWishlistId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlists = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use a simpler query structure to avoid RLS recursion issues
      const { data, error } = await supabase
        .from('wishlists')
        .select('id, title')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching wishlists:', error);
        setError(`Failed to load wishlists: ${error.message}`);
        toast({
          title: "Error",
          description: "Failed to load your wishlists",
          variant: "destructive",
        });
        return;
      }
      
      const wishlistOptions = data as WishlistOption[] || [];
      setWishlists(wishlistOptions);
      
      // Only set selectedWishlist if we have a list and no selection yet
      if (wishlistOptions.length > 0 && !selectedWishlist) {
        setSelectedWishlist(wishlistOptions[0].id);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      setError('An unexpected error occurred while loading wishlists');
      toast({
        title: "Error",
        description: "Failed to load your wishlists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlists();
    } else {
      // Reset state when user is not available
      setWishlists([]);
      setError(null);
    }
  }, [user]);

  // If the preSelectedWishlistId changes (and isn't empty), update the selected wishlist
  useEffect(() => {
    if (preSelectedWishlistId) {
      setSelectedWishlist(preSelectedWishlistId);
    }
  }, [preSelectedWishlistId]);

  return {
    wishlists,
    selectedWishlist,
    setSelectedWishlist,
    loading,
    error,
    fetchWishlists
  };
};
