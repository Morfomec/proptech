from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.properties.serializers.property_serializer import (
    PropertyDetailSerializer, PropertyWriteSerializer,
)
from apps.properties.services.property_service import PropertyService



class PropertyCreateAPIView(GenericAPIView):
    """Create a new property"""


    serializer_class = PropertyWriteSerializer
    permission_classes = [IsAuthenticated]

    # def get_serializer_class(self):
    #     if self.request.method in ("POST", "PUT", "PATCH"):
    #         return PropertyWriteSerializer
            
    #     return PropertyDetailSerializer

    def post(self, request, *args, **kwargs):
        """ Create a new property for the authenicated user."""

        
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        property_obj = PropertyService.create_property(
            owner=request.user, validated_data=serializer.validated_data,
        )

        response_serializer = PropertyDetailSerializer(property_obj)

        return Response(
            response_serializer.data, status=status.HTTP_201_CREATED,
        )