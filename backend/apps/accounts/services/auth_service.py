from django.contrib.auth import get_user_model
from django.db import transaction

from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .email_service import EmailService
from apps.accounts.models import (User, UserProfile, UserAddress, UserRole, Role)


User = get_user_model()

class AuthService:
    """Business logic for authentication"""



# Regsitration ----------------------------------------------



    @staticmethod
    @transaction.atomic
    def register_user(validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(**validated_data)

        AuthService._initialize_user(user)
        
        AuthService.send_verification_email(user)

        return user

    #an help methode to make the register_user method light and simplified
    @staticmethod
    def _initialize_user(user):
        """Creat default resources for a newly registered user."""

        UserProfile.objects.create(user=user)
        UserAddress.objects.create(user=user)
        tenant_role = Role.objects.get(name=Role.RoleChoices.TENANT)
        UserRole.objects.create(user=user, role=tenant_role)
    
    
    @staticmethod
    def send_verification_email(user):
        
        token = PasswordResetTokenGenerator().make_token(user)

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        verification_url = (
            f"{settings.FRONTEND_URL}"
            f"/verify-email/{uid}/{token}"
        )

        EmailService.send_verification_email(
            user=user,
            verification_url=verification_url,
        )


    @staticmethod
    def resend_verification_email(validated_data):
        email = validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ValidationError(
                {"email": "User not found."}
            )

        if user.email_verified:
            raise ValidationError(
                {"email": "Email is already verified."}
            )

        AuthService.send_verification_email(user)


    @staticmethod
    def verify_email(validated_data):

        uid = validated_data["uid"]
        token = validated_data["token"]


        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist,):
            raise ValidationError(
                {"token": "Invalid verification link."}
            )

        if not PasswordResetTokenGenerator().check_token(
            user, token,
        ):
            raise ValidationError(
                {"token": "Invalid verification link."}
            )

        if user.email_verified:
            raise ValidationError(
                {
                    "email": "Email is already verified."
                }
            )


        user.email_verified = True

        user.save(update_fields=["email_verified"])



# Authentication ------------------------------------------------




    @staticmethod
    def login_user(validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        user = authenticate(
            email=email,
            password=password,
        )

        if user is None:
            raise AuthenticationFailed(
                "Invalid email or password."
            )


        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            # "user": user,
            "tokens":{
                "access": str(access),
                "refresh": str(refresh),
            },
        }

    @staticmethod
    def logout_user(validated_data):
        refresh_token = validated_data["refresh"]

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception:
            raise ValidationError(
                "Invalid or expired refresh token."
            )






# Password Reset ---------------------------------------------




    @staticmethod
    def forgot_password(validated_data):
        email = validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return
        
        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = (
            f"{settings.FRONTEND_URL}"
            f"/reset-password/{uid}/{token}"
        )


        EmailService.send_password_reset_email(
            user=user,
            reset_url=reset_url,
        )

    @staticmethod
    def reset_password(validated_data):
        uid = validated_data["uid"]
        token = validated_data["token"]
        password = validated_data["password"]


        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise ValidationError(
                "Invalid reset link."
            )

        if not PasswordResetTokenGenerator().check_token(
            user, token,
        ):
            raise ValidationError(
                "Invalid or expired reset token."
            )

        user.set_password(password)
        user.save()


