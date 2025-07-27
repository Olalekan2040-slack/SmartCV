import React from 'react';

const TemplateSelector = ({ data, onUpdate, isPremium }) => {
  const selectedTemplate = data;

  const standardTemplates = [
    {
      id: 1,
      name: 'Professional',
      description: 'Clean and modern design perfect for corporate roles',
      preview: '/api/templates/preview/1',
      features: ['ATS-Friendly', 'Clean Layout', 'Professional Typography']
    },
    {
      id: 2,
      name: 'Creative',
      description: 'Stylish design with color accents for creative positions',
      preview: '/api/templates/preview/2',
      features: ['Color Accents', 'Modern Design', 'Visual Appeal']
    },
    {
      id: 3,
      name: 'Minimalist',
      description: 'Simple and elegant design focusing on content',
      preview: '/api/templates/preview/3',
      features: ['Clean Lines', 'Content Focus', 'Easy to Read']
    }
  ];

  const premiumTemplates = [
    {
      id: 4,
      name: 'Executive',
      description: 'Premium design for senior-level positions',
      preview: '/api/templates/preview/4',
      features: ['Premium Typography', 'Elegant Design', 'Executive Appeal'],
      premium: true
    },
    {
      id: 5,
      name: 'Tech Modern',
      description: 'Contemporary design perfect for tech professionals',
      preview: '/api/templates/preview/5',
      features: ['Modern Layout', 'Tech-Focused', 'Interactive Elements'],
      premium: true
    },
    {
      id: 6,
      name: 'Designer Pro',
      description: 'Showcase your creativity with this designer template',
      preview: '/api/templates/preview/6',
      features: ['Creative Layout', 'Visual Elements', 'Portfolio Integration'],
      premium: true
    },
    {
      id: 7,
      name: 'Academic',
      description: 'Perfect for academic and research positions',
      preview: '/api/templates/preview/7',
      features: ['Academic Format', 'Publication Ready', 'Research Focus'],
      premium: true
    },
    {
      id: 8,
      name: 'International',
      description: 'Global format suitable for international applications',
      preview: '/api/templates/preview/8',
      features: ['Global Format', 'Multi-language', 'Cultural Adaptable'],
      premium: true
    }
  ];

  const selectTemplate = (templateId) => {
    onUpdate(templateId);
  };

  const TemplateCard = ({ template, isSelected, canSelect }) => (
    <div
      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : canSelect
          ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          : 'border-gray-200 opacity-50 cursor-not-allowed'
      }`}
      onClick={() => canSelect && selectTemplate(template.id)}
    >
      {template.premium && !isPremium && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
          Premium
        </div>
      )}
      
      <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-gray-400 text-4xl">📄</div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">{template.name}</h3>
        <p className="text-sm text-gray-600">{template.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {template.features.map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        
        {isSelected && (
          <div className="flex items-center text-blue-600 text-sm font-medium mt-2">
            <span className="mr-1">✓</span>
            Selected
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Choose Your CV Template</h3>
        <p className="text-sm text-gray-600">Select a template that best represents your professional style</p>
      </div>

      {/* Standard Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Standard Templates</h4>
          <span className="text-sm text-gray-500">Free • Includes Watermark</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {standardTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              canSelect={true}
            />
          ))}
        </div>
        
        {!isPremium && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Note:</span> Standard templates include "Quadev SmartCV" watermark. 
              Upgrade to Premium to remove watermarks and access more templates.
            </p>
          </div>
        )}
      </div>

      {/* Premium Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            Premium Templates
            <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
              Premium
            </span>
          </h4>
          <span className="text-sm text-gray-500">No Watermarks • Premium Features</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {premiumTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              canSelect={isPremium}
            />
          ))}
        </div>
        
        {!isPremium && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-purple-500 text-xl mr-3">⭐</div>
              <div>
                <h5 className="font-medium text-purple-900 mb-2">Unlock Premium Templates</h5>
                <p className="text-sm text-purple-800 mb-3">
                  Get access to 5+ premium templates with no watermarks, advanced layouts, and exclusive designs.
                </p>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Features Comparison */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Template Features</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Feature</th>
                <th className="text-center py-2">Standard</th>
                <th className="text-center py-2">Premium</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-gray-100">
                <td className="py-2">Professional Templates</td>
                <td className="text-center py-2">3</td>
                <td className="text-center py-2">8+</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Watermark</td>
                <td className="text-center py-2">
                  <span className="text-red-600">✗</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">ATS-Friendly</td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">Custom Colors</td>
                <td className="text-center py-2">
                  <span className="text-yellow-600">Limited</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
              <tr>
                <td className="py-2">Advanced Layouts</td>
                <td className="text-center py-2">
                  <span className="text-red-600">✗</span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-600">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Template Selection Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose a template that matches your industry (creative vs. corporate)</li>
          <li>• Ensure the template is ATS-friendly for online applications</li>
          <li>• Consider the role level - minimalist for entry-level, executive for senior roles</li>
          <li>• Preview how your content looks before finalizing</li>
          <li>• You can change templates anytime during the editing process</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;
