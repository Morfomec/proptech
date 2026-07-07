from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from uuid import UUID
from django.contrib.auth import get_user_model

from rest_framework.exceptions import ValidationError

from apps.properties.models import Unit, UnitPricing

User = get_user_model()

class UnitPricingService:
    """Handles all business logic related to unit pricing."""

    @staticmethod
    @transaction.atomic
    def create_pricing(*, owner: User, validated_data: dict):
        """Create pricing for a unit."""

        unit = UnitPricingService._get_owned_unit(
            owner=owner,
            unit_uuid=validated_data["unit_uuid"],
        )

        if UnitPricing.objects.filter(unit=unit).exists():
            raise ValidationError(
                {"unit_uuid": ["Pricing already exists for this unit."]}
            )

        # if unit is None:
        #     raise ValidationError(
        #         {"unit_uuid": "Unit not found or you do not have permission."}
                
        #     )
        
        # if Unitpricing.objects.filter(unit=unit).exists():
        #     raise ValidationError(
        #         {"unit_uuid": "Pricing already exists for this unit."}
        #     )

        return UnitPricing.objects.create(
            unit=unit,
            rent_amount=validated_data["rent_amount"],
            security_deposit=validated_data["security_deposit"],
            maintenance_charge=validated_data["maintenance_charge"],
        )



    @staticmethod
    def get_pricing(*, owner: User, unit_uuid: UUID) -> UnitPricing:
        """Retrieve pricing for a unit owned by the authenticated user."""

        unit = UnitPricingService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

        return unit.pricing
    

    @staticmethod
    @transaction.atomic
    def update_pricing(*, owner: User, unit_uuid: UUID, validated_data: dict) -> UnitPricing:
        """Update pricing for a unit."""

        unit = UnitPricingService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

        pricing = unit.pricing

        for field, value in validated_data.items():
            setattr(pricing, field, value)


        pricing.save()

        return pricing
    




    # helper methods......


    @staticmethod
    def _get_owned_unit(*, owner: User, unit_uuid: UUID) -> Unit:
        """ Retrieve a unit owned by the authenticated user. """

        try:
            return (
                Unit.objects
                .select_related("property")
                .get(
                    uuid=unit_uuid,
                    property__owner=owner,
                    deleted_at__isnull=True,
                )
            )

        except Unit.DoesNotExist:
            raise ObjectDoesNotExist(
                "Unit not found."
            )
        

