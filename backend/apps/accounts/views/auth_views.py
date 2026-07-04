from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


from apps.accounts.serializers.auth_serializer import (RegisterSerializer, LoginSerializer, UserSerializer, LogoutSerializer, ForgotPasswordSerializer,          
ResetPasswordSerializer, VerifyEmailSerializer, ResendVerificationSerializer,
)
from apps.accounts.services.auth_service import AuthService
from rest_framework.permissions import IsAuthenticated


class RegisterAPIView(APIView):
    """Register a new user"""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        AuthService.register_user(serializer.validated_data)

        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    """Authenticate a user and return JWT tokens."""

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        login_data = AuthService.login_user(serializer.validated_data)

        return Response(
            {"message": "Login successful.", **login_data,},
            status=status.HTTP_200_OK,
        )

class CurrentUserAPIView(APIView):
    """Return the authenticated user;s details."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

class LogoutAPIView(APIView):
    """Logout user by blacklisting the refresh token."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        AuthService.logout_user(serializer.validated_data)

        return Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )


class ForgotPasswordAPIView(APIView):
    """Send password reset email."""

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        AuthService.forgot_password(serializer.validated_data)

        return Response(
            {"message":(
                "If an account with that email exists, "
                "a password reset link has been sent."
            )}, status=status.HTTP_200_OK,
        )


class ResetPasswordAPIView(APIView):
    "Reset user password."

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        AuthService.reset_password(serializer.validated_data)

        return Response(
            {"message": "Passowrd reset successful."}, status=status.HTTP_200_OK,
        )



class VerifyEmailAPIView(APIView):
    """Verify user's email address."""

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        AuthService.verify_email(serializer.validated_data)

        return Response(
            {"message": "Email verified successfully."}, status=status.HTTP_200_OK,
        )



class ResendVerificationAPIView(APIView):
    """Resend verification email."""


    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        AuthService.resend_verification_email(serializer.validated_data)


        return Response(
            {"message": "Verification email sent  successfully."}, status=status.HTTP_200_OK,
        )