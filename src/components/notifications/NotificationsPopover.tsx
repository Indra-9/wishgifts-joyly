import { useState } from 'react';
import { Bell, Check, User, Gift, Award, Info } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const NotificationsPopover = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Handle different notification types
    switch (notification.type) {
      case 'friend_request':
        navigate('/friends');
        break;
      case 'gift_purchased':
        navigate(`/wishlist/${notification.data?.wishlist_id || ''}`);
        break;
      case 'badge_earned':
        navigate('/profile');
        break;
      case 'wishlist_access':
        navigate(`/wishlist/${notification.data?.wishlist_id || ''}`);
        break;
      default:
        break;
    }
    
    setOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'friend_request':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'gift_purchased':
        return <Gift className="h-4 w-4 text-green-500" />;
      case 'badge_earned':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'wishlist_access':
        return <Check className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If less than 24 hours ago, show relative time
    if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise show date
    return format(date, 'MMM d');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-[70vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="justify-start px-4 pt-2 border-b rounded-none">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="flex-1 overflow-y-auto m-0 p-0">
            <AnimatePresence>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">We'll notify you when something happens</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">{formatNotificationTime(notification.created_at)}</p>
                        </div>
                        {!notification.is_read && (
                          <div className="ml-2 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
          
          <TabsContent value="unread" className="flex-1 overflow-y-auto m-0 p-0">
            <AnimatePresence>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm mt-2">Loading notifications...</p>
                </div>
              ) : notifications.filter(n => !n.is_read).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                  <Check className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No unread notifications</p>
                  <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.filter(n => !n.is_read).map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 hover:bg-gray-50 cursor-pointer bg-blue-50 dark:bg-blue-900/10"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">{formatNotificationTime(notification.created_at)}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
