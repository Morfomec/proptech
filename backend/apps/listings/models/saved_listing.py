from django.conf import settings
from django.db import models

from apps.common.models import BaseModel
from apps.listings.models.listing import Listing


class SavedListing(BaseModel):
    """Represents a user's bookmarked listing"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_listings",
    )

    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="saved_by_users",
    )

    class Meta:
        db_table = "saved_listings"
        ordering = ["-created_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["user", "listing"],
                name="unique_saved_listing",
            )
        ]

        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["listing"]),
        ]


    def __str__(self):
        return f"{self.user.email} saved '{self.listing.title}'"

