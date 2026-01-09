import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduInstitute</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900 font-medium">Features</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900 font-medium">About</a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900 font-medium">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">Sign in</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-150">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Connect with expert</span>{' '}
                  <span className="block text-indigo-600 xl:inline">teachers seamlessly</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Book appointments, manage schedules, and enhance your learning journey with our intuitive student-teacher booking system.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      Start Learning
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                      Log In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-50 flex items-center justify-center">
          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 opacity-80">
                <div className="bg-white p-4 rounded-lg shadow-lg transform translate-y-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Easy Scheduling</h3>
                    <p className="text-sm text-gray-500 mt-1">Book slots in seconds</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Expert Teachers</h3>
                    <p className="text-sm text-gray-500 mt-1">Qualified professionals</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg transform translate-y-4">
                     <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                        <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Secure Platform</h3>
                    <p className="text-sm text-gray-500 mt-1">Your data is safe</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Track Progress</h3>
                    <p className="text-sm text-gray-500 mt-1">Monitor your growth</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage appointments
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to streamline communication between students and teachers.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Calendar className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Scheduling</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Teachers can set availability, and students can book slots instantly. No more back-and-forth emails.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Users className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Role-Based Access</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Secure dashboards for Students, Teachers, and Admins with tailored features for each role.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure & Private</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Built with Firebase security rules to ensure your data is always protected and private.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <ArrowRight className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Updates</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get instant notifications for appointment status changes and new messages.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 EduInstitute. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
