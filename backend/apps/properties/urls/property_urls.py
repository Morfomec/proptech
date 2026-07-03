from django.urls import path

from apps.properties.views.property_views import PropertyCreateAPIView, MyPropertyListAPIView, PropertyRetrieveUpdateAPIView

urlpatterns = [
    path("", PropertyCreateAPIView.as_view(), name="property-create",),
    path("me/", MyPropertyListAPIView.as_view(), name="my-properties"),
    path("<uuid:property_uuid>/", PropertyRetrieveUpdateAPIView.as_view(), name="property-detail"),
]
