
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WishlistErrorProps {
  error: string;
}

const WishlistError = ({ error }: WishlistErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Error Loading Wishlist</h2>
      <p className="text-gray-500 mb-6 max-w-xs">
        {error}
      </p>
      <Button onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </div>
  );
};

export default WishlistError;
