from django.db import transaction
from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from apps.properties.models import Property, PropertyAddress, PropertyImage
from uuid import UUID

User = get_user_model()


class PropertyService:

    @staticmethod
    @transaction.atomic
    def create_property(*, owner: User, validated_data: dict) -> Property:
        address_data = validated_data.pop("address")

        property_obj = Property.objects.create(
            owner=owner, **validated_data
        )

        PropertyAddress.objects.create(
            property=property_obj, **address_data
        )

        return property_obj

    @staticmethod
    def get_user_properties(*, owner: User) -> QuerySet[Property]:
        return (
            Property.objects.filter(owner=owner, deleted_at__isnull=True).order_by("-created_at")
        )

    @staticmethod
    def get_property(*, owner: User, property_uuid: UUID) -> Property:

        return PropertyService._get_owned_property(owner=owner, property_uuid=property_uuid)

    @staticmethod
    def _get_owned_property(*, owner: User, property_uuid: UUID) -> Property:
        """Retrieve a property owned by the given user."""

        try:
            return Property.objects.get(uuid=property_uuid, owner=owner, deleted_at__isnull=True)

        except Property.DoesNotExist:
            raise ObjectDoesNotExist("Property not found.")

    @staticmethod
    @transaction.atomic
    def update_property(*, owner: User, property_uuid: UUID, validated_data: dict) -> property:

        property_obj = PropertyService._get_owned_property(
            owner=owner, property_uuid=property_uuid)

        address_data = validated_data.pop("address", None)

        for field, value in validated_data.items():
            setattr(property_obj, field, value)

        property_obj.save()

        if address_data:

            address = property_obj.address

            for field, value in address_data.items():
                setattr(address, field, value)

            address.save()

        return property_obj

    @staticmethod
    @transaction.atomic
    def delete_property(*, owner: User, property_uuid: UUID) -> None:

        property_obj = PropertyService._get_owned_property(
            owner=owner, property_uuid=property_uuid,
        )

        property_obj.deleted_at = timezone.now()

        property_obj.save(
            update_fields=["deleted_at"],
        )

    @staticmethod
    @transaction.atomic
    def upload_property_image(*, owner: User, property_uuid: UUID, validated_data: dict) -> PropertyImage:
        
        property_obj = PropertyService._get_owned_property(
            owner=owner,
            property_uuid=property_uuid,
        )

        has_existing_images = PropertyImage.objects.filter(
            property=property_obj,
        ).exists()


        is_primary = validated_data.get("is_primary", False)  


        if not has_existing_images:
            validated_data["is_primary"] = True  

        elif is_primary:
            PropertyImage.objects.filter(
                property=property_obj,
                is_primary=True,
            ).update(
                is_primary=False,
            )


        property_image = PropertyImage.objects.create(
            property=property_obj,
            **validated_data,
        )

        return property_image




    @staticmethod
    def _get_property_image(*, property_obj: Property, image_uuid: UUID) -> PropertyImage:

        try:
            return PropertyImage.objects.get(
                property=property_obj,
                uuid=image_uuid,
            )

        except PropertyImage.DoesNotExist:
            raise ObjectDoesNotExist(
                "Property image not found."
            )


    @staticmethod
    @transaction.atomic
    def delete_property_image(*, owner: User, property_uuid: UUID, image_uuid: UUID) -> None:

        property_obj = PropertyService._get_owned_property(
            owner=owner,
            property_uuid=property_uuid,
        )


        property_image = PropertyService._get_property_image(
            property_obj=property_obj,
            image_uuid=image_uuid,
        )


        was_primary = property_image.is_primary


        property_image.image.delete(save=False)


        property_image.delete()

        if was_primary:

            next_image = (
                PropertyImage.objects
                .filter(property=property_obj)
                .order_by(
                    "display_order", "created_at",
                )
                .first()
            )

        if next_image:
            next_image.is_primary = True
            next_image.save(update_fields=["is_primary"])

























from uuid import UUID

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import QuerySet
from django.utils import timezone

from apps.properties.choices import (
    OwnershipType,
    OwnershipVerificationStatus,
)
from apps.properties.models import (
    Property,
    Unit,
    UnitOwnership,
    UnitPricing,
)

User = get_user_model()


class UnitService:
    """
    Handles all business logic related to Unit Management.

    Business Rules:
    - Only the property owner can create units.
    - Every unit must have one pricing record.
    - Every newly created unit automatically gets an owner.
    """

    @staticmethod
    @transaction.atomic
    def create_unit(*, owner: User, validated_data: dict) -> Unit:
        """
        Creates a complete Unit aggregate.

        Creates:
        - Unit
        - UnitPricing
        - Initial UnitOwnership

        All operations execute inside a single database transaction.
        """

        # Extract nested pricing payload.
        pricing_data = validated_data.pop("pricing")

        # Verify that the property belongs to the authenticated user.
        property_obj = UnitService._get_owned_property(
            owner=owner,
            property_uuid=validated_data["property"].uuid,
        )

        validated_data["property"] = property_obj

        # Create the unit.
        unit = Unit.objects.create(**validated_data)

        # Create pricing.
        UnitService._create_pricing(
            unit=unit,
            pricing_data=pricing_data,
        )

        # Register the authenticated user as the initial owner.
        UnitService._create_initial_owner(
            unit=unit,
            owner=owner,
        )

        return unit

    @staticmethod
    def get_property_units(*, owner: User, property_uuid: UUID) -> QuerySet[Unit]:
        """
        Returns all active units belonging to one property.
        """

        property_obj = UnitService._get_owned_property(
            owner=owner,
            property_uuid=property_uuid,
        )

        return Unit.objects.filter(
            property=property_obj,
            deleted_at__isnull=True,
        ).order_by(
            "floor_number",
            "unit_number",
        )

    @staticmethod
    def get_unit(*, owner: User, unit_uuid: UUID) -> Unit:
        """
        Returns a single unit owned by the authenticated user.
        """

        return UnitService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

    @staticmethod
    @transaction.atomic
    def delete_unit(*, owner: User, unit_uuid: UUID) -> None:
        """
        Soft deletes a unit.
        """

        unit = UnitService._get_owned_unit(
            owner=owner,
            unit_uuid=unit_uuid,
        )

        unit.deleted_at = timezone.now()

        unit.save(update_fields=["deleted_at"])

    # ------------------------------------------------------------------
    # Private Helper Methods
    # ------------------------------------------------------------------

    @staticmethod
    def _get_owned_property(*, owner: User, property_uuid: UUID) -> Property:
        """
        Returns a property only if it belongs to the authenticated user.
        """

        try:
            return Property.objects.get(
                owner=owner,
                uuid=property_uuid,
                deleted_at__isnull=True,
            )

        except Property.DoesNotExist:
            raise ObjectDoesNotExist("Property not found.")

    @staticmethod
    def _get_owned_unit(*, owner: User, unit_uuid: UUID) -> Unit:
        """
        Returns a unit only if it belongs to one of the user's properties.
        """

        try:
            return Unit.objects.get(
                uuid=unit_uuid,
                property__owner=owner,
                deleted_at__isnull=True,
            )

        except Unit.DoesNotExist:
            raise ObjectDoesNotExist("Unit not found.")

    @staticmethod
    def _create_pricing(*, unit: Unit, pricing_data: dict) -> UnitPricing:
        """
        Creates the pricing record associated with a unit.
        """

        return UnitPricing.objects.create(
            unit=unit,
            **pricing_data,
        )

    @staticmethod
    def _create_initial_owner(*, unit: Unit, owner: User) -> UnitOwnership:
        """
        Registers the authenticated user as the initial owner
        of the newly created unit.
        """

        return UnitOwnership.objects.create(
            unit=unit,
            user=owner,
            ownership_percentage=100,
            ownership_type=OwnershipType.SOLE,
            verified_status=OwnershipVerificationStatus.VERIFIED,
        )
