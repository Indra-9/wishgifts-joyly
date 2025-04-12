import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Gift, Award, Settings, LogOut, ChevronRight, 
  Copy, CheckCircle, Users, MessageSquare, Bell 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRewards } from '@/hooks/useUserRewards';
import RewardsDashboard from '@/components/gamification/RewardsDashboard';
import LinkCaptureSheet from '@/components/wishlist/LinkCaptureSheet';
import { Profile as ProfileType } from '@/types/supabase';

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { currentTier, nextTier, karmaPoints, progress } = useUserRewards();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showLinkSheet, setShowLinkSheet] = useState(false);
  
  const [wishlistCount, setWishlistCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;

        const { count: wishlistsCount, error: wishlistError } = await supabase
          .from('wishlists')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);
        
        if (wishlistError) throw wishlistError;

        const { count: connectedFriendsCount, error: friendError } = await supabase
          .from('friends')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'connected');
        
        if (friendError) throw friendError;

        const { count: pendingRequestsCount, error: pendingError } = await supabase
          .from('friends')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'pending_received');
        
        if (pendingError) throw pendingError;

        const { count: unreadNotificationsCount, error: notificationsError } = await supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_read', false);
        
        if (notificationsError) throw notificationsError;

        setProfile(profileData);
        setWishlistCount(wishlistsCount ?? 0);
        setFriendCount(connectedFriendsCount ?? 0);
        setPendingFriendRequests(pendingRequestsCount ?? 0);
        setUnreadNotifications(unreadNotificationsCount ?? 0);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const copyProfileLink = () => {
    if (!profile) return;
    
    const link = `https://joyly.app/profile/${profile.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Your profile link has been copied to clipboard",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-16">
      <Header />
      
      <main className="px-4 py-6 max-w-md mx-auto">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex flex-col items-center mb-8">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            </div>
            
            <div className="glass rounded-xl p-4 mb-6">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
            
            <div className="mb-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        ) : profile && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-xl font-semibold mb-1">{profile.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.phone || profile.email}</p>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyProfileLink}
                className="relative overflow-hidden group"
              >
                <span className={`inline-flex items-center transition-opacity duration-200 ${copied ? 'opacity-0' : 'opacity-100'}`}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Share Profile
                </span>
                <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Copied!
                </span>
              </Button>
            </motion.div>
            
            <RewardsDashboard />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6 space-y-3"
            >
              <ProfileItem 
                icon={<Gift className="h-5 w-5 text-primary" />}
                title="My Wishlists"
                subtitle={`${wishlistCount} wishlists created`}
                to="/wishlists"
                badge={wishlistCount > 0}
              />
              
              <ProfileItem 
                icon={<Users className="h-5 w-5 text-primary" />}
                title="Friends"
                subtitle={`${friendCount} connected, ${pendingFriendRequests} pending`}
                to="/friends"
                badge={pendingFriendRequests > 0}
                badgeCount={pendingFriendRequests}
              />
              
              <ProfileItem 
                icon={<Bell className="h-5 w-5 text-primary" />}
                title="Notifications"
                subtitle={`${unreadNotifications} unread`}
                to="/notifications"
                badge={unreadNotifications > 0}
                badgeCount={unreadNotifications}
              />
              
              <ProfileItem 
                icon={<Award className="h-5 w-5 text-primary" />}
                title="My Rewards"
                subtitle="View rewards & gift history"
                to="/rewards"
              />
              
              {profile.is_admin && (
                <ProfileItem 
                  icon={<Settings className="h-5 w-5 text-primary" />}
                  title="Admin Panel"
                  subtitle="Manage platform & users"
                  to="/admin"
                />
              )}
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full text-destructive" 
                  size="lg"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </main>
      
      <BottomNav />
      
      <LinkCaptureSheet 
        open={showLinkSheet} 
        onOpenChange={setShowLinkSheet} 
      />
    </div>
  );
};

const ProfileItem = ({ 
  icon, 
  title, 
  subtitle, 
  to,
  badge = false,
  badgeCount
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  to: string;
  badge?: boolean;
  badgeCount?: number;
}) => {
  return (
    <motion.div
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative"
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mr-3">
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      
      {badge && badgeCount && (
        <div className="bg-primary text-white text-xs rounded-full px-2 py-1">
          {badgeCount}
        </div>
      )}
      
      <ChevronRight className="h-5 w-5 text-gray-400" />
      
      <Link to={to} className="absolute inset-0" aria-label={title}>
        <span className="sr-only">{title}</span>
      </Link>
    </motion.div>
  );
};

export default Profile;
