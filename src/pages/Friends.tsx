
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Check, X, Gift, User } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Friend {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status: 'connected' | 'pending_sent' | 'pending_received';
}

// Mock data - this would come from Supabase in a real implementation
const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Amit Kumar',
    phone: '+91 98765 43210',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'connected'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'connected'
  },
  {
    id: '3',
    name: 'Rahul Singh',
    phone: '+91 98765 43212',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'pending_sent'
  },
  {
    id: '4',
    name: 'Neha Gupta',
    phone: '+91 98765 43213',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'pending_received'
  }
];

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating data fetch from Supabase
    const fetchData = async () => {
      setLoading(true);
      // In a real app, fetch from Supabase here
      setTimeout(() => {
        setFriends(mockFriends);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  const connectedFriends = friends.filter(friend => friend.status === 'connected');
  const pendingSent = friends.filter(friend => friend.status === 'pending_sent');
  const pendingReceived = friends.filter(friend => friend.status === 'pending_received');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-16">
      <Header />
      
      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="mb-6">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search friends by name or phone..."
              className="pl-10 py-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl p-4 mb-6"
          >
            <h2 className="text-lg font-medium mb-2">Add Friends</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Connect with friends to see their wishlists and gift them easily.
            </p>
            <Button className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Friends
            </Button>
          </motion.div>

          <Tabs defaultValue="connected" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="connected">
                Connected
                {connectedFriends.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                    {connectedFriends.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="requests">
                Requests
                {pendingReceived.length > 0 && (
                  <span className="ml-1 text-xs bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
                    {pendingReceived.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent">
                Sent
                {pendingSent.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/10 px-1.5 py-0.5 rounded-full">
                    {pendingSent.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="connected" className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                    <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))
              ) : connectedFriends.length > 0 ? (
                connectedFriends.map((friend) => (
                  <FriendItem key={friend.id} friend={friend} type="connected" />
                ))
              ) : (
                <EmptyState message="You have no connected friends yet" />
              )}
            </TabsContent>
            
            <TabsContent value="requests" className="space-y-4">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))
              ) : pendingReceived.length > 0 ? (
                pendingReceived.map((friend) => (
                  <FriendItem key={friend.id} friend={friend} type="pending_received" />
                ))
              ) : (
                <EmptyState message="You have no friend requests" />
              )}
            </TabsContent>
            
            <TabsContent value="sent" className="space-y-4">
              {loading ? (
                Array(1).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                    <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))
              ) : pendingSent.length > 0 ? (
                pendingSent.map((friend) => (
                  <FriendItem key={friend.id} friend={friend} type="pending_sent" />
                ))
              ) : (
                <EmptyState message="You have no pending sent requests" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

const FriendItem = ({ friend, type }: { friend: Friend; type: 'connected' | 'pending_sent' | 'pending_received' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {friend.avatar ? (
          <img src={friend.avatar} alt={friend.name} className="h-full w-full object-cover" />
        ) : (
          <User className="h-6 w-6 text-gray-400" />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{friend.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{friend.phone}</p>
      </div>
      
      {type === 'connected' && (
        <Button variant="outline" size="sm">
          <Gift className="h-4 w-4 mr-1" />
          View Lists
        </Button>
      )}
      
      {type === 'pending_received' && (
        <div className="flex space-x-2">
          <Button size="icon" variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
            <X className="h-4 w-4" />
          </Button>
          <Button size="icon" className="text-green-50 bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {type === 'pending_sent' && (
        <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
      )}
    </motion.div>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        <User className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default Friends;
