
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WishlistsHeaderProps {
  onAddItem: () => void;
  isUserLoggedIn: boolean;
}

const WishlistsHeader = ({ onAddItem, isUserLoggedIn }: WishlistsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">My Wishlists</h2>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-primary"
        onClick={onAddItem}
        disabled={!isUserLoggedIn}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Item
      </Button>
    </div>
  );
};

export default WishlistsHeader;
