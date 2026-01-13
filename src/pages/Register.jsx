import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, BookOpen, Check } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // default
    department: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await registerUser(formData.email, formData.password, formData);
      if (formData.role === 'student') {
        alert("Registration successful");
        navigate('/login');
      } else {
                        alert("Registration successful! Please wait for admin approval.");

        navigate('/login');
      }
    } catch (err) {
      console.error("Registration Error:", err);
      let errorMessage = err.message || 'Failed to register';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Database permission denied. Please check your Firestore rules.';
      } else if (errorMessage.includes("quota")) {
        errorMessage = 'Firebase quota exceeded.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Decoration */}
      <div className="hidden lg:block relative w-0 flex-1 order-last lg:order-first">
         <div className="absolute inset-0 bg-indigo-900 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-bl from-blue-800 to-indigo-600 opacity-90"></div>
             <div className="relative z-10 px-10">
                 <h2 className="text-4xl font-bold text-white mb-6">Join Our Community</h2>
                 <ul className="space-y-6">
                    <li className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                <User className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">Create your profile</h3>
                            <p className="mt-1 text-indigo-200">Showcase your details and connect with others.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                <BookOpen className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">Book appointments</h3>
                            <p className="mt-1 text-indigo-200">Schedule time with teachers effortlessly.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500 text-white">
                                <Check className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">Stay organized</h3>
                            <p className="mt-1 text-indigo-200">Keep track of all your educational activities.</p>
                        </div>
                    </li>
                 </ul>
             </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
             <Link to="/" className="flex items-center lg:hidden mb-6">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduInstitute</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`flex items-center justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        formData.role === 'student'
                          ? 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData({ ...formData, role: 'student' })}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Student
                    </button>
                    <button
                      type="button"
                      className={`flex items-center justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        formData.role === 'teacher'
                          ? 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData({ ...formData, role: 'teacher' })}
                    >
                      <Briefcase className="mr-2 h-5 w-5" />
                      Teacher
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {formData.role === 'teacher' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="department"
                          name="department"
                          type="text"
                          required
                          value={formData.department}
                          onChange={handleChange}
                          className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border"
                          placeholder="Science"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border"
                          placeholder="Physics"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-2 border"
                      placeholder="••••••••"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
