
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { hrmsService } from '../services/hrmsService';
import { DashboardStats } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await hrmsService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const deptData = stats ? Object.entries(stats.departmentCounts).map(([name, value]) => ({ name, value })) : [];
  const attendanceData = stats ? [
    { name: 'Present', value: stats.presentToday },
    { name: 'Absent', value: stats.absentToday },
    { name: 'Total', value: stats.totalEmployees - stats.presentToday - stats.absentToday }
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">Total Employees</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-slate-900">{stats?.totalEmployees || 0}</h3>
            <span className="text-emerald-600 text-xs font-bold px-2 py-1 bg-emerald-50 rounded-full">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Present Today</p>
          <div className="mt-2">
            <h3 className="text-3xl font-bold text-emerald-600">{stats?.presentToday || 0}</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
               <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${stats?.totalEmployees ? (stats.presentToday / stats.totalEmployees) * 100 : 0}%` }}
               />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Absent Today</p>
          <div className="mt-2">
            <h3 className="text-3xl font-bold text-rose-600">{stats?.absentToday || 0}</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
               <div 
                className="bg-rose-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${stats?.totalEmployees ? (stats.absentToday / stats.totalEmployees) * 100 : 0}%` }}
               />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Pending Records</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {(stats?.totalEmployees || 0) - (stats?.presentToday || 0) - (stats?.absentToday || 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-2 italic">Requires admin attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Employees per Department</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#64748b" />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Today's Attendance Status</h4>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="block text-2xl font-bold text-slate-800">{stats?.totalEmployees || 0}</span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {attendanceData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-slate-600 font-medium">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
