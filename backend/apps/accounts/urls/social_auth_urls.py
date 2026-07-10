from django.urls import path

from apps.accounts.views.social_auth_views import GoogleLoginView

urlpatterns = [
    path("google/", GoogleLoginView.as_view(), name="google-login"),
]