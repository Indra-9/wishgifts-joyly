
import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoWishlistsProps {
  onCreateWishlist: () => void;
}

const NoWishlists = ({ onCreateWishlist }: NoWishlistsProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Gift className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No wishlists yet</h3>
      <p className="text-gray-500 mb-6">Create your first wishlist to get started</p>
      <Button onClick={onCreateWishlist}>Create a Wishlist</Button>
    </div>
  );
};

export default NoWishlists;
