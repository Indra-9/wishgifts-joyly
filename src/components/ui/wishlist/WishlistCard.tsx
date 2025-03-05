
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Lock, Share2, MoreHorizontal } from 'lucide-react';

export interface WishlistCardProps {
  id: string;
  title: string;
  occasion: string;
  itemCount: number;
  isPrivate: boolean;
  thumbnail?: string;
}

const WishlistCard = ({ id, title, occasion, itemCount, isPrivate, thumbnail }: WishlistCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      <div 
        className="h-32 bg-gray-100 dark:bg-gray-800 bg-center bg-cover" 
        style={{ 
          backgroundImage: thumbnail ? `url(${thumbnail})` : 'none',
          backgroundColor: !thumbnail ? '#f3f4f6' : undefined
        }}
      >
        {!thumbnail && (
          <div className="h-full w-full flex items-center justify-center">
            <Gift className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              {occasion}
            </span>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <button className="text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
          
          <div className="flex space-x-2">
            {isPrivate && (
              <span className="flex items-center text-amber-600 text-sm">
                <Lock className="h-4 w-4 mr-1" />
                Private
              </span>
            )}
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <Link to={`/wishlist/${id}`} className="absolute inset-0" aria-label={`View ${title} wishlist`} />
    </motion.div>
  );
};

export default WishlistCard;
