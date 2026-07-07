from rest_framework import serializers


from apps.listings.serializers import ListingListSerializer
from apps.listings.models import SavedListing

class SaveListingSerializer(serializers.Serializer):
    """Serializer for saving a listing."""



    listing_uuid = serializers.UUIDField()


class SavedListingReadSerializer(serializers.Serializer):
    """Return saved listing details."""


    listing = ListingListSerializer(read_only=True)

    class Meta:
        models = SavedListing
        fields = (
            "uuid",
            "listing",
            "created_at",
        )