from django.core.exceptions import ValidationError, PermissionDenied
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

        if unit.property.owner != user:
            raise PermissionDenied(
                "You do not have permission to create a listing for this unit."
            )

        try:
            pricing = unit.pricing
        except UnitPricing.DoesNotExist:
            raise ValidationError(
                "Configure unit price before creating a listing."
            )

        # Prevent multiple draft or active listings for the same unit.
        existing_listing = Listing.objects.filter(
            unit=unit,
            listing_status__in=[
                ListingStatus.DRAFT,
                ListingStatus.ACTIVE,
            ],
            deleted_at__isnull=True,
        ).exists()

        if existing_listing:
            raise ValidationError(
                "This unit already has a draft or active listing."
            )

        listing = Listing.objects.create(
            unit=unit,
            created_by=user,
            listing_status=ListingStatus.DRAFT,
            price=pricing.rent_amount,
            **validated_data,
        )

        return listing


    @staticmethod
    def get_listing(*, filters: dict | None = None):
        """Returns all active listings."""

        return Listing.objects.filter(
            deleted_at__isnull=True,
            # listing_status=ListingStatus.ACTIVE,
        ).select_related(
            "unit", "unit__property", "created_by",
        ).order_by("-published_at")
    

    # update_listing()

    # publish_listing()

    # archive_listing()

    # mark_rented()

    # delete_listing()