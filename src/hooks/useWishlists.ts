
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Wishlist } from '@/types/supabase';

export interface WishlistOption {
  id: string;
  title: string;
}

export const useWishlists = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlists, setWishlists] = useState<WishlistOption[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<string>('');
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
      
      if (wishlistOptions.length > 0) {
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

  return {
    wishlists,
    selectedWishlist,
    setSelectedWishlist,
    loading,
    fetchWishlists
  };
};
