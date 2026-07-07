from rest_framework import serializers



class SavedListingSerializer(serializers.Serializer):
    """Serializer for saving a listing."""



    listing_uuid = serializers.UUIDField()