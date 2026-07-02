from django.db import models

class Role(models.Model):
    """Represents a role that can be assigned to a user."""

    class RoleChoices(models.TextChoices):
        OWNER = "OWNER", "Owner"
        TENANT = "TENANT", "Tenant"
        BROKER = "BROKER", "Broker"
        ADMIN = "ADMIN", "Admin"

    name = models.CharField(max_length=20, unique=True, choices=RoleChoices.choices)
    description = models.TextField(max_length=255,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "roles"
        verbose_name = "Role"
        verbose_name_plural = "Roles"
        ordering = ["name"]

    def __str__(self):
        return self.get_name_display()
