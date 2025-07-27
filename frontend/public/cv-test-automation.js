// CV Builder Test Automation Script
// This script will automatically fill in your CV data and test all templates

const cvTestData = {
  personalInfo: {
    fullName: "Sharafdeen Quadri Olalekan",
    title: "Software Developer & Tech Educator",
    email: "olalekanquadri58@gmail.com",
    phone: "09050829691",
    location: "Akure, Ondo State, Nigeria",
    linkedin: "linkedin.com/in/yourprofile",
    github: "github.com/yourusername",
    website: "",
    summary: "Innovative and detail-oriented Software Developer with expertise in Python, Django, Flask, FastAPI, and full-stack web development. Proficient in building dynamic web applications, API development, task automation with Selenium, and data-driven solutions. Currently contributing as a Junior Python Developer at Bincom Dev Center, delivering scalable projects within Agile teams. Experienced tech educator with a background in training students across various levels in software development, AI, and digital literacy. Successfully managed educational faculties and currently lead a tech hub, driving community-based initiatives, scholarship programs, and tech outreach. Committed to leveraging technology for problem-solving and capacity building."
  },
  
  experience: [
    {
      position: "Junior Python Developer",
      company: "Bincom Dev Center",
      location: "Remote",
      startDate: "2024-10-01",
      endDate: "",
      isCurrent: true,
      description: [
        "Contributed to backend development and debugging using Python and Django",
        "Collaborated on projects in an Agile environment, participating in code reviews and sprints",
        "Engaged in version control with Git and worked on automation and API tasks"
      ]
    },
    {
      position: "Tech Hub Manager",
      company: "N-Tech Innovation Hub",
      location: "Osogbo, Osun State",
      startDate: "2024-08-01",
      endDate: "",
      isCurrent: true,
      description: [
        "Managed the operations of a community tech hub",
        "Organized training programs, scholarship assessments, and tech outreach",
        "Supervised internship interviews and partnerships with schools and universities",
        "Facilitated branding initiatives and student engagement campaigns"
      ]
    },
    {
      position: "ICT/AI Instructor & Faculty Manager",
      company: "ICTinSchool/Mabest Academy",
      location: "Akure, Ondo State",
      startDate: "2023-02-01",
      endDate: "2024-08-01",
      isCurrent: false,
      description: [
        "Taught AI, Python, Full Stack Web Development (HTML, CSS, JS) to students",
        "Led curriculum planning and project supervision",
        "Managed entire faculty operations and coordinated tech classes across departments"
      ]
    },
    {
      position: "Tech Instructor (Intern)",
      company: "Medmina College",
      location: "Ibadan, Oyo State",
      startDate: "2022-01-01",
      endDate: "2022-12-31",
      isCurrent: false,
      description: [
        "Conducted training on digital tools and programming basics for secondary school students",
        "Engaged students in tech projects and practical assessments"
      ]
    }
  ],
  
  education: [
    {
      degree: "MSc",
      fieldOfStudy: "Business Administration",
      institution: "Fountain University",
      location: "Osogbo",
      startDate: "2023-01-01",
      endDate: "",
      isCurrent: true,
      gpa: "",
      description: "Thesis Topic: Exploring the Impact of Digital Transformation on Business Strategy: A Case Study of Small and Medium-Sized Enterprises (SMEs) in Nigeria"
    },
    {
      degree: "BSc",
      fieldOfStudy: "Political Science and Public Administration",
      institution: "Fountain University",
      location: "Osogbo",
      startDate: "2016-01-01",
      endDate: "2020-12-31",
      isCurrent: false,
      gpa: "",
      description: ""
    }
  ],
  
  skills: [
    { name: "Python", category: "Programming Languages", proficiency: "Expert" },
    { name: "Django", category: "Frameworks", proficiency: "Advanced" },
    { name: "Flask", category: "Frameworks", proficiency: "Advanced" },
    { name: "FastAPI", category: "Frameworks", proficiency: "Advanced" },
    { name: "HTML", category: "Web Technologies", proficiency: "Advanced" },
    { name: "CSS", category: "Web Technologies", proficiency: "Advanced" },
    { name: "JavaScript", category: "Programming Languages", proficiency: "Intermediate" },
    { name: "Selenium", category: "Automation", proficiency: "Advanced" },
    { name: "REST API Development", category: "Backend", proficiency: "Advanced" },
    { name: "Git", category: "Version Control", proficiency: "Advanced" },
    { name: "SQL", category: "Databases", proficiency: "Intermediate" },
    { name: "SQLite", category: "Databases", proficiency: "Intermediate" },
    { name: "Data Science", category: "Analytics", proficiency: "Beginner" },
    { name: "Agile Development", category: "Methodologies", proficiency: "Intermediate" },
    { name: "Teaching", category: "Soft Skills", proficiency: "Expert" },
    { name: "Leadership", category: "Soft Skills", proficiency: "Advanced" }
  ],
  
  projects: [
    {
      name: "CV Builder App",
      description: "FastAPI-based backend with user registration, email confirmation, CV upload, and feedback system",
      technologies: ["FastAPI", "Python", "PostgreSQL", "React"],
      startDate: "2024-06-01",
      endDate: "",
      isCurrent: true,
      projectUrl: "",
      githubUrl: ""
    },
    {
      name: "Web Automation Scripts",
      description: "Built automation tools using Selenium for scraping and task automation",
      technologies: ["Python", "Selenium", "BeautifulSoup"],
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      isCurrent: false,
      projectUrl: "",
      githubUrl: ""
    },
    {
      name: "Tech Scholarship Portal",
      description: "Designed a scholarship system where applicants take a test and get partial funding based on performance",
      technologies: ["Django", "Python", "SQLite", "HTML", "CSS"],
      startDate: "2023-06-01",
      endDate: "2024-01-31",
      isCurrent: false,
      projectUrl: "",
      githubUrl: ""
    },
    {
      name: "Student Tech Bootcamp",
      description: "Led an Osogbo-based bootcamp for primary and secondary students in Python and Web Development",
      technologies: ["Python", "HTML", "CSS", "JavaScript"],
      startDate: "2024-03-01",
      endDate: "2024-07-31",
      isCurrent: false,
      projectUrl: "",
      githubUrl: ""
    }
  ],
  
  certifications: [
    {
      name: "Diploma in Software Engineering",
      issuer: "Professional Institute",
      dateObtained: "2023-12-01",
      expiryDate: "",
      credentialId: "",
      credentialUrl: ""
    },
    {
      name: "Diploma in Data Science",
      issuer: "Professional Institute", 
      dateObtained: "2024-01-15",
      expiryDate: "",
      credentialId: "",
      credentialUrl: ""
    },
    {
      name: "Python Development Apprenticeship",
      issuer: "Bincom Dev Center",
      dateObtained: "2024-09-30",
      expiryDate: "",
      credentialId: "",
      credentialUrl: ""
    },
    {
      name: "3MTT Program Certificate",
      issuer: "Federal Government of Nigeria",
      dateObtained: "2024-05-01",
      expiryDate: "",
      credentialId: "",
      credentialUrl: ""
    }
  ],
  
  languages: [
    { name: "English", proficiency: "Fluent" },
    { name: "Yoruba", proficiency: "Native" }
  ],
  
  awards: [
    {
      title: "Outstanding Faculty Manager",
      issuer: "ICTinSchool/Mabest Academy",
      date: "2024-07-01",
      description: "Recognized for exceptional leadership in managing tech education programs"
    },
    {
      title: "Community Tech Leadership Award",
      issuer: "N-Tech Innovation Hub",
      date: "2024-10-01",
      description: "Awarded for driving tech outreach and community development initiatives"
    }
  ],
  
  references: [
    {
      name: "Dr. Ahmed Hassan",
      relationship: "Academic Supervisor",
      company: "Fountain University",
      email: "ahmed.hassan@fountainuniversity.edu.ng",
      phone: "08012345678",
      allowContact: true
    },
    {
      name: "Eng. Biodun Ogundimu",
      relationship: "Senior Developer",
      company: "Bincom Dev Center",
      email: "biodun@bincom.dev",
      phone: "08098765432",
      allowContact: true
    }
  ]
};

// Function to fill form fields
function fillFormField(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`✅ Filled: ${selector} = ${value}`);
  } else {
    console.log(`❌ Element not found: ${selector}`);
  }
}

// Function to click button
function clickButton(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.click();
    console.log(`✅ Clicked: ${selector}`);
    return true;
  } else {
    console.log(`❌ Button not found: ${selector}`);
    return false;
  }
}

// Function to wait for element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function checkElement() {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkElement, 100);
      }
    }
    
    checkElement();
  });
}

// Function to fill personal info
async function fillPersonalInfo() {
  console.log('📝 Filling Personal Information...');
  
  try {
    // Wait for any personal info field to be available
    const selectors = [
      'input[name="full_name"]',
      'input[name="fullName"]', 
      'input[name="email"]'
    ];
    
    let foundElement = null;
    for (const selector of selectors) {
      try {
        foundElement = await waitForElement(selector, 2000);
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!foundElement) {
      console.log('⚠️ Personal info form not found');
      return;
    }
    
    // Try both naming conventions
    fillFormField('input[name="full_name"]', cvTestData.personalInfo.fullName);
    fillFormField('input[name="fullName"]', cvTestData.personalInfo.fullName);
    
    fillFormField('input[name="title"]', cvTestData.personalInfo.title);
    fillFormField('input[name="professional_title"]', cvTestData.personalInfo.title);
    
    fillFormField('input[name="email"]', cvTestData.personalInfo.email);
    fillFormField('input[name="email_address"]', cvTestData.personalInfo.email);
    
    fillFormField('input[name="phone"]', cvTestData.personalInfo.phone);
    fillFormField('input[name="phone_number"]', cvTestData.personalInfo.phone);
    
    fillFormField('input[name="location"]', cvTestData.personalInfo.location);
    fillFormField('input[name="address"]', cvTestData.personalInfo.location);
    
    fillFormField('input[name="linkedin"]', cvTestData.personalInfo.linkedin);
    fillFormField('input[name="github"]', cvTestData.personalInfo.github);
    fillFormField('input[name="website"]', cvTestData.personalInfo.website);
    fillFormField('input[name="portfolio"]', cvTestData.personalInfo.website);
    
    fillFormField('textarea[name="summary"]', cvTestData.personalInfo.summary);
    fillFormField('textarea[name="professional_summary"]', cvTestData.personalInfo.summary);
    
    console.log('✅ Personal information filled successfully');
  } catch (error) {
    console.error('❌ Error filling personal info:', error);
  }
}

// Function to fill experience
async function fillExperience() {
  console.log('💼 Filling Work Experience...');
  
  for (let i = 0; i < cvTestData.experience.length; i++) {
    const exp = cvTestData.experience[i];
    
    // Add new experience if needed
    if (i > 0) {
      const addButton = document.querySelector('[data-testid="add-experience"]');
      if (addButton) addButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const prefix = `experience_${i}`;
    fillFormField(`input[name="${prefix}_position"]`, exp.position);
    fillFormField(`input[name="${prefix}_company"]`, exp.company);
    fillFormField(`input[name="${prefix}_location"]`, exp.location);
    fillFormField(`input[name="${prefix}_startDate"]`, exp.startDate);
    
    if (!exp.isCurrent) {
      fillFormField(`input[name="${prefix}_endDate"]`, exp.endDate);
    } else {
      const currentCheckbox = document.querySelector(`input[name="${prefix}_isCurrent"]`);
      if (currentCheckbox && !currentCheckbox.checked) {
        currentCheckbox.click();
      }
    }
    
    // Fill description points
    exp.description.forEach((desc, idx) => {
      fillFormField(`input[name="${prefix}_description_${idx}"]`, desc);
    });
  }
  
  console.log('✅ Work experience filled successfully');
}

// Enhanced function to test all templates
async function testAllTemplates() {
  console.log('🎨 Testing All Templates...');
  
  // First, try to go to template selection step
  const templateStepSelectors = [
    '[data-step="0"]',
    'button:contains("Template")',
    'button[class*="step"]:first-child',
    '.step-button:first-child',
    'button[aria-label*="template" i]'
  ];
  
  let templateStepFound = false;
  for (const selector of templateStepSelectors) {
    try {
      const templateStep = document.querySelector(selector);
      if (templateStep) {
        templateStep.click();
        console.log('📍 Navigated to template selection');
        templateStepFound = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // Find all template cards using multiple selectors
  const templateSelectors = [
    '[data-template-id]',
    '.template-card',
    'div[class*="template"]:not([class*="selector"])',
    'button[class*="template"]',
    'div[class*="border"]:has(div[class*="aspect"])', // Template cards with aspect ratio
    '[role="button"][class*="border-2"]',
    'div[class*="cursor-pointer"][class*="border"]'
  ];
  
  let allTemplates = [];
  templateSelectors.forEach(selector => {
    try {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        console.log(`Found ${found.length} templates with selector: ${selector}`);
        allTemplates = [...allTemplates, ...Array.from(found)];
      }
    } catch (e) {
      console.log(`❌ Selector failed: ${selector}`);
    }
  });
  
  // Remove duplicates
  allTemplates = [...new Set(allTemplates)];
  console.log(`📊 Total unique templates found: ${allTemplates.length}`);
  
  if (allTemplates.length === 0) {
    console.log('🔍 No templates found, checking page structure...');
    console.log('Available elements:', document.body.innerHTML.substring(0, 500));
    return;
  }
  
  // Test each template
  for (let i = 0; i < allTemplates.length; i++) {
    const template = allTemplates[i];
    try {
      console.log(`🔄 Testing Template ${i + 1}/${allTemplates.length}...`);
      
      // Scroll template into view
      template.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Click template
      template.click();
      console.log(`✅ Clicked template ${i + 1}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if preview updated
      const previewElements = [
        '.cv-preview',
        '[class*="preview"]',
        '[class*="cv-"]',
        'div[class*="bg-white"][class*="shadow"]'
      ];
      
      let previewFound = false;
      for (const previewSelector of previewElements) {
        const preview = document.querySelector(previewSelector);
        if (preview && preview.textContent.includes('Sharafdeen')) {
          console.log(`📸 Template ${i + 1}: ✅ Your data is visible in preview!`);
          previewFound = true;
          break;
        }
      }
      
      if (!previewFound) {
        console.log(`📸 Template ${i + 1}: ⚠️ Preview not found or data not visible`);
      }
      
      // Check for watermark (standard templates)
      const hasWatermark = document.body.textContent.includes('Quadev SmartCV');
      if (hasWatermark) {
        console.log(`🔸 Template ${i + 1}: Standard template (has watermark)`);
      } else {
        console.log(`⭐ Template ${i + 1}: Premium template (no watermark)`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing template ${i + 1}:`, error);
    }
  }
  
  console.log('✅ All templates tested successfully!');
}

// Main automation function
async function runCVAutomation() {
  console.log('🚀 Starting CV Builder Automation...');
  
  try {
    // Wait for page to load
    await waitForElement('.cv-builder-container', 10000);
    
    // Step 1: Select first template
    console.log('1️⃣ Selecting initial template...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const firstTemplate = document.querySelector('[data-template-id="1"]');
    if (firstTemplate) firstTemplate.click();
    
    // Step 2: Go to Personal Info and fill
    console.log('2️⃣ Moving to Personal Info...');
    clickButton('[data-step="1"]');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fillPersonalInfo();
    
    // Step 3: Move through all steps and fill data
    const steps = [
      { step: 2, name: 'Education', data: cvTestData.education },
      { step: 3, name: 'Experience', data: cvTestData.experience },
      { step: 4, name: 'Skills', data: cvTestData.skills },
      { step: 5, name: 'Projects', data: cvTestData.projects },
      { step: 6, name: 'Certifications', data: cvTestData.certifications },
      { step: 7, name: 'Languages', data: cvTestData.languages },
      { step: 8, name: 'Awards', data: cvTestData.awards },
      { step: 9, name: 'References', data: cvTestData.references }
    ];
    
    for (const stepInfo of steps) {
      console.log(`${stepInfo.step + 1}️⃣ Filling ${stepInfo.name}...`);
      clickButton(`[data-step="${stepInfo.step}"]`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fill specific step data (you can customize this based on your form structure)
      if (stepInfo.step === 3) {
        await fillExperience();
      }
      // Add more specific filling logic for other steps as needed
    }
    
    // Step 4: Test all templates
    await testAllTemplates();
    
    console.log('🎉 CV Builder Automation Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Automation failed:', error);
  }
}

// Enhanced navigation function
async function navigateAndFillSections() {
  console.log('🧭 Enhanced navigation through CV sections...');
  
  const sections = [
    { name: 'Personal Info', selectors: ['[data-step="1"]', 'button:contains("Personal")', 'button:contains("Info")'] },
    { name: 'Education', selectors: ['[data-step="2"]', 'button:contains("Education")'] },
    { name: 'Experience', selectors: ['[data-step="3"]', 'button:contains("Experience")', 'button:contains("Work")'] },
    { name: 'Skills', selectors: ['[data-step="4"]', 'button:contains("Skills")'] },
    { name: 'Projects', selectors: ['[data-step="5"]', 'button:contains("Projects")'] },
    { name: 'Certifications', selectors: ['[data-step="6"]', 'button:contains("Certifications")'] },
    { name: 'Languages', selectors: ['[data-step="7"]', 'button:contains("Languages")'] },
    { name: 'Awards', selectors: ['[data-step="8"]', 'button:contains("Awards")'] },
    { name: 'References', selectors: ['[data-step="9"]', 'button:contains("References")'] }
  ];
  
  // First, try to find any navigation elements
  const navSelectors = [
    '[class*="step"]',
    'button[class*="step"]',
    '.wizard-navigation button',
    '[role="tablist"] button',
    'button[aria-selected]',
    'nav button',
    '.nav-button'
  ];
  
  let allNavElements = [];
  navSelectors.forEach(selector => {
    try {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        console.log(`Found ${found.length} navigation elements with: ${selector}`);
        allNavElements = [...allNavElements, ...Array.from(found)];
      }
    } catch (e) {
      // Continue
    }
  });
  
  allNavElements = [...new Set(allNavElements)];
  console.log(`📊 Total navigation elements found: ${allNavElements.length}`);
  
  if (allNavElements.length === 0) {
    console.log('⚠️ No navigation elements found. Checking page structure...');
    const buttons = document.querySelectorAll('button');
    console.log(`Found ${buttons.length} total buttons on page`);
    Array.from(buttons).slice(0, 10).forEach((btn, i) => {
      console.log(`Button ${i + 1}: "${btn.textContent.trim()}" - Classes: ${btn.className}`);
    });
    return;
  }
  
  // Try to navigate through sections
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(`${i + 1}️⃣ Trying to navigate to ${section.name}...`);
    
    let navigationSuccessful = false;
    
    // Try each selector for this section
    for (const selector of section.selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(resolve => setTimeout(resolve, 300));
          element.click();
          console.log(`✅ Clicked ${section.name} using selector: ${selector}`);
          navigationSuccessful = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!navigationSuccessful) {
      // Try to find button by text content
      const allButtons = document.querySelectorAll('button');
      for (const button of allButtons) {
        if (button.textContent.toLowerCase().includes(section.name.toLowerCase())) {
          button.click();
          console.log(`✅ Found ${section.name} by text content`);
          navigationSuccessful = true;
          break;
        }
      }
    }
    
    if (navigationSuccessful) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to fill section-specific data
      if (section.name === 'Personal Info') {
        await fillPersonalInfo();
      } else if (section.name === 'Experience') {
        await fillExperience();
      }
      
      console.log(`✅ ${section.name} section processed`);
    } else {
      console.log(`⚠️ Could not navigate to ${section.name}`);
    }
  }
  
  console.log('🎉 Navigation through sections completed!');
}

// Quick comprehensive test function
async function runCompleteTest() {
  console.log('🚀 Starting Complete CV Builder Test...');
  
  try {
    console.log('Step 1: Filling personal information...');
    await fillPersonalInfo();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Step 2: Testing all templates...');
    await testAllTemplates();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Step 3: Navigating through sections...');
    await navigateAndFillSections();
    
    console.log('🎉 Complete test finished! Check the results above.');
    
  } catch (error) {
    console.error('❌ Complete test failed:', error);
  }
}

// Debug function to analyze page structure
function debugPageStructure() {
  console.log('🔍 Analyzing CV Builder page structure...');
  
  // Check for main container
  const containers = document.querySelectorAll('div[class*="cv"], div[class*="builder"], div[class*="wizard"]');
  console.log(`📦 Found ${containers.length} potential CV builder containers`);
  
  // Check for forms
  const forms = document.querySelectorAll('form, div[class*="form"]');
  console.log(`📝 Found ${forms.length} forms on page`);
  
  // Check for inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  console.log(`📥 Found ${inputs.length} input fields`);
  
  // Check for buttons
  const buttons = document.querySelectorAll('button');
  console.log(`🔘 Found ${buttons.length} buttons`);
  
  // Show first few button texts
  Array.from(buttons).slice(0, 10).forEach((btn, i) => {
    console.log(`  Button ${i + 1}: "${btn.textContent.trim()}"`);
  });
  
  // Check current URL
  console.log(`🌐 Current URL: ${window.location.href}`);
  
  // Check if we're on the right page
  const pageTitle = document.title;
  console.log(`📄 Page title: ${pageTitle}`);
  
  return {
    containers: containers.length,
    forms: forms.length,
    inputs: inputs.length,
    buttons: buttons.length,
    url: window.location.href,
    title: pageTitle
  };
}

// Export for use in browser console
window.cvTestData = cvTestData;
window.runCVAutomation = runCVAutomation;
window.runCompleteTest = runCompleteTest;
window.fillPersonalInfo = fillPersonalInfo;
window.testAllTemplates = testAllTemplates;
window.navigateAndFillSections = navigateAndFillSections;
window.debugPageStructure = debugPageStructure;

console.log('📋 Enhanced CV Test Automation Loaded!');
console.log('💡 Available Functions:');
console.log('  🚀 runCompleteTest() - Complete automated test');
console.log('  📝 fillPersonalInfo() - Fill personal information');
console.log('  🎨 testAllTemplates() - Test all available templates');
console.log('  🧭 navigateAndFillSections() - Navigate through sections');
console.log('  🔍 debugPageStructure() - Analyze page structure');
console.log('  📊 cvTestData - Access your CV data object');
console.log('');
console.log('🎯 Quick Start: Just run runCompleteTest() for full automation!');
