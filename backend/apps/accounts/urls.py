from django.urls import path

from apps.accounts.views.auth_views import RegisterAPIView


urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
]