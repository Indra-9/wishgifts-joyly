
// Custom types for Supabase tables

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'friend_request' | 'gift_purchased' | 'badge_earned' | 'wishlist_access' | 'system';
  is_read: boolean;
  data: any;
  created_at: string;
  user_id: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement: string;
  created_at: string;
}

export interface Tier {
  id: string;
  name: string;
  min_points: number;
  max_points: number;
  color: string;
  created_at: string;
}

export interface LinkCache {
  id: string;
  url: string;
  title: string | null;
  price: number | null;
  image_url: string | null;
  merchant: string | null;
  created_at: string;
  expires_at: string;
}

export interface GiftSuggestion {
  id: string;
  user_id: string;
  occasion_id: string | null;
  title: string;
  description: string | null;
  url: string | null;
  price_range: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  phone: string | null;
  avatar_url: string | null;
  karma_points: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface User extends Profile {
  email: string;
}
