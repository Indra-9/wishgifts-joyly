
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  merchant: string; // Changed from 'amazon' | 'flipkart' | 'other' to string to match database values
  url: string;
}

const ProductCard = ({ id, title, price, image, merchant, url }: ProductCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getMerchantLogo = (merchant: string) => {
    // Handle merchant as a string, with fallback for non-standard values
    const normalizedMerchant = merchant.toLowerCase();
    if (normalizedMerchant.includes('amazon')) {
      return '/amazon-logo.png';
    } else if (normalizedMerchant.includes('flipkart')) {
      return '/flipkart-logo.png';
    }
    return null;
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      <div className="relative h-48 bg-gray-50 dark:bg-gray-800">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-contain p-4"
          loading="lazy"
        />
        
        {getMerchantLogo(merchant) && (
          <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-md p-1">
            <img 
              src={getMerchantLogo(merchant)} 
              alt={merchant} 
              className="h-5"
              loading="lazy"
            />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 h-10 mb-2">{title}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold">{formatPrice(price)}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={(e) => handleClick(e)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Gift
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
