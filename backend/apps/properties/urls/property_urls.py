from django.urls import path

from apps.properties.views.property_views import PropertyCreateAPIView, MyPropertyListAPIView, PropertyRetrieveUpdateAPIView, PropertyImageUploadAPIView, PropertyImageDeleteAPIView
from apps.properties.views.unit_views import PropertyUnitListAPIView

urlpatterns = [
    path("", PropertyCreateAPIView.as_view(), name="property-create",),
    path("me/", MyPropertyListAPIView.as_view(), name="my-properties"),
    path("<uuid:property_uuid>/", PropertyRetrieveUpdateAPIView.as_view(), name="property-detail"),
    path("<uuid:property_uuid>/images/", PropertyImageUploadAPIView.as_view(), name="property-image-uploads"),
    path("<uuid:property_uuid>/images/<uuid:image_uuid>/", PropertyImageDeleteAPIView.as_view(), name="property-image-delete"),

    path("<uuid:property_uuid>/units/", PropertyUnitListAPIView.as_view(), name="property-unit-list"),
]
