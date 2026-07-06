from django.core.exceptions import ValidationError
from django.db import transaction

from apps.listings.choices import ListingStatus
from apps.listings.models import Listing
from apps.properties.models import UnitPricing


class ListingService:
    """Creates all buisness logic related to listing management"""

    @staticmethod
    @transaction.atomic
    def create_listing(*, user, validated_data: dict) -> Listing:
        """Creates a new listing for a unit."""

        unit = validated_data.pop("unit")

        if unit.owner != user:
            raise ValidationError(
                "You do not have permission to create a listing for this unit."
            )

        try:
            pricing = unit.pricing
        except UnitPricing.DoesNotExist:
            raise ValidationError(
                "Configure unit price before creating a listing."
            )

        if Listing.object.filter(
            unit=unit,
            listing_status=ListingStatus.ACTIVE,
            deleted_at__isnull=True,
        ).exists():
            raise ValidationError(
                "This unit already has an active listing."
            )

        listing = Listing.objects.create(
            unit=unit,
            create_by=user,
            listing_status=ListingStatus.DRAFT,
            price=pricing.rent_amount,
            **validated_data,
        )

        return listing

    update_listing()

    publish_listing()

    archive_listing()

    mark_rented()

    delete_listing()