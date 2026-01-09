import React, { useEffect, useState } from 'react';
import { getAllUsers, approveUser, deleteUser } from '../services/authService';
import { getLogs } from '../services/logService';
import { getAllAppointments } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { 
  Users, 
  FileText, 
  Calendar, 
  LogOut, 
  Check, 
  Trash2, 
  Search, 
  Bell, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'users') {
      const data = await getAllUsers();
      setUsers(data);
    } else if (activeTab === 'logs') {
      const data = await getLogs();
      setLogs(data);
    } else if (activeTab === 'appointments') {
      const data = await getAllAppointments();
      setAppointments(data);
    }
  };

  const handleApprove = async (userId) => {
    await approveUser(userId, currentUser.uid);
    fetchData();
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId, currentUser.uid);
      fetchData();
    }
  };

  const handleLogout = async () => {
    await logoutUser(currentUser.uid);
    navigate('/login');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EduInstitute</span>
                <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  Admin
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`${
                    activeTab === 'users'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`${
                    activeTab === 'appointments'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`${
                    activeTab === 'logs'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  System Logs
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                 <span className="text-sm text-gray-500 mr-4 hidden md:inline-block">Admin Dashboard</span>
              </div>
              <div className="ml-4 relative flex items-center cursor-pointer group">
                  <Link to="/profile" className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                      {getInitials(currentUser?.email)}
                    </div>
                  </Link>
                  <div className="hidden md:block ml-2 text-sm">
                     <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-indigo-600 flex items-center">
                       <LogOut className="h-3 w-3 mr-1" /> Logout
                     </button>
                  </div>
              </div>
              <div className="-mr-2 flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <button
                onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
                className={`${
                  activeTab === 'users' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Users
              </button>
              <button
                onClick={() => { setActiveTab('appointments'); setIsMobileMenuOpen(false); }}
                className={`${
                  activeTab === 'appointments' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Appointments
              </button>
              <button
                onClick={() => { setActiveTab('logs'); setIsMobileMenuOpen(false); }}
                className={`${
                  activeTab === 'logs' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Logs
              </button>
               <button
                onClick={handleLogout}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between mb-8 px-4 sm:px-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'appointments' && 'All Appointments'}
              {activeTab === 'logs' && 'System Audit Logs'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
               {activeTab === 'users' && 'Manage student approvals and teacher accounts.'}
               {activeTab === 'appointments' && 'Overview of all scheduled sessions across the platform.'}
               {activeTab === 'logs' && 'Track security events and user activities.'}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {getInitials(user.name || user.email)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'teacher' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'admin' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        } capitalize`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.approved ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!user.approved && (
                          <button 
                            onClick={() => handleApprove(user.id)} 
                            className="text-indigo-600 hover:text-indigo-900 mr-4 flex items-center inline-flex"
                            title="Approve User"
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="text-red-600 hover:text-red-900 flex items-center inline-flex"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="p-6 text-center text-gray-500">No users found.</p>}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="overflow-hidden">
               <ul className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <li key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                         <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-gray-500" />
                         </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{log.action}</h3>
                          <p className="text-xs text-gray-500">{log.timestamp?.toDate().toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-500">User ID: <span className="font-mono text-xs">{log.userId}</span></p>
                        {log.metadata && (
                           <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 font-mono overflow-auto">
                             {JSON.stringify(log.metadata, null, 2)}
                           </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {logs.length === 0 && <p className="p-6 text-center text-gray-500">No logs found.</p>}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {appt.date} <span className="text-gray-500 ml-1">{appt.time}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.teacherId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.studentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appt.status === 'approved' ? 'bg-green-100 text-green-800' :
                          appt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        } capitalize`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <p className="p-6 text-center text-gray-500">No appointments found.</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
