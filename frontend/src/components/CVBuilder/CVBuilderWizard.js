import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PersonalInfoForm from './forms/PersonalInfoForm';
import EducationForm from './forms/EducationForm';
import ExperienceForm from './forms/ExperienceForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';
import CertificationsForm from './forms/CertificationsForm';
import LanguagesForm from './forms/LanguagesForm';
import AwardsForm from './forms/AwardsForm';
import ReferencesForm from './forms/ReferencesForm';
import CVPreview from './CVPreview';
import TemplateSelector from './TemplateSelector';
import api from '../../services/api';

const CVBuilderWizard = ({ cvId }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState({
    personal_info: {},
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    references: [],
    template_id: 1
  });
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const steps = [
    { id: 0, title: 'Template', component: TemplateSelector, icon: '🎨' },
    { id: 1, title: 'Personal Info', component: PersonalInfoForm, icon: '👤', required: true },
    { id: 2, title: 'Education', component: EducationForm, icon: '🎓', required: true },
    { id: 3, title: 'Experience', component: ExperienceForm, icon: '💼', required: false },
    { id: 4, title: 'Skills', component: SkillsForm, icon: '⚡', required: true },
    { id: 5, title: 'Projects', component: ProjectsForm, icon: '🚀', required: false },
    { id: 6, title: 'Certifications', component: CertificationsForm, icon: '🏆', required: false },
    { id: 7, title: 'Languages', component: LanguagesForm, icon: '🌍', required: false },
    { id: 8, title: 'Awards', component: AwardsForm, icon: '🥇', required: false },
    { id: 9, title: 'References', component: ReferencesForm, icon: '📋', required: false }
  ];

  // Check if user is premium
  const isPremium = user?.subscription_status === 'active' || user?.email === 'olalekanquadri58@gmail.com';

  // Auto-save functionality
  useEffect(() => {
    const autoSave = async () => {
      if (cvId && Object.keys(cvData.personal_info).length > 0) {
        try {
          await api.put(`/cv/${cvId}`, cvData);
          setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    };

    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [cvData, cvId]);

  // Load existing CV data
  useEffect(() => {
    if (cvId) {
      loadCvData();
    }
  }, [cvId]);

  const loadCvData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/cv/${cvId}`);
      setCvData(response.data);
      setSelectedTemplate(response.data.template_id || 1);
    } catch (error) {
      console.error('Failed to load CV data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCvData = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Save CV data
  const saveCvData = async () => {
    try {
      setIsLoading(true);
      if (cvId) {
        await api.put(`/cv/${cvId}`, cvData);
      } else {
        const response = await api.post('/cv', cvData);
        // Handle new CV creation if needed
      }
      setLastSaved(new Date().toLocaleTimeString());
      alert('CV saved successfully!');
    } catch (error) {
      console.error('Failed to save CV:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export CV functionality
  const exportCV = async () => {
    try {
      setIsLoading(true);
      // First save the CV
      await saveCvData();
      
      // Then trigger PDF download from the preview component
      const event = new CustomEvent('exportCV');
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    if (!step.required) return true;

    switch (stepIndex) {
      case 1: // Personal Info
        return cvData.personal_info?.full_name && 
               cvData.personal_info?.professional_title &&
               cvData.personal_info?.email && 
               cvData.personal_info?.phone;
      case 2: // Education
        return cvData.education?.length > 0;
      case 4: // Skills
        return cvData.skills?.length > 0;
      default:
        return true;
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">CV Builder</h1>
          <div className="flex items-center space-x-4">
            {!isPremium && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Standard Plan
              </span>
            )}
            {isPremium && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Premium Plan
              </span>
            )}
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : index < currentStep
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : validateStep(index)
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              } ${step.required && !validateStep(index) ? 'border-2 border-red-300' : ''}`}
              disabled={index > currentStep && !validateStep(currentStep)}
            >
              <span>{step.icon}</span>
              <span>{step.title}</span>
              {step.required && (
                <span className="text-red-500">*</span>
              )}
              {validateStep(index) && index !== currentStep && (
                <span className="text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">{steps[currentStep].icon}</span>
              {steps[currentStep].title}
              {steps[currentStep].required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              {steps[currentStep].required ? 'Required section' : 'Optional section'}
            </p>
          </div>

          <CurrentStepComponent
            data={currentStep === 0 ? selectedTemplate : cvData}
            onUpdate={currentStep === 0 ? (templateId) => {
              setSelectedTemplate(templateId);
              updateCvData('template_id', templateId);
            } : updateCvData}
            isPremium={isPremium}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {/* Save Button */}
              <button
                onClick={saveCvData}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={exportCV}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Exporting...' : 'Save & Export CV'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={steps[currentStep].required && !validateStep(currentStep)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
            <p className="text-gray-600">See how your CV looks in real-time</p>
          </div>
          
          <CVPreview
            data={cvData}
            templateId={selectedTemplate}
            isPremium={isPremium}
          />
        </div>
      </div>
    </div>
  );
};

export default CVBuilderWizard;
