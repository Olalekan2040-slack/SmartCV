"""
Email service for sending verification codes and notifications.
"""
import smtplib
import secrets
import string
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.models import User


class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
    
    def _create_smtp_connection(self):
        """Create and configure SMTP connection."""
        try:
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            return server
        except Exception as e:
            raise Exception(f"Failed to connect to SMTP server: {str(e)}")
    
    def generate_verification_code(self, length: int = 6) -> str:
        """Generate a random verification code."""
        return ''.join(secrets.choice(string.digits) for _ in range(length))
    
    def generate_verification_token(self, length: int = 32) -> str:
        """Generate a random verification token."""
        return secrets.token_urlsafe(length)
    
    def send_2fa_code(self, email: str, code: str, user_name: str) -> bool:
        """Send 2FA verification code via email."""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = email
            msg['Subject'] = "SmartCV - Two-Factor Authentication Code"
            
            # Create HTML email body
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 SmartCV Security</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Two-Factor Authentication</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Hello {user_name}!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Someone is trying to sign in to your SmartCV account. If this was you, please use the verification code below:
                        </p>
                        
                        <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                                {code}
                            </div>
                            <p style="color: #888; font-size: 14px; margin: 10px 0 0 0;">This code expires in 10 minutes</p>
                        </div>
                        
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                            <p style="color: #856404; margin: 0; font-size: 14px;">
                                <strong>Security Note:</strong> If you didn't request this code, please ignore this email and consider changing your password.
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Best regards,<br>
                            <strong>The SmartCV Team</strong>
                        </p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p>This is an automated message from SmartCV. Please do not reply to this email.</p>
                    </div>
                </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            with self._create_smtp_connection() as server:
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Failed to send 2FA code email: {str(e)}")
            return False
    
    def send_email_verification(self, email: str, verification_token: str, user_name: str) -> bool:
        """Send email verification link."""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = email
            msg['Subject'] = "SmartCV - Verify Your Email Address"
            
            verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
            
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">✨ Welcome to SmartCV!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Email Verification Required</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Welcome {user_name}!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for joining SmartCV! To complete your registration and start creating professional CVs with AI assistance, please verify your email address.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verification_url}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 15px 30px; 
                                      text-decoration: none; 
                                      border-radius: 25px; 
                                      font-weight: bold; 
                                      font-size: 16px;
                                      display: inline-block;">
                                ✅ Verify Email Address
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            If the button doesn't work, copy and paste this link in your browser:<br>
                            <a href="{verification_url}" style="color: #667eea; word-break: break-all;">{verification_url}</a>
                        </p>
                        
                        <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
                            <p style="color: #1565C0; margin: 0; font-size: 14px;">
                                <strong>Why verify?</strong> Email verification helps secure your account and enables features like password reset and 2FA.
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Best regards,<br>
                            <strong>The SmartCV Team</strong>
                        </p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p>This verification link will expire in 24 hours.</p>
                    </div>
                </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            with self._create_smtp_connection() as server:
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Failed to send email verification: {str(e)}")
            return False
    
    def send_login_notification(self, email: str, user_name: str, login_info: dict) -> bool:
        """Send login notification email."""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_user
            msg['To'] = email
            msg['Subject'] = "SmartCV - New Login Detected"
            
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔔 SmartCV Security Alert</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Login Notification</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-top: 0;">Hello {user_name}!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            We detected a new login to your SmartCV account. Here are the details:
                        </p>
                        
                        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <table style="width: 100%; font-size: 14px;">
                                <tr>
                                    <td style="color: #666; padding: 5px 0;"><strong>Time:</strong></td>
                                    <td style="color: #333; padding: 5px 0;">{login_info.get('time', 'Unknown')}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; padding: 5px 0;"><strong>IP Address:</strong></td>
                                    <td style="color: #333; padding: 5px 0;">{login_info.get('ip', 'Unknown')}</td>
                                </tr>
                                <tr>
                                    <td style="color: #666; padding: 5px 0;"><strong>Device:</strong></td>
                                    <td style="color: #333; padding: 5px 0;">{login_info.get('device', 'Unknown')}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                            <p style="color: #856404; margin: 0; font-size: 14px;">
                                <strong>Was this you?</strong> If you didn't log in, please change your password immediately and contact our support team.
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Best regards,<br>
                            <strong>The SmartCV Team</strong>
                        </p>
                    </div>
                </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            with self._create_smtp_connection() as server:
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Failed to send login notification: {str(e)}")
            return False


# Global email service instance
email_service = EmailService()
