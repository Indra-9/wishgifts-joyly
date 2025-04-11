
// Custom types to extend the auto-generated Supabase types
export interface NotificationType {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'friend_request' | 'gift_purchased' | 'badge_earned' | 'wishlist_access' | 'system';
  is_read: boolean;
  data: any;
  created_at: string;
}

export interface TierType {
  id: string;
  name: string;
  min_points: number;
  max_points: number;
  color: string;
  created_at: string;
}

export interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement: string;
  created_at: string;
}

export interface UserBadgeType {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface LinkCacheType {
  id: string;
  url: string;
  title: string | null;
  price: number | null;
  image_url: string | null;
  merchant: string | null;
  created_at: string;
  expires_at: string;
}

export interface GiftSuggestionType {
  id: string;
  user_id: string;
  occasion_id: string | null;
  title: string;
  description: string | null;
  url: string | null;
  price_range: string | null;
  created_at: string;
}
