import React, { useState } from 'react';
import { Calendar, Users, UserCheck, Clock, Download } from 'lucide-react';
import { format } from 'date-fns';

const AttendanceView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewType, setViewType] = useState<'student' | 'staff'>('student');

  // Mock data - replace with actual data from Supabase
  const studentAttendance = [
    { id: '1', name: 'Ahmed Ali', grNumber: 'GR001', class: 'Grade 7-A', status: 'present' },
    { id: '2', name: 'Fatima Hassan', grNumber: 'GR002', class: 'Grade 7-A', status: 'absent' },
    { id: '3', name: 'Omar Said', grNumber: 'GR003', class: 'Grade 7-A', status: 'late' },
    { id: '4', name: 'Maryam Ali', grNumber: 'GR004', class: 'Grade 7-A', status: 'present' },
  ];

  const staffAttendance = [
    { id: '1', name: 'Dr. Ahmed Mohamed', empId: 'EMP001', department: 'Mathematics', status: 'present' },
    { id: '2', name: 'Ms. Sarah Johnson', empId: 'EMP002', department: 'English', status: 'present' },
    { id: '3', name: 'Mr. Hassan Ali', empId: 'EMP003', department: 'Science', status: 'absent' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half_day': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const attendanceData = viewType === 'student' ? studentAttendance : staffAttendance;
  const presentCount = attendanceData.filter(item => item.status === 'present').length;
  const absentCount = attendanceData.filter(item => item.status === 'absent').length;
  const lateCount = attendanceData.filter(item => item.status === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-2">Track daily attendance for students and staff</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewType('student')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewType === 'student'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setViewType('staff')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewType === 'staff'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{attendanceData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {viewType === 'student' ? 'Student' : 'Staff'} Attendance - {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  {viewType === 'student' ? 'GR Number' : 'Employee ID'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  {viewType === 'student' ? 'Class' : 'Department'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {item.name.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {viewType === 'student' ? (item as any).grNumber : (item as any).empId}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {viewType === 'student' ? (item as any).class : (item as any).department}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => {
                        // Handle status change
                        console.log('Status changed:', e.target.value);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(item.status)}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half_day">Half Day</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;