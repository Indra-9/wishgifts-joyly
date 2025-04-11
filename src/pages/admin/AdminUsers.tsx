
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Trash, 
  Shield, 
  Award,
  Gift 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  karma_points: number;
  is_admin: boolean;
  avatar_url: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    karma_points: 0,
    is_admin: false
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
        fetchUsers();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users with their profiles
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      // For each profile, fetch the corresponding auth.users entry to get email
      const usersWithEmail = await Promise.all(
        userData.map(async (profile) => {
          // In a real app, you'd use a serverless function for this
          // Here we'll mock the emails based on usernames
          const email = profile.username ? 
            `${profile.username.toLowerCase().replace(/\s+/g, '.')}@example.com` : 
            null;
          
          return {
            ...profile,
            email
          };
        })
      );

      setUsers(usersWithEmail as User[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username || '',
      karma_points: user.karma_points,
      is_admin: user.is_admin
    });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const submitEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          karma_points: editForm.karma_points,
          is_admin: editForm.is_admin
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id ? {...u, ...editForm} : u
      ));
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive'
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real app, you'd use a serverless function to delete the auth user
      // Here we'll just remove the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      // Update local state
      setUsers(users.filter(u => u.id !== selectedUser.id));
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.phone && user.phone.includes(searchQuery))
    );
  });

  if (!isAdmin) {
    return null; // Already redirecting in useEffect
  }

  return (
    <AdminLayout title="User Management">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-[300px]"
          />
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left font-medium">User</th>
                <th className="py-3 px-4 text-left font-medium">Contact</th>
                <th className="py-3 px-4 text-left font-medium">Karma Points</th>
                <th className="py-3 px-4 text-left font-medium">Role</th>
                <th className="py-3 px-4 text-left font-medium">Joined</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.username || 'User'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-full h-full p-1 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium">{user.username || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {user.email && <div className="text-xs">{user.email}</div>}
                        {user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-amber-500 mr-1" />
                        <span>{user.karma_points}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.is_admin ? (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">User</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No users found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="karma">Karma Points</Label>
              <Input
                id="karma"
                type="number"
                value={editForm.karma_points}
                onChange={(e) => setEditForm({...editForm, karma_points: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_admin"
                checked={editForm.is_admin}
                onChange={(e) => setEditForm({...editForm, is_admin: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_admin">Admin privileges</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete {selectedUser?.username || 'this user'}?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone and will remove all associated data.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
