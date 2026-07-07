from django.urls import path

from apps.listings.views import ListingListCreateAPIView

urlpatterns = [
    path("", ListingListCreateAPIView.as_view(), name="listing-list-create"),
    
]