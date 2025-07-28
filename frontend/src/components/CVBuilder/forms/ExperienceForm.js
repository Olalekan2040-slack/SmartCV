import React, { useState } from 'react';
import { aiService } from '../../../services/api';

const ExperienceForm = ({ data, onUpdate, isPremium }) => {
  const [experienceList, setExperienceList] = useState(
    data.experience?.length > 0 ? data.experience : [createEmptyExperience()]
  );
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState({});

  function createEmptyExperience() {
    return {
      id: Date.now(),
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      is_current: false,
      location: '',
      description: []
    };
  }

  const validateExperience = (experience, index) => {
    const newErrors = { ...errors };
    const errorKey = `experience_${index}`;
    const experienceErrors = {};

    if (!experience.job_title.trim()) {
      experienceErrors.job_title = 'Job title is required';
    }

    if (!experience.company.trim()) {
      experienceErrors.company = 'Company name is required';
    }

    if (!experience.start_date) {
      experienceErrors.start_date = 'Start date is required';
    } else if (!/^\d{2}\/\d{4}$/.test(experience.start_date)) {
      experienceErrors.start_date = 'Date must be in MM/YYYY format';
    }

    if (!experience.is_current && experience.end_date) {
      if (!/^\d{2}\/\d{4}$/.test(experience.end_date)) {
        experienceErrors.end_date = 'Date must be in MM/YYYY format';
      } else {
        const [startMonth, startYear] = experience.start_date.split('/').map(Number);
        const [endMonth, endYear] = experience.end_date.split('/').map(Number);
        const startDate = new Date(startYear, startMonth - 1);
        const endDate = new Date(endYear, endMonth - 1);
        
        if (endDate <= startDate) {
          experienceErrors.end_date = 'End date must be after start date';
        }
      }
    }

    if (experience.description.length === 0 || experience.description.every(desc => !desc.trim())) {
      experienceErrors.description = 'At least one job responsibility is required';
    } else {
      const invalidDescriptions = experience.description.filter(desc => desc.trim() && desc.length < 10);
      if (invalidDescriptions.length > 0) {
        experienceErrors.description = 'Each responsibility should be at least 10 characters long';
      }
    }

    if (Object.keys(experienceErrors).length > 0) {
      newErrors[errorKey] = experienceErrors;
    } else {
      delete newErrors[errorKey];
    }

    setErrors(newErrors);
    return Object.keys(experienceErrors).length === 0;
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...experienceList];
    
    if (field === 'is_current') {
      updatedExperience[index][field] = value;
      if (value) {
        updatedExperience[index].end_date = '';
      }
    } else {
      updatedExperience[index][field] = value;
    }

    setExperienceList(updatedExperience);
    validateExperience(updatedExperience[index], index);
    onUpdate('experience', updatedExperience);
  };

  const handleDescriptionChange = (expIndex, descIndex, value) => {
    const updatedExperience = [...experienceList];
    const updatedDescriptions = [...updatedExperience[expIndex].description];
    updatedDescriptions[descIndex] = value;
    updatedExperience[expIndex].description = updatedDescriptions;

    setExperienceList(updatedExperience);
    validateExperience(updatedExperience[expIndex], expIndex);
    onUpdate('experience', updatedExperience);
  };

  const addDescription = (expIndex) => {
    const updatedExperience = [...experienceList];
    updatedExperience[expIndex].description.push('');
    setExperienceList(updatedExperience);
    onUpdate('experience', updatedExperience);
  };

  const removeDescription = (expIndex, descIndex) => {
    const updatedExperience = [...experienceList];
    updatedExperience[expIndex].description.splice(descIndex, 1);
    setExperienceList(updatedExperience);
    validateExperience(updatedExperience[expIndex], expIndex);
    onUpdate('experience', updatedExperience);
  };

  const addExperience = () => {
    const newExperience = [...experienceList, createEmptyExperience()];
    setExperienceList(newExperience);
    onUpdate('experience', newExperience);
  };

  const removeExperience = (index) => {
    if (experienceList.length === 1) {
      const clearedExperience = [createEmptyExperience()];
      setExperienceList(clearedExperience);
      onUpdate('experience', clearedExperience);
    } else {
      const updatedExperience = experienceList.filter((_, i) => i !== index);
      setExperienceList(updatedExperience);
      onUpdate('experience', updatedExperience);
      
      const newErrors = { ...errors };
      delete newErrors[`experience_${index}`];
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('experience_')) {
          const errorIndex = parseInt(key.split('_')[1]);
          if (errorIndex > index) {
            newErrors[`experience_${errorIndex - 1}`] = newErrors[key];
            delete newErrors[key];
          }
        }
      });
      setErrors(newErrors);
    }
  };

  const getAiSuggestions = async (expIndex) => {
    const experience = experienceList[expIndex];
    if (!experience.job_title || !experience.company) {
      alert('Please fill in job title and company first');
      return;
    }

    setAiLoading(prev => ({ ...prev, [expIndex]: true }));
    try {
      const response = await aiService.suggestJobDescription({
        job_title: experience.job_title,
        company: experience.company,
        current_descriptions: experience.description,
        context: 'work_experience'
      });
      
      setAiSuggestions(prev => ({ 
        ...prev, 
        [expIndex]: response.data.suggestions 
      }));
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      alert('Failed to get AI suggestions. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, [expIndex]: false }));
    }
  };

  const handleUseAiSuggestion = (expIndex, suggestion) => {
    const updatedExperience = [...experienceList];
    updatedExperience[expIndex].description.push(suggestion);
    setExperienceList(updatedExperience);
    onUpdate('experience', updatedExperience);
    
    // Remove used suggestion
    setAiSuggestions(prev => ({
      ...prev,
      [expIndex]: prev[expIndex].filter(s => s !== suggestion)
    }));
  };

  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 6);
    }
    return numbers;
  };

  // Ensure each experience has at least one empty description
  React.useEffect(() => {
    experienceList.forEach((exp, index) => {
      if (exp.description.length === 0) {
        handleDescriptionChange(index, 0, '');
      }
    });
  }, [experienceList]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600">Add your professional experience (recommended)</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Experience</span>
        </button>
      </div>

      {experienceList.map((experience, expIndex) => (
        <div key={experience.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">
              Experience {expIndex + 1}
            </h4>
            {experienceList.length > 1 && (
              <button
                onClick={() => removeExperience(expIndex)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={experience.job_title}
                onChange={(e) => handleExperienceChange(expIndex, 'job_title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`experience_${expIndex}`]?.job_title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Software Developer"
              />
              {errors[`experience_${expIndex}`]?.job_title && (
                <p className="mt-1 text-sm text-red-600">{errors[`experience_${expIndex}`].job_title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) => handleExperienceChange(expIndex, 'company', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`experience_${expIndex}`]?.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tech Company Inc."
              />
              {errors[`experience_${expIndex}`]?.company && (
                <p className="mt-1 text-sm text-red-600">{errors[`experience_${expIndex}`].company}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={experience.start_date}
                onChange={(e) => handleExperienceChange(expIndex, 'start_date', formatDateInput(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`experience_${expIndex}`]?.start_date ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM/YYYY"
                maxLength="7"
              />
              {errors[`experience_${expIndex}`]?.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors[`experience_${expIndex}`].start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="text"
                value={experience.end_date}
                onChange={(e) => handleExperienceChange(expIndex, 'end_date', formatDateInput(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`experience_${expIndex}`]?.end_date ? 'border-red-500' : 'border-gray-300'
                } ${experience.is_current ? 'bg-gray-100' : ''}`}
                placeholder="MM/YYYY"
                maxLength="7"
                disabled={experience.is_current}
              />
              {errors[`experience_${expIndex}`]?.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors[`experience_${expIndex}`].end_date}</p>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={experience.is_current}
                  onChange={(e) => handleExperienceChange(expIndex, 'is_current', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Current position</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={experience.location}
              onChange={(e) => handleExperienceChange(expIndex, 'location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, Country"
            />
          </div>

          {/* Job Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Responsibilities <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => getAiSuggestions(expIndex)}
                  disabled={aiLoading[expIndex]}
                  className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  <span>🤖</span>
                  <span>{aiLoading[expIndex] ? 'Getting AI Suggestions...' : 'AI Suggest'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => addDescription(expIndex)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                >
                  + Add Point
                </button>
              </div>
            </div>

            {experience.description.map((desc, descIndex) => (
              <div key={descIndex} className="flex items-start space-x-2 mb-2">
                <span className="text-gray-400 mt-3">•</span>
                <textarea
                  value={desc}
                  onChange={(e) => handleDescriptionChange(expIndex, descIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your responsibilities and achievements using action verbs..."
                  rows="2"
                  maxLength="200"
                />
                {experience.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescription(expIndex, descIndex)}
                    className="mt-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {errors[`experience_${expIndex}`]?.description && (
              <p className="mt-1 text-sm text-red-600">{errors[`experience_${expIndex}`].description}</p>
            )}

            {/* AI Suggestions */}
            {aiSuggestions[expIndex] && aiSuggestions[expIndex].length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <h5 className="text-sm font-medium text-purple-900 mb-2">🤖 AI Suggestions</h5>
                <div className="space-y-2">
                  {aiSuggestions[expIndex].map((suggestion, index) => (
                    <div key={index} className="flex items-start justify-between p-2 bg-white rounded border">
                      <span className="text-sm text-gray-700 flex-1">• {suggestion}</span>
                      <button
                        onClick={() => {
                          const currentDescription = [...experienceList[expIndex].description];
                          currentDescription.push(suggestion);
                          handleDescriptionChange(expIndex, currentDescription);
                        }}
                        className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-900 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([key, errorObj]) => (
              <li key={key}>
                <strong>Experience {key.split('_')[1] ? parseInt(key.split('_')[1]) + 1 : ''}:</strong>
                <ul className="ml-4 mt-1">
                  {typeof errorObj === 'object' && errorObj !== null ? 
                    Object.entries(errorObj).map(([field, error]) => (
                      <li key={field}>• {String(error)}</li>
                    )) : (
                      <li>• {String(errorObj)}</li>
                    )
                  }
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Experience Section</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Start each bullet point with an action verb (e.g., "Developed", "Managed", "Improved")</li>
          <li>• Include quantifiable achievements where possible (e.g., "Increased sales by 25%")</li>
          <li>• Focus on results and impact, not just job duties</li>
          <li>• List experiences in reverse chronological order</li>
          <li>• Use 3-6 bullet points per position</li>
        </ul>
      </div>
    </div>
  );
};

export default ExperienceForm;
