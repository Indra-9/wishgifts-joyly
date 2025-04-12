
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

  const fetchWishlists = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const wishlistOptions = data as WishlistOption[] || [];
      setWishlists(wishlistOptions);
      
      if (wishlistOptions.length > 0 && !selectedWishlist) {
        setSelectedWishlist(wishlistOptions[0].id);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
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
    fetchWishlists
  };
};
