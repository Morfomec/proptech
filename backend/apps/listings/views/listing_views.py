from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.listings.serializers import ListingCreateSerializer, ListingDetailSerializer

from apps.listings.services import ListingService


class ListingCreateAPIView(GenericAPIView):
    """API endpoint for creating a new listing."""

    serializer_class = ListingCreateSerializer
    permission_classes = [IsAuthenticated]


    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        listing = ListingService.create_listing(
            user=request.user,
            validated_data=serializer.validated_data,
        )

        response_serializer = ListingDetailSerializer(listing)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )