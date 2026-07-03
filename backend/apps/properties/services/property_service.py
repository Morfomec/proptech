from django.db import transaction
from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from apps.properties.models import Property, PropertyAddress
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
    def get_user_properties(*, owner:User) -> QuerySet[Property]:
        return (
            Property.objects.filter(owner=owner).order_by("-created_at")
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

        property_obj = PropertyService._get_owned_property(owner=owner, property_uuid=property_uuid)

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
    @transition.atomic
    def delete_property(*, owner: User, property_uuid: UUID) -> None:

        property_obj = PropertyService._get_owned_property(
            owner=owner, property_uuid=property_uuid,
        )

        property_obj.deleted_at = timezone.now()

        property_obj.save(
            updated_filed=["deleted_at"],
        )


    