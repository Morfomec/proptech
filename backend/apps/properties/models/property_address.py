from django.db import models


from apps.common.models import BaseModel
from apps.properties.models.property import Property


class PropertyAddress(BaseModel):
    """Stores the address information for a property."""

    property = models.OneToOneField(Property, on_delete=models.CASCADE, related_name="address")
    address_line_1 = models.TextField()
    address_line_2 = models.TextField(blank=True)
    landmark = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True,blank=True)


    class Meta:
        db_table = "property_addresses"

    
    def __str__(self):
        return f"{self.property.title} - {self.city}"