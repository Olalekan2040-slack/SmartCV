import React, { useState } from 'react';

const SkillsForm = ({ data, onUpdate, isPremium }) => {
  const [skills, setSkills] = useState(
    data.skills?.length > 0 ? data.skills : []
  );
  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState('technical');
  const [proficiencyLevel, setProficiencyLevel] = useState('intermediate');

  const skillCategories = [
    { value: 'technical', label: 'Technical Skills', icon: '💻' },
    { value: 'soft', label: 'Soft Skills', icon: '🤝' },
    { value: 'tools', label: 'Tools & Software', icon: '🛠️' },
    { value: 'languages', label: 'Programming Languages', icon: '⚡' },
    { value: 'other', label: 'Other Skills', icon: '🌟' }
  ];

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-red-100 text-red-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-blue-100 text-blue-800' },
    { value: 'expert', label: 'Expert', color: 'bg-green-100 text-green-800' }
  ];

  const predefinedSkills = {
    technical: [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
      'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Flask', 'Spring', 'Laravel',
      'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind CSS', 'TypeScript'
    ],
    tools: [
      'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'Terraform',
      'Visual Studio Code', 'IntelliJ IDEA', 'Figma', 'Adobe Creative Suite', 'Jira', 'Slack',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch'
    ],
    soft: [
      'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management',
      'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity', 'Public Speaking',
      'Mentoring', 'Conflict Resolution', 'Decision Making', 'Emotional Intelligence'
    ]
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    const skill = {
      id: Date.now(),
      name: newSkill.trim(),
      category: skillCategory,
      proficiency: proficiencyLevel
    };

    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    onUpdate('skills', updatedSkills);
    setNewSkill('');
  };

  const addPredefinedSkill = (skillName) => {
    if (skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
      return; // Skill already exists
    }

    const skill = {
      id: Date.now(),
      name: skillName,
      category: skillCategory,
      proficiency: proficiencyLevel
    };

    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    onUpdate('skills', updatedSkills);
  };

  const removeSkill = (skillId) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    setSkills(updatedSkills);
    onUpdate('skills', updatedSkills);
  };

  const updateSkillProficiency = (skillId, newProficiency) => {
    const updatedSkills = skills.map(skill =>
      skill.id === skillId ? { ...skill, proficiency: newProficiency } : skill
    );
    setSkills(updatedSkills);
    onUpdate('skills', updatedSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const getProficiencyColor = (proficiency) => {
    return proficiencyLevels.find(level => level.value === proficiency)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
        <p className="text-sm text-gray-600">Add your technical and soft skills (required)</p>
      </div>

      {/* Add New Skill */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h4 className="text-md font-medium text-gray-900">Add New Skill</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {skillCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency
            </label>
            <select
              value={proficiencyLevel}
              onChange={(e) => setProficiencyLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {proficiencyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter skill name"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addSkill}
              disabled={!newSkill.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Predefined Skills */}
        {skillCategory in predefinedSkills && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Add Popular Skills:</h5>
            <div className="flex flex-wrap gap-2">
              {predefinedSkills[skillCategory].map(skillName => (
                <button
                  key={skillName}
                  onClick={() => addPredefinedSkill(skillName)}
                  disabled={skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {skillName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills Display */}
      {skills.length > 0 ? (
        <div className="space-y-6">
          {skillCategories.map(category => {
            const categorySkills = groupedSkills[category.value] || [];
            if (categorySkills.length === 0) return null;

            return (
              <div key={category.value} className="space-y-3">
                <h4 className="text-md font-medium text-gray-900 flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.label} ({categorySkills.length})
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categorySkills.map(skill => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ×
                          </button>
                        </div>
                        
                        <select
                          value={skill.proficiency}
                          onChange={(e) => updateSkillProficiency(skill.id, e.target.value)}
                          className={`mt-1 text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getProficiencyColor(skill.proficiency)}`}
                        >
                          {proficiencyLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-4">⚡</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h4>
          <p className="text-gray-600">Add your skills using the form above to showcase your expertise</p>
        </div>
      )}

      {/* Validation */}
      {skills.length === 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">⚠️ Please add at least one skill to continue</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Skills Section</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include both technical and soft skills relevant to your target role</li>
          <li>• Be honest about your proficiency levels</li>
          <li>• Focus on skills that differentiate you from other candidates</li>
          <li>• Group similar skills together (e.g., programming languages, design tools)</li>
          <li>• Keep your skill list current and remove outdated technologies</li>
          <li>• {isPremium ? '✨ Premium: Get AI-powered skill recommendations based on your experience' : '⭐ Upgrade to Premium for AI-powered skill suggestions'}</li>
        </ul>
      </div>

      {/* Skill Summary */}
      {skills.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-2">📊 Skills Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-800">Total Skills:</span>
              <span className="ml-2 text-green-700">{skills.length}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Expert Level:</span>
              <span className="ml-2 text-green-700">{skills.filter(s => s.proficiency === 'expert').length}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Advanced:</span>
              <span className="ml-2 text-green-700">{skills.filter(s => s.proficiency === 'advanced').length}</span>
            </div>
            <div>
              <span className="font-medium text-green-800">Categories:</span>
              <span className="ml-2 text-green-700">{Object.keys(groupedSkills).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
