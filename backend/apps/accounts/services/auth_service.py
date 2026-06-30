from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class AuthService:
    """Business logic for authentication"""


    @staticmethod
    @transaction.atomic
    def register_user(validated_data):
        user = User.objects.create_user(**validated_data)

        return user