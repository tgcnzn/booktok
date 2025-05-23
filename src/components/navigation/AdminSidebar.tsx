import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Settings, 
  BarChart, 
  FileText,
  Eye
} from 'lucide-react';
import Logo from '../ui/Logo';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Participants',
      path: '/admin/participants',
      icon: <Users size={20} />,
    },
    {
      name: 'Judges',
      path: '/admin/judges',
      icon: <Award size={20} />,
    },
    {
      name: 'Submissions',
      path: '/admin/submissions',
      icon: <FileText size={20} />,
    },
    {
      name: 'Voting',
      path: '/admin/voting',
      icon: <Eye size={20} />,
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart size={20} />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="bg-white w-64 h-screen shadow-md hidden md:block overflow-y-auto">
      <div className="p-5">
        <Link to="/admin" className="flex items-center">
          <Logo size="lg" />
        </Link>
      </div>
      <nav className="mt-5">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-5 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-700 bg-primary-50 border-r-4 border-primary-700'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-5 border-t border-gray-200">
        <Link to="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <Eye size={18} className="mr-2" />
          View Site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;