import React from 'react';

const CVPreviewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CV Preview</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">CV Preview will be shown here.</p>
          <p className="text-sm text-gray-500 mt-2">
            This will display the formatted CV and PDF download options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVPreviewPage;
