
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WishlistInfoProps {
  occasion: string;
  title: string;
  description?: string;
  itemCount: number;
  onAddItem: () => void;
}

const WishlistInfo = ({ occasion, title, description, itemCount, onAddItem }: WishlistInfoProps) => {
  return (
    <>
      <div className="mb-6">
        <span className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
          {occasion}
        </span>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{itemCount} Items</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary"
          onClick={onAddItem}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>
    </>
  );
};

export default WishlistInfo;
