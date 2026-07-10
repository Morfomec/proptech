from abc import ABC, abstractclassmethod

from ..types import SocialUserInfo


class BaseSocialProvider(ABC):
    @abstractclassmethod
    def verify_id_token(self, id_token: str) -> SocialUserInfo:
        """"Verify an external ID token and return normalized user information."""

        raise NotImplementedError