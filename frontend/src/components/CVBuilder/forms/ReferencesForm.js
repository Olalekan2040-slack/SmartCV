import React, { useState } from 'react';

const ReferencesForm = ({ data, onUpdate, isPremium }) => {
  const [references, setReferences] = useState(
    data.references?.length > 0 ? data.references : []
  );
  const [errors, setErrors] = useState({});

  const validateReference = (ref, index) => {
    const newErrors = { ...errors };
    const errorKey = `ref_${index}`;
    const refErrors = {};

    if (!ref.name.trim()) {
      refErrors.name = 'Name is required';
    }

    if (!ref.relationship.trim()) {
      refErrors.relationship = 'Relationship is required';
    }

    if (!ref.contact.trim()) {
      refErrors.contact = 'Contact information is required';
    } else if (!ref.contact.includes('@') && !/^[+]?[\d\s\-()]+$/.test(ref.contact)) {
      refErrors.contact = 'Please provide a valid email or phone number';
    }

    if (Object.keys(refErrors).length > 0) {
      newErrors[errorKey] = refErrors;
    } else {
      delete newErrors[errorKey];
    }

    setErrors(newErrors);
    return Object.keys(refErrors).length === 0;
  };

  const addReference = () => {
    const newReference = {
      id: Date.now(),
      name: '',
      relationship: '',
      company: '',
      contact: '',
      notes: ''
    };

    const updatedReferences = [...references, newReference];
    setReferences(updatedReferences);
    onUpdate('references', updatedReferences);
  };

  const updateReference = (id, field, value) => {
    const updatedReferences = references.map(ref =>
      ref.id === id ? { ...ref, [field]: value } : ref
    );
    setReferences(updatedReferences);
    
    const index = updatedReferences.findIndex(ref => ref.id === id);
    if (index !== -1) {
      validateReference(updatedReferences[index], index);
    }
    
    onUpdate('references', updatedReferences);
  };

  const removeReference = (id) => {
    const updatedReferences = references.filter(ref => ref.id !== id);
    setReferences(updatedReferences);
    onUpdate('references', updatedReferences);
    
    // Clean up errors
    const newErrors = { ...errors };
    const refIndex = references.findIndex(ref => ref.id === id);
    delete newErrors[`ref_${refIndex}`];
    setErrors(newErrors);
  };

  const relationshipOptions = [
    'Direct Supervisor',
    'Manager',
    'Team Lead',
    'Colleague',
    'Client',
    'Professor',
    'Academic Advisor',
    'Mentor',
    'Business Partner',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">References</h3>
          <p className="text-sm text-gray-600">Add professional references (optional)</p>
        </div>
        <button
          onClick={addReference}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Reference</span>
        </button>
      </div>

      {references.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No references added yet</h4>
          <p className="text-gray-600 mb-4">Professional references can strengthen your application</p>
          <div className="mb-4 text-sm text-gray-600">
            <p className="mb-2">💡 <strong>Pro tip:</strong> Always ask permission before listing someone as a reference</p>
          </div>
          <button
            onClick={addReference}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Reference
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {references.map((reference, index) => (
            <div key={reference.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">
                  Reference {index + 1}
                </h4>
                <button
                  onClick={() => removeReference(reference.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reference.name}
                    onChange={(e) => updateReference(reference.id, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`ref_${index}`]?.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Smith"
                  />
                  {errors[`ref_${index}`]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors[`ref_${index}`].name || ''}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reference.relationship}
                    onChange={(e) => updateReference(reference.id, 'relationship', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`ref_${index}`]?.relationship ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select relationship</option>
                    {relationshipOptions.map(relation => (
                      <option key={relation} value={relation}>{relation}</option>
                    ))}
                  </select>
                  {errors[`ref_${index}`]?.relationship && (
                    <p className="mt-1 text-sm text-red-600">{errors[`ref_${index}`].relationship || ''}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    value={reference.company}
                    onChange={(e) => updateReference(reference.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reference.contact}
                    onChange={(e) => updateReference(reference.id, 'contact', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`ref_${index}`]?.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com or +1 (555) 123-4567"
                  />
                  {errors[`ref_${index}`]?.contact && (
                    <p className="mt-1 text-sm text-red-600">{errors[`ref_${index}`].contact || ''}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={reference.notes}
                  onChange={(e) => updateReference(reference.id, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Any additional context about your working relationship..."
                  maxLength="150"
                />
                <p className="mt-1 text-sm text-gray-500">{reference.notes.length}/150</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-900 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([key, errorObj]) => (
              <li key={key}>
                <strong>Reference {key.split('_')[1] ? parseInt(key.split('_')[1]) + 1 : ''}:</strong>
                <ul className="ml-4 mt-1">
                  {typeof errorObj === 'object' && errorObj !== null ? 
                    Object.entries(errorObj).map(([field, error]) => (
                      <li key={field}>• {error || ''}</li>
                    )) : (
                      <li>• {errorObj || ''}</li>
                    )
                  }
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for References</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Always ask permission before listing someone as a reference</li>
          <li>• Choose references who can speak to your work performance and character</li>
          <li>• Include a mix of supervisors, colleagues, and clients if possible</li>
          <li>• Keep your references informed about your job search</li>
          <li>• Provide your references with an updated copy of your CV</li>
          <li>• Consider including 2-3 strong references rather than many weak ones</li>
        </ul>
      </div>

      {references.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-400 text-lg mr-2">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">Privacy Notice</h4>
              <p className="text-sm text-yellow-800">
                Reference contact information is sensitive. This data will be securely stored and only shared 
                when you explicitly choose to include references in your CV export.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferencesForm;
