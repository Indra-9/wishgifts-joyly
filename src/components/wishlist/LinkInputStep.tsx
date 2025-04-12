
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface LinkInputStepProps {
  url: string;
  onUrlChange: (url: string) => void;
  onFetchInfo: () => void;
  loading: boolean;
  scrapingError: boolean;
}

const LinkInputStep = ({
  url,
  onUrlChange,
  onFetchInfo,
  loading,
  scrapingError
}: LinkInputStepProps) => {
  return (
    <motion.div
      key="step-link"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">
        <Label htmlFor="product-url">Product URL from Amazon or Flipkart</Label>
        <div className="flex mt-1.5">
          <Input
            id="product-url"
            placeholder="https://www.amazon.in/product-name/..."
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() => window.open('https://www.amazon.in', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {scrapingError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Failed to extract product details</p>
            <p className="text-sm mt-1">
              We only support Amazon.in and Flipkart links. Make sure you're copying the full product URL.
            </p>
          </div>
        </div>
      )}
      
      <div className="p-4 border rounded-md bg-blue-50 mb-6">
        <h3 className="text-sm font-medium mb-2 text-blue-700">How to add products:</h3>
        <ol className="text-xs text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="font-bold mr-1">1.</span>
            <span>Browse Amazon.in or Flipkart and find a product</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-1">2.</span>
            <span>Copy the product URL from your browser</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-1">3.</span>
            <span>Paste it here and click "Fetch Details"</span>
          </li>
        </ol>
      </div>
      
      <Button 
        onClick={onFetchInfo} 
        className="w-full"
        disabled={!url.trim() || loading}
      >
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Fetching Details...
          </>
        ) : 'Fetch Details'}
      </Button>
    </motion.div>
  );
};

export default LinkInputStep;
