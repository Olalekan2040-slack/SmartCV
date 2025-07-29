from datetime import datetime, timedelta
from typing import Optional
import jwt
import hashlib
import secrets
import string
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.database import get_db
from app.models.models import User

# JWT token scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    try:
        # Split stored password into salt and hash
        stored_salt, stored_hash = hashed_password.split(':')
        # Hash the provided password with the stored salt
        password_hash = hashlib.pbkdf2_hmac('sha256', 
                                          plain_password.encode('utf-8'), 
                                          stored_salt.encode('utf-8'), 
                                          100000)
        return secrets.compare_digest(stored_hash.encode('utf-8'), password_hash.hex().encode('utf-8'))
    except ValueError:
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2."""
    # Generate a random salt
    salt = secrets.token_hex(32)
    # Hash the password with the salt
    password_hash = hashlib.pbkdf2_hmac('sha256', 
                                      password.encode('utf-8'), 
                                      salt.encode('utf-8'), 
                                      100000)
    # Return salt:hash
    return f"{salt}:{password_hash.hex()}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except jwt.InvalidTokenError:
        return None

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

def get_current_premium_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current authenticated premium user."""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required"
        )
    return current_user

# 2FA Helper Functions
def generate_2fa_code(length: int = 6) -> str:
    """Generate a random 2FA verification code."""
    return ''.join(secrets.choice(string.digits) for _ in range(length))

def generate_verification_token(length: int = 32) -> str:
    """Generate a random email verification token."""
    return secrets.token_urlsafe(length)

def is_2fa_code_valid(user: User, provided_code: str) -> bool:
    """Check if the provided 2FA code is valid and not expired."""
    if not user.two_factor_code or not user.two_factor_code_expires:
        return False
    
    # Check if code has expired
    if datetime.utcnow() > user.two_factor_code_expires:
        return False
    
    # Check if code matches
    return secrets.compare_digest(user.two_factor_code, provided_code)

def generate_backup_codes(count: int = 8) -> list[str]:
    """Generate backup codes for 2FA recovery."""
    codes = []
    for _ in range(count):
        # Generate 8-character alphanumeric backup codes
        code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        # Format as XXXX-XXXX
        formatted_code = f"{code[:4]}-{code[4:]}"
        codes.append(formatted_code)
    return codes

def set_2fa_code(db: Session, user: User, code: str, expires_minutes: int = 10):
    """Set 2FA code for user with expiration."""
    user.two_factor_code = code
    user.two_factor_code_expires = datetime.utcnow() + timedelta(minutes=expires_minutes)
    db.commit()
    db.refresh(user)

def clear_2fa_code(db: Session, user: User):
    """Clear 2FA code from user."""
    user.two_factor_code = None
    user.two_factor_code_expires = None
    db.commit()
    db.refresh(user)

def set_email_verification_token(db: Session, user: User, token: str):
    """Set email verification token for user."""
    user.email_verification_token = token
    db.commit()
    db.refresh(user)

def verify_email_token(db: Session, token: str) -> Optional[User]:
    """Verify email verification token and return user."""
    user = db.query(User).filter(User.email_verification_token == token).first()
    if user:
        user.email_verified = True
        user.email_verification_token = None
        db.commit()
        db.refresh(user)
    return user
