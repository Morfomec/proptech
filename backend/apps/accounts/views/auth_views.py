from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


from apps.accounts.serializers.auth_serializer import RegisterSerializer
from apps.accounts.services.auth_service import AuthService



class RegisterAPIView(APIView):
    """Register a new user"""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = AuthService.register_user(serializer.validated_data)

        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED,
        )

