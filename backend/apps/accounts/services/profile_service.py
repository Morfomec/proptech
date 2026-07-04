from apps.accounts.models import User

from django.db import transaction

class ProfileService:
    """Service class for user profile operations."""

    @staticmethod
    def get_my_profile(user):
        """Retrieve the authenticated user with all related profile data."""
        

        return (
            User.objects.select_related("profile", "address").
            prefetch_related("user_roles__role").get(pk=user.pk)
        )




    @staticmethod
    @transaction.atomic
    def update_my_profile(user, validated_data):
        """Update the authenticated user;s profile."""

        profile_data = validated_data.pop("profile", {})
        address_data = validated_data.pop("address", {})

        if validated_data:
            for field, value in validated_data.items():
                setattr(user, field, value)
            user.save(update_fields=validated_data.keys())

        if profile_data:
            profile = user.profile
            for field, value in profile_data.items():
                setattr(profile, field, value)
            profile.save(update_fields=profile_data.keys())

        if address_data:
            address = user.address
            for field, value in address_data.items():
                setattr(address, field, value)
            address.save(update_fields=address_data.keys())


        return user

