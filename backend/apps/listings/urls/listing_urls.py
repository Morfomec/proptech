from django.urls import path

from apps.listings.views import ListingListCreateAPIView, ListingDetailAPIView, ListingPublishAPIView, ListingArchiveAPIView, MyListingAPIView

urlpatterns = [
    path("", ListingListCreateAPIView.as_view(), name="listing-list-create"),
    path("my/", MyListingAPIView.as_view(), name="my-listings"),
    path("<uuid:listing_uuid>/", ListingDetailAPIView.as_view(), name="listing-detail"),
    path("<uuid:listing_uuid>/publish/", ListingPublishAPIView.as_view(), name="listing-publish"),
    path("<uuid:listing_uuid>/archive/", ListingArchiveAPIView.as_view(), name="listing-archive"),

]