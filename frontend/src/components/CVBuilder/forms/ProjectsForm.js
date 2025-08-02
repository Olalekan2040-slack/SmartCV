import React, { useState } from 'react';

const ProjectsForm = ({ data, onUpdate, isPremium }) => {
  const [projects, setProjects] = useState(
    data.projects?.length > 0 ? data.projects : []
  );
  const [errors, setErrors] = useState({});

  function createEmptyProject() {
    return {
      id: Date.now(),
      title: '',
      description: '',
      technologies: [],
      link: '',
      github_link: '',
      start_date: '',
      end_date: '',
      is_ongoing: false
    };
  }

  const validateProject = (project, index) => {
    const newErrors = { ...errors };
    const errorKey = `project_${index}`;
    const projectErrors = {};

    if (!project.title.trim()) {
      projectErrors.title = 'Project title is required';
    }

    if (!project.description.trim()) {
      projectErrors.description = 'Project description is required';
    } else if (project.description.length < 50) {
      projectErrors.description = 'Description should be at least 50 characters';
    }

    if (project.technologies.length === 0) {
      projectErrors.technologies = 'At least one technology is required';
    }

    if (project.link && !/^https?:\/\//.test(project.link)) {
      projectErrors.link = 'Please enter a valid URL';
    }

    if (project.github_link && !/^https?:\/\/(www\.)?github\.com\//.test(project.github_link)) {
      projectErrors.github_link = 'Please enter a valid GitHub URL';
    }

    if (Object.keys(projectErrors).length > 0) {
      newErrors[errorKey] = projectErrors;
    } else {
      delete newErrors[errorKey];
    }

    setErrors(newErrors);
    return Object.keys(projectErrors).length === 0;
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    
    if (field === 'is_ongoing') {
      updatedProjects[index][field] = value;
      if (value) {
        updatedProjects[index].end_date = '';
      }
    } else {
      updatedProjects[index][field] = value;
    }

    setProjects(updatedProjects);
    validateProject(updatedProjects[index], index);
    onUpdate('projects', updatedProjects);
  };

  const handleTechnologyAdd = (index, technology) => {
    if (!technology.trim()) return;
    
    const updatedProjects = [...projects];
    if (!updatedProjects[index].technologies.includes(technology.trim())) {
      updatedProjects[index].technologies.push(technology.trim());
      setProjects(updatedProjects);
      validateProject(updatedProjects[index], index);
      onUpdate('projects', updatedProjects);
    }
  };

  const handleTechnologyRemove = (index, techIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[index].technologies.splice(techIndex, 1);
    setProjects(updatedProjects);
    validateProject(updatedProjects[index], index);
    onUpdate('projects', updatedProjects);
  };

  const addProject = () => {
    const newProjects = [...projects, createEmptyProject()];
    setProjects(newProjects);
    onUpdate('projects', newProjects);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    onUpdate('projects', updatedProjects);
    
    // Clean up errors
    const newErrors = { ...errors };
    delete newErrors[`project_${index}`];
    Object.keys(newErrors).forEach(key => {
      if (key.startsWith('project_')) {
        const errorIndex = parseInt(key.split('_')[1]);
        if (errorIndex > index) {
          newErrors[`project_${errorIndex - 1}`] = newErrors[key];
          delete newErrors[key];
        }
      }
    });
    setErrors(newErrors);
  };

  const formatDateInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 6);
    }
    return numbers;
  };

  const commonTechnologies = [
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Django', 'Flask',
    'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift',
    'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git', 'Jenkins', 'Terraform'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Projects</h3>
          <p className="text-sm text-gray-600">Showcase your best projects (optional but recommended)</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-4">🚀</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No projects added yet</h4>
          <p className="text-gray-600 mb-4">Projects help demonstrate your practical skills and experience</p>
          <button
            onClick={addProject}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">
                  Project {index + 1}
                </h4>
                <button
                  onClick={() => removeProject(index)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`project_${index}`]?.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="E-commerce Website"
                  />
                  {errors[`project_${index}`]?.title && (
                    <p className="mt-1 text-sm text-red-600">{errors[`project_${index}`].title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`project_${index}`]?.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Describe what the project does, your role, key features, and impact..."
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors[`project_${index}`]?.description ? (
                      <p className="text-sm text-red-600">{errors[`project_${index}`].description}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Describe the project and your contributions</p>
                    )}
                    <span className="text-sm text-gray-400">{project.description.length}/500</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies Used <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tech}
                          <button
                            onClick={() => handleTechnologyRemove(index, techIndex)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {commonTechnologies
                        .filter(tech => !project.technologies.includes(tech))
                        .slice(0, 10)
                        .map(tech => (
                          <button
                            key={tech}
                            onClick={() => handleTechnologyAdd(index, tech)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                          >
                            + {tech}
                          </button>
                        ))}
                    </div>
                    
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add custom technology..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTechnologyAdd(index, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          handleTechnologyAdd(index, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {errors[`project_${index}`]?.technologies && (
                    <p className="mt-1 text-sm text-red-600">{errors[`project_${index}`].technologies}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Link
                    </label>
                    <input
                      type="url"
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`project_${index}`]?.link ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://yourproject.com"
                    />
                    {errors[`project_${index}`]?.link && (
                      <p className="mt-1 text-sm text-red-600">{errors[`project_${index}`].link}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Link
                    </label>
                    <input
                      type="url"
                      value={project.github_link}
                      onChange={(e) => handleProjectChange(index, 'github_link', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`project_${index}`]?.github_link ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://github.com/username/project"
                    />
                    {errors[`project_${index}`]?.github_link && (
                      <p className="mt-1 text-sm text-red-600">{errors[`project_${index}`].github_link}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={project.start_date}
                      onChange={(e) => handleProjectChange(index, 'start_date', formatDateInput(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YYYY"
                      maxLength="7"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={project.end_date}
                      onChange={(e) => handleProjectChange(index, 'end_date', formatDateInput(e.target.value))}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        project.is_ongoing ? 'bg-gray-100' : ''
                      }`}
                      placeholder="MM/YYYY"
                      maxLength="7"
                      disabled={project.is_ongoing}
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={project.is_ongoing}
                        onChange={(e) => handleProjectChange(index, 'is_ongoing', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Ongoing project</span>
                    </label>
                  </div>
                </div>
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
                <strong>Project {key.split('_')[1] ? parseInt(key.split('_')[1]) + 1 : ''}:</strong>
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
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Projects Section</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose projects that best demonstrate your skills for your target role</li>
          <li>• Include both personal and professional projects</li>
          <li>• Describe the problem you solved and the impact of your solution</li>
          <li>• Mention specific technologies and methodologies used</li>
          <li>• Provide links to live demos or source code when possible</li>
          <li>• Quantify results where possible (e.g., "Reduced load time by 40%")</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectsForm;
