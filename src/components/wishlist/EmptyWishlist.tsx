
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyWishlistProps {
  onAddItem: () => void;
}

const EmptyWishlist = ({ onAddItem }: EmptyWishlistProps) => {
  return (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <h3 className="text-lg font-medium mb-2">No items yet</h3>
      <p className="text-gray-500 mb-6">Add your first item to this wishlist</p>
      <Button onClick={onAddItem}>Add Item</Button>
    </div>
  );
};

export default EmptyWishlist;
