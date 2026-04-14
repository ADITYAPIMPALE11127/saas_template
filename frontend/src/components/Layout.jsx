import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/billing', name: 'Billing', icon: '💰' },
    { path: '/history', name: 'History', icon: '📜' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'SaaS Template' : 'ST'}
          </h1>
        </div>
        
        {/* User Info */}
        {sidebarOpen && user && (
          <div className="p-4 border-b border-gray-800">
            <p className="text-sm font-semibold">{user.name || user.email}</p>
            <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ☰
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {sidebarOpen && user?.email}
            </span>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;