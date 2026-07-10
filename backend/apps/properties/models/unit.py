from django.db import models

from apps.common.models import BaseModel
from apps.properties.choices import (
    AvailabilityStatus, FurnishingStatus, UnitStatus, UnitType,
)
from apps.properties.models.property import Property


class Unit(BaseModel):
    """Represents the smallest rentable entity within a property.

    A property may contain multiple units (apartments, shops, offices, rooms)."""

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="units", help_text="The property this unit belongs to.")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    unit_number = models.CharField(max_length=50, blank=True)
    floor_number = models.SmallIntegerField(null=True, blank=True)
    unit_type = models.CharField(max_length=30, choices=UnitType.choices)
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    balconies = models.PositiveSmallIntegerField(null=True, blank=True)
    parking_available = models.BooleanField(default=False)
    furnishing_status = models.CharField(max_length=30, choices=FurnishingStatus.choices, default=FurnishingStatus.UNFURNISHED)
    area_sqft = models.DecimalField(max_digits=10, decimal_places=2)
    
    
    availability_status = models.CharField(max_length=30, choices=AvailabilityStatus.choices, default=AvailabilityStatus.AVAILABLE)
    
    #
    status = models.CharField(max_length=20, choices=UnitStatus.choices, default=UnitStatus.ACTIVE)

    class Meta:
        db_table = "units"
        ordering = ["floor_number", "unit_number"]

        constraints = [
            models.UniqueConstraint(
                fields=["property", "unit_number"],
                name="unique_unit_number_per_property",
            )
        ]

    def __str__(self):
        return self.title