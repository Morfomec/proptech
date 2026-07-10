from dataclasses import dataclass


@dataclass(slots=True)
class SocialUserInfo:
    provider: str
    provider_user_id: str
    email: str
    first_name: str
    last_name: str
    picture: str = ""
    email_verified: bool = False