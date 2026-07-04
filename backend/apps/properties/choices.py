from django.db import models


class PropertyType(models.TextChoices):
    APARTMENT = "APARTMENT", "Apartment"
    HOUSE = "HOUSE", "House"
    VILLA = "VILLA", "Villa"
    SHOP = "SHOP", "Shop"
    OFFICE = "OFFICE", "Office"
    WAREHOUSE = "WAREHOUSE", "Warehouse"
    LAND = "LAND", "Land"


class PropertyCategory(models.TextChoices):
    RESIDENTIAL = "RESIDENTIAL", "Residential"
    COMMERCIAL = "COMMERCIAL", "Commercial"
    INDUSTRIAL = "INDUSTRIAL", "Industrial"
    AGRICULTURAL = "AGRICULTURAL", "Agricultural"


class ConstructionStatus(models.TextChoices):
    READY_TO_MOVE = "READY_TO_MOVE", "Ready to Move"
    UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION", "Under Construction"
    NEW_LAUNCH = "NEW_LAUNCH", "New Launch"


class PropertyStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"
    ARCHIVED = "ARCHIVED", "Archived"