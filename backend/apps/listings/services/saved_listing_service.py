from django.db import transaction
from django.db.models import F
from rest_framework.exceptions import ValidationError


from apps.listings.models import Listing, SavedListing


class SavedListingService:
    """Handles buisness logic related to saved listings."""



    @staticmethod
    @transaction.atomic
    def save_listing(*, user, listing_uuid):
        """Save an active listing for a user."""


        listing = Listing.objects.filter(
            uuid=listing_uuid,
            listing_status=Listing.Status.ACTIVE,
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
            favorite_count=F("favoriteS_count") + 1
        )

        return listing