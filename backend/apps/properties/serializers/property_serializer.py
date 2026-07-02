from rest_framework import serializers

from apps.properties.models import Property, PropertyAddress

# from .property_address_serializer import PropertyAddressSerializer


class PropertyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAddress

        fields = (
            "address_line_1",
            "address_line_2",
            "landmark",
            "city",
            "district",
            "state",
            "country",
            "pincode",
            "latitude",
            "longitude",
        )


class PropertyWriteSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating properties."""
    address = PropertyAddressSerializer()

    class Meta:
        model = Property
        fields = (
            "property_type",
            "property_category",
            "title",
            "description",
            "total_units",
            "total_floors",
            "construction_status",
            "address",
        )



class PropertyDetailSerializer(serializers.ModelSerializer):
    """Serializer for retrieving detailed property information."""


    address = PropertyAddressSerializer(read_only=True)

    class Meta:
        model = Property
        
        fields = (
            "uuid",
            "property_type",
            "property_category",
            "title",
            "description",
            "total_units",
            "total_floors",
            "construction_status",
            "status",
            "address",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields
        