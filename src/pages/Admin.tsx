
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Settings, 
  Trash2, 
  Edit, 
  UserPlus, 
  Ban, 
  CheckCircle 
} from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { User, Profile } from '@/types/supabase';

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<(User & Profile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.email !== 'indranath3636@gmail.com') {
      window.location.href = '/profile';
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, auth.users(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setUsers(data as (User & Profile)[]);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Could not fetch users",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, toast]);

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const handleUserAction = async (userId: string, action: 'promote' | 'demote' | 'ban') => {
    try {
      if (action === 'promote') {
        await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', userId);
      } else if (action === 'demote') {
        await supabase
          .from('profiles')
          .update({ is_admin: false })
          .eq('id', userId);
      } else if (action === 'ban') {
        // TODO: Implement proper ban mechanism
        toast({
          title: "Ban Feature",
          description: "Full ban implementation pending",
          variant: "default"
        });
      }

      // Refresh users after action
      const { data, error } = await supabase
        .from('profiles')
        .select('*, auth.users(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as (User & Profile)[]);

      toast({
        title: "Success",
        description: `User ${action} successfully`,
        variant: "default"
      });
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast({
        title: "Error",
        description: `Could not ${action} user`,
        variant: "destructive"
      });
    }
  };

  if (!user || user.email !== 'indranath3636@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-16">
      <Header />
      <main className="px-4 py-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Settings className="mr-3" /> Admin Panel
        </h1>

        <div className="mb-4">
          <Input 
            placeholder="Search users by username, email, or phone" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Table>
          <TableCaption>List of Platform Users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Karma Points</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.username || 'N/A'}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.karma_points}</TableCell>
                <TableCell>
                  {u.is_admin ? 'Admin' : 'User'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!u.is_admin ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUserAction(u.id, 'promote')}
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Promote
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUserAction(u.id, 'demote')}
                      >
                        <Ban className="mr-2 h-4 w-4" /> Demote
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleUserAction(u.id, 'ban')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Ban
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
      <BottomNav />
    </div>
  );
};

export default AdminPanel;
