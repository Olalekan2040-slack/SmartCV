import os
import uuid
from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, grey
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import CV as CVModel, PDFGeneration
from datetime import datetime
import json

class PDFGeneratorService:
    """Service to generate PDF resumes from CV data using ReportLab."""
    
    def __init__(self):
        self.output_dir = "/tmp/uploads"
        os.makedirs(self.output_dir, exist_ok=True)
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles."""
        # Header style
        self.styles.add(ParagraphStyle(
            name='CustomHeader',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=12,
            alignment=TA_CENTER,
            textColor=HexColor('#2563eb')
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=12,
            spaceAfter=6,
            textColor=HexColor('#2563eb'),
            borderWidth=1,
            borderColor=grey,
            borderPadding=3
        ))
        
        # Job title style
        self.styles.add(ParagraphStyle(
            name='JobTitle',
            parent=self.styles['Heading3'],
            fontSize=12,
            spaceBefore=6,
            spaceAfter=3,
            textColor=black
        ))
        
        # Contact info style
        self.styles.add(ParagraphStyle(
            name='ContactInfo',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_CENTER,
            spaceAfter=6
        ))
    
    def generate_pdf(self, cv_id: int, user_id: int, task_id: str) -> str:
        """Generate PDF from CV data."""
        db = SessionLocal()
        
        try:
            # Get CV data
            cv = db.query(CVModel).filter(CVModel.id == cv_id).first()
            if not cv:
                raise ValueError(f"CV with id {cv_id} not found")
            
            # Create PDF generation record
            pdf_gen = PDFGeneration(
                cv_id=cv_id,
                user_id=user_id,
                status="processing"
            )
            db.add(pdf_gen)
            db.commit()
            
            # Generate PDF
            pdf_filename = f"cv_{cv_id}_{uuid.uuid4().hex[:8]}.pdf"
            pdf_path = os.path.join(self.output_dir, pdf_filename)
            
            self._create_pdf(cv, pdf_path)
            
            # Update CV with PDF URL
            cv.pdf_url = pdf_path
            
            # Update generation record
            pdf_gen.status = "completed"
            pdf_gen.file_path = pdf_path
            pdf_gen.completed_at = datetime.utcnow()
            
            db.commit()
            
            return pdf_path
            
        except Exception as e:
            # Update generation record with error
            if 'pdf_gen' in locals():
                pdf_gen.status = "failed"
                pdf_gen.error_message = str(e)
                db.commit()
            raise e
        finally:
            db.close()
    
    def _create_pdf(self, cv: CVModel, pdf_path: str):
        """Create PDF document using ReportLab."""
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        
        story = []
        
        # Parse JSON data
        personal_info = json.loads(cv.personal_info) if isinstance(cv.personal_info, str) else cv.personal_info
        education = json.loads(cv.education) if isinstance(cv.education, str) else cv.education
        experience = json.loads(cv.experience) if isinstance(cv.experience, str) else cv.experience
        skills = json.loads(cv.skills) if isinstance(cv.skills, str) else cv.skills
        projects = json.loads(cv.projects) if cv.projects and isinstance(cv.projects, str) else (cv.projects or [])
        
        # Header - Name
        if personal_info and personal_info.get('full_name'):
            story.append(Paragraph(personal_info['full_name'], self.styles['CustomHeader']))
        
        # Contact Information
        contact_parts = []
        if personal_info:
            if personal_info.get('email'):
                contact_parts.append(personal_info['email'])
            if personal_info.get('phone'):
                contact_parts.append(personal_info['phone'])
            if personal_info.get('address'):
                contact_parts.append(personal_info['address'])
        
        if contact_parts:
            story.append(Paragraph(' | '.join(contact_parts), self.styles['ContactInfo']))
        
        # Links
        link_parts = []
        if personal_info:
            if personal_info.get('linkedin'):
                link_parts.append(f"LinkedIn: {personal_info['linkedin']}")
            if personal_info.get('github'):
                link_parts.append(f"GitHub: {personal_info['github']}")
            if personal_info.get('portfolio'):
                link_parts.append(f"Portfolio: {personal_info['portfolio']}")
        
        if link_parts:
            story.append(Paragraph(' | '.join(link_parts), self.styles['ContactInfo']))
        
        story.append(Spacer(1, 12))
        
        # Profile Summary
        if personal_info and personal_info.get('profile_summary'):
            story.append(Paragraph('Profile Summary', self.styles['SectionHeader']))
            story.append(Paragraph(personal_info['profile_summary'], self.styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Work Experience
        if experience and len(experience) > 0:
            story.append(Paragraph('Work Experience', self.styles['SectionHeader']))
            
            for exp in experience:
                if exp.get('job_title') and exp.get('company_name'):
                    # Job title and company
                    job_header = f"<b>{exp['job_title']}</b> at {exp['company_name']}"
                    if exp.get('start_date') and exp.get('end_date'):
                        job_header += f" ({exp['start_date']} - {exp['end_date']})"
                    elif exp.get('start_date'):
                        job_header += f" ({exp['start_date']} - Present)"
                    
                    story.append(Paragraph(job_header, self.styles['JobTitle']))
                    
                    # Location
                    if exp.get('location'):
                        story.append(Paragraph(f"<i>{exp['location']}</i>", self.styles['Normal']))
                    
                    # Job description
                    if exp.get('job_description'):
                        if isinstance(exp['job_description'], list):
                            for desc in exp['job_description']:
                                story.append(Paragraph(f"• {desc}", self.styles['Normal']))
                        else:
                            story.append(Paragraph(f"• {exp['job_description']}", self.styles['Normal']))
                    
                    story.append(Spacer(1, 6))
        
        # Education
        if education and len(education) > 0:
            story.append(Paragraph('Education', self.styles['SectionHeader']))
            
            for edu in education:
                if edu.get('degree') and edu.get('school_name'):
                    edu_text = f"<b>{edu['degree']}</b>"
                    if edu.get('field_of_study'):
                        edu_text += f" in {edu['field_of_study']}"
                    edu_text += f" - {edu['school_name']}"
                    
                    if edu.get('start_date') and edu.get('end_date'):
                        edu_text += f" ({edu['start_date']} - {edu['end_date']})"
                    elif edu.get('start_date'):
                        edu_text += f" ({edu['start_date']} - Present)"
                    
                    story.append(Paragraph(edu_text, self.styles['Normal']))
                    
                    if edu.get('grade'):
                        story.append(Paragraph(f"Grade: {edu['grade']}", self.styles['Normal']))
                    
                    story.append(Spacer(1, 6))
        
        # Skills
        if skills and len(skills) > 0:
            story.append(Paragraph('Skills', self.styles['SectionHeader']))
            
            skill_text = ""
            for skill in skills:
                if skill.get('skill_name'):
                    if skill_text:
                        skill_text += " • "
                    skill_text += skill['skill_name']
                    if skill.get('proficiency_level'):
                        skill_text += f" ({skill['proficiency_level']})"
            
            if skill_text:
                story.append(Paragraph(skill_text, self.styles['Normal']))
                story.append(Spacer(1, 6))
        
        # Projects
        if projects and len(projects) > 0:
            story.append(Paragraph('Projects', self.styles['SectionHeader']))
            
            for project in projects:
                if project.get('project_title'):
                    story.append(Paragraph(f"<b>{project['project_title']}</b>", self.styles['JobTitle']))
                    
                    if project.get('description'):
                        story.append(Paragraph(project['description'], self.styles['Normal']))
                    
                    if project.get('technologies_used'):
                        if isinstance(project['technologies_used'], list):
                            tech_text = f"<b>Technologies:</b> {', '.join(project['technologies_used'])}"
                        else:
                            tech_text = f"<b>Technologies:</b> {project['technologies_used']}"
                        story.append(Paragraph(tech_text, self.styles['Normal']))
                    
                    if project.get('link'):
                        story.append(Paragraph(f"<b>Link:</b> {project['link']}", self.styles['Normal']))
                    
                    story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
    
    def _get_primary_color(self, color_scheme: str) -> str:
        """Get primary color based on color scheme."""
        colors = {
            'blue': '#2563eb',
            'green': '#16a34a',
            'purple': '#9333ea',
            'red': '#dc2626',
            'orange': '#ea580c',
            'teal': '#0d9488'
        }
        return colors.get(color_scheme, '#2563eb')

# Global instance
pdf_generator = PDFGeneratorService()

def generate_pdf_task(cv_id: int, user_id: int, task_id: str):
    """Background task to generate PDF."""
    try:
        pdf_path = pdf_generator.generate_pdf(cv_id, user_id, task_id)
        print(f"PDF generated successfully: {pdf_path}")
        return pdf_path
    except Exception as e:
        print(f"PDF generation failed: {str(e)}")
        raise e
