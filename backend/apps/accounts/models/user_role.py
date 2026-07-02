from django.db import models

from .role import Role
from .user import User

class UserRole(models.Model):
    """Represents a role assigned to a user."""


    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_roles")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="user_roles")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_roles"
        verbose_name = "User Role"
        verbose_name_plural = "User Roles"
        ordering = ["user", "role"]

        constraints = [
            models.UniqueConstraint(fields=["user", "role"], name="unique_user_role")
        ]

    def __str__(self):
        return f"{self.user} - {self.role}"