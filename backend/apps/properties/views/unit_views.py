from uuid import UUID

from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from apps.properties.serializers.unit_serializer import (
    UnitWriteSerializer,
    UnitDetailSerializer,
    UnitImageSerializer,
)
from apps.properties.services.unit_service import UnitService


class UnitCreateAPIView(GenericAPIView):
    """Create a new unit under an owned Property."""

    permission_classes = [IsAuthenticated]
    serializer_class = UnitWriteSerializer

    def post(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        unit = UnitService.create_unit(
            owner=request.user,
            validated_data=serializer.validated_data,
        )

        return Response(
            UnitDetailSerializer(unit).data,
            status=status.HTTP_201_CREATED,
        )



class PropertyUnitListAPIView(GenericAPIView):
    """List all units belonging to a property."""

    permission_classes = [IsAuthenticated]

    def get(self, request, property_uuid: UUID):

        units = UnitService.get_property_units(
            owner=request.user,
            property_uuid=property_uuid,
        )

        serializer = UnitDetailSerializer(units, many=True)

        return Response(serializer.data)


class UnitDetailAPIView(GenericAPIView):
    """Retrieve a single unit."""

    permission_classes = [IsAuthenticated]

    def get(self, request, unit_uuid: UUID):
        
        unit = UnitService.get_unit(owner=request.user, unit_uuid=unit_uuid)

        serializer = UnitDetailSerializer(unit)

        return Response(serializer.data)


class UnitUpdateAPIView(GenericAPIView):
    """Update a unit"""

    permission_classes = [IsAuthenticated]
    serializer_class = UnitWriteSerializer

    def patch(self, request, unit_uuid: UUID):

        serializer = self.get_serializer(data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        unit = UnitService.update_unit(
            owner=request.user,
            unit_uuid=unit_uuid,
            validated_data=serializer.validated_data,
        )

        return Response(
            UnitDetailSerializer(unit).data
        )



class UnitDeleteAPIView(GenericAPIView):
    """Soft delete a unit."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, unit_uuid: UUID):

        UnitService.delete_unit(
            owner=request.user,
            unit_uuid=unit_uuid,
        )


        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
    


class UnitImageUploadAPIView(GenericAPIView):
    """Upload an image for a unit."""

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = UnitImageSerializer


    def post(self, request, unit_uuid: UUID):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        image = UnitService.upload_unit_image(
            owner=request.user,
            unit_uuid=unit_uuid,
            validated_data=serializer.validated_data,
        )


        return Response(
            UnitImageSerializer(image).data,
            status=status.HTTP_201_CREATED,
        )


class UnitImageDeleteAPIView(GenericAPIView):
    """Delete an image for a unit."""
    
    permission_classes = [IsAuthenticated]

    def delete(self, request, unit_uuid: UUID, image_uuid: UUID):

        UnitService.delete_unit_image(
            owner=request.user,
            unit_uuid=unit_uuid,
            image_uuid=image_uuid,
        )


        return Response(
            status=status.HTTP_204_NO_CONTENT
        )