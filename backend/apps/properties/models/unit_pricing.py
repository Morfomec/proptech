from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


from apps.common.models import BaseModel
from apps.properties.models.unit import Unit


class UnitPricing(BaseModel):
    """Stores the current pricing information for a unit."""


    unit = models.OneToOneField(Unit, on_delete=models.CASCADE, related_name="pricing")
    rent_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))])
    security_deposit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"), validators=[MinValueValidator(Decimal("0.00"))])
    maintenance_charge = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00")), validators=[MinValueValidator(Decimal("0.00"))]

    class Meta:
        db_table = "unit_pricing"

    def __str__(self):
        return f"{self.unit.title} Pricing"