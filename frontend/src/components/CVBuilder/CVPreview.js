import React, { useMemo, useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './CVPreview.css';

const CVPreview = ({ data, templateId, isPremium }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef(null);

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

  // Template styles with enhanced multi-page support
  const getTemplateStyles = (templateId) => {
    const templates = {
      1: { // Professional
        containerClass: 'bg-white text-gray-900',
        headerClass: 'border-b-4 border-blue-600 pb-6 mb-6',
        sectionClass: 'mb-8 break-inside-avoid',
        titleClass: 'text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2',
        textClass: 'text-gray-700',
        accentColor: 'text-blue-600',
        nameClass: 'text-4xl font-bold text-gray-900 mb-2',
        titleTextClass: 'text-xl text-blue-600 mb-4'
      },
      2: { // Creative
        containerClass: 'bg-white text-gray-900',
        headerClass: 'bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg mb-6',
        sectionClass: 'mb-8 break-inside-avoid',
        titleClass: 'text-2xl font-bold text-purple-800 mb-4 border-l-4 border-purple-500 pl-4',
        textClass: 'text-gray-700',
        accentColor: 'text-purple-600',
        nameClass: 'text-4xl font-bold text-purple-900 mb-2',
        titleTextClass: 'text-xl text-purple-700 mb-4'
      },
      3: { // Minimalist
        containerClass: 'bg-white text-gray-900',
        headerClass: 'pb-8 mb-8 border-b border-gray-200',
        sectionClass: 'mb-10 break-inside-avoid',
        titleClass: 'text-xl font-semibold text-gray-900 mb-6 uppercase tracking-wider',
        textClass: 'text-gray-600',
        accentColor: 'text-gray-800',
        nameClass: 'text-4xl font-light text-gray-900 mb-2',
        titleTextClass: 'text-xl text-gray-600 mb-4'
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

  const printCV = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
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
              className="transform -rotate-45 text-6xl font-bold text-gray-200 opacity-20 select-none"
              style={{ fontSize: '4rem', zIndex: 1 }}
            >
              Quadev SmartCV
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
            <div className={`${styles.textClass} flex flex-wrap gap-4 text-base`}>
              {(previewData.personalInfo.email || previewData.personalInfo.email_address) && (
                <span className="flex items-center">
                  📧 {previewData.personalInfo.email || previewData.personalInfo.email_address}
                </span>
              )}
              {(previewData.personalInfo.phone || previewData.personalInfo.phone_number) && (
                <span className="flex items-center">
                  📞 {previewData.personalInfo.phone || previewData.personalInfo.phone_number}
                </span>
              )}
              {previewData.personalInfo.location && (
                <span className="flex items-center">
                  📍 {previewData.personalInfo.location}
                </span>
              )}
              {previewData.personalInfo.linkedin && (
                <span className="flex items-center">
                  💼 {previewData.personalInfo.linkedin}
                </span>
              )}
              {(previewData.personalInfo.website || previewData.personalInfo.portfolio_url) && (
                <span className="flex items-center">
                  🌐 {previewData.personalInfo.website || previewData.personalInfo.portfolio_url}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {(previewData.personalInfo.summary || previewData.personalInfo.professional_summary) && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Professional Summary</h2>
              <p className={`${styles.textClass} text-base leading-relaxed`}>
                {previewData.personalInfo.summary || previewData.personalInfo.professional_summary}
              </p>
            </div>
          )}

          {/* Experience Section */}
          {previewData.experience.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Professional Experience</h2>
              {previewData.experience.map((exp, index) => (
                <div key={index} className="mb-6 last:mb-0 break-inside-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.position || exp.job_title}
                    </h3>
                    <span className={`${styles.textClass} text-sm font-medium whitespace-nowrap ml-4`}>
                      {formatDateRange(exp.start_date || exp.startDate, exp.end_date || exp.endDate, exp.is_current || exp.isCurrent)}
                    </span>
                  </div>
                  <div className={`${styles.accentColor} font-medium mb-3`}>
                    {exp.company || exp.company_name} 
                    {(exp.location || exp.company_location) && ` • ${exp.location || exp.company_location}`}
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className={`${styles.textClass} text-base ml-6 space-y-2`}>
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="list-disc leading-relaxed">{item}</li>
                      ))}
                    </ul>
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
                <div key={index} className="mb-4 last:mb-0 break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree} {(edu.field_of_study || edu.field) && `in ${edu.field_of_study || edu.field}`}
                      </h3>
                      <div className={styles.accentColor}>
                        {edu.school || edu.institution} 
                        {edu.location && ` • ${edu.location}`}
                      </div>
                      {edu.gpa && (
                        <div className={`${styles.textClass} text-sm`}>
                          GPA: {edu.gpa}
                        </div>
                      )}
                      {edu.description && (
                        <div className={`${styles.textClass} text-sm mt-1`}>
                          {edu.description}
                        </div>
                      )}
                    </div>
                    <span className={`${styles.textClass} text-sm font-medium whitespace-nowrap ml-4`}>
                      {formatDateRange(edu.start_date || edu.startDate, edu.end_date || edu.endDate, edu.is_current || edu.isCurrent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {previewData.skills.length > 0 && (
            <div className={styles.sectionClass}>
              <h2 className={styles.titleClass}>Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  previewData.skills.reduce((acc, skill) => {
                    const category = skill.category || 'Other';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, skills]) => (
                  <div key={category} className="break-inside-avoid">
                    <h4 className={`${styles.accentColor} font-semibold mb-3 text-base`}>{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full border font-medium"
                        >
                          {skill.name}
                          {skill.proficiency && skill.proficiency !== 'Beginner' && (
                            <span className="ml-1 text-xs text-gray-500 font-normal">
                              • {skill.proficiency}
                            </span>
                          )}
                        </span>
                      ))}
                      {skills.length > 5 && (
                        <span className="text-sm text-gray-500 px-3 py-1 font-medium">
                          +{skills.length - 5} more
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
              <h2 className={styles.titleClass}>Projects</h2>
              {previewData.projects.map((project, index) => (
                <div key={index} className="mb-5 last:mb-0 break-inside-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    {(project.start_date || project.startDate) && (
                      <span className={`${styles.textClass} text-sm font-medium whitespace-nowrap ml-4`}>
                        {formatDateRange(project.start_date || project.startDate, project.end_date || project.endDate, project.is_current || project.isCurrent)}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className={`${styles.textClass} text-base mb-3 leading-relaxed`}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.project_url || project.github_url) && (
                    <div className="text-sm text-blue-600">
                      {project.project_url && <span>🔗 Live Demo</span>}
                      {project.project_url && project.github_url && <span className="mx-2">•</span>}
                      {project.github_url && <span>📂 GitHub</span>}
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
      1: 'Professional',
      2: 'Creative', 
      3: 'Minimalist',
      4: 'Executive',
      5: 'Tech Modern',
      6: 'Designer Pro',
      7: 'Academic',
      8: 'International'
    };
    return names[id] || 'Professional';
  }
};

export default CVPreview;
