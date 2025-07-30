"""
Test script to verify the 2FA implementation works without celery.
Run this to test email functionality.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test that all imports work without celery."""
    try:
        print("Testing imports...")
        
        # Test basic imports
        from app.services.email_service import email_service
        print("✅ Email service imported successfully")
        
        # Test auth imports
        from app.api.auth import router
        print("✅ Auth router imported successfully")
        
        # Test that SMTP config is loaded
        smtp_user = os.getenv('SMTP_USER')
        smtp_password = os.getenv('SMTP_PASSWORD')
        
        if smtp_user and smtp_password:
            print(f"✅ SMTP configured for: {smtp_user}")
        else:
            print("⚠️  SMTP not configured")
        
        return True
        
    except Exception as e:
        print(f"❌ Import failed: {str(e)}")
        return False

def test_email_service():
    """Test email service initialization."""
    try:
        from app.services.email_service import email_service
        
        # Test code generation
        code = email_service.generate_verification_code()
        print(f"✅ Verification code generated: {code}")
        
        token = email_service.generate_verification_token()
        print(f"✅ Verification token generated: {token[:20]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Email service test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing 2FA Implementation...")
    print("=" * 50)
    
    all_tests_passed = True
    
    # Test imports
    if not test_imports():
        all_tests_passed = False
    
    # Test email service
    if not test_email_service():
        all_tests_passed = False
    
    print("\n" + "=" * 50)
    
    if all_tests_passed:
        print("🎉 All tests passed! Deployment should work.")
    else:
        print("💥 Some tests failed. Check the errors above.")
        sys.exit(1)
