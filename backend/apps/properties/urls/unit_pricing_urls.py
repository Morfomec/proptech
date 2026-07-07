from django.urls import path

from apps.properties.views.unit_pricing_views import (
    UnitPricingAPIView,
)


urlpatterns = [
    path("", UnitPricingAPIView.as_view(), name="create-unit-pricing"),
    path("<uuid:unit_uuid>/", UnitPricingAPIView.as_view(), name="unit-pricing-detail"),
]