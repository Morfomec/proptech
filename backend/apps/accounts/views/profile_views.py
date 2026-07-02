from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers.profile_serializers import MyProfileSerializer, UpdateMyProfileSerializer
from apps.accounts.services.profile_service import ProfileService



class MyProfileView(APIView):
    """Retrieve the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = ProfileService.get_my_profile(request.user)

        serializer = MyProfileSerializer(user)

        return Response(
            serializer.data, status=status.HTTP_200_OK
        )



class UpdateMyProfileView(APIView):
    """Update the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UpdateMyProfileSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        user = ProfileService.update_my_profile(
            request.user,
            serializer.validated_data,
        )

        response_serializer = MyProfileSerializer(user)

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK,
        )