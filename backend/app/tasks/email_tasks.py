"""
Email tasks for Celery background processing.
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.celery_app import celery_app
from app.models.database import get_db
from app.models.models import User
from app.services.email_service import email_service


@celery_app.task(bind=True, max_retries=3)
def send_2fa_code_task(self, user_id: int, code: str):
    """Send 2FA verification code email."""
    try:
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise Exception(f"User with ID {user_id} not found")
        
        # Send the email
        success = email_service.send_2fa_code(
            email=user.email,
            code=code,
            user_name=user.full_name
        )
        
        if not success:
            raise Exception("Failed to send 2FA code email")
        
        return {"status": "success", "message": "2FA code sent successfully"}
        
    except Exception as e:
        if self.request.retries < self.max_retries:
            # Retry after 60 seconds
            raise self.retry(countdown=60, exc=e)
        else:
            return {"status": "error", "message": str(e)}
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3)
def send_email_verification_task(self, user_id: int, verification_token: str):
    """Send email verification link."""
    try:
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise Exception(f"User with ID {user_id} not found")
        
        # Send the email
        success = email_service.send_email_verification(
            email=user.email,
            verification_token=verification_token,
            user_name=user.full_name
        )
        
        if not success:
            raise Exception("Failed to send email verification")
        
        return {"status": "success", "message": "Email verification sent successfully"}
        
    except Exception as e:
        if self.request.retries < self.max_retries:
            # Retry after 60 seconds
            raise self.retry(countdown=60, exc=e)
        else:
            return {"status": "error", "message": str(e)}
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3)
def send_login_notification_task(self, user_id: int, login_info: dict):
    """Send login notification email."""
    try:
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise Exception(f"User with ID {user_id} not found")
        
        # Send the email
        success = email_service.send_login_notification(
            email=user.email,
            user_name=user.full_name,
            login_info=login_info
        )
        
        if not success:
            raise Exception("Failed to send login notification")
        
        return {"status": "success", "message": "Login notification sent successfully"}
        
    except Exception as e:
        if self.request.retries < self.max_retries:
            # Retry after 60 seconds
            raise self.retry(countdown=60, exc=e)
        else:
            return {"status": "error", "message": str(e)}
    finally:
        db.close()


@celery_app.task
def cleanup_expired_2fa_codes():
    """Clean up expired 2FA codes from database."""
    try:
        db = next(get_db())
        current_time = datetime.utcnow()
        
        # Find users with expired 2FA codes
        expired_users = db.query(User).filter(
            User.two_factor_code_expires < current_time
        ).all()
        
        # Clear expired codes
        for user in expired_users:
            user.two_factor_code = None
            user.two_factor_code_expires = None
        
        db.commit()
        
        return {
            "status": "success", 
            "message": f"Cleaned up {len(expired_users)} expired 2FA codes"
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
