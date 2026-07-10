from django.urls import path

from apps.accounts.views import MyProfileView, UpdateMyProfileView

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my-profile"),
    path("me/update/", UpdateMyProfileView.as_view(), name="update-my-profile"),
    
]