from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.listings.serializers.saved_listing_serializer import (
    SavedListingSerializer,
)
from apps.listings.services.saved_listing_service import (
    SavedListingService,
)


class SaveListingAPIView(GenericAPIView):
    """Allows an authenticated user to save a listing."""


    serializer_class = SavedListingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
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
    

