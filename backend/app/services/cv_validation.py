from typing import List, Dict, Any
from app.schemas.schemas import CVBase, ValidationResponse
import re

class CVValidationService:
    """Service to validate CV data and provide suggestions."""
    
    def __init__(self):
        self.required_fields = {
            'personal_info': ['full_name', 'email', 'phone', 'profile_summary'],
            'education': ['school_name', 'degree', 'field_of_study', 'start_date'],
            'experience': ['job_title', 'company_name', 'start_date', 'job_description'],
            'skills': ['skill_name']
        }
        
        self.action_verbs = [
            'achieved', 'administered', 'analyzed', 'built', 'collaborated',
            'created', 'designed', 'developed', 'directed', 'enhanced',
            'established', 'executed', 'generated', 'implemented', 'improved',
            'increased', 'led', 'managed', 'optimized', 'organized',
            'planned', 'produced', 'reduced', 'resolved', 'streamlined'
        ]
    
    def validate_cv(self, cv_data: CVBase) -> ValidationResponse:
        """Validate CV data and return validation response."""
        missing_fields = []
        suggestions = []
        
        # Validate personal information
        missing_personal = self._validate_personal_info(cv_data.personal_info)
        missing_fields.extend(missing_personal)
        
        # Validate education (at least one required)
        if not cv_data.education:
            missing_fields.append("At least one education entry is required")
        else:
            for i, edu in enumerate(cv_data.education):
                missing_edu = self._validate_education(edu, i)
                missing_fields.extend(missing_edu)
        
        # Validate experience (preferred)
        if not cv_data.experience:
            suggestions.append("Consider adding work experience to strengthen your CV")
        else:
            for i, exp in enumerate(cv_data.experience):
                missing_exp = self._validate_experience(exp, i)
                missing_fields.extend(missing_exp)
                
                # Check job descriptions for action verbs
                exp_suggestions = self._suggest_experience_improvements(exp, i)
                suggestions.extend(exp_suggestions)
        
        # Validate skills
        if not cv_data.skills:
            missing_fields.append("Skills section is required")
        
        # General suggestions
        general_suggestions = self._get_general_suggestions(cv_data)
        suggestions.extend(general_suggestions)
        
        is_valid = len(missing_fields) == 0
        
        return ValidationResponse(
            is_valid=is_valid,
            missing_required_fields=missing_fields,
            suggestions=suggestions
        )
    
    def _validate_personal_info(self, personal_info) -> List[str]:
        """Validate personal information fields."""
        missing = []
        
        if not personal_info.full_name.strip():
            missing.append("Full name is required")
        
        if not personal_info.email:
            missing.append("Email is required")
        
        if not personal_info.phone.strip():
            missing.append("Phone number is required")
        
        if not personal_info.profile_summary.strip():
            missing.append("Profile summary is required")
        elif len(personal_info.profile_summary.split()) < 10:
            missing.append("Profile summary should be at least 10 words")
        
        return missing
    
    def _validate_education(self, education, index: int) -> List[str]:
        """Validate education entry."""
        missing = []
        prefix = f"Education {index + 1}: "
        
        if not education.school_name.strip():
            missing.append(f"{prefix}School name is required")
        
        if not education.degree.strip():
            missing.append(f"{prefix}Degree is required")
        
        if not education.field_of_study.strip():
            missing.append(f"{prefix}Field of study is required")
        
        if not education.start_date.strip():
            missing.append(f"{prefix}Start date is required")
        elif not self._validate_date_format(education.start_date):
            missing.append(f"{prefix}Start date must be in MM/YYYY format")
        
        if education.end_date and education.end_date != "Present":
            if not self._validate_date_format(education.end_date):
                missing.append(f"{prefix}End date must be in MM/YYYY format or 'Present'")
        
        return missing
    
    def _validate_experience(self, experience, index: int) -> List[str]:
        """Validate work experience entry."""
        missing = []
        prefix = f"Experience {index + 1}: "
        
        if not experience.job_title.strip():
            missing.append(f"{prefix}Job title is required")
        
        if not experience.company_name.strip():
            missing.append(f"{prefix}Company name is required")
        
        if not experience.start_date.strip():
            missing.append(f"{prefix}Start date is required")
        elif not self._validate_date_format(experience.start_date):
            missing.append(f"{prefix}Start date must be in MM/YYYY format")
        
        if experience.end_date and experience.end_date != "Present":
            if not self._validate_date_format(experience.end_date):
                missing.append(f"{prefix}End date must be in MM/YYYY format or 'Present'")
        
        if not experience.job_description or len(experience.job_description) < 2:
            missing.append(f"{prefix}At least 2 job description bullet points are required")
        
        return missing
    
    def _suggest_experience_improvements(self, experience, index: int) -> List[str]:
        """Suggest improvements for work experience."""
        suggestions = []
        prefix = f"Experience {index + 1}: "
        
        # Check for action verbs
        weak_descriptions = []
        for i, desc in enumerate(experience.job_description):
            first_word = desc.strip().split()[0].lower() if desc.strip() else ""
            if first_word not in self.action_verbs:
                weak_descriptions.append(i + 1)
        
        if weak_descriptions:
            suggestions.append(
                f"{prefix}Consider starting bullet points {weak_descriptions} with action verbs like: "
                f"{', '.join(self.action_verbs[:5])}, etc."
            )
        
        # Check for quantifiable achievements
        has_numbers = any(re.search(r'\d+', desc) for desc in experience.job_description)
        if not has_numbers:
            suggestions.append(
                f"{prefix}Try to include quantifiable achievements (numbers, percentages, etc.)"
            )
        
        return suggestions
    
    def _get_general_suggestions(self, cv_data: CVBase) -> List[str]:
        """Get general CV improvement suggestions."""
        suggestions = []
        
        # Check for optional but valuable sections
        if not cv_data.projects:
            suggestions.append("Consider adding projects to showcase your practical skills")
        
        if not cv_data.certifications:
            suggestions.append("Add relevant certifications to strengthen your credentials")
        
        if not cv_data.languages and len(cv_data.languages) < 2:
            suggestions.append("Consider adding language skills, especially if you're multilingual")
        
        # Check skills categorization
        if cv_data.skills and len(cv_data.skills) > 10:
            suggestions.append("Consider grouping your skills into categories (e.g., Programming, Soft Skills, Tools)")
        
        return suggestions
    
    def _validate_date_format(self, date_str: str) -> bool:
        """Validate date format (MM/YYYY)."""
        if not date_str or date_str == "Present":
            return True
        
        pattern = r'^\d{2}/\d{4}$'
        return bool(re.match(pattern, date_str))
    
    def improve_description(self, description: str) -> str:
        """Suggest improvements for job descriptions."""
        # Convert to bullet point if it's a paragraph
        if len(description) > 100 and '.' in description and not description.startswith('•'):
            sentences = description.split('.')
            bullet_points = [f"• {sentence.strip()}" for sentence in sentences if sentence.strip()]
            return '\n'.join(bullet_points)
        
        # Suggest action verb if not present
        first_word = description.strip().split()[0].lower() if description.strip() else ""
        if first_word not in self.action_verbs:
            suggested_verb = self.action_verbs[0]  # Default suggestion
            return f"Consider starting with an action verb like '{suggested_verb}': {description}"
        
        return description

# Global instance
cv_validator = CVValidationService()
