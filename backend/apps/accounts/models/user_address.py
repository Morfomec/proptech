from uuid import uuid4

from django.db import models

from .user import User


class UserAddress(models.Model):
    """Stores the residential address of a user."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="address")
    address_line_1 = models.TextField(blank=True)
    address_line_2 = models.TextField(blank=True)
    landmark = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_addresses"
        verbose_name = "User Address"
        verbose_name_plural = "User Addresses"
        ordering = ["-created_at"]

    def __str__(self):
        if self.user.full_name:
            return f"{self.user.full_name} Address"

        return f"{self.user.email} Address"