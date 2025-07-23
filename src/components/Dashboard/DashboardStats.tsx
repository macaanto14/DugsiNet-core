import React from 'react';
import { Users, UserCheck, BookOpen, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {change && (
          <div className="flex items-center space-x-1">
            <TrendingUp className={`w-4 h-4 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
            <p className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
            <span className="text-sm text-gray-500">from last month</span>
          </div>
        )}
      </div>
      <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,248',
      icon: <Users className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      change: '+12',
      trend: 'up' as const,
    },
    {
      title: 'Active Staff',
      value: '86',
      icon: <UserCheck className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: '+3',
      trend: 'up' as const,
    },
    {
      title: 'Total Classes',
      value: '42',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      change: '+2',
      trend: 'up' as const,
    },
    {
      title: 'Monthly Revenue',
      value: '$45,320',
      icon: <DollarSign className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      change: '+8%',
      trend: 'up' as const,
    },
    {
      title: 'Attendance Rate',
      value: '94.5%',
      icon: <Calendar className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      change: '+2.1%',
      trend: 'up' as const,
    },
    {
      title: 'Pending Fees',
      value: '$12,450',
      icon: <DollarSign className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      change: '-5%',
      trend: 'down' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;