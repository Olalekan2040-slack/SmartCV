import React, { useState } from 'react';

const EducationForm = ({ data, onUpdate, isPremium }) => {
  const [educationList, setEducationList] = useState(
    data.education?.length > 0 ? data.education : [createEmptyEducation()]
  );
  const [errors, setErrors] = useState({});

  function createEmptyEducation() {
    return {
      id: Date.now(),
      school: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: '',
      grade: '',
      location: '',
      is_current: false
    };
  }

  const validateEducation = (education, index) => {
    const newErrors = { ...errors };
    const errorKey = `education_${index}`;

    const educationErrors = {};

    if (!education.school.trim()) {
      educationErrors.school = 'School name is required';
    }

    if (!education.degree.trim()) {
      educationErrors.degree = 'Degree is required';
    }

    if (!education.field.trim()) {
      educationErrors.field = 'Field of study is required';
    }

    if (!education.start_date) {
      educationErrors.start_date = 'Start date is required';
    } else if (!/^\d{2}\/\d{4}$/.test(education.start_date)) {
      educationErrors.start_date = 'Date must be in MM/YYYY format';
    }

    if (!education.is_current && education.end_date) {
      if (!/^\d{2}\/\d{4}$/.test(education.end_date)) {
        educationErrors.end_date = 'Date must be in MM/YYYY format';
      } else {
        // Check if end date is after start date
        const [startMonth, startYear] = education.start_date.split('/').map(Number);
        const [endMonth, endYear] = education.end_date.split('/').map(Number);
        const startDate = new Date(startYear, startMonth - 1);
        const endDate = new Date(endYear, endMonth - 1);
        
        if (endDate <= startDate) {
          educationErrors.end_date = 'End date must be after start date';
        }
      }
    }

    if (Object.keys(educationErrors).length > 0) {
      newErrors[errorKey] = educationErrors;
    } else {
      delete newErrors[errorKey];
    }

    setErrors(newErrors);
    return Object.keys(educationErrors).length === 0;
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...educationList];
    
    if (field === 'is_current') {
      updatedEducation[index][field] = value;
      if (value) {
        updatedEducation[index].end_date = '';
      }
    } else {
      updatedEducation[index][field] = value;
    }

    setEducationList(updatedEducation);
    validateEducation(updatedEducation[index], index);
    onUpdate('education', updatedEducation);
  };

  const addEducation = () => {
    const newEducation = [...educationList, createEmptyEducation()];
    setEducationList(newEducation);
    onUpdate('education', newEducation);
  };

  const removeEducation = (index) => {
    if (educationList.length === 1) {
      // Don't remove the last education entry, just clear it
      const clearedEducation = [createEmptyEducation()];
      setEducationList(clearedEducation);
      onUpdate('education', clearedEducation);
    } else {
      const updatedEducation = educationList.filter((_, i) => i !== index);
      setEducationList(updatedEducation);
      onUpdate('education', updatedEducation);
      
      // Clean up errors for removed item
      const newErrors = { ...errors };
      delete newErrors[`education_${index}`];
      // Reindex remaining errors
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('education_')) {
          const errorIndex = parseInt(key.split('_')[1]);
          if (errorIndex > index) {
            newErrors[`education_${errorIndex - 1}`] = newErrors[key];
            delete newErrors[key];
          }
        }
      });
      setErrors(newErrors);
    }
  };

  const formatDateInput = (value) => {
    // Remove any non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as MM/YYYY
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 6);
    }
    return numbers;
  };

  const degreeOptions = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor\'s Degree',
    'B.Sc',
    'B.A',
    'B.Eng',
    'B.Tech',
    'Master\'s Degree',
    'M.Sc',
    'M.A',
    'M.Eng',
    'MBA',
    'Ph.D',
    'Professional Certificate',
    'Diploma',
    'HND',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Education History</h3>
          <p className="text-sm text-gray-600">Add your educational background (at least one required)</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Education</span>
        </button>
      </div>

      {educationList.map((education, index) => (
        <div key={education.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">
              Education {index + 1}
            </h4>
            {educationList.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School/Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.school}
                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`education_${index}`]?.school ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="University of Example"
              />
              {errors[`education_${index}`]?.school && (
                <p className="mt-1 text-sm text-red-600">{errors[`education_${index}`].school}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree <span className="text-red-500">*</span>
              </label>
              <select
                value={education.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`education_${index}`]?.degree ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select degree</option>
                {degreeOptions.map(degree => (
                  <option key={degree} value={degree}>{degree}</option>
                ))}
              </select>
              {errors[`education_${index}`]?.degree && (
                <p className="mt-1 text-sm text-red-600">{errors[`education_${index}`].degree}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.field}
                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`education_${index}`]?.field ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Computer Science"
              />
              {errors[`education_${index}`]?.field && (
                <p className="mt-1 text-sm text-red-600">{errors[`education_${index}`].field}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={education.location}
                onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.start_date}
                onChange={(e) => handleEducationChange(index, 'start_date', formatDateInput(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`education_${index}`]?.start_date ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM/YYYY"
                maxLength="7"
              />
              {errors[`education_${index}`]?.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors[`education_${index}`].start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="text"
                value={education.end_date}
                onChange={(e) => handleEducationChange(index, 'end_date', formatDateInput(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[`education_${index}`]?.end_date ? 'border-red-500' : 'border-gray-300'
                } ${education.is_current ? 'bg-gray-100' : ''}`}
                placeholder="MM/YYYY"
                maxLength="7"
                disabled={education.is_current}
              />
              {errors[`education_${index}`]?.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors[`education_${index}`].end_date}</p>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={education.is_current}
                  onChange={(e) => handleEducationChange(index, 'is_current', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Currently studying</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade/GPA
            </label>
            <input
              type="text"
              value={education.grade}
              onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.8 GPA, First Class, etc."
            />
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
                <strong>Education {key.split('_')[1] ? parseInt(key.split('_')[1]) + 1 : ''}:</strong>
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
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Education Section</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• List your education in reverse chronological order (most recent first)</li>
          <li>• Include relevant coursework, honors, or academic achievements</li>
          <li>• If you're a recent graduate, education should come before experience</li>
          <li>• Use consistent date formatting (MM/YYYY)</li>
        </ul>
      </div>
    </div>
  );
};

export default EducationForm;
