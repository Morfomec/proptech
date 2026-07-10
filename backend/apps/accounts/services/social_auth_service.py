from django.contrib.auth import get_user_model
from django.db import transaction

from apps.accounts.models import SocialAccount
from apps.accounts.services.auth_service import AuthService

from .providers.google import GoogleSocialProvider

User = get_user_model()


class SocialAuthService:
    """Buisness logic for social authentication."""



    @staticmethod
    @transaction.atomic
    def authenticate(provider: str, id_token: str):
        """Authenticate a user using a social identity provider."""

        if provider != "google":
            raise ValueError("Unsupported provider.")

        social_provider = GoogleSocialProvider()

        social_user = social_provider.verify_id_token(id_token)

        user = User.objects.filter(email=social_user.email).first()


        if user is None:
            user = User.objects.create_user(
                email=social_user.email,
                full_name=social_user.full_name,
                is_email_verified=True,
            )

            AuthService.initialize_user(user)


        social_account, _ = SocialAccount.objects.get_or_create(
            provider=social_user.provider,
            provider_user_id=social_user.provider_user_id,
            defaults={
                "user": user,
                "email": social_user.email,
                "picture": social_user.picture,
            },
        )


        if social_account.user != user:
            social_account = user

        social_account.email = social_user.email
        social_account.picture = social_user.picture
        social_account.save()

        return {
            "tokens": AuthService.generate_tokens(user),
        }