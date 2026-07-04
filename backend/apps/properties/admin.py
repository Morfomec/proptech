from django.contrib import admin

# Register your models here.

from apps.properties.models import Property, PropertyAddress, PropertyImage


admin.site.register(Property)
admin.site.register(PropertyAddress)
admin.site.register(PropertyImage)