import React from 'react';
import { Users, UserCheck, BookOpen, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-2">
            +{change} from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
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
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-600',
      change: '12',
    },
    {
      title: 'Active Staff',
      value: '86',
      icon: <UserCheck className="w-6 h-6 text-white" />,
      color: 'bg-green-600',
      change: '3',
    },
    {
      title: 'Classes',
      value: '42',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'bg-indigo-600',
    },
    {
      title: 'Monthly Revenue',
      value: '$45,320',
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'bg-orange-600',
      change: '8%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;