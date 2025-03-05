
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Gift, UserCircle, Users, Plus } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavItem 
          to="/" 
          icon={<Gift className="w-6 h-6" />} 
          label="Wishlists" 
          isActive={isActive('/')} 
        />
        <NavItem 
          to="/friends" 
          icon={<Users className="w-6 h-6" />} 
          label="Friends" 
          isActive={isActive('/friends')} 
        />
        <AddButton />
        <NavItem 
          to="/profile" 
          icon={<UserCircle className="w-6 h-6" />} 
          label="Profile" 
          isActive={isActive('/profile')} 
        />
      </div>
    </motion.nav>
  );
};

const NavItem = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center px-3 py-1 relative ${
        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center">
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
};

const AddButton = () => {
  return (
    <Link to="/add-item" className="relative -top-5">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus className="w-7 h-7" />
      </motion.div>
    </Link>
  );
};

export default BottomNav;
