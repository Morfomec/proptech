from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.properties.serializers.unit_pricing_serializer import (
    UnitPricingCreateSerializer, UnitPricingDetailSerializer, UnitPricingUpdateSerializer
)


from apps.properties.services.unit_pricing_service import (
    UnitPricingService,
)



class UnitPricingAPIView(GenericAPIView):
    """Handles unit pricing operations."""


    permission_classes = [IsAuthenticated]


    def get_serializer_class(self):

        if self.request.method == 'POST':
            return UnitPricingCreateSerializer
        
        elif self.request.method == 'PATCH':
            return UnitPricingUpdateSerializer

        return UnitPricingDetailSerializer
    

    def get(self, request, unit_uuid):
        """Retrieve pricing for a unit."""

        pricing = UnitPricingService.get_pricing(
            owner=request.user,
            unit_uuid=unit_uuid,
        )

        serializer = self.get_serializer(pricing)

        return Response(serializer.data)

    def post(self, request):
        """Create Pricing for a unit owned by the authenticated user."""


        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        UnitPricingService.create_pricing(
            owner=request.user,
            validated_data=serializer.validated_data,
        )

        return Response(
            {
                "detail": "Unit pricing created successfully."
            }, status=status.HTTP_201_CREATED,
        )
    

    def patch(self, request, unit_uuid):
        """Update pricing for a unit."""

        serializer = self.get_serializer(
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)


        pricing = UnitPricingService.update_pricing(
            owner=request.user,
            unit_uuid=unit_uuid,
            validated_data=serializer.validated_data,
        )


        serializer = UnitPricingDetailSerializer(pricing)

        return Response(serializer.data)