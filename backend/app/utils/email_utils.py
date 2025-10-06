import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    cc: Optional[List[str]] = None,
    from_email: Optional[str] = None
) -> bool:
    """
    Send an email with HTML content.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content of the email
        cc: Optional list of CC recipients
        from_email: Optional sender email (defaults to settings.EMAILS_FROM_EMAIL)
        
    Returns:
        bool: True if the email was sent successfully, False otherwise
    """
    # Use the configured sender email or the provided one
    sender_email = from_email or settings.EMAILS_FROM_EMAIL
    
    # Create a multipart message
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = to_email
    
    if cc:
        message["Cc"] = ", ".join(cc)
    
    # Attach HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)
    
    # If we're using the console backend, just log the email
    if settings.EMAIL_BACKEND == "CONSOLE":
        logger.info(f"Email would be sent to: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"From: {sender_email}")
        logger.info(f"Content: {html_content}")
        return True
    
    # Otherwise, try to send via SMTP
    elif settings.EMAIL_BACKEND == "SMTP":
        try:
            logger.info(f"Attempting to send email via SMTP to: {to_email}")
            logger.info(f"SMTP Server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
            
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.set_debuglevel(1)  # Enable debug output
            server.starttls()
            
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                logger.info(f"Authenticating with user: {settings.SMTP_USER}")
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            
            recipients = [to_email]
            if cc:
                recipients.extend(cc)
                
            logger.info(f"Sending email from {sender_email} to {recipients}")
            server.sendmail(sender_email, recipients, message.as_string())
            server.quit()
            logger.info("Email sent successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            if hasattr(e, 'smtp_code'):
                logger.error(f"SMTP Error Code: {e.smtp_code}")
            if hasattr(e, 'smtp_error'):
                logger.error(f"SMTP Error Message: {e.smtp_error}")
            return False
    
    else:
        logger.error(f"Unsupported email backend: {settings.EMAIL_BACKEND}")
        return False
