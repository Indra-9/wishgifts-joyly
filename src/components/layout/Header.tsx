
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsPopover from '@/components/notifications/NotificationsPopover';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [title, setTitle] = useState('Joyly');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Set page title based on current route
    const path = location.pathname;
    if (path === '/') setTitle('Joyly');
    else if (path.includes('/wishlist')) setTitle('Wishlist');
    else if (path === '/friends') setTitle('Friends');
    else if (path === '/profile') setTitle('Profile');
    else if (path === '/add-item') setTitle('Add Item');
    else if (path === '/rewards') setTitle('Rewards');
    else setTitle('Joyly');

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-primary rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          {user && <NotificationsPopover />}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
