from django.urls import path

from apps.properties.views.property_views import PropertyCreateAPIView

urlpatterns = [
    path("", PropertyCreateAPIView.as_view(), name="property-create",),
]
