from django.db import transaction
from django.db.models import F
from rest_framework.exceptions import ValidationError

from apps.listings.choices import ListingStatus
from apps.listings.models import Listing, SavedListing


class SavedListingService:
    """Handles buisness logic related to saved listings."""



    @staticmethod
    @transaction.atomic
    def save_listing(*, user, listing_uuid):
        """Save an active listing for a user."""


        listing = Listing.objects.filter(
            uuid=listing_uuid,
            listing_status=ListingStatus.ACTIVE,
            deleted_at__isnull=True,
        ).first()


        if not listing:
            raise ValidationError(
                {"listing_uuid": "Listing not found or unavailable."}
            )
        
        if SavedListing.objects.filter(
            user=user,
            listing=listing,
        ).exists():
            raise ValidationError(
                {"listing_uuid": "Listing already saved."}
            )
        
        SavedListing.objects.create(user=user, listing=listing)

        Listing.objects.filter(pk=listing.pk).update(
            favorite_count=F("favorite_count") + 1
        )

        return listing
    


    @staticmethod
    def get_saved_listings(*, user):
        """Return all active saved listings for the authenticated user"""


        return (
            SavedListing.objects.filter(
                user=user,
                listing__listing_status=ListingStatus.ACTIVE,
                listing__deleted_at__isnull=True
            ).select_related(
                "listing",
                "listing__unit",
                "listing__unit__property",
            ).order_by("-created_at")
        )


    @staticmethod
    @transaction.atomic
    def remove_saved_listing(*, user, listing_uuid):
        """Removes a savedf listing for the authenticated user."""


        saved_listing = SavedListing.objects.filter(
            user=user, 
            listing__uuid=listing_uuid,
        ).first()


        if not saved_listing:
            raise ValidationError(
                {"listing_uuid": "Saved listing not found."}
            )
        
        saved_listing.delete()