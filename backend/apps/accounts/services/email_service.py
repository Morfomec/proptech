from django.core.mail import send_mail
from django.conf import settings


class EmailService:
    """Service responsible for sending emails."""

    @staticmethod
    def send_password_reset_email(user, reset_url):
        send_mail(
            subject="Reset your password",
            message=(
                f"Click the link below to reset your password:\n\n"
                f"{reset_url}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

    @staticmethod
    def send_verification_email(user, verification_url):
        send_mail(
            subject="Verify your email",
            message=(
                f"Welcome to {settings.APP_NAME}!\n\n"
                f"Click the link below to verify your email:\n\n"
                f"{verification_url}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )