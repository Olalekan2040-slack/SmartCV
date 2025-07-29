from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_premium = Column(Boolean, default=False)
    
    # 2FA fields
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_code = Column(String, nullable=True)
    two_factor_code_expires = Column(DateTime, nullable=True)
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    cvs = relationship("CV", back_populates="owner")
    subscriptions = relationship("Subscription", back_populates="user")

class CV(Base):
    __tablename__ = "cvs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Personal Information
    personal_info = Column(JSON)
    
    # CV Sections
    education = Column(JSON)
    experience = Column(JSON)
    skills = Column(JSON)
    projects = Column(JSON)
    certifications = Column(JSON)
    languages = Column(JSON)
    achievements = Column(JSON)
    references = Column(JSON)
    
    # Template and styling
    template_id = Column(String, default="modern")
    color_scheme = Column(String, default="blue")
    
    # Status
    is_public = Column(Boolean, default=False)
    pdf_url = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="cvs")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stripe_subscription_id = Column(String, unique=True)
    stripe_customer_id = Column(String)
    status = Column(String)  # active, canceled, past_due, etc.
    plan_name = Column(String)  # basic, premium, pro
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")

class PDFGeneration(Base):
    __tablename__ = "pdf_generations"
    
    id = Column(Integer, primary_key=True, index=True)
    cv_id = Column(Integer, ForeignKey("cvs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    file_path = Column(String)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime)
