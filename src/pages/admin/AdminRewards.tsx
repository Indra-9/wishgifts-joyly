
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Gift, 
  Plus,
  Edit,
  Trash,
  Filter,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/AdminLayout';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeType, TierType } from '@/integrations/supabase/custom-types';

const AdminRewards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('badges');
  
  // Badges state
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [badgeDeleteDialogOpen, setBadgeDeleteDialogOpen] = useState(false);
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    icon: 'award',
    points: 50,
    requirement: ''
  });
  
  // Tiers state
  const [tiers, setTiers] = useState<TierType[]>([]);
  const [selectedTier, setSelectedTier] = useState<TierType | null>(null);
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [tierDeleteDialogOpen, setTierDeleteDialogOpen] = useState(false);
  const [tierForm, setTierForm] = useState({
    name: '',
    min_points: 0,
    max_points: 0,
    color: '#000000'
  });

  // User rewards state
  const [userRewards, setUserRewards] = useState<any[]>([]);
  const [rewardsStats, setRewardsStats] = useState({
    totalBadgesEarned: 0,
    mostPopularBadge: '',
    averageKarmaPoints: 0
  });

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
        fetchRewardsData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const fetchRewardsData = async () => {
    setLoading(true);
    try {
      // Fetch badges, tiers, and user rewards in parallel
      const [
        { data: badgesData, error: badgesError },
        { data: tiersData, error: tiersError },
        { data: userBadgesData, error: userBadgesError },
        { data: profilesData, error: profilesError }
      ] = await Promise.all([
        supabase.from('badges').select('*').order('created_at', { ascending: false }),
        supabase.from('tiers').select('*').order('min_points', { ascending: true }),
        supabase.from('user_badges').select('badge_id, user_id, earned_at, badges(name), profiles(username)'),
        supabase.from('profiles').select('karma_points')
      ]);

      if (badgesError) throw badgesError;
      if (tiersError) throw tiersError;
      if (userBadgesError) throw userBadgesError;
      if (profilesError) throw profilesError;

      setBadges(badgesData as BadgeType[]);
      setTiers(tiersData as TierType[]);
      setUserRewards(userBadgesData || []);
      
      // Calculate stats
      const totalBadgesEarned = userBadgesData?.length || 0;
      
      // Count occurrences of each badge
      const badgeCounts: Record<string, number> = {};
      userBadgesData?.forEach((userBadge: any) => {
        const badgeName = userBadge.badges?.name;
        if (badgeName) {
          badgeCounts[badgeName] = (badgeCounts[badgeName] || 0) + 1;
        }
      });
      
      // Find most popular badge
      let mostPopularBadge = '';
      let maxCount = 0;
      Object.entries(badgeCounts).forEach(([badge, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostPopularBadge = badge;
        }
      });
      
      // Calculate average karma points
      const totalKarmaPoints = profilesData?.reduce((sum, profile) => sum + (profile.karma_points || 0), 0) || 0;
      const averageKarmaPoints = profilesData?.length ? Math.round(totalKarmaPoints / profilesData.length) : 0;
      
      setRewardsStats({
        totalBadgesEarned,
        mostPopularBadge,
        averageKarmaPoints
      });
      
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rewards data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBadgeDialog = (badge?: BadgeType) => {
    if (badge) {
      setSelectedBadge(badge);
      setBadgeForm({
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        points: badge.points,
        requirement: badge.requirement
      });
    } else {
      setSelectedBadge(null);
      setBadgeForm({
        name: '',
        description: '',
        icon: 'award',
        points: 50,
        requirement: ''
      });
    }
    setBadgeDialogOpen(true);
  };

  const handleOpenTierDialog = (tier?: TierType) => {
    if (tier) {
      setSelectedTier(tier);
      setTierForm({
        name: tier.name,
        min_points: tier.min_points,
        max_points: tier.max_points,
        color: tier.color
      });
    } else {
      setSelectedTier(null);
      setTierForm({
        name: '',
        min_points: 0,
        max_points: 0,
        color: '#000000'
      });
    }
    setTierDialogOpen(true);
  };

  const handleDeleteBadge = (badge: BadgeType) => {
    setSelectedBadge(badge);
    setBadgeDeleteDialogOpen(true);
  };

  const handleDeleteTier = (tier: TierType) => {
    setSelectedTier(tier);
    setTierDeleteDialogOpen(true);
  };

  const submitBadgeForm = async () => {
    try {
      if (selectedBadge) {
        // Update existing badge
        const { error } = await supabase
          .from('badges')
          .update({
            name: badgeForm.name,
            description: badgeForm.description,
            icon: badgeForm.icon,
            points: badgeForm.points,
            requirement: badgeForm.requirement
          })
          .eq('id', selectedBadge.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Badge updated successfully',
        });

        // Update local state
        setBadges(badges.map(b => 
          b.id === selectedBadge.id ? {...b, ...badgeForm} : b
        ));
      } else {
        // Create new badge
        const { data, error } = await supabase
          .from('badges')
          .insert({
            name: badgeForm.name,
            description: badgeForm.description,
            icon: badgeForm.icon,
            points: badgeForm.points,
            requirement: badgeForm.requirement
          })
          .select();

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Badge created successfully',
        });

        // Update local state
        setBadges([data[0], ...badges]);
      }
      
      setBadgeDialogOpen(false);
    } catch (error) {
      console.error('Error saving badge:', error);
      toast({
        title: 'Error',
        description: 'Failed to save badge',
        variant: 'destructive'
      });
    }
  };

  const submitTierForm = async () => {
    try {
      if (selectedTier) {
        // Update existing tier
        const { error } = await supabase
          .from('tiers')
          .update({
            name: tierForm.name,
            min_points: tierForm.min_points,
            max_points: tierForm.max_points,
            color: tierForm.color
          })
          .eq('id', selectedTier.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Tier updated successfully',
        });

        // Update local state
        setTiers(tiers.map(t => 
          t.id === selectedTier.id ? {...t, ...tierForm} : t
        ));
      } else {
        // Create new tier
        const { data, error } = await supabase
          .from('tiers')
          .insert({
            name: tierForm.name,
            min_points: tierForm.min_points,
            max_points: tierForm.max_points,
            color: tierForm.color
          })
          .select();

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Tier created successfully',
        });

        // Update local state with proper sorting by min_points
        const newTiers = [...tiers, data[0]].sort((a, b) => a.min_points - b.min_points);
        setTiers(newTiers);
      }
      
      setTierDialogOpen(false);
    } catch (error) {
      console.error('Error saving tier:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tier',
        variant: 'destructive'
      });
    }
  };

  const confirmDeleteBadge = async () => {
    if (!selectedBadge) return;
    
    try {
      const { error } = await supabase
        .from('badges')
        .delete()
        .eq('id', selectedBadge.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Badge deleted successfully',
      });

      // Update local state
      setBadges(badges.filter(b => b.id !== selectedBadge.id));
      
      setBadgeDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete badge',
        variant: 'destructive'
      });
    }
  };

  const confirmDeleteTier = async () => {
    if (!selectedTier) return;
    
    try {
      const { error } = await supabase
        .from('tiers')
        .delete()
        .eq('id', selectedTier.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tier deleted successfully',
      });

      // Update local state
      setTiers(tiers.filter(t => t.id !== selectedTier.id));
      
      setTierDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tier',
        variant: 'destructive'
      });
    }
  };

  if (!isAdmin) {
    return null; // Already redirecting in useEffect
  }

  return (
    <AdminLayout title="Rewards & Gamification">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="badges" className="flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="tiers" className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            Tiers
          </TabsTrigger>
          <TabsTrigger value="user-rewards" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            User Rewards
          </TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Badges Tab */}
            <TabsContent value="badges">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Manage Achievement Badges</h2>
                <Button onClick={() => handleOpenBadgeDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Badge
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <Card key={badge.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex items-center">
                        <Award className="mr-2 h-5 w-5 text-primary" />
                        {badge.name}
                      </CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-primary/10">
                          {badge.points} points
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Requirement: {badge.requirement}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 pt-0">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenBadgeDialog(badge)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBadge(badge)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {badges.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No badges found. Create your first badge to get started.
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Tiers Tab */}
            <TabsContent value="tiers">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Manage User Tiers</h2>
                <Button onClick={() => handleOpenTierDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Tier
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiers.map((tier) => (
                  <Card key={tier.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex items-center">
                        <span
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: tier.color }}
                        ></span>
                        {tier.name}
                      </CardTitle>
                      <CardDescription>
                        {tier.min_points} - {tier.max_points} karma points
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end space-x-2 pt-4">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenTierDialog(tier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTier(tier)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {tiers.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No tiers found. Create your first tier to get started.
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* User Rewards Tab */}
            <TabsContent value="user-rewards">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Total Badges Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{rewardsStats.totalBadgesEarned}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Most Popular Badge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{rewardsStats.mostPopularBadge || 'None'}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Average Karma Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{rewardsStats.averageKarmaPoints}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="rounded-md border">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-medium">Recent Badge Earnings</h3>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-3 px-4 text-left font-medium">User</th>
                      <th className="py-3 px-4 text-left font-medium">Badge</th>
                      <th className="py-3 px-4 text-left font-medium">Date Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRewards.length > 0 ? (
                      userRewards.map((reward: any) => (
                        <tr key={`${reward.badge_id}-${reward.user_id}`} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">
                            {reward.profiles?.username || 'Anonymous'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-primary/10">
                              <Award className="h-3 w-3 mr-1" />
                              {reward.badges?.name || 'Unknown Badge'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {new Date(reward.earned_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          No badge rewards found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Badge Dialog */}
      <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBadge ? 'Edit Badge' : 'Create New Badge'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="badge-name">Badge Name</Label>
              <Input
                id="badge-name"
                value={badgeForm.name}
                onChange={(e) => setBadgeForm({...badgeForm, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badge-description">Description</Label>
              <Textarea
                id="badge-description"
                value={badgeForm.description}
                onChange={(e) => setBadgeForm({...badgeForm, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badge-icon">Icon</Label>
              <Select
                value={badgeForm.icon}
                onValueChange={(value) => setBadgeForm({...badgeForm, icon: value})}
              >
                <SelectTrigger id="badge-icon">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="award">Award</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badge-points">Karma Points</Label>
              <Input
                id="badge-points"
                type="number"
                value={badgeForm.points}
                onChange={(e) => setBadgeForm({...badgeForm, points: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badge-requirement">Requirement</Label>
              <Input
                id="badge-requirement"
                value={badgeForm.requirement}
                onChange={(e) => setBadgeForm({...badgeForm, requirement: e.target.value})}
                placeholder="e.g., purchase_first_gift"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBadgeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitBadgeForm}>
              {selectedBadge ? 'Update Badge' : 'Create Badge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tier Dialog */}
      <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTier ? 'Edit Tier' : 'Create New Tier'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tier-name">Tier Name</Label>
              <Input
                id="tier-name"
                value={tierForm.name}
                onChange={(e) => setTierForm({...tierForm, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier-min-points">Minimum Points</Label>
              <Input
                id="tier-min-points"
                type="number"
                value={tierForm.min_points}
                onChange={(e) => setTierForm({...tierForm, min_points: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier-max-points">Maximum Points</Label>
              <Input
                id="tier-max-points"
                type="number"
                value={tierForm.max_points}
                onChange={(e) => setTierForm({...tierForm, max_points: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier-color">Tier Color</Label>
              <div className="flex items-center">
                <Input
                  id="tier-color"
                  type="color"
                  value={tierForm.color}
                  onChange={(e) => setTierForm({...tierForm, color: e.target.value})}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={tierForm.color}
                  onChange={(e) => setTierForm({...tierForm, color: e.target.value})}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitTierForm}>
              {selectedTier ? 'Update Tier' : 'Create Tier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Badge Dialog */}
      <Dialog open={badgeDeleteDialogOpen} onOpenChange={setBadgeDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete the "{selectedBadge?.name}" badge?</p>
            <p className="text-sm text-gray-500 mt-2">This will remove the badge from all users who have earned it.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBadgeDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBadge}>
              Delete Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tier Dialog */}
      <Dialog open={tierDeleteDialogOpen} onOpenChange={setTierDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete the "{selectedTier?.name}" tier?</p>
            <p className="text-sm text-gray-500 mt-2">Users in this tier will no longer have a tier assigned.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTier}>
              Delete Tier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminRewards;
