import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Users, UserCheck, Calendar, ClipboardList, BookOpen, GraduationCap, Layers, DollarSign, Building, Bus, Package, CreditCard, FileText, Activity, Settings, LogOut, ChevronDown, ChevronRight, UserPlus, UserSearch, School, Clock, BarChart3, FileCheck, CalendarDays, TestTube, Trophy, Library, Receipt, Wallet, PieChart, Bed, Car, Archive, Car as IdCard, Award, TrendingUp } from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path?: string;
  roles: string[];
  children?: MenuItem[];
}

const Sidebar: React.FC = () => {
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (menuLabel: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuLabel)) {
      newExpanded.delete(menuLabel);
    } else {
      newExpanded.add(menuLabel);
    }
    setExpandedMenus(newExpanded);
  };

  const menuItems: MenuItem[] = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard', 
      roles: ['admin', 'staff', 'student', 'parent'] 
    },
    {
      icon: Users,
      label: 'Students',
      roles: ['admin', 'staff'],
      children: [
        { icon: Users, label: 'All Students', path: '/students', roles: ['admin', 'staff'] },
        { icon: UserPlus, label: 'Register Student', path: '/students/onboarding', roles: ['admin', 'staff'] },
        { icon: UserSearch, label: 'Student Profiles', path: '/students/profiles', roles: ['admin', 'staff'] },
        { icon: School, label: 'Admissions', path: '/students/admissions', roles: ['admin', 'staff'] },
      ]
    },
    {
      icon: UserCheck,
      label: 'Staff',
      roles: ['admin'],
      children: [
        { icon: UserCheck, label: 'All Staff', path: '/staff', roles: ['admin'] },
        { icon: UserPlus, label: 'Add Staff', path: '/staff/new', roles: ['admin'] },
        { icon: Calendar, label: 'Staff Schedule', path: '/staff/schedule', roles: ['admin'] },
        { icon: DollarSign, label: 'Payroll', path: '/payroll', roles: ['admin'] },
      ]
    },
    {
      icon: Calendar,
      label: 'Attendance',
      roles: ['admin', 'staff'],
      children: [
        { icon: ClipboardList, label: 'Mark Attendance', path: '/attendance', roles: ['admin', 'staff'] },
        { icon: BarChart3, label: 'Attendance Reports', path: '/attendance/reports', roles: ['admin', 'staff'] },
        { icon: FileCheck, label: 'Attendance Records', path: '/attendance/records', roles: ['admin', 'staff'] },
      ]
    },
    {
      icon: Layers,
      label: 'Curriculum',
      roles: ['admin', 'staff'],
      children: [
        { icon: BookOpen, label: 'All Courses', path: '/curriculum', roles: ['admin', 'staff'] },
        { icon: BookOpen, label: 'Add Course', path: '/curriculum/courses/new', roles: ['admin', 'staff'] },
        { icon: Layers, label: 'Subjects', path: '/curriculum/subjects', roles: ['admin', 'staff'] },
        { icon: FileText, label: 'Lessons', path: '/curriculum/lessons', roles: ['admin', 'staff'] },
      ]
    },
    {
      icon: GraduationCap,
      label: 'Academic',
      roles: ['admin', 'staff', 'student'],
      children: [
        { icon: CalendarDays, label: 'Timetable', path: '/timetable', roles: ['admin', 'staff', 'student'] },
        { icon: TestTube, label: 'Exams', path: '/exams', roles: ['admin', 'staff', 'student'] },
        { icon: Trophy, label: 'Results', path: '/results', roles: ['admin', 'staff', 'student'] },
        { icon: Library, label: 'Library', path: '/library', roles: ['admin', 'staff', 'student'] },
      ]
    },
    {
      icon: DollarSign,
      label: 'Finance',
      roles: ['admin', 'staff', 'parent'],
      children: [
        { icon: Receipt, label: 'Fee Management', path: '/fees', roles: ['admin', 'staff', 'parent'] },
        { icon: Wallet, label: 'Payments', path: '/payments', roles: ['admin', 'staff', 'parent'] },
        { icon: PieChart, label: 'Financial Reports', path: '/finance/reports', roles: ['admin'] },
      ]
    },
    {
      icon: Building,
      label: 'Facilities',
      roles: ['admin', 'staff'],
      children: [
        { icon: Bed, label: 'Hostel Management', path: '/hostel', roles: ['admin', 'staff'] },
        { icon: Car, label: 'Transport', path: '/transport', roles: ['admin', 'staff'] },
        { icon: Archive, label: 'Inventory', path: '/inventory', roles: ['admin', 'staff'] },
      ]
    },
    {
      icon: FileText,
      label: 'Documents',
      roles: ['admin', 'staff'],
      children: [
        { icon: IdCard, label: 'ID Cards', path: '/documents/id-cards', roles: ['admin', 'staff'] },
        { icon: Award, label: 'Certificates', path: '/documents/certificates', roles: ['admin', 'staff'] },
        { icon: TrendingUp, label: 'Reports', path: '/documents/reports', roles: ['admin', 'staff'] },
      ]
    },
    { 
      icon: Activity, 
      label: 'Activities', 
      path: '/activities', 
      roles: ['admin', 'staff', 'student'] 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings', 
      roles: ['admin'] 
    },
  ];

  const filteredMenuItems = menuItems.filter(item => hasRole(item.roles));

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.label);
    const filteredChildren = item.children?.filter(child => hasRole(child.roles)) || [];

    if (hasChildren && filteredChildren.length === 0) {
      return null;
    }

    return (
      <div key={item.label}>
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 ${
              depth === 0 
                ? 'text-gray-700 hover:bg-green-50 hover:text-green-700' 
                : 'text-gray-600 hover:bg-green-50 hover:text-green-600 ml-4'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${depth === 0 ? '' : 'w-4 h-4'}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        ) : (
          <NavLink
            to={item.path!}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                depth === 0 ? '' : 'ml-4'
              } ${
                isActive
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
              }`
            }
          >
            <item.icon className={`w-5 h-5 ${depth === 0 ? '' : 'w-4 h-4'}`} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        )}
        
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {filteredChildren.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-r border-gray-200 w-72 min-h-screen flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <School className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">DugsiNet</h1>
            <p className="text-green-100 text-sm">School Management</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-sm text-green-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;