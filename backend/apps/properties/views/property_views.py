from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist

from apps.properties.serializers.property_serializer import (
    PropertyDetailSerializer, PropertyWriteSerializer, PropertyListSerializer
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


class MyPropertyListAPIView(GenericAPIView):
    """List properties owned by the authenticated user."""

    serializer_class = PropertyListSerializer
    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):

        queryset = PropertyService.get_user_properties(
            owner=request.user,
        )

        serializer = self.get_serializer(queryset, many=True)

        return Response(
            serializer.data
        )


class PropertyDetailAPIView(GenericAPIView):
    """Retrieve a property owner by the authenticated user."""

    permissions_classes = [IsAuthenticated]

    def get(self, request, property_uuid, *args, **kwargs):
        try:
            property_obj = PropertyService.get_property(
                owner=request.user,
                property_uuid=property_uuid,
            )

        except ObjectDoesNotExist:
            
            return Response(
                {"detail": "Property not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PropertyDetailSerializer(property_obj)

        return Response(serializer.data)