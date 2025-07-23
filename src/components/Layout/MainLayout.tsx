import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm min-h-full p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;