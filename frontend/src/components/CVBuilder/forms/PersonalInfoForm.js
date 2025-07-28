import React, { useState } from 'react';
import { aiService } from '../../../services/api';

const PersonalInfoForm = ({ data, onUpdate, isPremium }) => {
  const [formData, setFormData] = useState({
    full_name: data.personal_info?.full_name || '',
    professional_title: data.personal_info?.professional_title || '',
    email: data.personal_info?.email || '',
    phone: data.personal_info?.phone || '',
    address: data.personal_info?.address || '',
    linkedin: data.personal_info?.linkedin || '',
    github: data.personal_info?.github || '',
    portfolio: data.personal_info?.portfolio || '',
    summary: data.personal_info?.summary || ''
  });

  const [errors, setErrors] = useState({});
  const [isGettingAiSuggestion, setIsGettingAiSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'full_name':
        if (!value.trim()) {
          newErrors[name] = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors[name] = 'Full name should contain only letters and spaces';
        } else {
          delete newErrors[name];
        }
        break;

      case 'professional_title':
        if (!value.trim()) {
          newErrors[name] = 'Professional title is required';
        } else if (value.length < 2) {
          newErrors[name] = 'Professional title should be at least 2 characters';
        } else if (value.length > 100) {
          newErrors[name] = 'Professional title should not exceed 100 characters';
        } else {
          delete newErrors[name];
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors[name] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid email address';
        } else {
          delete newErrors[name];
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors[name] = 'Phone number is required';
        } else if (!/^[+]?[0-9\s\-()]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid phone number';
        } else {
          delete newErrors[name];
        }
        break;

      case 'linkedin':
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\//.test(value)) {
          newErrors[name] = 'Please enter a valid LinkedIn URL';
        } else {
          delete newErrors[name];
        }
        break;

      case 'github':
        if (value && !/^https?:\/\/(www\.)?github\.com\//.test(value)) {
          newErrors[name] = 'Please enter a valid GitHub URL';
        } else {
          delete newErrors[name];
        }
        break;

      case 'portfolio':
        if (value && !/^https?:\/\//.test(value)) {
          newErrors[name] = 'Please enter a valid URL';
        } else {
          delete newErrors[name];
        }
        break;

      case 'summary':
        if (!value.trim()) {
          newErrors[name] = 'Professional summary is required';
        } else if (value.length < 50) {
          newErrors[name] = 'Summary should be at least 50 characters';
        } else if (value.length > 300) {
          newErrors[name] = 'Summary should not exceed 300 characters';
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    
    // Update parent component
    onUpdate('personal_info', { ...formData, [name]: value });
  };

  const getAiSuggestion = async () => {
    if (!formData.full_name || !formData.email) {
      alert('Please fill in your name and email first');
      return;
    }

    setIsGettingAiSuggestion(true);
    try {
      const response = await aiService.suggestSummary({
        full_name: formData.full_name,
        current_summary: formData.summary,
        context: 'professional_summary'
      });
      setAiSuggestion(String(response.data.suggestion || ''));
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
      alert('Failed to get AI suggestion. Please try again.');
    } finally {
      setIsGettingAiSuggestion(false);
    }
  };

  const useAiSuggestion = () => {
    handleInputChange('summary', aiSuggestion);
    setAiSuggestion('');
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="professional_title" className="block text-sm font-medium text-gray-700 mb-1">
            Professional Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="professional_title"
            value={formData.professional_title}
            onChange={(e) => handleInputChange('professional_title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.professional_title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Software Developer, Marketing Manager"
          />
          {errors.professional_title && (
            <p className="mt-1 text-sm text-red-600">{errors.professional_title}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City, Country"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Social Links (Optional)</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.linkedin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://www.linkedin.com/in/yourprofile"
            />
            {errors.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
            )}
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile
            </label>
            <input
              type="url"
              id="github"
              value={formData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.github ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://github.com/yourusername"
            />
            {errors.github && (
              <p className="mt-1 text-sm text-red-600">{errors.github}</p>
            )}
          </div>

          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio Website
            </label>
            <input
              type="url"
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.portfolio ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://yourportfolio.com"
            />
            {errors.portfolio && (
              <p className="mt-1 text-sm text-red-600">{errors.portfolio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Professional Summary <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={getAiSuggestion}
            disabled={isGettingAiSuggestion}
            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <span>🤖</span>
            <span>{isGettingAiSuggestion ? 'Getting AI Suggestion...' : 'AI Suggest'}</span>
          </button>
        </div>
        
        <textarea
          id="summary"
          rows="4"
          value={formData.summary}
          onChange={(e) => handleInputChange('summary', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.summary ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write a compelling 2-4 sentence summary that highlights your key skills, experience, and career objectives..."
          maxLength="300"
        />
        
        <div className="flex justify-between items-center mt-1">
          {errors.summary ? (
            <p className="text-sm text-red-600">{errors.summary}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Write 2-4 sentences describing your professional background and goals
            </p>
          )}
          <span className="text-sm text-gray-400">
            {formData.summary.length}/300
          </span>
        </div>

        {/* AI Suggestion Display */}
        {aiSuggestion && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-purple-900">🤖 AI Suggestion</h4>
              <div className="space-x-2">
                <button
                  onClick={useAiSuggestion}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Use This
                </button>
                <button
                  onClick={() => setAiSuggestion('')}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700">{String(aiSuggestion)}</p>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-900 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {String(error)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;
