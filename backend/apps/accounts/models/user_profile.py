from uuid import uuid4

from django.db import models
from .user import User


class UserProfile(models.Model):
    """Stores additional profile information for a user."""

    class GenderChoices(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"
        PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY", "Prefer not to say"

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    gender = models.CharField(max_length=20, choices=GenderChoices.choices, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    occupation = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
        ordering = ["-created_at"]

    def __str__(self):
        if self.user.full_name:
            return f"{self.user.full_name} ({self.user.email})"

        return self.user.email
