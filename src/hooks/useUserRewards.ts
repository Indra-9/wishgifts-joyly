
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BadgeType, TierType, UserBadgeType } from '@/integrations/supabase/custom-types';

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  earnedAt?: string;
}

export interface UserTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
}

export const useUserRewards = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [tiers, setTiers] = useState<UserTier[]>([]);
  const [currentTier, setCurrentTier] = useState<UserTier | null>(null);
  const [nextTier, setNextTier] = useState<UserTier | null>(null);
  const [karmaPoints, setKarmaPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRewards = async () => {
      setLoading(true);
      try {
        // Fetch user profile for karma points
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('karma_points')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        const points = profileData?.karma_points || 0;
        setKarmaPoints(points);

        // Fetch all tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from('tiers')
          .select('*')
          .order('min_points', { ascending: true });

        if (tiersError) throw tiersError;
        
        const formattedTiers = (tiersData as TierType[]).map(tier => ({
          id: tier.id,
          name: tier.name,
          minPoints: tier.min_points,
          maxPoints: tier.max_points,
          color: tier.color
        }));
        
        setTiers(formattedTiers);
        
        // Determine current and next tier based on karma points
        const current = formattedTiers.find(
          tier => points >= tier.minPoints && points <= tier.maxPoints
        ) || null;
        
        setCurrentTier(current);
        
        if (current) {
          const currentIndex = formattedTiers.findIndex(t => t.id === current.id);
          if (currentIndex < formattedTiers.length - 1) {
            setNextTier(formattedTiers[currentIndex + 1]);
          }
        }

        // Fetch all badges and user earned badges
        const [{ data: badgesData, error: badgesError }, { data: userBadgesData, error: userBadgesError }] = await Promise.all([
          supabase.from('badges').select('*'),
          supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user.id)
        ]);

        if (badgesError) throw badgesError;
        if (userBadgesError) throw userBadgesError;

        // Create a map of earned badges for quick lookup
        const earnedBadgesMap = new Map();
        (userBadgesData as UserBadgeType[])?.forEach(userBadge => {
          earnedBadgesMap.set(userBadge.badge_id, userBadge.earned_at);
        });

        // Combine badges with earned status
        const combinedBadges = (badgesData as BadgeType[]).map(badge => ({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          points: badge.points,
          earned: earnedBadgesMap.has(badge.id),
          earnedAt: earnedBadgesMap.get(badge.id) || undefined
        }));

        setBadges(combinedBadges);
      } catch (error) {
        console.error('Error fetching user rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [user]);

  return {
    badges,
    tiers,
    currentTier,
    nextTier,
    karmaPoints,
    loading,
    // Calculate progress to next tier
    progress: nextTier 
      ? Math.round(((karmaPoints - (currentTier?.minPoints || 0)) / 
         ((nextTier?.minPoints || 1) - (currentTier?.minPoints || 0))) * 100)
      : 100
  };
};
