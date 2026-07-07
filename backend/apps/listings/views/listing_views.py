from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response


from apps.listings.serializers import ListingCreateSerializer, ListingDetailSerializer, ListingListSerializer

from apps.listings.services import ListingService


class ListingListCreateAPIView(GenericAPIView):
    """
    API endpoint for listing and creating listings.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ListingListSerializer
        
        return ListingCreateSerializer

    def get(self, request, *args, **kwargs):
        listings = ListingService.get_listings()

        serializer = self.get_serializer(
            listings, many=True,
        )

        return Response(serializer.data)


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

# class ListingListAPIView(GenericAPIView):
#     """Returns all active listiings."""


#     serialzier_class = ListingListSerializer
#     perimission_classes = [AllowAny]

#     def get(self, request, *args, **kwargs):
#         listings = ListingService.get_listings()

#         serializer = self.get_serializer(
#             listings, many=True,
#         )

#         return Response(serializer.data)


class ListingDetailAPIView(GenericAPIView):
    """Retrieve a single listing."""


    serializer_class = ListingDetailSerializer
    permission_classes = [AllowAny]


    def get(self, request,listing_uuid, *args, **kwargs):
        listing = ListingService.get_listing(
            listing_uuid=listing_uuid,
        )

        serializer = self.get_serializer(listing)

        return Response(serializer.data)
    


