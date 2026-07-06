from django.conf import settings
from django.db import models

from apps.common.models import BaseModel
from apps.properties.models.unit import Unit

from apps.listings.choices import ListingStatus, ListingType


class Listing(BaseModel):
    """Represents market place listing for units either for rent or sale."""

    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="listings")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings")
    listing_type = models.CharField(max_length=20, choices=ListingType.choices)
    listing_status = models.CharField(max_length=20, choices=ListingStatus.choices, default=ListingStatus.ACTIVE)

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=12, decimal_places=2)

    available_from = models.DateField()
    published_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    view_count = models.PositiveIntegerField(default=0)
    favorite_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["listing_status"]),
            models.Index(fields=["listing_type"]),
            models.Index(fields=["available_from"]),
            models.Index(fields=["price"]),
        ]


    def __str__(self):
        return f"{self.title} -({self.unit.unit_number})"
