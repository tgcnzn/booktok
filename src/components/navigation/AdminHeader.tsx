import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';

interface AdminHeaderProps {
  toggleSidebar?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const { profile } = useAuth();

  return (
    <header className="bg-white shadow-sm h-16 flex items-center z-30">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none focus:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4">
            <Logo />
          </div>
        </div>

        <div className="flex items-center ml-auto">
          <div className="relative">
            <button className="flex text-gray-500 focus:outline-none">
              <Bell size={20} />
            </button>
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-error-500 rounded-full"></span>
          </div>
          
          <div className="ml-4 relative flex items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={18} className="text-gray-500" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {profile?.full_name || profile?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;