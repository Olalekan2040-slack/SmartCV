import React, { useMemo, useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './CVPreview.css';

const CVPreview = ({ data, templateId, isPremium }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

  // Generate preview content based on the current data
  const previewData = useMemo(() => {
    return {
      personalInfo: data.personal_info || data.personalInfo || {},
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
      awards: data.awards || [],
      references: data.references || []
    };
  }, [data]);

  // Export functionality
  const exportToPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      const element = previewRef.current;
      const opt = {
        margin: 0.5,
        filename: `${previewData.personalInfo.full_name || previewData.personalInfo.fullName || 'CV'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Listen for export events from parent component
  useEffect(() => {
    const handleExportEvent = () => {
      exportToPDF();
    };
    
    document.addEventListener('exportCV', handleExportEvent);
    return () => {
      document.removeEventListener('exportCV', handleExportEvent);
    };
  }, []);

  // Template styles with enhanced multi-page support
  const getTemplateStyles = (templateId) => {
    const templates = {
      1: { // Professional - Enhanced with modern business styling
        containerClass: 'bg-white text-gray-900 shadow-2xl border border-gray-100',
        headerClass: 'relative bg-gradient-to-r from-slate-50 to-blue-50 border-b-4 border-blue-600 p-8 mb-8 rounded-t-lg',
        sectionClass: 'mb-10 break-inside-avoid px-2',
        titleClass: 'text-2xl font-bold text-slate-800 mb-6 border-b-3 border-blue-500 pb-3 relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-blue-600',
        textClass: 'text-gray-700 leading-relaxed',
        accentColor: 'text-blue-700 font-medium',
        nameClass: 'text-5xl font-extrabold text-slate-900 mb-3 tracking-tight',
        titleTextClass: 'text-xl font-semibold text-blue-700 mb-4 tracking-wide'
      },
      2: { // Creative - Enhanced with vibrant gradients and modern spacing
        containerClass: 'bg-white text-gray-900 shadow-2xl border border-purple-100',
        headerClass: 'relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-10 rounded-lg mb-8 border-l-8 border-purple-500',
        sectionClass: 'mb-10 break-inside-avoid px-3',
        titleClass: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-6 border-l-6 border-gradient-to-b from-purple-500 to-pink-500 pl-6 relative before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-purple-500 before:to-pink-500',
        textClass: 'text-gray-700 leading-relaxed',
        accentColor: 'text-purple-700 font-semibold',
        nameClass: 'text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-700 mb-3 tracking-tight',
        titleTextClass: 'text-xl font-semibold text-purple-700 mb-4 tracking-wide'
      },
      3: { // Minimalist - Enhanced with clean typography and perfect spacing
        containerClass: 'bg-white text-gray-900 shadow-xl border border-gray-50',
        headerClass: 'pb-10 mb-10 border-b-2 border-gray-300 relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gray-400 after:to-transparent',
        sectionClass: 'mb-12 break-inside-avoid',
        titleClass: 'text-xl font-semibold text-gray-900 mb-8 uppercase tracking-wide-custom relative pb-3 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-gray-600',
        textClass: 'text-gray-600 leading-relaxed font-light',
        accentColor: 'text-gray-800 font-medium',
        nameClass: 'text-5xl font-extralight text-gray-900 mb-4 tracking-wide',
        titleTextClass: 'text-xl font-light text-gray-600 mb-6 tracking-wide'
      },
      4: { // Executive (Premium)
        containerClass: 'bg-white text-gray-900',
        headerClass: 'bg-gray-900 text-white p-8 mb-6',
        sectionClass: 'mb-8 break-inside-avoid',
        titleClass: 'text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gold-500 pb-2',
        textClass: 'text-gray-700',
        accentColor: 'text-gold-600',
        nameClass: 'text-4xl font-bold text-white mb-2',
        titleTextClass: 'text-xl text-gray-300 mb-4'
      },
      5: { // Tech Modern (Premium)
        containerClass: 'bg-gray-50 text-gray-900',
        headerClass: 'bg-gradient-to-r from-blue-600 to-teal-500 text-white p-8 mb-6',
        sectionClass: 'mb-8 break-inside-avoid bg-white p-6 rounded-lg shadow-sm',
        titleClass: 'text-2xl font-bold text-blue-600 mb-4 flex items-center',
        textClass: 'text-gray-700',
        accentColor: 'text-teal-600',
        nameClass: 'text-4xl font-bold text-white mb-2',
        titleTextClass: 'text-xl text-blue-100 mb-4'
      },
      6: { // Designer Pro (Premium)
        containerClass: 'bg-white text-gray-900',
        headerClass: 'relative p-8 mb-6 bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100',
        sectionClass: 'mb-8 break-inside-avoid',
        titleClass: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4',
        textClass: 'text-gray-700',
        accentColor: 'text-purple-600',
        nameClass: 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2',
        titleTextClass: 'text-xl text-purple-700 mb-4'
      },
      7: { // Academic (Premium)
        containerClass: 'bg-white text-gray-900',
        headerClass: 'border-t-8 border-green-600 pt-6 pb-6 mb-6',
        sectionClass: 'mb-8 break-inside-avoid',
        titleClass: 'text-2xl font-serif font-bold text-green-800 mb-4 border-b border-green-300 pb-2',
        textClass: 'text-gray-700',
        accentColor: 'text-green-600',
        nameClass: 'text-4xl font-serif font-bold text-gray-900 mb-2',
        titleTextClass: 'text-xl font-serif text-green-700 mb-4'
      },
      8: { // International (Premium)
        containerClass: 'bg-white text-gray-900',
        headerClass: 'border-l-8 border-orange-500 pl-8 pb-6 mb-6',
        sectionClass: 'mb-8 break-inside-avoid',
        titleClass: 'text-2xl font-bold text-orange-700 mb-4 uppercase',
        textClass: 'text-gray-700',
        accentColor: 'text-orange-600',
        nameClass: 'text-4xl font-bold text-gray-900 mb-2',
        titleTextClass: 'text-xl text-orange-600 mb-4'
      }
    };
    
    return templates[templateId] || templates[1];
  };

  const styles = getTemplateStyles(templateId);

  // Zoom controls
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const printCV = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      let date;
      
      // Handle MM/YYYY format (from forms)
      if (typeof dateString === 'string' && /^\d{2}\/\d{4}$/.test(dateString)) {
        const [month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, 1);
      }
      // Handle YYYY-MM-DD format (from date inputs)
      else if (typeof dateString === 'string' && dateString.includes('-')) {
        date = new Date(dateString);
      } 
      // Handle timestamp
      else if (!isNaN(dateString)) {
        date = new Date(parseInt(dateString));
      }
      // Handle Date object
      else if (dateString instanceof Date) {
        date = dateString;
      }
      // Default fallback
      else {
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if can't parse
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return dateString || '';
    }
  };

  const formatDateRange = (startDate, endDate, isCurrent) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900 p-8' : 'bg-gray-100 p-6 rounded-lg'}`}>
      {/* Preview Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-lg font-medium ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
          Live Preview
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={zoomOut}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
            title="Zoom Out"
          >
            🔍➖
          </button>
          <span className="text-sm text-gray-600 min-w-[4rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            onClick={zoomIn}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
            title="Zoom In"
          >
            🔍➕
          </button>
          <button 
            onClick={toggleFullscreen}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? '📱' : '🖥️'}
          </button>
          {isFullscreen && (
            <button 
              onClick={toggleFullscreen}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* CV Preview Container with Multi-page Support */}
      <div 
        className={`${isFullscreen ? 'max-h-full overflow-y-auto' : 'max-h-[600px] overflow-y-auto'} 
                   bg-white shadow-lg mx-auto scrollbar-thin scrollbar-thumb-gray-300`}
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          width: `${100 / zoomLevel}%`,
          maxWidth: '210mm', // A4 width
        }}
      >
        {/* Watermark Layer for Standard Templates */}
        {!isPremium && templateId <= 3 && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
            <div 
              className="transform -rotate-45 text-5xl font-light text-gray-150 opacity-15 select-none tracking-widest"
              style={{ fontSize: '3.5rem', zIndex: 1, letterSpacing: '0.3em' }}
            >
              SmartCV • Free Plan
            </div>
          </div>
        )}

        {/* CV Content with Multi-page Layout */}
        <div 
          ref={previewRef}
          className={`${styles.containerClass} relative min-h-[297mm] p-8`} // A4 height
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6',
            color: '#1f2937'
          }}
        >
          {/* Header Section */}
          <div className={styles.headerClass}>
            <h1 className={styles.nameClass}>
              {previewData.personalInfo.full_name || previewData.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className={styles.titleTextClass}>
              {previewData.personalInfo.professional_title || previewData.personalInfo.title || 'Professional Title'}
            </div>
            <div className={`${styles.textClass} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-base mt-6`}>
              {(previewData.personalInfo.email || previewData.personalInfo.email_address) && (
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="font-medium">{previewData.personalInfo.email || previewData.personalInfo.email_address}</span>
                </div>
              )}
              {(previewData.personalInfo.phone || previewData.personalInfo.phone_number) && (
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span className="font-medium">{previewData.personalInfo.phone || previewData.personalInfo.phone_number}</span>
                </div>
              )}
              {previewData.personalInfo.location && (
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">{previewData.personalInfo.location}</span>
                </div>
              )}
              {previewData.personalInfo.linkedin && (
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">{previewData.personalInfo.linkedin}</span>
                </div>
              )}
              {(previewData.personalInfo.website || previewData.personalInfo.portfolio_url) && (
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-medium">{previewData.personalInfo.website || previewData.personalInfo.portfolio_url}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {(previewData.personalInfo.summary || previewData.personalInfo.professional_summary) && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Professional Summary</h2>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <p className={`${styles.textClass} text-base leading-relaxed italic font-medium text-gray-800`}>
                  "{previewData.personalInfo.summary || previewData.personalInfo.professional_summary}"
                </p>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {previewData.experience.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Professional Experience</h2>
              {previewData.experience.map((exp, index) => (
                <div key={index} className="mb-8 last:mb-0 break-inside-avoid bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {exp.position || exp.job_title}
                      </h3>
                      <div className={`${styles.accentColor} text-lg font-semibold mb-2 flex items-center`}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                        </svg>
                        {exp.company || exp.company_name}
                        {(exp.location || exp.company_location) && (
                          <span className="ml-2 text-gray-600 font-normal flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            {exp.location || exp.company_location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`${styles.textClass} text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap`}>
                        {formatDateRange(exp.start_date || exp.startDate, exp.end_date || exp.endDate, exp.is_current || exp.isCurrent)}
                      </span>
                    </div>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <div className="mt-4">
                      <ul className={`${styles.textClass} text-base space-y-2`}>
                        {exp.description.map((item, idx) => (
                          <li key={idx} className="flex items-start leading-relaxed">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education Section */}
          {previewData.education.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Education</h2>
              {previewData.education.map((edu, index) => (
                <div key={index} className="mb-6 last:mb-0 break-inside-avoid bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                        </svg>
                        <h3 className="text-xl font-bold text-gray-900">
                          {edu.degree} {(edu.field_of_study || edu.field) && `in ${edu.field_of_study || edu.field}`}
                        </h3>
                      </div>
                      <div className={`${styles.accentColor} text-lg font-semibold mb-2 flex items-center`}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                        </svg>
                        {edu.school || edu.institution}
                        {edu.location && (
                          <span className="ml-2 text-gray-600 font-normal flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            {edu.location}
                          </span>
                        )}
                      </div>
                      {edu.gpa && (
                        <div className={`${styles.textClass} text-sm mb-2 bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block font-semibold`}>
                          GPA: {edu.gpa}
                        </div>
                      )}
                      {edu.description && (
                        <div className={`${styles.textClass} text-sm mt-3 bg-white p-3 rounded-lg border border-blue-200`}>
                          {edu.description}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`${styles.textClass} text-sm font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full whitespace-nowrap`}>
                        {formatDateRange(edu.start_date || edu.startDate, edu.end_date || edu.endDate, edu.is_current || edu.isCurrent)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {previewData.skills.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Skills & Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(
                  previewData.skills.reduce((acc, skill) => {
                    const category = skill.category || 'Other';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, skills]) => (
                  <div key={category} className="break-inside-avoid bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <h4 className={`${styles.accentColor} font-bold text-lg`}>{category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {skills.slice(0, 8).map((skill, index) => {
                        const getProficiencyColor = (proficiency) => {
                          switch(proficiency?.toLowerCase()) {
                            case 'expert': return 'bg-green-500 text-white';
                            case 'advanced': return 'bg-blue-500 text-white';
                            case 'intermediate': return 'bg-yellow-500 text-white';
                            default: return 'bg-gray-500 text-white';
                          }
                        };
                        
                        return (
                          <div key={index} className="relative group">
                            <span className="inline-block bg-white border-2 border-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-default">
                              {skill.name}
                              {skill.proficiency && (
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getProficiencyColor(skill.proficiency)}`}>
                                  {skill.proficiency}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                      {skills.length > 8 && (
                        <span className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded-lg font-medium border-2 border-dashed border-gray-300">
                          +{skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {previewData.projects.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Featured Projects</h2>
              {previewData.projects.map((project, index) => (
                <div key={index} className="mb-8 last:mb-0 break-inside-avoid bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd"/>
                        </svg>
                        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                      </div>
                    </div>
                    {(project.start_date || project.startDate) && (
                      <span className={`${styles.textClass} text-sm font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full whitespace-nowrap ml-4`}>
                        {formatDateRange(project.start_date || project.startDate, project.end_date || project.endDate, project.is_current || project.isCurrent)}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
                      <p className={`${styles.textClass} text-base leading-relaxed text-gray-800`}>
                        {project.description}
                      </p>
                    </div>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Technologies Used:</h5>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(project.project_url || project.github_url) && (
                    <div className="flex space-x-3">
                      {project.project_url && (
                        <div className="flex items-center text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-lg font-semibold">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                          </svg>
                          Live Demo
                        </div>
                      )}
                      {project.github_url && (
                        <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg font-semibold">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                          </svg>
                          GitHub
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications Section */}
          {previewData.certifications.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewData.certifications.map((cert, index) => (
                  <div key={index} className="break-inside-avoid">
                    <h3 className="font-semibold text-gray-900 text-base">{cert.name}</h3>
                    <div className={`${styles.accentColor} text-sm`}>
                      {cert.issuer || cert.issuing_organization}
                    </div>
                    <div className={`${styles.textClass} text-sm`}>
                      {formatDate(cert.date_obtained || cert.dateObtained)}
                      {cert.expiry_date && ` - Expires: ${formatDate(cert.expiry_date)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {previewData.languages.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Languages</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewData.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center break-inside-avoid">
                    <span className={`${styles.textClass} font-medium`}>{lang.name}</span>
                    <span className={`${styles.accentColor} text-sm`}>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards Section */}
          {previewData.awards.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Awards & Achievements</h2>
              {previewData.awards.map((award, index) => (
                <div key={index} className="mb-4 last:mb-0 break-inside-avoid">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-base">{award.title}</h3>
                    <span className={`${styles.textClass} text-sm font-medium whitespace-nowrap ml-4`}>
                      {formatDate(award.date)}
                    </span>
                  </div>
                  <div className={`${styles.accentColor} text-sm mb-2`}>{award.issuer}</div>
                  {award.description && (
                    <p className={`${styles.textClass} text-sm leading-relaxed`}>
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* References Section */}
          {previewData.references.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>References</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previewData.references.map((ref, index) => (
                  <div key={index} className="break-inside-avoid">
                    <h3 className="font-semibold text-gray-900 text-base">{ref.name}</h3>
                    <div className={`${styles.accentColor} text-sm`}>
                      {ref.relationship} {ref.company && `at ${ref.company}`}
                    </div>
                    <div className={`${styles.textClass} text-sm space-y-1`}>
                      {ref.email && <div>📧 {ref.email}</div>}
                      {ref.phone && <div>📞 {ref.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <button 
          onClick={exportToPDF}
          disabled={isExporting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <span>📄</span>
              <span>Download PDF</span>
            </>
          )}
        </button>
        <button 
          onClick={printCV}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
        >
          <span>🖨️</span>
          <span>Print</span>
        </button>
      </div>

      {/* Template Info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Template: {getTemplateName(templateId)}
        {!isPremium && templateId <= 3 && (
          <span className="ml-2 text-yellow-600">• Includes Watermark</span>
        )}
        {isPremium && templateId > 3 && (
          <span className="ml-2 text-purple-600">• Premium Template</span>
        )}
      </div>
    </div>
  );

  function getTemplateName(id) {
    const names = {
      1: 'Professional Elite',
      2: 'Creative Master', 
      3: 'Minimalist Pro',
      4: 'Executive',
      5: 'Tech Modern',
      6: 'Designer Pro',
      7: 'Academic',
      8: 'International'
    };
    return names[id] || 'Professional Elite';
  }
};

export default CVPreview;
