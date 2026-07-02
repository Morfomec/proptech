from django.urls import path

from apps.properties.views.property_views import PropertyCreateAPIView, MyPropertyListAPIView

urlpatterns = [
    path("", PropertyCreateAPIView.as_view(), name="property-create",),
    path("me/", MyPropertyListAPIView.as_view(), name="my-properties"),
]
