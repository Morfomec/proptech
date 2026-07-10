from rest_framework import serializers

from apps.properties.models import Unit
from apps.listings.models import Listing
# from apps.listings.choices import ListingStatus, ListingType


class ListingCreateSerializer(serializers.ModelSerializer):
    """Validates data required to create a new listing."""

    unit = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=Unit.objects.filter(deleted_at__isnull=True)
    )


    class Meta:
        model = Listing
        fields = (
            "unit",
            "listing_type",
            "title",
            "description",
            "available_from",
            
        )

        extra_kwargs = {
            "title": {
                "trim_whitespace": True,
            },
            "description": {
                "required": False,
                "allow_blank": True,
                "trim_whitespace": True,
            },
        }

    def validate_title(self, value: str) -> str:
        """Ensure the listing tilee is meaningful."""
        
        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must contain at least 5 characters."
            )

        return value
    
    def validate_description(self, value: str) -> str:
        """ Normalize the description before passing it to the service layer"""

        return value.strip() if value else value



class ListingUpdateSerializer(serializers.ModelSerializer):
    """Validate data for updating a draft list"""

    class Meta:
        model=Listing

        fields = (
            "title",
            "description",
            "available_from",
        )

    
    def validate_title(self, value: str) -> str:
        value = value.strip()

        if len(value) < 5:

            raise serializers.ValidationError(
                "Title must contain at least 5 characters."
            )

        return value
    
    def validate_description(self, value: str) -> str:
        return value.strip()


class ListingListSerializer(serializers.ModelSerializer):
    """Ser2752a701-d27c-4c3b-ba91-c3b0c9f9c8a3ializer for listing search results."""

    unit = serializers.UUIDField(source="unit.uuid", read_only=True)

    class Meta:
        model = Listing

        fields = (
            "uuid",
            "unit",
            "title",
            "price",
            "listing_status",
            "available_from",
        )

        read_only_fields = fields


class ListingDetailSerializer(serializers.ModelSerializer):
    """Serializer for retrieving listing details."""

    unit_uuid = serializers.UUIDField(source="unit.uuid", read_only=True)
    property_uuid = serializers.UUIDField(source="unit.property.uuid", read_only=True)
    created_by_uuid = serializers.UUIDField(source="created_by.uuid", read_only=True)


    class Meta:
        model = Listing

        fields = (
            "uuid",
            "unit_uuid",
            "property_uuid",
            "created_by_uuid",
            "listing_type",
            "listing_status",
            "title",
            "description",
            "price",
            "available_from",
            "published_at",
            "expires_at",
            "view_count",
            "favorite_count",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields


class UnitSummarySerializer(serializers.ModelSerializer):
    pass

class PropertySummarySerializer(serializers.ModelSerializer):
    pass