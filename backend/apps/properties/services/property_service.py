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

        address_data = validated_data = validated_data.pop("address", None)

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