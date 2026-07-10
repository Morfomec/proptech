from rest_framework import serializers


from apps.accounts.models import User, UserAddress, UserProfile



class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = ("gender", "date_of_birth", "occupation", "bio")


class UserAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserAddress
        fields = ("address_line_1", "address_line_2", "landmark", "city", "district", "state", "pincode", "country")


class MyProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    address = UserAddressSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "full_name",
            "profile_image",
            "profile",
            "address",
            "roles",
        )

    
    def get_roles(self, obj):
        return [
            user_role.role.name
            for user_role in obj.user_roles.all()
        ]


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            "gender", "date_of_birth", "occupation", "bio"
        )


class UpdateUserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = (
            "address_line_1",
            "address_line_2",
            "landmark",
            "city",
            "district",
            "state",
            "pincode",
            "country",
        )


class UpdateMyProfileSerializer(serializers.ModelSerializer):
    profile = UpdateUserProfileSerializer(required=False)
    address = UpdateUserAddressSerializer(required=False)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "phone_number",
            "profile",
            "address",
        )



    