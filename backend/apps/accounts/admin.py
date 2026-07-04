from django.contrib import admin
from .models import User, UserProfile, UserAddress, UserRole, Role



# Register your models here.

admin.site.register(User)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "occupation", "gender", "created_at")
    search_fields = ("user__email", "occupation")
    list_filter = ("gender",)


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ("user", "city", "district", "state", "country")
    search_fields = ("user__email", "city", "district", "state", "pincode")
    list_filter = ("state", "country")

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "role",
        "created_at",
    )

    list_filter = ("role",)
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
    )

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "description",
        "created_at",
    )

    search_fields = (
        "name",
    )