
import { supabase } from '@/integrations/supabase/client';
import { LinkCache } from '@/types/supabase';

export const getCachedLink = async (url: string): Promise<LinkCache | null> => {
  try {
    const { data, error } = await supabase
      .from('link_cache')
      .select('*')
      .eq('url', url)
      .single();
    
    if (error) return null;
    return data as LinkCache;
  } catch (error) {
    console.error('Error fetching cached link:', error);
    return null;
  }
};

export const cacheLink = async (linkData: Omit<LinkCache, 'id' | 'created_at' | 'expires_at'>) => {
  try {
    const { error } = await supabase
      .from('link_cache')
      .insert(linkData);
    
    if (error) console.error('Error caching link data:', error);
  } catch (error) {
    console.error('Error caching link:', error);
  }
};

export const determineMerchant = (url: string): string => {
  if (url.includes('amazon')) return 'amazon';
  if (url.includes('flipkart')) return 'flipkart';
  return 'other';
};
