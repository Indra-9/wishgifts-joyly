
import { Award, Gift, Users, Calendar, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface BadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned?: boolean;
  earnedAt?: string;
}

const getBadgeIcon = (iconName: string) => {
  const iconMap: Record<string, LucideIcon> = {
    'gift': Gift,
    'list': Award,
    'users': Users,
    'award': Award,
    'calendar': Calendar,
  };

  const IconComponent = iconMap[iconName] || Award;
  return <IconComponent className="h-5 w-5" />;
};

const getBadgeColor = (name: string) => {
  const colorMap: Record<string, string> = {
    'First Gift': 'bg-green-100 text-green-800 border-green-300',
    'Wish Creator': 'bg-purple-100 text-purple-800 border-purple-300',
    'Social Butterfly': 'bg-blue-100 text-blue-800 border-blue-300',
    'Gift Master': 'bg-amber-100 text-amber-800 border-amber-300',
    'Occasion Collector': 'bg-pink-100 text-pink-800 border-pink-300',
  };

  return colorMap[name] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const UserBadge = ({ 
  name, 
  description, 
  icon, 
  points, 
  earned = false, 
  earnedAt 
}: BadgeProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-lg border",
        earned ? 'border-primary/30 bg-primary/5' : 'border-gray-200 bg-gray-50 opacity-70'
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-full flex items-center justify-center mb-3",
        earned ? 'bg-primary/20' : 'bg-gray-200'
      )}>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          earned ? 'text-primary' : 'text-gray-400'
        )}>
          {getBadgeIcon(icon)}
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-center mb-1">{name}</h3>
      <p className="text-xs text-gray-500 text-center mb-2">{description}</p>
      
      <Badge variant="outline" className={cn(
        "text-xs px-2 py-1",
        getBadgeColor(name)
      )}>
        {points} points
      </Badge>
      
      {earned && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Award className="h-4 w-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserBadge;
