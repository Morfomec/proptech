from django.urls import path

from apps.properties.views.unit_views import (
    UnitCreateAPIView, UnitDetailAPIView, UnitUpdateAPIView, UnitDeleteAPIView, UnitImageUploadAPIView, UnitImageDeleteAPIView, 
)


urlpatterns = [
    path("", UnitCreateAPIView.as_view(), name="unit-create"),
    path("<uuid:unit_uuid>/", UnitDetailAPIView.as_view(), name="unit-detail"),
    path("<uuid:unit_uuid>/update/",UnitUpdateAPIView.as_view(), name="unit-update"),
    path("<uuid:unit_uuid>/delete/",UnitDeleteAPIView.as_view(), name="unit-delete"),
    path("<uuid:unit_uuid>/images/", UnitImageUploadAPIView.as_view(), name="unit-image-upload"),
    path("<uuid:unit_uuid>/images/<uuid:image_uuid>/", UnitImageDeleteAPIView.as_view(), name="unit-image-delete"),
]
