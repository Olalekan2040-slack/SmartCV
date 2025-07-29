from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_premium: bool
    two_factor_enabled: bool
    email_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# 2FA Schemas
class TwoFactorSetupRequest(BaseModel):
    password: str  # Current password for verification

class TwoFactorSetupResponse(BaseModel):
    message: str
    backup_codes: Optional[List[str]] = None

class TwoFactorVerifyRequest(BaseModel):
    email: EmailStr
    password: str
    verification_code: str

class TwoFactorLoginRequest(BaseModel):
    email: EmailStr
    verification_code: str

class TwoFactorDisableRequest(BaseModel):
    password: str
    verification_code: str

class EmailVerificationRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class TwoFactorStatus(BaseModel):
    two_factor_enabled: bool
    email_verified: bool

# Personal Information Schema
class PersonalInfo(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    profile_summary: str
    
    @validator('profile_summary')
    def validate_summary_length(cls, v):
        if len(v.split()) < 10:
            raise ValueError('Profile summary should be at least 10 words')
        return v

# Education Schema
class Education(BaseModel):
    school_name: str
    degree: str
    field_of_study: str
    start_date: str  # MM/YYYY format
    end_date: Optional[str] = None  # MM/YYYY or "Present"
    grade: Optional[str] = None
    location: Optional[str] = None
    
    @validator('start_date', 'end_date')
    def validate_date_format(cls, v):
        if v and v != "Present":
            import re
            if not re.match(r'^\d{2}/\d{4}$', v):
                raise ValueError('Date must be in MM/YYYY format')
        return v

# Work Experience Schema
class WorkExperience(BaseModel):
    job_title: str
    company_name: str
    start_date: str  # MM/YYYY format
    end_date: Optional[str] = None  # MM/YYYY or "Present"
    job_description: List[str]  # Bullet points
    location: Optional[str] = None
    
    @validator('job_description')
    def validate_job_description(cls, v):
        if len(v) < 2:
            raise ValueError('Job description should have at least 2 bullet points')
        return v

# Skills Schema
class Skill(BaseModel):
    skill_name: str
    proficiency_level: Optional[str] = None  # Beginner/Intermediate/Expert

# Project Schema
class Project(BaseModel):
    project_title: str
    description: str
    technologies_used: List[str]
    link: Optional[str] = None

# Certification Schema
class Certification(BaseModel):
    certificate_name: str
    issuer: str
    date_issued: str  # MM/YYYY format
    credential_url: Optional[str] = None

# Language Schema
class Language(BaseModel):
    language: str
    proficiency: str  # Basic/Fluent/Native

# Achievement Schema
class Achievement(BaseModel):
    title: str
    description: Optional[str] = None
    date: Optional[str] = None  # MM/YYYY format

# Reference Schema
class Reference(BaseModel):
    name: str
    relationship: str
    contact: str  # Phone or email

# CV Schema
class CVBase(BaseModel):
    title: str
    personal_info: PersonalInfo
    education: List[Education]
    experience: List[WorkExperience]
    skills: List[Skill]
    projects: Optional[List[Project]] = []
    certifications: Optional[List[Certification]] = []
    languages: Optional[List[Language]] = []
    achievements: Optional[List[Achievement]] = []
    references: Optional[List[Reference]] = []
    template_id: Optional[str] = "modern"
    color_scheme: Optional[str] = "blue"

class CVCreate(CVBase):
    pass

class CVUpdate(BaseModel):
    title: Optional[str] = None
    personal_info: Optional[PersonalInfo] = None
    education: Optional[List[Education]] = None
    experience: Optional[List[WorkExperience]] = None
    skills: Optional[List[Skill]] = None
    projects: Optional[List[Project]] = None
    certifications: Optional[List[Certification]] = None
    languages: Optional[List[Language]] = None
    achievements: Optional[List[Achievement]] = None
    references: Optional[List[Reference]] = None
    template_id: Optional[str] = None
    color_scheme: Optional[str] = None

class CV(CVBase):
    id: int
    owner_id: int
    is_public: bool
    pdf_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Validation Response
class ValidationResponse(BaseModel):
    is_valid: bool
    missing_required_fields: List[str] = []
    suggestions: List[str] = []
    
# PDF Generation Schema
class PDFGenerationRequest(BaseModel):
    cv_id: int
    
class PDFGenerationResponse(BaseModel):
    task_id: str
    status: str
    message: str
