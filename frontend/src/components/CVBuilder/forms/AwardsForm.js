import React, { useState } from 'react';

const AwardsForm = ({ data, onUpdate, isPremium }) => {
  const [awards, setAwards] = useState(
    data.awards?.length > 0 ? data.awards : []
  );

  const addAward = () => {
    const newAward = {
      id: Date.now(),
      title: '',
      description: '',
      date: '',
      issuer: ''
    };

    const updatedAwards = [...awards, newAward];
    setAwards(updatedAwards);
    onUpdate('awards', updatedAwards);
  };

  const updateAward = (id, field, value) => {
    const updatedAwards = awards.map(award =>
      award.id === id ? { ...award, [field]: value } : award
    );
    setAwards(updatedAwards);
    onUpdate('awards', updatedAwards);
  };

  const removeAward = (id) => {
    const updatedAwards = awards.filter(award => award.id !== id);
    setAwards(updatedAwards);
    onUpdate('awards', updatedAwards);
  };

  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 6);
    }
    return numbers;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Awards & Achievements</h3>
          <p className="text-sm text-gray-600">Add your professional awards and achievements (optional)</p>
        </div>
        <button
          onClick={addAward}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Award</span>
        </button>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-4">🥇</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No awards added yet</h4>
          <p className="text-gray-600 mb-4">Awards and achievements showcase your excellence and recognition</p>
          <button
            onClick={addAward}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Award
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {awards.map((award) => (
            <div key={award.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">Award</h4>
                <button
                  onClick={() => removeAward(award.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Award Title
                  </label>
                  <input
                    type="text"
                    value={award.title}
                    onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Employee of the Year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuer/Organization
                  </label>
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company Name / Organization"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Received
                </label>
                <input
                  type="text"
                  value={award.date}
                  onChange={(e) => updateAward(award.id, 'date', formatDateInput(e.target.value))}
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/YYYY"
                  maxLength="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={award.description}
                  onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Brief description of the achievement..."
                  maxLength="200"
                />
                <p className="mt-1 text-sm text-gray-500">{award.description.length}/200</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Awards & Achievements</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include professional awards, academic honors, and significant achievements</li>
          <li>• Mention the context and significance of each award</li>
          <li>• Include both internal company awards and external recognition</li>
          <li>• Quantify the achievement if possible (e.g., "top 5% of performers")</li>
          <li>• List awards in reverse chronological order</li>
        </ul>
      </div>
    </div>
  );
};

export default AwardsForm;
