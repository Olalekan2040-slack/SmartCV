import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-800/5 to-transparent">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>
        
        {/* Floating Documents Animation */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg opacity-30 transform rotate-12"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-12 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg opacity-30 transform -rotate-6"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float-slow">
          <div className="w-14 h-18 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg shadow-lg opacity-30 transform rotate-45"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <div className="w-10 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-lg opacity-30 transform -rotate-12"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading with Gradient Text */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Create 
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Professional CVs
              </span>
              with AI Magic ✨
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your career with intelligent CV building. Get AI-powered suggestions, 
              stunning templates, and land your dream job faster than ever.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <span className="flex items-center">
                    Go to Dashboard
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    <span className="flex items-center">
                      Start Building Free
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    to="/pricing"
                    className="group border-2 border-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:border-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                  >
                    View Pricing
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-counter">10K+</div>
                <div className="text-gray-400 text-sm">CVs Created</div>
              </div>
              <div className="text-center border-x border-gray-700">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-counter">95%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent animate-counter">5⭐</div>
                <div className="text-gray-400 text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> SmartCV?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of CV creation with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">AI-Powered Assistance</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Get intelligent suggestions for improving your CV content, formatting, and structure with our advanced AI
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">8 Premium Templates</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Choose from professionally designed templates that work for any industry and career level
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Instant PDF Export</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Download professional PDF versions of your CV ready for applications in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 py-20 lg:py-32 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It 
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Create your professional CV in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  1
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Fill Your Information</h3>
              <p className="text-gray-300 leading-relaxed">
                Enter your personal details, work experience, education, and skills with our guided forms
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  2
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Get AI Suggestions</h3>
              <p className="text-gray-300 leading-relaxed">
                Our AI analyzes your content and provides suggestions to improve your CV's impact and effectiveness
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mx-auto mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  3
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-red-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Download & Apply</h3>
              <p className="text-gray-300 leading-relaxed">
                Choose a template, customize the design, and download your professional PDF CV instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Transform 
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Your Career?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of professionals who have successfully landed their dream jobs with SmartCV
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="group bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-black px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl inline-block"
            >
              <span className="flex items-center">
                Go to Dashboard
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="group bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-black px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl inline-block"
            >
              <span className="flex items-center">
                Start Building Now - It's Free!
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-3deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        @keyframes counter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-counter { animation: counter 1s ease-out; }
        
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
