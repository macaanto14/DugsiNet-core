import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  ClipboardList,
  BookOpen,
  GraduationCap,
  Layers,
  DollarSign,
  Building,
  Bus,
  Package,
  CreditCard,
  FileText,
  Activity,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, signOut, hasRole } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'staff', 'student', 'parent'] },
    { icon: Users, label: 'Students', path: '/students', roles: ['admin', 'staff'] },
    { icon: UserCheck, label: 'Staff', path: '/staff', roles: ['admin'] },
    { icon: Calendar, label: 'Attendance', path: '/attendance', roles: ['admin', 'staff'] },
    { icon: Layers, label: 'Curriculum', path: '/curriculum', roles: ['admin', 'staff'] },
    { icon: ClipboardList, label: 'Timetable', path: '/timetable', roles: ['admin', 'staff', 'student'] },
    { icon: BookOpen, label: 'Exams', path: '/exams', roles: ['admin', 'staff', 'student'] },
    { icon: GraduationCap, label: 'Library', path: '/library', roles: ['admin', 'staff', 'student'] },
    { icon: DollarSign, label: 'Fees', path: '/fees', roles: ['admin', 'staff', 'parent'] },
    { icon: Building, label: 'Hostel', path: '/hostel', roles: ['admin', 'staff'] },
    { icon: Bus, label: 'Transport', path: '/transport', roles: ['admin', 'staff'] },
    { icon: Package, label: 'Inventory', path: '/inventory', roles: ['admin', 'staff'] },
    { icon: CreditCard, label: 'Payroll', path: '/payroll', roles: ['admin'] },
    { icon: FileText, label: 'ID & Certificates', path: '/documents', roles: ['admin', 'staff'] },
    { icon: Activity, label: 'Activities', path: '/activities', roles: ['admin', 'staff', 'student'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => hasRole(item.roles));

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">DugsiNet</h1>
        <p className="text-sm text-gray-500">School Management System</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.full_name}</p>
            <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;