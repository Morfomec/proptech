from django.urls import path

from apps.properties.views.unit_views import (
    UnitCreateAPIView, PropertyUnitListAPIView, UnitDetailAPIView, UnitUpdateAPIView, UnitDeleteAPIView
)


urlpatterns = [
    path("", UnitCreateAPIView.as_view(), name="unit-create"),
    path("<uuid:unit_uuid>/", UnitDetailAPIView.as_view(), name="unit-detail"),
    path("<uuid:unit_uuid>/update/",UnitUpdateAPIView.as_view(), name="unit-update"),
    path("<uuid:unit_uuid>/delete/",UnitDeleteAPIView.as_view(), name="unit-delete"),
]
