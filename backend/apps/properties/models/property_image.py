from django.db import models

from apps.common.models import BaseModel
from apps.properties.models.property import Property


#function to organize images based on property uuid
def property_image_upload_path(instance, filename):
    return f"properties/{instance.property.uuid}/{filename}"


class PropertyImage(BaseModel):
    """Stores images associatied with a property"""

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to=property_image_upload_path)
    display_order = models.PositiveIntegerField(default=1)
    is_primary = models.BooleanField(default=False)

    class Meta:
        db_table = "property_images"
        ordering = ["display_order", "created_at"]

    def __str__(self):
        return f"{self.property.title} - Image {self.display_order}"