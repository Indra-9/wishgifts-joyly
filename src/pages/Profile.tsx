
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Gift, Award, Settings, LogOut, ChevronRight, Copy, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  points: number;
  level: string;
  nextLevel: string;
  progress: number;
  totalWishlists: number;
  totalFriends: number;
}

// Mock data - this would come from Supabase in a real implementation
const mockProfile: UserProfile = {
  id: '1',
  name: 'Rohit Sharma',
  phone: '+91 98765 12345',
  email: 'rohit@example.com',
  avatar: 'https://i.pravatar.cc/300?img=70',
  points: 450,
  level: 'Silver',
  nextLevel: 'Gold',
  progress: 45,
  totalWishlists: 5,
  totalFriends: 12
};

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulating data fetch from Supabase
    const fetchData = async () => {
      setLoading(true);
      // In a real app, fetch from Supabase here
      setTimeout(() => {
        setProfile(mockProfile);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  const copyProfileLink = () => {
    const link = `https://joyly.app/profile/${profile?.id}`;
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
              <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.phone}</p>
              
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
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass rounded-xl p-4 mb-6"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-medium">Rewards Level</h2>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                You're <span className="font-medium">{profile.progress}%</span> of the way to {profile.nextLevel}
              </p>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full" 
                  style={{ width: `${profile.progress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{profile.points} points</span>
                <span>1000 points for {profile.nextLevel}</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6 space-y-3"
            >
              <ProfileItem 
                icon={<Gift className="h-5 w-5 text-primary" />}
                title="My Wishlists"
                subtitle={`${profile.totalWishlists} wishlists created`}
                to="/"
              />
              
              <ProfileItem 
                icon={<User className="h-5 w-5 text-primary" />}
                title="Friends"
                subtitle={`${profile.totalFriends} connected friends`}
                to="/friends"
              />
              
              <ProfileItem 
                icon={<Award className="h-5 w-5 text-primary" />}
                title="My Rewards"
                subtitle="View your rewards and gift history"
                to="/rewards"
              />
              
              <ProfileItem 
                icon={<Settings className="h-5 w-5 text-primary" />}
                title="Settings"
                subtitle="App preferences and account settings"
                to="/settings"
              />
              
              <div className="mt-6">
                <Button variant="outline" className="w-full text-destructive" size="lg">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

const ProfileItem = ({ 
  icon, 
  title, 
  subtitle, 
  to 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  to: string;
}) => {
  return (
    <motion.div
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
      className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mr-3">
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      
      <ChevronRight className="h-5 w-5 text-gray-400" />
      
      <Link to={to} className="absolute inset-0" aria-label={title} />
    </motion.div>
  );
};

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const Link = ({ to, children, className }: LinkProps) => {
  // This is a mock Link component, in a real app we'd use react-router-dom's Link
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
};

export default Profile;
