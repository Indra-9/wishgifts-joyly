
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCachedLink, cacheLink, determineMerchant } from '@/utils/linkCache';

export interface ProductInfo {
  title: string;
  price: number;
  image_url: string;
  merchant: string;
}

export const useProductLink = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [scrapingError, setScrapingError] = useState(false);

  const fetchProductInfo = async () => {
    if (!url.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid product URL",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    setScrapingError(false);

    try {
      // Check if URL is cached
      const cachedData = await getCachedLink(url);
      
      if (cachedData) {
        setProductInfo({
          title: cachedData.title || 'Product Title',
          price: cachedData.price || 0,
          image_url: cachedData.image_url || '',
          merchant: cachedData.merchant || determineMerchant(url)
        });
        setLoading(false);
        return true;
      }

      // Simulate fetching product info
      // In production, this would call your scraping edge function
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          const merchant = determineMerchant(url);
          
          // Mock data based on merchant
          let mockData: ProductInfo;
          
          if (merchant === 'amazon') {
            mockData = {
              title: 'Amazon Product - ' + Math.floor(Math.random() * 1000),
              price: Math.floor(Math.random() * 10000) + 1000,
              image_url: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg',
              merchant: 'amazon'
            };
          } else if (merchant === 'flipkart') {
            mockData = {
              title: 'Flipkart Product - ' + Math.floor(Math.random() * 1000),
              price: Math.floor(Math.random() * 10000) + 1000,
              image_url: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/u/h/j/mobile-f45-smartphone-tecno-original-imagsm4r2gr3shvx.jpeg',
              merchant: 'flipkart'
            };
          } else {
            // Handle other merchants
            mockData = {
              title: 'Other Product - ' + Math.floor(Math.random() * 1000),
              price: Math.floor(Math.random() * 10000) + 1000,
              image_url: 'https://via.placeholder.com/300',
              merchant: 'other'
            };
          }
          
          // Cache the result
          cacheLink({
            url,
            title: mockData.title,
            price: mockData.price,
            image_url: mockData.image_url,
            merchant: mockData.merchant
          });
          
          setProductInfo(mockData);
          setLoading(false);
          resolve(true);
        }, 1500);
      });
    } catch (error) {
      console.error('Error fetching product info:', error);
      setScrapingError(true);
      setLoading(false);
      toast({
        title: "Failed to extract product details",
        description: "We couldn't read the product details from this URL. Please check if it's valid.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetProductInfo = () => {
    setUrl('');
    setProductInfo(null);
    setScrapingError(false);
  };

  return {
    url,
    setUrl,
    productInfo,
    loading,
    scrapingError,
    fetchProductInfo,
    resetProductInfo
  };
};
