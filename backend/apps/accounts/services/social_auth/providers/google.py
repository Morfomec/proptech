from .base import BaseSocialProvider


class GoogleSocialProvider(BaseSocialProvider):
    def verify_id_token(self, id_token: str):

        """Google Verification will be implemented in the next milestone."""

        raise NotImplementedError("Google provider not implemented yet.")




        