import React, { useEffect, useState } from 'react';
import { getAppointmentsForTeacher, updateAppointmentStatus } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser, getUserName } from '../services/authService';
import { getMessages, sendMessage, getAppointmentMessages } from '../services/messageService';
import { 
  Bell, 
  Search, 
  User, 
  Calendar, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Edit,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const TeacherDashboard = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [studentNames, setStudentNames] = useState({}); // Map studentId -> name
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [stats, setStats] = useState({
    todayAppointments: 0,
    unreadMessages: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Messaging State
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentMessages, setAppointmentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    const appts = await getAppointmentsForTeacher(currentUser.uid);
    const msgs = await getMessages(currentUser.uid);
    
    setAppointments(appts);
    setMessages(msgs);
    
    // Fetch student names for appointments
    const namesMap = {};
    const uniqueStudentIds = [...new Set(appts.map(appt => appt.studentId))];
    for (const studentId of uniqueStudentIds) {
      if (studentId) {
        try {
          const name = await getUserName(studentId);
          namesMap[studentId] = name;
        } catch (error) {
          console.error(`Error fetching student name for ${studentId}:`, error);
          namesMap[studentId] = 'Unknown Student';
        }
      }
    }
    setStudentNames(namesMap);
    
    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appts.filter(a => a.date === today).length;
    const pending = appts.filter(a => a.status === 'pending').length;
    const approved = appts.filter(a => a.status === 'approved').length;
    const rejected = appts.filter(a => a.status === 'rejected').length;
    
    setStats({
      todayAppointments: todayAppts,
      unreadMessages: msgs.length, // Assuming all fetched are unread/relevant for now
      pendingRequests: pending,
      approvedRequests: approved,
      rejectedRequests: rejected
    });
  };

  const handleStatusChange = async (id, status) => {
    await updateAppointmentStatus(id, status, currentUser.uid);
    fetchData();
  };

  const handleLogout = async () => {
    await logoutUser(currentUser.uid);
    navigate('/login');
  };

  const handleOpenMessages = async (appt) => {
    if (appt.status === 'approved') {
      setSelectedAppointment(appt);
      // Load messages for this appointment
      const msgs = await getAppointmentMessages(appt.id, currentUser.uid, appt.studentId);
      setAppointmentMessages(msgs);
      setNewMessage('');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAppointment) return;
    
    try {
      await sendMessage(currentUser.uid, selectedAppointment.studentId, newMessage.trim(), selectedAppointment.id);
      setNewMessage('');
      // Reload messages
      const msgs = await getAppointmentMessages(selectedAppointment.id, currentUser.uid, selectedAppointment.studentId);
      setAppointmentMessages(msgs);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EduInstitute</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                {/* <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Schedule
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Students
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Resources
                </a> */}
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="relative">
                  {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search students..."
                    type="search"
                  /> */}
                </div>
              </div>
              <button className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
                {/* <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span> */}
              </button>
              
              {/* Profile Dropdown Trigger */}
              <div className="ml-4 relative flex items-center cursor-pointer group">
                <Link to="/profile" className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                    {getInitials(userData?.name)}
                  </div>
                </Link>
                <div className=" md:block ml-2 text-sm">
                   <p className="font-medium text-gray-700">{userData?.name || 'Teacher'}</p>
                   <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-indigo-600">Log out</button>
                </div>
              </div>
              
              <div className="-mr-2 flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div className="flex items-center">
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">Home</a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="shrink-0 h-5 w-5 text-gray-400" />
                    <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Dashboard</a>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Teacher Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your student appointments and recent communications.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            {/* <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Calendar className="-ml-1 mr-2 h-5 w-5" />
              Set Office Hours
            </button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Card 1 */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">
                Today's Appointments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.todayAppointments}
              </dd>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600 font-medium">+2 from yesterday</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">
                Unread Messages
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.unreadMessages}
              </dd>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-500">Priority: 2</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">
                Pending Requests
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.pendingRequests}
              </dd>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-orange-600 font-medium">Needs attention</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`${
                    activeTab === 'pending'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Pending ({stats.pendingRequests})
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`${
                    activeTab === 'approved'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Approved ({stats.approvedRequests})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`${
                    activeTab === 'rejected'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Rejected ({stats.rejectedRequests})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {/* Pending Tab */}
                {activeTab === 'pending' && (
                  <>
                    {appointments.filter(a => a.status === 'pending').length === 0 ? (
                      <li className="px-4 py-8 text-center text-gray-500">No pending requests.</li>
                    ) : (
                      appointments.filter(a => a.status === 'pending').map((appt) => (
                        <li key={appt.id}>
                          <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                  {getInitials(studentNames[appt.studentId] || appt.studentId)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-indigo-600 truncate">
                                    {studentNames[appt.studentId] || 'Loading...'}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                                      {appt.purpose || 'General'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{appt.date}</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{appt.time}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-3">
                              <button
                                onClick={() => handleStatusChange(appt.id, 'rejected')}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleStatusChange(appt.id, 'approved')}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </>
                )}

                {/* Approved Tab */}
                {activeTab === 'approved' && (
                  <>
                    {appointments.filter(a => a.status === 'approved').length === 0 ? (
                      <li className="px-4 py-8 text-center text-gray-500">No approved requests.</li>
                    ) : (
                      appointments.filter(a => a.status === 'approved').map((appt) => (
                        <li key={appt.id}>
                          <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                  {getInitials(studentNames[appt.studentId] || appt.studentId)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-indigo-600 truncate">
                                    {studentNames[appt.studentId] || 'Loading...'}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 uppercase">
                                      Approved
                                    </span>
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {appt.purpose || 'General'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{appt.date}</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{appt.time}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => handleOpenMessages(appt)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message Student
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </>
                )}

                {/* Rejected Tab */}
                {activeTab === 'rejected' && (
                  <>
                    {appointments.filter(a => a.status === 'rejected').length === 0 ? (
                      <li className="px-4 py-8 text-center text-gray-500">No rejected requests.</li>
                    ) : (
                      appointments.filter(a => a.status === 'rejected').map((appt) => (
                        <li key={appt.id}>
                          <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                  {getInitials(studentNames[appt.studentId] || appt.studentId)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-indigo-600 truncate">
                                    {studentNames[appt.studentId] || 'Loading...'}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 uppercase">
                                      Rejected
                                    </span>
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {appt.purpose || 'General'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{appt.date}</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>{appt.time}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Messages & Help */}
          <div className="space-y-8">
            
            {/* Messages Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Messages</h3>
                <button className="text-gray-400 hover:text-gray-500">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <ul className="space-y-4">
                {messages.slice(0, 4).map((msg) => (
                  <li key={msg.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="shrink-0">
                       <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                         {getInitials(msg.fromId)}
                       </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {msg.fromId === currentUser.uid ? 'Me' : 'Student'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {msg.message}
                      </p>
                    </div>
                    <div className="shrink-0 text-xs text-gray-400">
                      {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </li>
                ))}
                {messages.length === 0 && (
                  <li className="text-sm text-gray-500 text-center py-4">No messages yet.</li>
                )}
              </ul>
              
              <div className="mt-4 text-center">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View All Messages
                </a>
              </div>
            </div>

            {/* Need Help Card */}
            {/* <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Check out our teacher resources and quick-start guide for the appointment system.
              </p>
              <button className="w-full bg-white text-indigo-600 font-medium py-2 px-4 rounded shadow-sm hover:bg-gray-50 transition duration-150">
                View Guide
              </button>
            </div> */}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Contact Support</a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2026 EduInstitute Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Messaging Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="message-modal-title" role="dialog" aria-modal="true" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedAppointment(null);
          }
        }}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity pointer-events-none"></div>
          
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 pointer-events-auto">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="message-modal-title">
                    Messages with {studentNames[selectedAppointment.studentId] || 'Student'}
                  </h3>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Messages Display */}
                <div className="mb-4 border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
                  {appointmentMessages.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No messages yet. Start a conversation!</p>
                  ) : (
                    <div className="space-y-3">
                      {appointmentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.fromId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.fromId === currentUser.uid
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-300'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            {msg.timestamp && (
                              <p className={`text-xs mt-1 ${
                                msg.fromId === currentUser.uid ? 'text-indigo-200' : 'text-gray-500'
                              }`}>
                                {msg.timestamp.toDate ? msg.timestamp.toDate().toLocaleString() : new Date(msg.timestamp.seconds * 1000).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <textarea
                      rows={3}
                      required
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
