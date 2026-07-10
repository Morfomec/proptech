from django.contrib import admin

# Register your models here.

from apps.properties.models import Property, PropertyAddress, PropertyImage, Unit, UnitPricing, UnitOwnership, UnitImage


admin.site.register(Property)
admin.site.register(PropertyAddress)
admin.site.register(PropertyImage)
admin.site.register(Unit)
admin.site.register(UnitPricing)
admin.site.register(UnitOwnership)
@admin.register(UnitImage)
class UnitImageAdmin(admin.ModelAdmin):
    list_display = ("id", "unit", "is_primary", "display_order", "created_at")
    list_filter = ("is_primary",)
    search_fields = ("unit__unit_number", "unit__property__title")
    ordering = ("display_order",)