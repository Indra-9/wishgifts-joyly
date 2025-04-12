
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthRequired = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Gift className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">Please log in</h3>
      <p className="text-gray-500 mb-6">Sign in to view and manage your wishlists</p>
      <Button onClick={() => navigate('/auth')}>Sign In</Button>
    </div>
  );
};

export default AuthRequired;
