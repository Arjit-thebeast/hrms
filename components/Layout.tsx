
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: '📊' },
    { id: 'employees' as View, label: 'Employees', icon: '👥' },
    { id: 'attendance' as View, label: 'Attendance', icon: '📅' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-indigo-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">H</div>
          <h1 className="text-xl font-bold tracking-tight">HRMS Lite</h1>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-indigo-800">
          <div className="bg-indigo-800/50 rounded-lg p-4 text-xs text-indigo-300">
            <p className="font-semibold mb-1">Admin Portal</p>
            <p>Version 1.0.4-lite</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">{currentView}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">System Admin</p>
              <p className="text-xs text-slate-500">Global HR Control</p>
            </div>
            <img 
              src="https://picsum.photos/seed/admin/40/40" 
              alt="Admin" 
              className="w-10 h-10 rounded-full border border-slate-200"
            />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
