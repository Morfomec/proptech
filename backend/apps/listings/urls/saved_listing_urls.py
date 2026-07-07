from django.urls import path

from apps.listings.views.saved_listing_views import SavedListingAPIView, RemoveSavedListingAPIView


urlpatterns = [
    path("", SavedListingAPIView.as_view(), name="save-listing"),
    path("<uuid:listing_uuid>/", RemoveSavedListingAPIView.as_view(), name="remove-saved-listing"),
]