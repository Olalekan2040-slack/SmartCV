from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import openai
import os
from pydantic import BaseModel

from ..core.database import get_db
from ..core.auth import get_current_user
from ..models.models import User
from ..core.config import settings

router = APIRouter()

# AI Request/Response Models
class SuggestSummaryRequest(BaseModel):
    full_name: str
    current_summary: str = ""
    context: str = "professional_summary"

class SuggestJobDescriptionRequest(BaseModel):
    job_title: str
    company: str
    current_descriptions: List[str] = []
    context: str = "work_experience"

class AIResponse(BaseModel):
    suggestion: str

class AIJobDescriptionResponse(BaseModel):
    suggestions: List[str]

# Configure OpenAI if API key is available
if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY:
    openai.api_key = settings.OPENAI_API_KEY
    AI_AVAILABLE = True
else:
    AI_AVAILABLE = False

def generate_mock_summary(full_name: str, current_summary: str = "") -> str:
    """Generate a mock professional summary when AI is not available"""
    base_summaries = [
        f"Dedicated and results-driven professional with expertise in delivering high-quality solutions. {full_name} brings a strong analytical mindset and excellent communication skills to drive project success and team collaboration.",
        f"Experienced professional with a proven track record of achieving measurable results. {full_name} combines technical expertise with strategic thinking to solve complex challenges and deliver value to organizations.",
        f"Dynamic and motivated professional with strong problem-solving abilities. {full_name} is committed to continuous learning and innovation, bringing fresh perspectives to drive business growth and operational excellence.",
        f"Detail-oriented professional with extensive experience in project management and team leadership. {full_name} excels at building relationships, managing complex initiatives, and delivering results that exceed expectations."
    ]
    
    import random
    return random.choice(base_summaries)

def generate_mock_job_descriptions(job_title: str, company: str) -> List[str]:
    """Generate mock job descriptions when AI is not available"""
    base_descriptions = [
        f"Led strategic initiatives at {company} that resulted in improved operational efficiency and team productivity",
        f"Collaborated with cross-functional teams to deliver high-impact projects on time and within budget",
        f"Developed and implemented innovative solutions that enhanced business processes and customer satisfaction",
        f"Managed key stakeholder relationships and communicated project progress to senior leadership",
        f"Analyzed market trends and business requirements to inform strategic decision-making processes",
        f"Mentored junior team members and contributed to a positive, collaborative work environment",
        f"Utilized industry best practices to optimize workflows and drive continuous improvement initiatives"
    ]
    
    # Customize descriptions based on job title
    role_specific = {
        "software": [
            f"Developed and maintained scalable software applications using modern technologies and frameworks",
            f"Participated in code reviews and implemented best practices for software development lifecycle",
            f"Debugged and resolved complex technical issues to ensure optimal system performance"
        ],
        "manager": [
            f"Supervised and developed a team of professionals, providing guidance and performance feedback",
            f"Established and monitored key performance indicators to drive team success and goal achievement",
            f"Facilitated strategic planning sessions and coordinated cross-departmental initiatives"
        ],
        "analyst": [
            f"Conducted comprehensive data analysis to identify trends and provide actionable business insights",
            f"Created detailed reports and presentations for stakeholders and executive leadership",
            f"Implemented data-driven solutions to optimize business processes and support decision-making"
        ],
        "sales": [
            f"Exceeded sales targets through effective client relationship management and strategic prospecting",
            f"Developed and presented compelling proposals that addressed client needs and pain points",
            f"Built and maintained a strong pipeline of qualified leads through networking and referrals"
        ]
    }
    
    descriptions = base_descriptions.copy()
    job_lower = job_title.lower()
    
    for key, specific_desc in role_specific.items():
        if key in job_lower:
            descriptions.extend(specific_desc)
            break
    
    import random
    return random.sample(descriptions, min(5, len(descriptions)))

@router.post("/suggest-summary", response_model=AIResponse)
async def suggest_summary(
    request: SuggestSummaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered professional summary suggestions"""
    
    if not AI_AVAILABLE:
        # Return mock suggestion when AI is not configured
        suggestion = generate_mock_summary(request.full_name, request.current_summary)
        return AIResponse(suggestion=suggestion)
    
    try:
        # Prepare the prompt for OpenAI
        prompt = f"""
        Write a professional summary for {request.full_name}.
        Current summary: {request.current_summary if request.current_summary else "None provided"}
        Context: {request.context}
        
        Generate a compelling 2-3 sentence professional summary that highlights key strengths, 
        experience, and value proposition. Make it engaging and tailored for a CV/resume.
        Keep it professional and impactful.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional CV/resume writer who creates compelling professional summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        suggestion = response.choices[0].message.content.strip()
        return AIResponse(suggestion=suggestion)
        
    except Exception as e:
        # Fallback to mock suggestion if AI fails
        suggestion = generate_mock_summary(request.full_name, request.current_summary)
        return AIResponse(suggestion=suggestion)

@router.post("/suggest-job-description", response_model=AIJobDescriptionResponse)
async def suggest_job_description(
    request: SuggestJobDescriptionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI-powered job description bullet points"""
    
    if not AI_AVAILABLE:
        # Return mock suggestions when AI is not configured
        suggestions = generate_mock_job_descriptions(request.job_title, request.company)
        return AIJobDescriptionResponse(suggestions=suggestions)
    
    try:
        # Prepare the prompt for OpenAI
        current_desc = "\n".join(request.current_descriptions) if request.current_descriptions else "None provided"
        
        prompt = f"""
        Generate 5 professional bullet points for a job description.
        Job Title: {request.job_title}
        Company: {request.company}
        Current descriptions: {current_desc}
        Context: {request.context}
        
        Create compelling, action-oriented bullet points that highlight achievements, 
        responsibilities, and impact. Use strong action verbs and quantify results where possible.
        Make them suitable for a professional CV/resume.
        
        Format: Return only the bullet point text without bullets or numbering.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional CV/resume writer who creates impactful job descriptions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        suggestions_text = response.choices[0].message.content.strip()
        suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
        
        # Ensure we have at least 3 suggestions
        if len(suggestions) < 3:
            mock_suggestions = generate_mock_job_descriptions(request.job_title, request.company)
            suggestions.extend(mock_suggestions[:5-len(suggestions)])
        
        return AIJobDescriptionResponse(suggestions=suggestions[:5])
        
    except Exception as e:
        # Fallback to mock suggestions if AI fails
        suggestions = generate_mock_job_descriptions(request.job_title, request.company)
        return AIJobDescriptionResponse(suggestions=suggestions)
