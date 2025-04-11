
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  Award, 
  Settings, 
  LogOut, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Gift, label: 'Wishlists', path: '/admin/wishlists' },
    { icon: Award, label: 'Badges & Rewards', path: '/admin/rewards' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-primary">Joyly Admin</h2>
          <p className="text-sm text-gray-500">Manage your platform</p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <nav className="p-2">
            {navItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start mb-1 ${isActive ? 'bg-primary/10' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Button>
              );
            })}
            
            <Separator className="my-4" />
            
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </ScrollArea>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </header>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
