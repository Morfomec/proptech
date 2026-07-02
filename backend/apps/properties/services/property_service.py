from django.db import transaction
from django.contrib.auth import get_user_model

from apps.properties.models import Property, PropertyAddress

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