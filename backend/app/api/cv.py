from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.models.database import get_db
from app.models.models import User, CV as CVModel
from app.schemas.schemas import (
    CVCreate, CVUpdate, CV as CVSchema, 
    ValidationResponse, PDFGenerationRequest, PDFGenerationResponse
)
from app.core.auth import get_current_user, get_current_premium_user
from app.services.cv_validation import cv_validator
# from app.services.pdf_generator import generate_pdf_task  # Temporarily disabled

router = APIRouter()

@router.post("/", response_model=CVSchema)
async def create_cv(
    cv_data: CVCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new CV."""
    # Validate CV data first
    validation_result = cv_validator.validate_cv(cv_data)
    if not validation_result.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "CV validation failed",
                "missing_fields": validation_result.missing_required_fields,
                "suggestions": validation_result.suggestions
            }
        )
    
    # Create CV in database
    db_cv = CVModel(
        title=cv_data.title,
        owner_id=current_user.id,
        personal_info=cv_data.personal_info.dict(),
        education=[edu.dict() for edu in cv_data.education],
        experience=[exp.dict() for exp in cv_data.experience],
        skills=[skill.dict() for skill in cv_data.skills],
        projects=[proj.dict() for proj in cv_data.projects] if cv_data.projects else [],
        certifications=[cert.dict() for cert in cv_data.certifications] if cv_data.certifications else [],
        languages=[lang.dict() for lang in cv_data.languages] if cv_data.languages else [],
        achievements=[ach.dict() for ach in cv_data.achievements] if cv_data.achievements else [],
        references=[ref.dict() for ref in cv_data.references] if cv_data.references else [],
        template_id=cv_data.template_id,
        color_scheme=cv_data.color_scheme
    )
    
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    
    return db_cv

@router.get("/", response_model=List[CVSchema])
async def get_user_cvs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all CVs for the current user."""
    cvs = db.query(CVModel).filter(CVModel.owner_id == current_user.id).all()
    return cvs

@router.get("/{cv_id}", response_model=CVSchema)
async def get_cv(
    cv_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific CV by ID."""
    cv = db.query(CVModel).filter(
        CVModel.id == cv_id,
        CVModel.owner_id == current_user.id
    ).first()
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    return cv

@router.put("/{cv_id}", response_model=CVSchema)
async def update_cv(
    cv_id: int,
    cv_update: CVUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a CV."""
    cv = db.query(CVModel).filter(
        CVModel.id == cv_id,
        CVModel.owner_id == current_user.id
    ).first()
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    # Update fields that were provided
    update_data = cv_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field in ['education', 'experience', 'skills', 'projects', 
                     'certifications', 'languages', 'achievements', 'references']:
            if value:
                setattr(cv, field, [item.dict() for item in value])
        elif field == 'personal_info' and value:
            setattr(cv, field, value.dict())
        else:
            setattr(cv, field, value)
    
    db.commit()
    db.refresh(cv)
    
    return cv

@router.delete("/{cv_id}")
async def delete_cv(
    cv_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a CV."""
    cv = db.query(CVModel).filter(
        CVModel.id == cv_id,
        CVModel.owner_id == current_user.id
    ).first()
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    db.delete(cv)
    db.commit()
    
    return {"message": "CV deleted successfully"}

@router.post("/validate", response_model=ValidationResponse)
async def validate_cv(
    cv_data: CVCreate,
    current_user: User = Depends(get_current_user)
):
    """Validate CV data without saving."""
    validation_result = cv_validator.validate_cv(cv_data)
    return validation_result

@router.post("/{cv_id}/generate-pdf", response_model=PDFGenerationResponse)
async def generate_pdf(
    cv_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate PDF for a CV."""
    cv = db.query(CVModel).filter(
        CVModel.id == cv_id,
        CVModel.owner_id == current_user.id
    ).first()
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    # For non-premium users, limit PDF generations
    if not current_user.is_premium:
        # You can add logic here to check generation limits
        pass
    
    # Start background task for PDF generation
    task_id = f"pdf_{cv_id}_{current_user.id}"
    # background_tasks.add_task(generate_pdf_task, cv_id, current_user.id, task_id)  # Temporarily disabled
    
    return PDFGenerationResponse(
        task_id=task_id,
        status="disabled",
        message="PDF generation temporarily disabled - WeasyPrint setup required"
    )

@router.get("/{cv_id}/pdf-status/{task_id}")
async def get_pdf_status(
    cv_id: int,
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get PDF generation status."""
    # You can implement task status checking here
    # For now, return a simple response
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "PDF generation in progress"
    }

@router.post("/{cv_id}/duplicate", response_model=CVSchema)
async def duplicate_cv(
    cv_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Duplicate an existing CV."""
    original_cv = db.query(CVModel).filter(
        CVModel.id == cv_id,
        CVModel.owner_id == current_user.id
    ).first()
    
    if not original_cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    # Create a copy
    new_cv = CVModel(
        title=f"{original_cv.title} (Copy)",
        owner_id=current_user.id,
        personal_info=original_cv.personal_info,
        education=original_cv.education,
        experience=original_cv.experience,
        skills=original_cv.skills,
        projects=original_cv.projects,
        certifications=original_cv.certifications,
        languages=original_cv.languages,
        achievements=original_cv.achievements,
        references=original_cv.references,
        template_id=original_cv.template_id,
        color_scheme=original_cv.color_scheme
    )
    
    db.add(new_cv)
    db.commit()
    db.refresh(new_cv)
    
    return new_cv
