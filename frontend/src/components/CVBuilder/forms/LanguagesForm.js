import React, { useState } from 'react';

const LanguagesForm = ({ data, onUpdate, isPremium }) => {
  const [languages, setLanguages] = useState(
    data.languages?.length > 0 ? data.languages : []
  );

  const proficiencyLevels = [
    { value: 'basic', label: 'Basic', description: 'Can understand and use familiar everyday expressions' },
    { value: 'conversational', label: 'Conversational', description: 'Can handle most social exchanges and work discussions' },
    { value: 'fluent', label: 'Fluent', description: 'Can express ideas fluently and spontaneously' },
    { value: 'native', label: 'Native', description: 'Mother tongue or equivalent proficiency' }
  ];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese (Mandarin)',
    'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian', 'Dutch', 'Swedish', 'Norwegian'
  ];

  const addLanguage = (languageName = '', proficiency = 'conversational') => {
    const newLanguage = {
      id: Date.now(),
      language: languageName,
      proficiency: proficiency
    };

    const updatedLanguages = [...languages, newLanguage];
    setLanguages(updatedLanguages);
    onUpdate('languages', updatedLanguages);
  };

  const updateLanguage = (id, field, value) => {
    const updatedLanguages = languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    setLanguages(updatedLanguages);
    onUpdate('languages', updatedLanguages);
  };

  const removeLanguage = (id) => {
    const updatedLanguages = languages.filter(lang => lang.id !== id);
    setLanguages(updatedLanguages);
    onUpdate('languages', updatedLanguages);
  };

  const getProficiencyColor = (proficiency) => {
    const colors = {
      basic: 'bg-red-100 text-red-800',
      conversational: 'bg-yellow-100 text-yellow-800',
      fluent: 'bg-blue-100 text-blue-800',
      native: 'bg-green-100 text-green-800'
    };
    return colors[proficiency] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          <p className="text-sm text-gray-600">Add languages you speak (optional)</p>
        </div>
        <button
          onClick={() => addLanguage()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <span>+</span>
          <span>Add Language</span>
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-4xl mb-4">🌍</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No languages added yet</h4>
          <p className="text-gray-600 mb-4">Multilingual skills are valuable in today's global workplace</p>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Popular languages:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {commonLanguages.slice(0, 8).map(lang => (
                <button
                  key={lang}
                  onClick={() => addLanguage(lang)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => addLanguage()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Language
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {languages.map((language) => (
            <div key={language.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={language.language}
                    onChange={(e) => updateLanguage(language.id, 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter language"
                    list={`languages-${language.id}`}
                  />
                  <datalist id={`languages-${language.id}`}>
                    {commonLanguages.map(lang => (
                      <option key={lang} value={lang} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {proficiencyLevels.find(l => l.value === language.proficiency)?.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm rounded-full ${getProficiencyColor(language.proficiency)}`}>
                    {proficiencyLevels.find(l => l.value === language.proficiency)?.label}
                  </span>
                  <button
                    onClick={() => removeLanguage(language.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Languages</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be honest about your proficiency levels</li>
          <li>• Include both spoken and written proficiency if they differ significantly</li>
          <li>• Native language proficiency is valuable even if it's not English</li>
          <li>• Language skills can be a significant differentiator in global companies</li>
          <li>• Consider adding languages you're currently learning</li>
        </ul>
      </div>
    </div>
  );
};

export default LanguagesForm;
