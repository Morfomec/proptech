from django.contrib import admin
from apps.listings.models import Listing

# Register your models here.

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "unit", "listing_type", "price", "created_at")
    list_filter = ("listing_type",)
    search_fields = ("unit__unit_number", "unit__property__title")
    ordering = ("-created_at",)
