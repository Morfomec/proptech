from django.contrib import admin
from apps.listings.models import Listing, SavedListing

# Register your models here.

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "unit", "listing_type", "price", "created_at")
    list_filter = ("listing_type",)
    search_fields = ("unit__unit_number", "unit__property__title")
    ordering = ("-created_at",)


@admin.register(SavedListing)
class SavedListingAdmin(admin.ModelAdmin):
    list_display = ("user", "listing", "created_at")
    search_fields = ("user__email", "listing__uuid")