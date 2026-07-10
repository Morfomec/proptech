from django.db import models


class ListingType(models.TextChoices):
    """Defines the type of marketplace listing."""

    RENT = "rent", "Rent"
    LEASE = "lease", "Lease"
    SALE = "sale", "Sale"


class ListingStatus(models.TextChoices):
    """Represents the lifecycle of a listing."""

    DRAFT = "draft", "Draft"
    ACTIVE = "active", "Active"
    RENTED = "rented", "Rented"
    EXPIRED = "expired", "Expired"
    ARCHIVED = "archived", "Archived"