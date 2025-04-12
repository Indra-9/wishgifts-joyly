
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
    if (!user) {
      setError("User not authenticated");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use a direct query without any joins to avoid RLS recursion
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
      
      if (!data || data.length === 0) {
        setWishlists([]);
        return;
      }
      
      const wishlistOptions = data as WishlistOption[];
      setWishlists(wishlistOptions);
      
      // Set selectedWishlist if we have lists but no selection yet
      if (wishlistOptions.length > 0 && !selectedWishlist) {
        setSelectedWishlist(wishlistOptions[0].id);
      }
    } catch (error: any) {
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
      setWishlists([]);
      setError(null);
    }
  }, [user]);

  // Update selected wishlist when preSelectedWishlistId changes
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
