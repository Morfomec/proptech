from django.db import transaction
from django.db.models import QuerySet
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from apps.properties.models import Unit, UnitPricing, UnitOwnership, UnitImage, Property
from apps.properties.choices import OwnershipType, OwnershipVerificationStatus

from uuid import UUID

User = get_user_model()

class UnitService:
    """Handles all buisness logic related to Unit Management."""

    @staticmethod
    @transaction.atomic
    def create_unit(*, owner: User, validated_data: dict) -> Unit:

        pricing_data = validated_data.pop("pricing")

        property_obj = UnitService._get_owned_property(
            owner=owner,
            property_uuid=validated_data["property"].uuid,
        )

        validated_data["property"] = property_obj

        unit = Unit.objects.create(**validated_data)

        UnitService._create_pricing(unit=unit, pricing_data=pricing_data)
        UnitService._create_initial_owner(unit=unit, owner=owner)

        return unit


    @staticmethod
    def get_property_units(*, owner: User, property_uuid) -> QuerySet[Unit]:
        """Retrieve all the active units belonging to a property owner by the authenticated user."""

        property_obj = UnitService._get_owned_property(
            owner=owner,
            property_uuid=property_uuid,
        )


        return (
            Unit.objects.filter(
                property=property_obj,
                deleted_at__isnull=True,
            )
            .order_by("-created_at")
        )


    @staticmethod
    def get_unit(*, owner: User, unit_uuid: UUID) -> Unit:
        """Retrieve a single unit owned by the authenticated user."""

        return UnitService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )


    @staticmethod
    @transaction.atomic
    def update_unit(*, owner: User, unit_uuid: UUID, validated_data: dict) -> Unit:
        """Update a unit and its pricing information."""

        unit = UnitService._get_owned_unit(
            owner=owner, unit_uuid=unit_uuid,
        )

        pricing_data = validated_data.pop("pricing", None)

        for field, value in validated_data.items():
            setattr(unit, field, value)
        
        unit.save()

        if pricing_data:

            pricing = unit.pricing
            
            for field, value in pricing_data.items():
                setattr(pricing, field, value)

            pricing.save()

        return unit



    @staticmethod
    @transaction.atomic
    def delete_unit(*, owner: User, unit_uuid: UUID) -> None:
        """Soft delete a unit."""

        unit = UnitService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

        unit.deleted_at = timezone.now()

        unit.save(
            update_fields=["deleted_at"]
        )
        

    





### Private Helper Methods



    @staticmethod
    def _get_owned_property(*, owner: User, property_uuid: UUID) -> Property:
        """Retrieve a property owner by the authenticated user."""

        try:
            return Property.objects.get(
                uuid=property_uuid,
                owner=owner,
                deleted_at__isnull=True,
            )

        except Property.DoesNotExist:
            raise ObjectDoesNotExist("Property not found.")


    @staticmethod
    def _create_pricing(*, unit: Unit, pricing_data:dict) -> UnitPricing:
        """Create pricing information for a unit."""
        
        return UnitPricing.objects.create(
            unit=unit, **pricing_data,
        )

    @staticmethod
    def _create_initial_owner(*, unit: Unit, owner: User) -> UnitOwnership:
        """Register the authenticated user as the initial owner of the unit."""

        return UnitOwnership.objects.create(
            unit=unit,
            user=owner,
            ownership_percentage=100,
            ownership_type=OwnershipType.SOLE,
            verified_status=OwnershipVerificationStatus.VERIFIED,
        )



    @staticmethod
    def _get_owned_unit(*, owner: User, unit_uuid: UUID) -> Unit:
        """Retrieve a unit owned by the authenticated user.

        Owner ship is validated through the parent property"""

        try:
            return Unit.objects.select_related(
                "property",
                "pricing",
            ).get(
                uuid=unit_uuid,
                property__owner=owner,
                deleted_at__isnull=True,
            )

        except Unit.DoesNotExist:
            raise ObjectDoesNotExist(
                "Unit not found."
            )