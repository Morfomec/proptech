from django.core.exceptions import ValidationError, PermissionDenied
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

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
    def get_listings(*, filters: dict | None = None):
        """Returns all active listings."""

        return Listing.objects.filter(
            deleted_at__isnull=True,
            # listing_status=ListingStatus.ACTIVE,
        ).select_related(
            "unit", "unit__property", "created_by",
        ).order_by("-published_at")
    

    @staticmethod
    def get_listing(*, listing_uuid) -> Listing:
        """Returns a single listing by UUID."""

        return get_object_or_404(
            Listing.objects.select_related(
            "unit",
            "unit__property",
            "created_by",
            ),
            uuid=listing_uuid,
            deleted_at__isnull=True,
        )

    @staticmethod
    @transaction.atomic
    def update_listing(*, listing_uuid, user, validated_data: dict) -> Listing:
        """Updates an existing listing."""


        listing = ListingService.get_listing(
            listing_uuid=listing_uuid,
        )

        if listing.created_by != user:
            raise PermissionDenied(
                "You do not have perimission to update this listing."
            )
        
        if listing.listing_status != ListingStatus.DRAFT:
            raise ValidationError(
                "Only draft listings can be updated."
            )

        for field, value in validated_data.items():
            setattr(listing, field, value)

        listing.save()

        return listing
    


    @staticmethod
    @transaction.atomic
    def delete_listing(*, listing_uuid, user) -> None:
        """Soft deleted a listing."""


        listing = ListingService.get_listing(
            listing_uuid=listing_uuid,
        )

        if listing.created_by != user:
            raise PermissionDenied(
                "You do not have permission to delete this listing."
            )
        
        if listing.listing_status not in (
            ListingStatus.DRAFT,
            ListingStatus.ARCHIVED,
        ):
            raise ValidationError(
                "Only draft or archived listings can be deleted."
            )
        

        listing.deleted_at = timezone.now()
        listing.save(update_fields=["deleted_at"])


    @staticmethod
    @transaction.atomic
    def publish_listing(*, listing_uuid, user) -> Listing:
        """Publish a draft lisitng."""

        listing = ListingService.get_listing(
            listing_uuid=listing_uuid,
        )

        if listing.created_by != user:
            raise PermissionDenied(
                "You do not have permission to publish this listing."
            )
        
        if listing.listing_status != ListingStatus.DRAFT:
            raise ValidationError(
                "Only draft listings can be published."
            )
        

        active_listing_existis = Listing.objects.filter(
            unit=listing.unit,
            listing_status=ListingStatus.ACTIVE,
            deleted_at__isnull=True,
        ).exclude(
            pk=listing.pk,
        ).exists()

        if active_listing_existis:
            raise ValidationError(
                "This unit already has an active listing."
            )
        
        listing.listing_status = ListingStatus.ACTIVE
        listing.published_at = timezone.now()
        
        listing.save(
            update_fields=[
                "listing_status",
                "published_at",
                "updated_at",
            ]
        )

        return listing
    

    @staticmethod
    @transaction.atomic
    def archive_listing(*, listing_uuid, user) -> Listing:
        """Archives an  active listing."""

        listing = ListingService.get_listing(
            listing_uuid=listing_uuid,
        )


        if listing.created_by != user:
            raise PermissionDenied(
                "You do not have permission to archive this listing."
            )
        
        if listing.listing_status != ListingStatus.ACTIVE:
            raise ValidationError(
                "Only active listings can be archived."
            )


        listing.listing_status = ListingStatus.ARCHIVED
        listing.save(
            update_fields=["listing_status", "updated_at"]
        )

        return listing


    @staticmethod
    def get_my_listing(*, user):
        """ Return all listing created by the authenticated user."""


        return (
            Listing.objects.filter(
                created_by=user,
                deleted_at__isnull=True,
            )
            .select_related(
                "unit",
                "unit__property",
                "created_by",
            )
            .order_by("created_at")
        )
    

    # mark_rented()
    # Marketplace
    # Public List
    # Public Detail
    # Search
