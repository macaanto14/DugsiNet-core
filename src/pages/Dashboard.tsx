import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/Dashboard/DashboardStats';
import { Calendar, Clock, Bell, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();

  const recentActivities = [
    {
      id: 1,
      title: 'New student admission',
      description: 'Ahmed Ali has been admitted to Grade 7-A',
      time: '2 hours ago',
      type: 'admission',
    },
    {
      id: 2,
      title: 'Staff leave approved',
      description: 'Fatima Hassan\'s leave request has been approved',
      time: '4 hours ago',
      type: 'leave',
    },
    {
      id: 3,
      title: 'Fee payment received',
      description: 'Monthly fee payment received from Omar Said',
      time: '6 hours ago',
      type: 'payment',
    },
    {
      id: 4,
      title: 'Exam schedule updated',
      description: 'Mid-term exam schedule has been updated',
      time: '1 day ago',
      type: 'exam',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2025-01-15',
      time: '09:00 AM',
    },
    {
      id: 2,
      title: 'Mid-term Exams',
      date: '2025-01-20',
      time: '08:00 AM',
    },
    {
      id: 3,
      title: 'Sports Day',
      date: '2025-01-25',
      time: '10:00 AM',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening at your school today.
        </p>
      </div>

      {hasRole(['admin', 'staff']) && (
        <DashboardStats />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{event.date}</span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasRole(['admin']) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-center">
              <Users className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="font-medium text-gray-900">Add New Student</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors text-center">
              <UserCheck className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="font-medium text-gray-900">Add New Staff</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors text-center">
              <BookOpen className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="font-medium text-gray-900">Create New Class</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;