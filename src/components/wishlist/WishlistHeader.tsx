
import React from 'react';
import { ArrowLeft, Lock, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WishlistHeaderProps {
  title: string;
  isPrivate: boolean;
  loading: boolean;
  error: string | null;
}

const WishlistHeader = ({ title, isPrivate, loading, error }: WishlistHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium truncate">
            {loading ? 'Loading...' : error ? 'Error' : title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {!loading && !error && isPrivate && (
            <span className="flex items-center text-amber-600 text-sm mr-1">
              <Lock className="h-4 w-4 mr-1" />
              Private
            </span>
          )}
          <Button variant="ghost" size="icon" className="text-primary rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistHeader;
