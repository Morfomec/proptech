import uuid
from dango.db import models

class BaseModel(models.Model):
    """Abstract base model that provides common fields for all
    databse models."""

    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True,blank=True)

    class Meta:
        abstract = True