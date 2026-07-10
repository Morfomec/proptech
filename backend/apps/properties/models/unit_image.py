from django.db import models

from apps.common.models import BaseModel
from apps.properties.models.unit import Unit

class UnitImage(BaseModel):
    """Stores images uploaded for a unit."""


    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="units/")
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveSmallIntegerField(default=1)

    class Meta:
        db_table = "unit_images"
        ordering = ["display_order"]

        constraints = [
            models.UniqueConstraint(
                fields=["unit", "display_order"],
                name="unique_display_order_per_unit",
            )
        ]
    def __str__(self):
        return f"{self.unit.title} Image"