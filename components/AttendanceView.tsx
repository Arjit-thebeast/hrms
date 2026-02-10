
import React, { useState, useEffect } from 'react';
import { hrmsService } from '../services/hrmsService';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';

const AttendanceView: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markingStatus, setMarkingStatus] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    const [empRes, attRes] = await Promise.all([
      hrmsService.fetchEmployees(),
      hrmsService.fetchAttendance(selectedDate)
    ]);
    if (empRes.success) setEmployees(empRes.data || []);
    if (attRes.success) setAttendance(attRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleMark = async (employeeId: string, status: AttendanceStatus) => {
    setMarkingStatus(prev => ({ ...prev, [employeeId]: true }));
    const response = await hrmsService.markAttendance({
      employeeId,
      date: selectedDate,
      status
    });
    if (response.success) {
      // Refresh local list
      const attRes = await hrmsService.fetchAttendance(selectedDate);
      if (attRes.success) setAttendance(attRes.data || []);
    }
    setMarkingStatus(prev => ({ ...prev, [employeeId]: false }));
  };

  const getStatus = (employeeId: string) => {
    return attendance.find(a => a.employeeId === employeeId)?.status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Attendance Log</h3>
          <p className="text-slate-500">Monitor and mark daily attendance</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <span className="text-sm font-medium text-slate-600 px-3">Filter by Date:</span>
          <input
            type="date"
            className="px-4 py-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium cursor-pointer"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-400">Syncing records...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-16 text-center">
            <h4 className="text-lg font-bold text-slate-800">No Employees to Mark</h4>
            <p className="text-slate-500">Please add employees first in the Directory view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const currentStatus = getStatus(emp.id);
                  const isMarking = markingStatus[emp.id];
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <img 
                            src={`https://picsum.photos/seed/${emp.id}/40/40`} 
                            alt="" 
                            className="w-10 h-10 rounded-full border border-slate-200 grayscale"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{emp.fullName}</p>
                            <p className="text-xs text-slate-500">{emp.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {currentStatus ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            currentStatus === 'Present' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {currentStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not Marked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isMarking}
                            onClick={() => handleMark(emp.id, 'Present')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                            } disabled:opacity-50`}
                          >
                            Present
                          </button>
                          <button
                            disabled={isMarking}
                            onClick={() => handleMark(emp.id, 'Absent')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                            } disabled:opacity-50`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl text-xl shrink-0">💡</div>
        <div>
          <h4 className="font-bold text-indigo-900">Attendance Tips</h4>
          <p className="text-sm text-indigo-700 mt-1">
            Data is auto-saved locally. For best results, ensure all employees are marked daily before COB (Close of Business). 
            You can change attendance status at any time by re-clicking the buttons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
