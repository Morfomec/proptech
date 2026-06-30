from django.contrib.auth import get_user_model
from django.db import transaction

from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthService:
    """Business logic for authentication"""


    @staticmethod
    @transaction.atomic
    def register_user(validated_data):
        user = User.objects.create_user(**validated_data)

        return user


    @staticmethod
    def login_user(validated_data):
        email = validated_data["email"]
        password = validated_data["password"]

        user = authenticate(
            email=email,
            password=password,
        )

        if user is None:
            raise AuthenticationFailed(
                "Invalid email or password."
            )


        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            # "user": user,
            "tokens":{
                "access": str(access),
                "refresh": str(refresh),
            },
        }