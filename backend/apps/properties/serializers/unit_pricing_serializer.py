from rest_framework import serializers

from apps.properties.models import UnitPricing


class UnitPricingSerializer(serializers.ModelSerializer):
    """Validates and serializes unit pricing data."""


    class Meta:
        model = UnitPricing
        fields = (
            "uuid",
            "unit",
            "rent_amount",
            "security_deposit",
            "maintenance_charge",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "uuid",
            "created_at",
            "updated_at",
        )

class UnitPricingCreateSerializer(serializers.Serializer):
    """Validates the request payloaf for creatign unitpricing"""

    unit_uuid = serializers.UUIDField()
    rent_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    security_deposit = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=0)
    maintenance_charge = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=0)


class UnitPricingDetailSerializer(serializers.ModelSerializer):
    """Return unit pricing details."""

    class Meta:
        model = UnitPricing
        fields = (
            "uuid",
            "rent_amount",
            "security_deposit",
            "maintenance_charge",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class UnitPricingUpdateSerializer(serializers.ModelSerializer):
    """
    Validates unit pricing updates.
    """

    class Meta:
        model = UnitPricing
        fields = (
            "rent_amount",
            "security_deposit",
            "maintenance_charge",
        )