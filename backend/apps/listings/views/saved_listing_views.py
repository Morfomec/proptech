from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.listings.serializers.saved_listing_serializer import (
    SaveListingSerializer, SavedListingReadSerializer,
)
from apps.listings.services.saved_listing_service import (
    SavedListingService,
)


class SavedListingAPIView(GenericAPIView):
    """Handles saved listing operations for authenticated users."""


    serializer_class = SaveListingSerializer
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return SaveListingSerializer
        return SavedListingReadSerializer

    def post(self, request):
        """Save a listing for an authenticated user."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        SavedListingService.save_listing(
            user=request.user,
            listing_uuid=serializer.validated_data["listing_uuid"]
        )

        return Response(
            {"detail": "Listing saved successfully."},
            status=status.HTTP_201_CREATED,
        )
    


    def get(self, request):
        """Retrieve all saved"""

        saved_listings = SavedListingService.get_saved_listings(
            user=request.user
        )


        serializer = self.get_serializer(saved_listings, many=True)

        return Response(serializer.data)
    

class RemoveSavedListingAPIView(GenericAPIView):
    """
    Removes a saved listing for the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, listing_uuid):
        """
        Remove a saved listing.
        """
        SavedListingService.remove_saved_listing(
            user=request.user,
            listing_uuid=listing_uuid,
        )

        return Response(
            {"detail": "Saved listing removed successfully."},
            status=status.HTTP_200_OK,
        )