from django.urls import path

from apps.accounts.views.auth_views import (
    RegisterAPIView, LoginAPIView, CurrentUserAPIView, LogoutAPIView, ForgotPasswordAPIView, ResetPasswordAPIView,
    verifyEmailAPIView
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("me/", CurrentUserAPIView.as_view(), name="current-user"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("verify-email/", verifyEmailAPIView.as_view(), name="verify-email"),
]