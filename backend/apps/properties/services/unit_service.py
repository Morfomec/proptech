from django.db import transaction
from django.db.models import QuerySet
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Max

from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound


from apps.properties.models import Unit, UnitPricing, UnitOwnership, UnitImage, Property
from apps.properties.choices import OwnershipType, OwnershipVerificationStatus

from uuid import UUID

User = get_user_model()

class UnitService:
    """Handles all buisness logic related to Unit Management."""

    @staticmethod
    @transaction.atomic
    def create_unit(*, owner: User, validated_data: dict) -> Unit:

        pricing_data = validated_data.pop("pricing", None)

        property_obj = UnitService._get_owned_property(
            owner=owner,
            property_uuid=validated_data["property"].uuid,
        )

        validated_data["property"] = property_obj


        UnitService._validate_unique_unit_number(
            property_obj=property_obj,
            unit_number=validated_data["unit_number"],
        )

        unit = Unit.objects.create(**validated_data)


        if pricing_data:
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
        
        if "unit_number" in validated_data:
            UnitService._validate_unique_unit_number(
                property_obj=unit.property,
                unit_number=validated_data["unit_number"],
                exclude_unit_id=unit.id,
            )

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
        


    @staticmethod
    @transaction.atomic
    def upload_unit_image(*, owner: User, unit_uuid: UUID, validated_data: dict) -> UnitImage:
        """Upload an image for a unit."""

        unit = UnitService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

        last_order = (
            UnitImage.objects
            .filter(unit=unit)
            .aggregate(max_order=Max("display_order"))
        )

        validated_data["display_order"] = (
            (last_order["max_order"] or 0) + 1
        )

        has_existing_images = UnitImage.objects.filter(unit=unit).exists()

        is_primary = validated_data.get("is_primary", False)

        if not has_existing_images:
            validated_data["is_primary"] = True

        elif is_primary:

            UnitImage.objects.filter(
                unit=unit,
                is_primary=True,
            ).update(
                is_primary=False,
            )

        unit_image = UnitImage.objects.create(
            unit=unit,
            **validated_data,
        )

        return unit_image    
    
    @staticmethod
    @transaction.atomic
    def delete_unit_image(*, owner: User, unit_uuid: UUID, image_uuid: UUID) -> None:
        """Delete a unit image."""

        unit = UnitService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

        unit_image = UnitService._get_unit_image(
            unit=unit,
            image_uuid=image_uuid,
        )

        was_primary = unit_image.is_primary
        unit_image.image.delete(save=False)

        unit_image.delete()

        if was_primary:
            next_image = (UnitImage.objects.filter(unit=unit)
            .order_by("display_order", "created_at").first()
            )

            if next_image:
                next_image.is_primary = True
                next_image.save(update_fields=["is_primary"])


    





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
        

    @staticmethod
    def _get_unit_image(*, unit: Unit, image_uuid: UUID) -> UnitImage:
        """Retrieve a unit image by its UUID."""

        try:
            return UnitImage.objects.get(
                unit=unit,
                uuid=image_uuid,
            )
        
        except UnitImage.DoesNotExist:
            raise NotFound(
                "Unit image not found."
            )
        

    @staticmethod
    def _validate_unique_unit_number(*, property_obj: Property, unit_number: str, exclude_unit_id: int = None) -> None:
        """Validate that the unit number is unique within the property."""

        queryset = Unit.objects.filter(
            property=property_obj,
            unit_number=unit_number,
            deleted_at__isnull=True,
        )

        if exclude_unit_id:
            queryset = queryset.exclude(id=exclude_unit_id)

        if queryset.exists():
            raise ValidationError(
                {"unit_number": ["A Unit with this unit number already exists for the property."]}
            )