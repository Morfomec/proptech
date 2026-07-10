from .base import BaseSocialProvider

from google.auth.transport import requests
from google.oauth2 import id_token
from google.auth import exceptions as google_exceptions

from django.conf import settings

from ..types import SocialUserInfo


class GoogleSocialProvider(BaseSocialProvider):
    def verify_id_token(self, id_token_value: str) -> SocialUserInfo:

        """Verify a Google ID token and return normalized user information."""
        
        try:

            payload = id_token.verify_oauth2_token(
                id_token_value,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except google_exceptions.GoogleAuthError as exc:
            raise ValueError("Invalid Google ID token.") from exc

        if payload.get("email_verified") is not True:
            raise ValueError("Google email is not verified.")
        
        name = payload.get("name", "").strip()

        parts = name.split(maxsplit=1)

        first_name = parts[0] if parts else ""
        last_name = parts[1] if len(parts) > 1 else ""
        
        return SocialUserInfo(
            provider="google",
            provider_user_id=payload["sub"],
            email=payload["email"],
            first_name=first_name,
            last_name=last_name,
            picture=payload.get("picture", ""),
            email_verified=True,
        )
        # raise NotImplementedError("Google provider not implemented yet.")



