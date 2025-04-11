
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Tier, UserBadge } from '@/types/supabase';

export interface UserBadgeWithDetails extends Badge {
  earned: boolean;
  earnedAt?: string;
}

export { type UserBadge, type Badge, type Tier } from '@/types/supabase';

export const useUserRewards = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadgeWithDetails[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [currentTier, setCurrentTier] = useState<Tier | null>(null);
  const [nextTier, setNextTier] = useState<Tier | null>(null);
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
        
        setTiers(tiersData as Tier[]);
        
        // Determine current and next tier based on karma points
        const current = (tiersData as Tier[]).find(
          tier => points >= tier.min_points && points <= tier.max_points
        ) || null;
        
        setCurrentTier(current);
        
        if (current) {
          const currentIndex = (tiersData as Tier[]).findIndex(t => t.id === current.id);
          if (currentIndex < (tiersData as Tier[]).length - 1) {
            setNextTier((tiersData as Tier[])[currentIndex + 1]);
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
        (userBadgesData as UserBadge[])?.forEach(userBadge => {
          earnedBadgesMap.set(userBadge.badge_id, userBadge.earned_at);
        });

        // Combine badges with earned status
        const combinedBadges = (badgesData as Badge[]).map(badge => ({
          ...badge,
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
      ? Math.round(((karmaPoints - (currentTier?.min_points || 0)) / 
         ((nextTier?.min_points || 1) - (currentTier?.min_points || 0))) * 100)
      : 100
  };
};
