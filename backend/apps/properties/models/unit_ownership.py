from django.db import models

from apps.common.models import BaseModel
from apps.accounts.models.user import User
from apps.properties.choices import OwnershipType, OwnershipVerificationStatus
from apps.properties.models.unit import Unit


class UnitOwnership(BaseModel):
    """Represents ownership of a unit."""

    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="owners")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_units")
    ownership_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    ownership_type = models.CharField(max_length=20, choices=OwnershipType.choices, default=OwnershipType.SOLE)
    verified_status = models.CharField(max_length=20, choices=OwnershipVerificationStatus.choices, default=OwnershipVerificationStatus.PENDING)

    class Meta:
        db_table = "unit_ownerships"

        constraints = [
            models.UniqueConstraint(
                fields=["unit", "user"],
                name="unique_unit_owner"
            )
        ]


    def __str__(self):
        return f"{self.user.email} - {self.unit.title}"


