from app.core.celery_app import celery_app
from app.services.pdf_generator import pdf_generator
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import PDFGeneration
from datetime import datetime

@celery_app.task(bind=True)
def generate_cv_pdf(self, cv_id: int, user_id: int):
    """Celery task to generate CV PDF."""
    db = SessionLocal()
    
    try:
        # Update task status
        pdf_gen = db.query(PDFGeneration).filter(
            PDFGeneration.cv_id == cv_id,
            PDFGeneration.user_id == user_id,
            PDFGeneration.status == "pending"
        ).first()
        
        if pdf_gen:
            pdf_gen.status = "processing"
            db.commit()
        
        # Generate PDF
        pdf_path = pdf_generator.generate_pdf(cv_id, user_id, self.request.id)
        
        return {
            'status': 'completed',
            'pdf_path': pdf_path,
            'cv_id': cv_id,
            'user_id': user_id
        }
        
    except Exception as exc:
        # Update task status on failure
        if pdf_gen:
            pdf_gen.status = "failed"
            pdf_gen.error_message = str(exc)
            db.commit()
        
        # Retry the task
        raise self.retry(exc=exc, countdown=60, max_retries=3)
        
    finally:
        db.close()

@celery_app.task
def cleanup_old_pdfs():
    """Clean up old PDF files to save storage space."""
    import os
    import time
    from pathlib import Path
    
    pdf_dir = Path("generated_pdfs")
    if not pdf_dir.exists():
        return
    
    # Delete PDFs older than 30 days
    current_time = time.time()
    days_to_keep = 30
    cutoff_time = current_time - (days_to_keep * 24 * 60 * 60)
    
    deleted_count = 0
    for pdf_file in pdf_dir.glob("*.pdf"):
        if pdf_file.stat().st_mtime < cutoff_time:
            try:
                pdf_file.unlink()
                deleted_count += 1
            except OSError:
                pass
    
    return f"Deleted {deleted_count} old PDF files"
