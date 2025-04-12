export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points: number
          requirement: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gift_activities: {
        Row: {
          created_at: string | null
          gifter_id: string | null
          id: string
          message: string | null
          recipient_id: string | null
          status: string
          wishlist_item_id: string | null
        }
        Insert: {
          created_at?: string | null
          gifter_id?: string | null
          id?: string
          message?: string | null
          recipient_id?: string | null
          status: string
          wishlist_item_id?: string | null
        }
        Update: {
          created_at?: string | null
          gifter_id?: string | null
          id?: string
          message?: string | null
          recipient_id?: string | null
          status?: string
          wishlist_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_activities_wishlist_item_id_fkey"
            columns: ["wishlist_item_id"]
            isOneToOne: false
            referencedRelation: "wishlist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_purchases: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          item_id: string
          points_earned: number
          recipient_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          item_id: string
          points_earned?: number
          recipient_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          item_id?: string
          points_earned?: number
          recipient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "wishlist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_suggestions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          occasion_id: string | null
          price_range: string | null
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          occasion_id?: string | null
          price_range?: string | null
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          occasion_id?: string | null
          price_range?: string | null
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_suggestions_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "occasions"
            referencedColumns: ["id"]
          },
        ]
      }
      karma_events: {
        Row: {
          created_at: string | null
          event: string
          id: string
          metadata: Json | null
          points: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: string
          metadata?: Json | null
          points: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: string
          metadata?: Json | null
          points?: number
          user_id?: string | null
        }
        Relationships: []
      }
      link_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          image_url: string | null
          merchant: string | null
          price: number | null
          title: string | null
          url: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          image_url?: string | null
          merchant?: string | null
          price?: number | null
          title?: string | null
          url: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          image_url?: string | null
          merchant?: string | null
          price?: number | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      occasions: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_admin: boolean
          karma_points: number
          name: string | null
          phone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_admin?: boolean
          karma_points?: number
          name?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean
          karma_points?: number
          name?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      tiers: {
        Row: {
          color: string
          created_at: string
          id: string
          max_points: number
          min_points: number
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          max_points: number
          min_points: number
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          max_points?: number
          min_points?: number
          name?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_access: {
        Row: {
          can_edit: boolean
          created_at: string
          id: string
          user_id: string
          wishlist_id: string
        }
        Insert: {
          can_edit?: boolean
          created_at?: string
          id?: string
          user_id: string
          wishlist_id: string
        }
        Update: {
          can_edit?: boolean
          created_at?: string
          id?: string
          user_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_access_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_collaborators: {
        Row: {
          accepted: boolean | null
          id: string
          invited_at: string | null
          role: string
          user_id: string | null
          wishlist_id: string | null
        }
        Insert: {
          accepted?: boolean | null
          id?: string
          invited_at?: string | null
          role: string
          user_id?: string | null
          wishlist_id?: string | null
        }
        Update: {
          accepted?: boolean | null
          id?: string
          invited_at?: string | null
          role?: string
          user_id?: string | null
          wishlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_collaborators_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_item_reactions: {
        Row: {
          emoji: string
          id: string
          reacted_at: string | null
          user_id: string | null
          wishlist_item_id: string | null
        }
        Insert: {
          emoji: string
          id?: string
          reacted_at?: string | null
          user_id?: string | null
          wishlist_item_id?: string | null
        }
        Update: {
          emoji?: string
          id?: string
          reacted_at?: string | null
          user_id?: string | null
          wishlist_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_item_reactions_wishlist_item_id_fkey"
            columns: ["wishlist_item_id"]
            isOneToOne: false
            referencedRelation: "wishlist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_purchased: boolean
          merchant: string | null
          notes: string | null
          price: number | null
          product_url: string
          title: string
          updated_at: string
          user_id: string | null
          wishlist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          merchant?: string | null
          notes?: string | null
          price?: number | null
          product_url: string
          title: string
          updated_at?: string
          user_id?: string | null
          wishlist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          merchant?: string | null
          notes?: string | null
          price?: number | null
          product_url?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_private: boolean
          occasion_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean
          occasion_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean
          occasion_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "occasions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
