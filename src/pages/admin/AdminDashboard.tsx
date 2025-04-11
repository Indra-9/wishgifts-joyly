
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Gift, 
  Award, 
  TrendingUp, 
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { Progress } from '@/components/ui/progress';

interface StatCard {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  change?: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentWishlists, setRecentWishlists] = useState<any[]>([]);
  const [flaggedContent, setFlaggedContent] = useState<any[]>([]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (!data || !data.is_admin) {
          // Not an admin, redirect to home
          navigate('/');
          return;
        }

        setIsAdmin(true);
        fetchDashboardData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch statistics in parallel
      const [
        { count: usersCount },
        { count: wishlistsCount },
        { count: itemsCount },
        { count: badgesCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('wishlists').select('*', { count: 'exact', head: true }),
        supabase.from('wishlist_items').select('*', { count: 'exact', head: true }),
        supabase.from('user_badges').select('*', { count: 'exact', head: true })
      ]);

      // Set statistics
      setStats([
        {
          title: 'Total Users',
          value: usersCount || 0,
          description: 'Registered users on the platform',
          icon: Users,
          change: 8.2
        },
        {
          title: 'Active Wishlists',
          value: wishlistsCount || 0,
          description: 'Wishlists created by users',
          icon: Gift,
          change: 12.5
        },
        {
          title: 'Wishlist Items',
          value: itemsCount || 0,
          description: 'Products added to wishlists',
          icon: ShoppingBag,
          change: 23.1
        },
        {
          title: 'Badges Earned',
          value: badgesCount || 0,
          description: 'Achievements unlocked by users',
          icon: Award,
          change: 4.6
        }
      ]);

      // Fetch recent wishlists
      const { data: recentWishlistsData } = await supabase
        .from('wishlists')
        .select('id, title, created_at, user_id, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentWishlists(recentWishlistsData || []);

      // For demo purposes, generate some flagged content
      setFlaggedContent([
        {
          id: '1',
          type: 'product',
          title: 'Potentially unsafe product link',
          reportedBy: 'user123',
          date: new Date().toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          type: 'user',
          title: 'Suspicious account activity',
          reportedBy: 'system',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Already redirecting in useEffect
  }

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">+{stat.change}% from last month</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Wishlists */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Wishlists</CardTitle>
                <CardDescription>Newly created wishlists across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWishlists.length > 0 ? (
                    recentWishlists.map((wishlist: any) => (
                      <div key={wishlist.id} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{wishlist.title}</h4>
                          <p className="text-sm text-gray-500">
                            by {wishlist.profiles?.username || 'Anonymous'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(wishlist.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">No wishlists found</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content Requiring Moderation */}
            <Card>
              <CardHeader>
                <CardTitle>Flagged Content</CardTitle>
                <CardDescription>Items that require admin attention</CardDescription>
              </CardHeader>
              <CardContent>
                {flaggedContent.length > 0 ? (
                  <div className="space-y-4">
                    {flaggedContent.map((item) => (
                      <div key={item.id} className="flex items-start border-l-4 border-amber-500 pl-3 py-2 bg-amber-50 rounded">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Reported by: {item.reportedBy}</span>
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">No flagged content</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
