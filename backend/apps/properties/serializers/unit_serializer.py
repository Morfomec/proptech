from rest_framework import serializers

from apps.properties.models import Unit, UnitPricing, UnitOwnership, UnitImage, Property

class UnitPricingSerializer(serializers.ModelSerializer):
    """Validates unit pricing information."""

    class Meta:
        model = UnitPricing
        fields = (
            "rent_amount",
            "security_deposit",
            "maintenance_charge",
        )


class UnitWriteSerializer(serializers.ModelSerializer):

    property = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=Property.objects.all()
    )

    pricing = UnitPricingSerializer(required=True)


    class Meta:
        model = Unit
        fields = (
            "property",
            "title",
            "description",
            "unit_number",
            "floor_number",
            "unit_type",
            "bedrooms",
            "bathrooms",
            "balconies",
            "parking_available",
            "furnishing_status",
            "area_sqft",
            "availability_status",
            "pricing",
        )


class UnitDetailSerializer(serializers.ModelSerializer):

    pricing = UnitPricingSerializer(read_only=True)

    class Meta:
        model = Unit
        fields = (
            "uuid",
            "property",
            "title",
            "description",
            "unit_number",
            "floor_number",
            "unit_type",
            "bedrooms",
            "bathrooms",
            "balconies",
            "parking_available",
            "furnishing_status",
            "area_sqft",
            "availability_status",
            "status",
            "pricing",
            "created_at",
            "updated_at",
        )