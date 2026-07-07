from django.urls import path

from apps.listings.views.saved_listing_views import SaveListingAPIView


urlpatterns = [
    path("", SaveListingAPIView.as_view(), name="save-listing"),
]