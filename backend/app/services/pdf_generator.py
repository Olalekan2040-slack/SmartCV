import os
import uuid
from weasyprint import HTML, CSS
from jinja2 import Template
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import CV as CVModel, PDFGeneration
from datetime import datetime

class PDFGeneratorService:
    """Service to generate PDF resumes from CV data."""
    
    def __init__(self):
        self.output_dir = "generated_pdfs"
        os.makedirs(self.output_dir, exist_ok=True)
    
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
            
            # Generate HTML from template
            html_content = self._generate_html(cv)
            
            # Generate PDF
            pdf_filename = f"cv_{cv_id}_{uuid.uuid4().hex[:8]}.pdf"
            pdf_path = os.path.join(self.output_dir, pdf_filename)
            
            HTML(string=html_content).write_pdf(
                pdf_path,
                stylesheets=[CSS(string=self._get_css(cv.template_id, cv.color_scheme))]
            )
            
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
    
    def _generate_html(self, cv: CVModel) -> str:
        """Generate HTML content from CV data."""
        template_str = self._get_template(cv.template_id)
        template = Template(template_str)
        
        # Prepare template data
        context = {
            'personal_info': cv.personal_info,
            'education': cv.education,
            'experience': cv.experience,
            'skills': cv.skills,
            'projects': cv.projects or [],
            'certifications': cv.certifications or [],
            'languages': cv.languages or [],
            'achievements': cv.achievements or [],
            'references': cv.references or []
        }
        
        return template.render(**context)
    
    def _get_template(self, template_id: str) -> str:
        """Get HTML template based on template ID."""
        if template_id == "modern":
            return self._get_modern_template()
        elif template_id == "classic":
            return self._get_classic_template()
        elif template_id == "minimal":
            return self._get_minimal_template()
        else:
            return self._get_modern_template()  # Default
    
    def _get_modern_template(self) -> str:
        """Modern CV template."""
        return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ personal_info.full_name }} - Resume</title>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1 class="name">{{ personal_info.full_name }}</h1>
            <div class="contact-info">
                <div class="contact-item">{{ personal_info.email }}</div>
                <div class="contact-item">{{ personal_info.phone }}</div>
                {% if personal_info.address %}
                <div class="contact-item">{{ personal_info.address }}</div>
                {% endif %}
            </div>
            {% if personal_info.linkedin or personal_info.github or personal_info.portfolio %}
            <div class="links">
                {% if personal_info.linkedin %}
                <a href="{{ personal_info.linkedin }}" class="link">LinkedIn</a>
                {% endif %}
                {% if personal_info.github %}
                <a href="{{ personal_info.github }}" class="link">GitHub</a>
                {% endif %}
                {% if personal_info.portfolio %}
                <a href="{{ personal_info.portfolio }}" class="link">Portfolio</a>
                {% endif %}
            </div>
            {% endif %}
        </header>

        <!-- Profile Summary -->
        <section class="section">
            <h2 class="section-title">Profile Summary</h2>
            <p class="summary">{{ personal_info.profile_summary }}</p>
        </section>

        <!-- Experience -->
        {% if experience %}
        <section class="section">
            <h2 class="section-title">Work Experience</h2>
            {% for exp in experience %}
            <div class="experience-item">
                <div class="experience-header">
                    <h3 class="job-title">{{ exp.job_title }}</h3>
                    <div class="company-date">
                        <span class="company">{{ exp.company_name }}</span>
                        <span class="date">{{ exp.start_date }} - {{ exp.end_date or 'Present' }}</span>
                    </div>
                </div>
                {% if exp.location %}
                <div class="location">{{ exp.location }}</div>
                {% endif %}
                <ul class="job-description">
                    {% for desc in exp.job_description %}
                    <li>{{ desc }}</li>
                    {% endfor %}
                </ul>
            </div>
            {% endfor %}
        </section>
        {% endif %}

        <!-- Education -->
        <section class="section">
            <h2 class="section-title">Education</h2>
            {% for edu in education %}
            <div class="education-item">
                <div class="education-header">
                    <h3 class="degree">{{ edu.degree }} in {{ edu.field_of_study }}</h3>
                    <div class="school-date">
                        <span class="school">{{ edu.school_name }}</span>
                        <span class="date">{{ edu.start_date }} - {{ edu.end_date or 'Present' }}</span>
                    </div>
                </div>
                {% if edu.grade %}
                <div class="grade">Grade: {{ edu.grade }}</div>
                {% endif %}
                {% if edu.location %}
                <div class="location">{{ edu.location }}</div>
                {% endif %}
            </div>
            {% endfor %}
        </section>

        <!-- Skills -->
        <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                {% for skill in skills %}
                <div class="skill-item">
                    <span class="skill-name">{{ skill.skill_name }}</span>
                    {% if skill.proficiency_level %}
                    <span class="skill-level">{{ skill.proficiency_level }}</span>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
        </section>

        <!-- Projects -->
        {% if projects %}
        <section class="section">
            <h2 class="section-title">Projects</h2>
            {% for project in projects %}
            <div class="project-item">
                <h3 class="project-title">{{ project.project_title }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="technologies">
                    <strong>Technologies:</strong> {{ project.technologies_used | join(', ') }}
                </div>
                {% if project.link %}
                <div class="project-link">
                    <a href="{{ project.link }}">View Project</a>
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </section>
        {% endif %}

        <!-- Certifications -->
        {% if certifications %}
        <section class="section">
            <h2 class="section-title">Certifications</h2>
            {% for cert in certifications %}
            <div class="certification-item">
                <h3 class="cert-name">{{ cert.certificate_name }}</h3>
                <div class="cert-details">
                    <span class="issuer">{{ cert.issuer }}</span>
                    <span class="cert-date">{{ cert.date_issued }}</span>
                </div>
                {% if cert.credential_url %}
                <div class="credential-link">
                    <a href="{{ cert.credential_url }}">View Credential</a>
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </section>
        {% endif %}

        <!-- Languages -->
        {% if languages %}
        <section class="section">
            <h2 class="section-title">Languages</h2>
            <div class="languages-grid">
                {% for lang in languages %}
                <div class="language-item">
                    <span class="language">{{ lang.language }}</span>
                    <span class="proficiency">{{ lang.proficiency }}</span>
                </div>
                {% endfor %}
            </div>
        </section>
        {% endif %}
    </div>
</body>
</html>
        """
    
    def _get_classic_template(self) -> str:
        """Classic CV template - simplified version."""
        return self._get_modern_template()  # For now, use modern template
    
    def _get_minimal_template(self) -> str:
        """Minimal CV template - simplified version."""
        return self._get_modern_template()  # For now, use modern template
    
    def _get_css(self, template_id: str, color_scheme: str) -> str:
        """Get CSS styles for the template."""
        primary_color = self._get_primary_color(color_scheme)
        
        return f"""
        @page {{
            size: A4;
            margin: 20mm;
        }}
        
        body {{
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }}
        
        .container {{
            max-width: 100%;
        }}
        
        .header {{
            text-align: center;
            border-bottom: 2px solid {primary_color};
            padding-bottom: 15px;
            margin-bottom: 20px;
        }}
        
        .name {{
            font-size: 24pt;
            font-weight: bold;
            color: {primary_color};
            margin: 0 0 10px 0;
        }}
        
        .contact-info {{
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 10px;
        }}
        
        .contact-item {{
            font-size: 10pt;
        }}
        
        .links {{
            display: flex;
            justify-content: center;
            gap: 15px;
        }}
        
        .link {{
            color: {primary_color};
            text-decoration: none;
            font-size: 10pt;
        }}
        
        .section {{
            margin-bottom: 20px;
        }}
        
        .section-title {{
            font-size: 14pt;
            font-weight: bold;
            color: {primary_color};
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }}
        
        .summary {{
            text-align: justify;
            margin-bottom: 15px;
        }}
        
        .experience-item, .education-item, .project-item, .certification-item {{
            margin-bottom: 15px;
        }}
        
        .experience-header, .education-header {{
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 5px;
        }}
        
        .job-title, .degree, .project-title, .cert-name {{
            font-weight: bold;
            font-size: 12pt;
            margin: 0;
        }}
        
        .company-date, .school-date {{
            text-align: right;
            font-size: 10pt;
        }}
        
        .company, .school {{
            display: block;
            font-weight: bold;
        }}
        
        .date {{
            color: #666;
        }}
        
        .location {{
            font-size: 10pt;
            color: #666;
            margin-bottom: 5px;
        }}
        
        .job-description {{
            margin: 0;
            padding-left: 20px;
        }}
        
        .job-description li {{
            margin-bottom: 3px;
        }}
        
        .skills-grid {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        
        .skill-item {{
            background: #f5f5f5;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 10pt;
        }}
        
        .skill-name {{
            font-weight: bold;
        }}
        
        .skill-level {{
            color: #666;
            font-size: 9pt;
        }}
        
        .technologies {{
            font-size: 10pt;
            margin: 5px 0;
        }}
        
        .project-link, .credential-link {{
            font-size: 10pt;
        }}
        
        .project-link a, .credential-link a {{
            color: {primary_color};
            text-decoration: none;
        }}
        
        .cert-details {{
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
        }}
        
        .languages-grid {{
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }}
        
        .language-item {{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 5px;
        }}
        
        .language {{
            font-weight: bold;
        }}
        
        .proficiency {{
            font-size: 10pt;
            color: #666;
        }}
        """
    
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
