from django.conf import settings
from django.db import models

from apps.common.models import BaseModel
from apps.properties.choices import (
    ConstructionStatus,
    PropertyCategory,
    PropertyStatus,
    PropertyType,
)


class Property(BaseModel):
    """Represents a physcial property owned by a user."""

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="properties")
    property_type = models.CharField(max_length=30, choices=PropertyType.choices)
    property_category = models.CharField(max_length=30, choices=PropertyCategory.choices)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    total_units = models.PositiveIntegerField(default=1)
    total_floors = models.PositiveIntegerField(null=True, blank=True)
    construction_status = models.CharField(max_length=30, choices=ConstructionStatus.choices, null=True, blank=True)
    status = models.CharField(max_length=20, choices=PropertyStatus.choices, default=PropertyStatus.DRAFT)

    class Meta:
        db_table = "properties"
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["property_type"]),
            models.Index(fields=["property_category"]),
        ]

    
    def __str__(self):
        return self.title

