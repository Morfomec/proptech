from dataclasses import dataclass


@dataclass(slots=True)
class SocialUserInfo:
    provider: str
    provider_user_id: str
    email: str
    full_name: str
    picture: str = ""
    email_verified: bool = False
    