from django.urls import path

from apps.listings.views import ListingCreateAPIView

urlpatterns = [
    path("", ListingCreateAPIView.as_view(), name="listing-create"),
]