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


class UnitType(models.TextChoices):
    APARTMENT = "APARTMENT", "Apartment"
    ROOM = "ROOM", "Room"
    VILLA = "VILLA", "Villa"
    OFFICE = "OFFICE", "Office"
    SHOP = "SHOP", "Shop"
    WAREHOUSE = "WAREHOUSE", "Warehouse"
    HOSTEL_BED = "HOSTEL_BED", "Hostel Bed"


class FurnishingStatus(models.TextChoices):
    UNFURNISHED = "UNFURNISHED", "Unfurnished"
    SEMI_FURNISHED = "SEMI_FURNISHED", "Semi Furnished"
    FULLY_FURNISHED = "FULLY_FURNISHED", "Fully Furnished"


class AvailabilityStatus(models.TextChoices):
    AVAILABLE = "AVAILABLE", "Available"
    OCCUPIED = "OCCUPIED", "Occupied"
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE", "Under Maintenance"
    UNAVAILABLE = "UNAVAILABLE", "Unavailable"


class UnitStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"
    ARCHIVED = "ARCHIVED", "Archived"


class OwnershipType(models.TextChoices):
    SOLE = "SOLE", "Sole"
    JOINT = "JOINT", "Joint"
    COMPANY = "COMPANY", "Company"


class OwnershipVerificationStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    VERIFIED = "VERIFIED", "Verified"
    REJECTED = "REJECTED", "Rejected"