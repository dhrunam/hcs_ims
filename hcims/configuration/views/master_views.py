from configuration import models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated

from configuration import serializers
from durin.auth import TokenAuthentication

# authentication_classes = (TokenAuthentication,)
# permission_classes = (IsAuthenticated,)

# State


class StateList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    queryset = models.State.objects.all()
    serializer_class = serializers.StateSerializer
    # pagination.PageNumberPagination.page_size = 100


class StateDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.State
    serializer_class = serializers.StateSerializer
# ==========

# District


class DistrictList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.District.objects.all()
    serializer_class = serializers.ManageDistrictSerializer
    # pagination.PageNumberPagination.page_size = 2


class DistrictDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.District
    serializer_class = serializers.DistrictSerializer


# Designation

class DesignationList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Designation.objects.all()
    serializer_class = serializers.DesignationSerializer
    # pagination.PageNumberPagination.page_size = 100


class DesignationDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Designation
    serializer_class = serializers.DesignationSerializer
# ===

# Body

# class BodyList(generics.ListCreateAPIView):
#     queryset = models.Body.objects.all()
#     serializer_class = serializers.BodySerializer

# class BodyDetails(generics.RetrieveUpdateDestroyAPIView):
#     queryset = models.Body
#     serializer_class = serializers.BodySerializer


# Office

class OfficeList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Office.objects.all()
    serializer_class = serializers.ManageOfficeSerializer
    # pagination.PageNumberPagination.page_size = 100


class OfficeDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Office
    serializer_class = serializers.OfficeSerializer
# ===

# Division


class DivisionList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Division.objects.all()
    serializer_class = serializers.ManageDivisionSerializer
    # pagination.PageNumberPagination.page_size = 100


class DivisionDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Division
    serializer_class = serializers.DivisionSerializer
# ===

# Location


class LocationList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Location.objects.all()
    serializer_class = serializers.ManageLocationSerializer
    # pagination.PageNumberPagination.page_size = 100


class LocationDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Location
    serializer_class = serializers.LocationSerializer

# ===


# Financial Year

class FinanacialYearList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.FinancialYear.objects.all().order_by('financial_year')
    serializer_class = serializers.FinancialYearSerializer
    # pagination.PageNumberPagination.page_size = 100


class FinancialYearDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.FinancialYear
    serializer_class = serializers.FinancialYearSerializer

# ========

# Acount Head


class AccountHeadList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.AccountHead.objects.all()
    serializer_class = serializers.AccountHeadSerializer
    # pagination.PageNumberPagination.page_size = 100


class AccountHeadDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.AccountHead
    serializer_class = serializers.AccountHeadSerializer

# ========
# Item Type


class ItemTypeList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    # queryset = models.ItemType.objects.all()
    serializer_class = serializers.ItemTypeSerializer
   # pagination.PageNumberPagination.page_size = 100

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        search_text = self.request.query_params.get('search_text')

        if(search_text):
            return models.ItemType.objects.filter(name__icontains=search_text)

        return models.ItemType.objects.all()


class ItemTypeDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.ItemType
    serializer_class = serializers.ItemTypeSerializer

# =========

# Item


class ItemList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Item.objects.all()
    serializer_class = serializers.ManageItemSerializer
    # pagination.PageNumberPagination.page_size = 100

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        search_text = self.request.query_params.get('search_text')

        if(search_text):
            return models.Item.objects.filter(name__icontains=search_text)

        return models.Item.objects.all()


class ItemDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Item
    serializer_class = serializers.ItemSerializer

# =========

# Unit


class UnitList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Unit.objects.all()
    serializer_class = serializers.UnitSerializer
    # pagination.PageNumberPagination.page_size = 100


class UnitDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Unit
    serializer_class = serializers.UnitSerializer

# =========

# Venndor


class VendorList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorSerializer
    # pagination.PageNumberPagination.page_size = 100


class VendorDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Vendor
    serializer_class = serializers.VendorSerializer

# =========
