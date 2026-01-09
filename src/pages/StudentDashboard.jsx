import React, { useEffect, useState } from 'react';
import { getAllTeachers, searchTeachers } from '../services/teacherService';
import { bookAppointment, getAppointmentsForStudent } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { getMessages } from '../services/messageService';
import { 
  Bell, 
  Search, 
  User, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Edit,
  ChevronRight,
  Menu,
  X,
  Filter,
  Plus
} from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' or 'appointments'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [purpose, setPurpose] = useState('');
//changing
useEffect(() => {
  if (currentUser) {
    fetchData();
  }
}, [currentUser, activeTab]);
//to this 
  // const fetchData = async () => {
  //   const teachersData = await getAllTeachers();
  //   const apptsData = await getAppointmentsForStudent(currentUser.uid);
  //   const msgsData = await getMessages(currentUser.uid); // Assuming student messages fetching logic exists
    
  //   setTeachers(teachersData);
  //   setAppointments(apptsData);
  //   setMessages(msgsData);
  // };
  //changing 
const fetchData = async () => {
  if (!currentUser) return;

  const teachersData = await getAllTeachers();
  setTeachers(teachersData);

  if (activeTab === 'appointments') {
    const apptsData = await getAppointmentsForStudent(currentUser.uid);
    setAppointments(apptsData);
  }

  const msgsData = await getMessages(currentUser.uid);
  setMessages(msgsData);
};

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await searchTeachers(searchTerm);
    setTeachers(results);
  };
// tohis 
  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment(currentUser.uid, selectedTeacher.id, bookingDate, bookingTime, purpose);
      alert('Appointment booked successfully!');
      setSelectedTeacher(null);
      setBookingDate('');
      setBookingTime('');
      setPurpose('');
      fetchData(); // Refresh appointments
      setActiveTab('appointments');
    } catch (error) {
      alert('Failed to book appointment');
    }
  };

  const handleLogout = async () => {
    await logoutUser(currentUser.uid);
    navigate('/login');
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
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EduInstitute</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <button 
                  onClick={() => setActiveTab('teachers')}
                  className={`${activeTab === 'teachers' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Find Teachers
                </button>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className={`${activeTab === 'appointments' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  My Schedule
                </button>
               
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search teachers..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>
              </div>
              {/* <button className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
                <span className="sr-only">View notifications</span>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button> */}
              
              {/* Profile Dropdown Trigger */}
              <div className="ml-4 relative flex items-center cursor-pointer group">
                <Link to="/profile" className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                    {getInitials(userData?.name)}
                  </div>
                </Link>
                <div className="hidden md:block ml-2 text-sm">
                   <p className="font-medium text-gray-700">{userData?.name || 'Student'}</p>
                   <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-indigo-600">Log out</button>
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
                    <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Student Dashboard</a>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {userData?.name?.split(' ')[0] || 'Student'}!
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
             onClick={() => {
    setActiveTab('teachers');
    if (teachers.length > 0) {
      setSelectedTeacher(teachers[0]); // open modal
    }
  }
              }

              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Book Appointment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Content (Teachers or Appointments) */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'teachers' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                 <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Find a Teacher
                  </h3>
                  <div className="flex space-x-2">
                    <span className="inline-flex rounded-md shadow-sm">
                      <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Filter className="-ml-0.5 mr-2 h-4 w-4 text-gray-400" />
                        Filter
                      </button>
                    </span>
                  </div>
                </div>
                <ul className="divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <li key={teacher.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                             <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {getInitials(teacher.name)}
                              </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-bold text-gray-900">{teacher.name}</h4>
                              <p className="text-sm text-gray-500">{teacher.department} • {teacher.subject}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedTeacher(teacher)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                  {teachers.length === 0 && (
                     <li className="px-4 py-8 text-center text-gray-500">No teachers found matching your search.</li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    My Appointments
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {appointments.length === 0 ? (
                    <li className="px-4 py-8 text-center text-gray-500">No upcoming appointments.</li>
                  ) : (
                    appointments.map((appt) => (
                      <li key={appt.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-indigo-600 truncate">
                                Teacher ID: {appt.teacherId}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">{appt.date} at {appt.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appt.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                appt.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appt.status}
                              </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

          </div>

          {/* Right Column: Messages & Info */}
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
                 {messages.slice(0, 3).map((msg) => (
                  <li key={msg.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0">
                       <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                         {getInitials(msg.fromId)}
                       </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {msg.fromId === currentUser.uid ? 'Me' : 'Teacher'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {msg.message}
                      </p>
                    </div>
                  </li>
                ))}
                {messages.length === 0 && (
                  <li className="text-sm text-gray-500 text-center py-4">No messages yet.</li>
                )}
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Student Tips</h3>
              <ul className="list-disc list-inside text-sm text-purple-100 space-y-2">
                <li>Check teacher availability before booking.</li>
                <li>Arrive 5 minutes early for appointments.</li>
                <li>Update your profile with your latest contact info.</li>
              </ul>
              <button onClick={() => navigate('/profile')} className="mt-4 w-full bg-white text-purple-600 font-medium py-2 px-4 rounded shadow-sm hover:bg-gray-50 transition duration-150">
                Update Profile
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedTeacher(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <Calendar className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Book Appointment with {selectedTeacher.name}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please select a date and time for your appointment.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleBook} className="mt-5 sm:mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                    <textarea
                      required
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Briefly describe what you want to discuss..."
                    />
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setSelectedTeacher(null)}
                    >
                      Cancel
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

export default StudentDashboard;
