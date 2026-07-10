from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers.social_auth_serializers import GoogleLoginSerializer
from apps.accounts.services.social_auth.social_auth_service import SocialAuthService



class GoogleLoginView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = SocialAuthService.authenticate(
            provider="google",
            id_token=serializer.validated_data["id_token"],
        )

        return Response(data, status=status.HTTP_200_OK)