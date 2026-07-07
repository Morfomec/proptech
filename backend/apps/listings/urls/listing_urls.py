from django.urls import path

from apps.listings.views import ListingListCreateAPIView, ListingDetailAPIView

urlpatterns = [
    path("", ListingListCreateAPIView.as_view(), name="listing-list-create"),
    path("<uuid:listing_uuid>/", ListingDetailAPIView.as_view(), name="listing-detail"),

]