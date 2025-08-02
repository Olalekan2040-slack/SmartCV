import React, { useState } from 'react';

const CertificationsForm = ({ data, onUpdate, isPremium }) => {
  const [certifications, setCertifications] = useState(
    data.certifications?.length > 0 ? data.certifications : []
  );
  const [errors, setErrors] = useState({});

  function createEmptyCertification() {
    return {
      id: Date.now(),
      name: '',
      issuer: '',
      date_issued: '',
      credential_url: '',
      expires: false,
      expiry_date: ''
    };
  }

  const validateCertification = (cert, index) => {
    const newErrors = { ...errors };
    const errorKey = `cert_${index}`;
    const certErrors = {};

    if (!cert.name.trim()) {
      certErrors.name = 'Certificate name is required';
    }

    if (!cert.issuer.trim()) {
      certErrors.issuer = 'Issuer is required';
    }

    if (!cert.date_issued) {
      certErrors.date_issued = 'Issue date is required';
    } else if (!/^\d{2}\/\d{4}$/.test(cert.date_issued)) {
      certErrors.date_issued = 'Date must be in MM/YYYY format';
    }

    if (cert.credential_url && !/^https?:\/\//.test(cert.credential_url)) {
      certErrors.credential_url = 'Please enter a valid URL';
    }

    if (cert.expires && cert.expiry_date && !/^\d{2}\/\d{4}$/.test(cert.expiry_date)) {
      certErrors.expiry_date = 'Date must be in MM/YYYY format';
    }

    if (Object.keys(certErrors).length > 0) {
      newErrors[errorKey] = certErrors;
    } else {
      delete newErrors[errorKey];
    }

    setErrors(newErrors);
    return Object.keys(certErrors).length === 0;
  };

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[index][field] = value;

    if (field === 'expires' && !value) {
      updatedCertifications[index].expiry_date = '';
    }

    setCertifications(updatedCertifications);
    validateCertification(updatedCertifications[index], index);
    onUpdate('certifications', updatedCertifications);
  };

  const addCertification = () => {
    const newCertifications = [...certifications, createEmptyCertification()];
    setCertifications(newCertifications);
    onUpdate('certifications', newCertifications);
  };

  const removeCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
    onUpdate('certifications', updatedCertifications);
    
    const newErrors = { ...errors };
    delete newErrors[`cert_${index}`];
    setErrors(newErrors);
  };

  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 6);
    }
    return numbers;
  };

  const popularCertifications = [
    'AWS Certified Solutions Architect',
    'Google Cloud Professional',
    'Microsoft Azure Fundamentals',
    'CompTIA Security+',
    'Cisco CCNA',
    'PMP Certification',
    'Scrum Master Certification',
    'Google Analytics Certified',
    'HubSpot Content Marketing',
    'Facebook Blueprint Certified'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
          <p className="text-sm text-gray-600">Add your professional certifications (optional)</p>
        </div>
        <button
          onClick={addCertification}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Certification</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-4">🏆</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No certifications added yet</h4>
          <p className="text-gray-600 mb-4">Certifications demonstrate your expertise and professional development</p>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Popular certifications:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {popularCertifications.slice(0, 6).map(cert => (
                <span key={cert} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={addCertification}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Certification
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">
                  Certification {index + 1}
                </h4>
                <button
                  onClick={() => removeCertification(index)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`cert_${index}`]?.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="AWS Certified Solutions Architect"
                  />
                  {errors[`cert_${index}`]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors[`cert_${index}`].name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`cert_${index}`]?.issuer ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Amazon Web Services"
                  />
                  {errors[`cert_${index}`]?.issuer && (
                    <p className="mt-1 text-sm text-red-600">{errors[`cert_${index}`].issuer}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Issued <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.date_issued}
                    onChange={(e) => handleCertificationChange(index, 'date_issued', formatDateInput(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`cert_${index}`]?.date_issued ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MM/YYYY"
                    maxLength="7"
                  />
                  {errors[`cert_${index}`]?.date_issued && (
                    <p className="mt-1 text-sm text-red-600">{errors[`cert_${index}`].date_issued}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cert.expiry_date}
                    onChange={(e) => handleCertificationChange(index, 'expiry_date', formatDateInput(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`cert_${index}`]?.expiry_date ? 'border-red-500' : 'border-gray-300'
                    } ${!cert.expires ? 'bg-gray-100' : ''}`}
                    placeholder="MM/YYYY"
                    maxLength="7"
                    disabled={!cert.expires}
                  />
                  {errors[`cert_${index}`]?.expiry_date && (
                    <p className="mt-1 text-sm text-red-600">{errors[`cert_${index}`].expiry_date}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cert.expires}
                      onChange={(e) => handleCertificationChange(index, 'expires', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Has expiry date</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential URL
                </label>
                <input
                  type="url"
                  value={cert.credential_url}
                  onChange={(e) => handleCertificationChange(index, 'credential_url', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors[`cert_${index}`]?.credential_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://www.credly.com/badges/..."
                />
                {errors[`cert_${index}`]?.credential_url && (
                  <p className="mt-1 text-sm text-red-600">{errors[`cert_${index}`].credential_url}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Link to verify your certification (e.g., Credly, official certificate)
                </p>
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
                <strong>Certification {key.split('_')[1] ? parseInt(key.split('_')[1]) + 1 : ''}:</strong>
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
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Certifications</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include relevant certifications that align with your career goals</li>
          <li>• List certifications in reverse chronological order (most recent first)</li>
          <li>• Include the credential URL for verification when possible</li>
          <li>• Mention if a certification is currently in progress</li>
          <li>• Include both technical and professional development certifications</li>
          <li>• Update expired certifications or remove them if no longer relevant</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificationsForm;
