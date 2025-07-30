from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.database import get_db
from app.models.models import User
from app.schemas.schemas import (
    UserCreate, UserLogin, User as UserSchema, Token,
    TwoFactorSetupRequest, TwoFactorSetupResponse,
    TwoFactorVerifyRequest, TwoFactorLoginRequest,
    TwoFactorDisableRequest, EmailVerificationRequest,
    ResendVerificationRequest, TwoFactorStatus
)
from app.core.auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_user,
    verify_password,
    generate_2fa_code,
    generate_verification_token,
    generate_backup_codes,
    set_2fa_code,
    clear_2fa_code,
    set_email_verification_token,
    verify_email_token,
    is_2fa_code_valid
)

# Import email service directly for fallback
from app.services.email_service import email_service

# Try to import celery tasks, fallback to direct email sending if not available
try:
    from app.tasks.email_tasks import (
        send_2fa_code_task,
        send_email_verification_task,
        send_login_notification_task
    )
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
    print("⚠️  Celery not available, using direct email sending")

router = APIRouter()

# Helper functions for email sending with celery fallback
def send_verification_email(user_id: int, verification_token: str):
    """Send verification email with celery fallback."""
    if CELERY_AVAILABLE:
        send_email_verification_task.delay(user_id, verification_token)
    else:
        # Direct email sending fallback
        from app.models.database import get_db
        db = next(get_db())
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                email_service.send_email_verification(
                    email=user.email,
                    verification_token=verification_token,
                    user_name=user.full_name
                )
        finally:
            db.close()

def send_2fa_code_email(user_id: int, code: str):
    """Send 2FA code email with celery fallback."""
    if CELERY_AVAILABLE:
        send_2fa_code_task.delay(user_id, code)
    else:
        # Direct email sending fallback
        from app.models.database import get_db
        db = next(get_db())
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                email_service.send_2fa_code(
                    email=user.email,
                    code=code,
                    user_name=user.full_name
                )
        finally:
            db.close()

def send_login_notification_email(user_id: int, login_info: dict):
    """Send login notification email with celery fallback."""
    if CELERY_AVAILABLE:
        send_login_notification_task.delay(user_id, login_info)
    else:
        # Direct email sending fallback
        from app.models.database import get_db
        db = next(get_db())
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                email_service.send_login_notification(
                    email=user.email,
                    user_name=user.full_name,
                    login_info=login_info
                )
        finally:
            db.close()

@router.post("/register", response_model=UserSchema)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    verification_token = generate_verification_token()
    
    db_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        email_verification_token=verification_token
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Send verification email
    send_verification_email(db_user.id, verification_token)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if 2FA is enabled
    if user.two_factor_enabled:
        # Generate and send 2FA code
        code = generate_2fa_code()
        set_2fa_code(db, user, code)
        
        # Send 2FA code via email
        send_2fa_code_email(user.id, code)
        
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="2FA code sent to your email. Please verify to complete login."
        )
    
    # Regular login without 2FA
    access_token = create_access_token(data={"sub": user.email})
    
    # Send login notification
    login_info = {
        "time": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "ip": request.client.host if request.client else "Unknown",
        "device": request.headers.get("user-agent", "Unknown")
    }
    send_login_notification_email(user.id, login_info)
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_user_me(
    user_update: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information."""
    # Update allowed fields
    if "full_name" in user_update:
        current_user.full_name = user_update["full_name"]
    
    db.commit()
    db.refresh(current_user)
    return current_user

# 2FA Endpoints

@router.post("/2fa/verify-login", response_model=Token)
async def verify_2fa_login(
    request_data: TwoFactorLoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """Complete login with 2FA verification code."""
    user = db.query(User).filter(User.email == request_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify 2FA code
    if not is_2fa_code_valid(user, request_data.verification_code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired verification code"
        )
    
    # Clear the used 2FA code
    clear_2fa_code(db, user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    # Send login notification
    login_info = {
        "time": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "ip": request.client.host if request.client else "Unknown",
        "device": request.headers.get("user-agent", "Unknown")
    }
    send_login_notification_email(user.id, login_info)
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/2fa/setup", response_model=TwoFactorSetupResponse)
async def setup_2fa(
    request_data: TwoFactorSetupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enable 2FA for the current user."""
    # Verify current password
    if not verify_password(request_data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )
    
    # Check if email is verified
    if not current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email must be verified before enabling 2FA"
        )
    
    # Enable 2FA
    current_user.two_factor_enabled = True
    db.commit()
    db.refresh(current_user)
    
    # Generate backup codes
    backup_codes = generate_backup_codes()
    
    return TwoFactorSetupResponse(
        message="Two-factor authentication has been enabled successfully",
        backup_codes=backup_codes
    )

@router.post("/2fa/disable")
async def disable_2fa(
    request_data: TwoFactorDisableRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disable 2FA for the current user."""
    # Verify current password
    if not verify_password(request_data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )
    
    # If 2FA is enabled, require verification code
    if current_user.two_factor_enabled:
        if not is_2fa_code_valid(current_user, request_data.verification_code):
            # Generate and send new code if not provided or invalid
            code = generate_2fa_code()
            set_2fa_code(db, current_user, code)
            send_2fa_code_email(current_user.id, code)
            
            raise HTTPException(
                status_code=status.HTTP_202_ACCEPTED,
                detail="Verification code sent to your email. Please provide the code to disable 2FA."
            )
    
    # Disable 2FA
    current_user.two_factor_enabled = False
    clear_2fa_code(db, current_user)
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Two-factor authentication has been disabled"}

@router.get("/2fa/status", response_model=TwoFactorStatus)
async def get_2fa_status(current_user: User = Depends(get_current_user)):
    """Get 2FA status for the current user."""
    return TwoFactorStatus(
        two_factor_enabled=current_user.two_factor_enabled,
        email_verified=current_user.email_verified
    )

@router.post("/verify-email")
async def verify_email(
    request_data: EmailVerificationRequest,
    db: Session = Depends(get_db)
):
    """Verify user email with verification token."""
    user = verify_email_token(db, request_data.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification_email(
    request_data: ResendVerificationRequest,
    db: Session = Depends(get_db)
):
    """Resend email verification link."""
    user = db.query(User).filter(User.email == request_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )
    
    # Generate new verification token
    verification_token = generate_verification_token()
    set_email_verification_token(db, user, verification_token)
    
    # Send verification email
    send_verification_email(user.id, verification_token)
    
    return {"message": "Verification email sent successfully"}

@router.post("/2fa/request-code")
async def request_2fa_code(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request a new 2FA code (for manual requests)."""
    if not current_user.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Two-factor authentication is not enabled"
        )
    
    # Generate and send new 2FA code
    code = generate_2fa_code()
    set_2fa_code(db, current_user, code)
    send_2fa_code_email(current_user.id, code)
    
    return {"message": "Verification code sent to your email"}
