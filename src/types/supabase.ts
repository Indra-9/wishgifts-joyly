
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

// Add missing interfaces from Supabase tables
export interface Wishlist {
  id: string;
  user_id: string;
  occasion_id: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  user_id: string | null;
  title: string;
  price: number | null;
  image_url: string | null;
  merchant: string | null;
  product_url: string;
  notes: string | null;
  is_purchased: boolean;
  created_at: string;
  updated_at: string;
}

export interface Occasion {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface WishlistAccess {
  id: string;
  wishlist_id: string;
  user_id: string;
  can_edit: boolean;
  created_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GiftPurchase {
  id: string;
  item_id: string;
  buyer_id: string;
  recipient_id: string;
  points_earned: number;
  created_at: string;
}
