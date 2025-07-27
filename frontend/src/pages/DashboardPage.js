import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { cvService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  
  const { data: cvs, isLoading, error } = useQuery('cvs', cvService.getCVs);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CVs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your CVs and create new ones
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total CVs</p>
                <p className="text-2xl font-semibold text-gray-900">{cvs?.data?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Account Type</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user?.is_premium ? 'Premium' : 'Free'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {user?.is_premium ? 'Unlimited' : '3/month'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CVs Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your CVs</h2>
            <Link
              to="/builder"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New CV
            </Link>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading CVs. Please try again.</p>
            </div>
          ) : cvs?.data?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs yet</h3>
              <p className="text-gray-600 mb-4">Create your first CV to get started</p>
              <Link
                to="/builder"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First CV
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs?.data?.map((cv) => (
                <div key={cv.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{cv.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Last updated: {new Date(cv.updated_at || cv.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Link
                        to={`/builder/${cv.id}`}
                        className="flex-1 bg-primary-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-primary-700 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/preview/${cv.id}`}
                        className="flex-1 bg-gray-200 text-gray-800 text-center py-2 px-3 rounded text-sm hover:bg-gray-300 transition-colors"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Banner */}
        {!user?.is_premium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                <p className="text-yellow-100">
                  Get unlimited CV downloads, premium templates, and priority support
                </p>
              </div>
              <Link
                to="/pricing"
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
