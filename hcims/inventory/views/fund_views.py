from inventory import models
from configuration import models as config_models
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, connection
from inventory import serializers
from durin.auth import TokenAuthentication
from django.utils import timezone
# from rest_framework import filters, pagination
import json

# =================


class FundList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Fund.objects.all()
    serializer_class = serializers.ManageFundSerializer
    #pagination.PageNumberPagination.page_size = 2
    print('Hi')
    def post(self, request, *args, **kwargs):
        if 'document_url' in request.FILES:
            file_name_parts = request.data['document_url'].name.split('.')
            if len(file_name_parts) > 1:
                request.data['document_url'].name = request.data.get(
                    'cheque_no') + '.'+file_name_parts[len(file_name_parts)-1]
        request.data['created_by'] = request.user.id
        return self.create(request, *args, **kwargs)


class FundDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.Fund
    serializer_class = serializers.FundSerializer

    def put(self, request, *args, **kwargs):

        if 'document_url' in request.FILES:
            file_name_parts = request.data['document_url'].name.split('.')
            if len(file_name_parts) > 1:
                request.data['document_url'].name = request.data.get(
                    'cheque_no') + '.'+file_name_parts[len(file_name_parts)-1]
        # request.data['created_by']=request.user.id
        request.data['updated_by'] = request.user.id
        return self.update(request, *args, **kwargs)


class CustomFundList(generics.ListAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    serializer_class = serializers.FundSerializer

    def get_queryset(self):
        """

        """

        queryset = models.Fund.objects.raw('''
            				                SELECT id, 
										cheque_no, 
										purpose, 
										cheque_date, 
										date_of_receipt, 
										document_url, 
										remarks, 
										created_at, 
										updated_at, 
										account_head_id, 
										created_by_id, 
										updated_by_id, 
										cheque_amount, 
										financial_year_id, 
										coalesce(fu.purchase_amount,0) as purchase_amount, 
										(cheque_amount- coalesce(fu.purchase_amount,0)) as balance_amount


                               	FROM public.inventory_fund	as f			
								left join (
										SELECT fund_id, sum(purchase_amount) as purchase_amount
										from (
											SELECT id, fund_id, purchase_amount
											FROM public.inventory_purchasedetails as p

												join (
														SELECT sum(quantity * unit_price) as purchase_amount,
															purchase_id
														FROM public.inventory_purchaseitemlist group by purchase_id
												) as pa on p.id=pa.purchase_id

										   ) as r group by r.fund_id
									
								) as fu on fu.fund_id=f.id
                                order by f.id desc
                ''')
        return queryset

    # def list(self, request, *arg, **kwargs):

    #     return super().list(self, request, *arg, **kwargs)


class YearWiseFund(viewsets.ModelViewSet):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)

    serializer_class = serializers.FundUtilizationReportSerializer

    def get_queryset(self):
        """

        """

        queryset = config_models.FinancialYear.objects.raw('''
             SELECT   id, financial_year, coalesce(s.cheque_amount,'0') as fund_received, coalesce(p.purchase_amount,'0') 
                as fund_utilized
                FROM public.configuration_financialyear as f
                
                left join (
                
                SELECT sum(cheque_amount) as cheque_amount, 
                    financial_year_id
                    FROM public.inventory_fund
                    group by financial_year_id
                    ) as s on f.id = s.financial_year_id
                left join (
                    
                    select financial_year_id, sum(u.purchase_amount) as purchase_amount from public.inventory_fund as f
                    join (
                                SELECT fund_id, sum(purchase_amount) as purchase_amount
                                from (
                                    SELECT id, fund_id, purchase_amount
                                    FROM public.inventory_purchasedetails as p

                                    join (
                                            SELECT sum(quantity * unit_price) as purchase_amount,
                                                purchase_id
                                            FROM public.inventory_purchaseitemlist group by purchase_id
                                    ) as pa on p.id=pa.purchase_id

                            ) as r group by r.fund_id
                    ) as u on u.fund_id=f.id
                    group by f.financial_year_id

                    
                ) as p on p.financial_year_id=f.id
                order by f.financial_year
                ''')
        return queryset

    def list(self, request, *arg, **kwargs):

        return super().list(self, request, *arg, **kwargs)


# =================
class PurchaseDetailsList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.PurchaseDetails.objects.all()
    serializer_class = serializers.ManagePurchaseDetailsSerializer
    # pagination.PageNumberPagination.page_size = 100

    def post(self, request, *args, **kwargs):
        request.data._mutable = True
        if 'purchase_order_url' in request.FILES:
            file_name_parts = request.data['purchase_order_url'].name.split(
                '.')
            if len(file_name_parts) > 1:
                request.data['purchase_order_url'].name = request.data.get(
                    'order_no') + '.'+file_name_parts[len(file_name_parts)-1]
        request.data['created_by'] = request.user.id
        request.data._mutable = False
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        search_text = self.request.query_params.get('search_text')
        fund = self.request.query_params.get('fund')
        if(search_text):
            return models.PurchaseDetails.objects.filter(order_no__contains=search_text)
        if(fund):
            return models.PurchaseDetails.objects.filter(fund=fund)
        return models.PurchaseDetails.objects.all()


class PurchaseDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.PurchaseDetails
    serializer_class = serializers.PurchaseDetailsSerializer

    def put(self, request, *args, **kwargs):
        if 'purchase_order_url' in request.FILES:
            file_name_parts = request.data['purchase_order_url'].name.split(
                '.')
            if len(file_name_parts) > 1:
                request.data['purchase_order_url'].name = request.data.get(
                    'order_no') + '.'+file_name_parts[len(file_name_parts)-1]
        # request.data['created_by']=request.user.id
        request.data['updated_by'] = request.user.id

        return self.update(request, *args, **kwargs)


# =================
class PurchaseItemsList(generics.ListCreateAPIView):
    queryset = models.PurchaseItemList.objects.all()
    serializer_class = serializers.ManagePurchaseItemListSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        item_id = self.request.query_params.get('item_id')
        purchase_id = self.request.query_params.get('purchase_id')
        if(item_id and purchase_id):

            return models.PurchaseItemList.objects.filter(item=item_id, purchase=purchase_id)

        if(purchase_id):

            return models.PurchaseItemList.objects.filter(purchase=purchase_id)

        return models.PurchaseItemList.objects.all()


class PurchaseItemsListDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.PurchaseItemList
    serializer_class = serializers.PurchaseItemListSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class PurchaseItemesListOfParticularOrder(generics.ListAPIView):

    serializer_class = serializers.ManagePurchaseItemListSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        This view should return a list of all the purchases items
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        order_number = self.request.query_params.get('order_no')
        print(order_number)
        purchase_details = models.PurchaseDetails.objects.filter(
            order_no=order_number)
        print(purchase_details[0].id)
        return models.PurchaseItemList.objects.filter(purchase=purchase_details[0].id)

# =================


class PurchaseItemReceivedDetailsList(generics.ListCreateAPIView):
    queryset = models.PurchaseItemReceivedDetails.objects.all()
    serializer_class = serializers.ManagePurchaseItemReceivedDetailsSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):

        request.data['created_by'] = request.user.id
        request.data['received_by'] = request.user.id
        return self.create(request, *args, **kwargs)


class PurchaseItemReceivedDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.PurchaseItemReceivedDetails
    serializer_class = serializers.PurchaseItemReceivedDetailsSerializerForUpdate
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        print(request.data)
        request.data['created_by'] = request.user.id
        request.data['updated_by'] = request.user.id
        return self.update(request, *args, **kwargs)


class PurchaseItemReceivedDetailsListOfParticularOrder(generics.ListAPIView):
    queryset = models.PurchaseItemReceivedDetails
    serializer_class = serializers.PurchaseItemReceivedDetailsSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        purchase = self.request.query_params.get('purchase')
        item = self.request.query_params.get('item')
        if(purchase and item):
            return models.PurchaseItemReceivedDetails.objects.filter(purchase=purchase, item=item)
        if (purchase):
            return models.PurchaseItemReceivedDetails.objects.filter(purchase=purchase)


class PurchaseItemReceivedByDispatch(viewsets.ModelViewSet):

    serializer_class = serializers.CustomPurchaseItemReceivedSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        dispatch = self.request.query_params.get('dispatch')
        purchase = self.request.query_params.get('purchase')
        queryset = models.PurchaseItemReceivedDetails.objects.raw('''
            SELECT
            rl.id,
            rl.item_id,
            rl.quantity_received,
            rl.received_on,
            rl.purchase_id,
            rl.purchase_item_id,
            dl.id as dispatch_item_id,
            dl.lot_no,
            case when dl.quantity_dispatch is null then 0
                else dl.quantity_dispatch end as quantity_dispatch,
            dl.dispatch_id,
            case when dl.remarks is null then ''
                else dl.remarks end as remarks,
            case when dc.total_dispatch is null then 0
                else dc.total_dispatch
                end  as total_dispatch

            FROM public.inventory_purchaseitemreceiveddetails as rl
            left join (
                SELECT id, quantity_dispatch, dispatch_id,
                purchase_id,
                lot_no,
                remarks, purchase_item_received_id
                FROM public.inventory_itemdispatchlist
                where dispatch_id=%s
            ) as dl on dl.purchase_item_received_id=rl.id
            left join
            (
                SELECT purchase_item_received_id, sum(quantity_dispatch) as total_dispatch
                FROM public.inventory_itemdispatchlist
                group by purchase_item_received_id
            ) as dc on dc.purchase_item_received_id= rl.id

            where rl.purchase_id=%s
                ''', [dispatch, purchase])
        return queryset

    def list(self, request, *arg, **kwargs):

        return super().list(self, request, *arg, **kwargs)


# =================


class ItemDispatchDetailList(generics.ListCreateAPIView):
    queryset = models.ItemDispatchDetail.objects.all()
    serializer_class = serializers.ItemDispatchDetailSerializer
    # filter_backends = [filters.SearchFilter]
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    # search_fields = ['dispatch_to_office__name']

    def post(self, request, *args, **kwargs):

        request.data['dispatch_by'] = request.user.id
        request.data['created_by'] = request.user.id
        return self.create(request, *args, **kwargs)

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        purchase = self.request.query_params.get('purchase')
        office = self.request.query_params.get('office')
        if(purchase):
            return models.ItemDispatchDetail.objects.filter(purchase=purchase).order_by('-id')

        if(office):
            return models.ItemDispatchDetail.objects.filter(dispatch_to_office=office).order_by('-id')

        return models.ItemDispatchDetail.objects.all().order_by('-id')


class ItemDispatchDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ItemDispatchDetail
    serializer_class = serializers.ItemDispatchDetailSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):

        request.data['updated_by'] = request.user.id
        is_received = request.data.get('is_received')
        if(is_received):
            request.data['acknowledge_by'] = request.user.id
            request.data['acknowledge_on'] = timezone.now()
            return self.partial_update(request, *args, **kwargs)

        return self.update(request, *args, **kwargs)

# =================


class ItemDispatchList(generics.ListCreateAPIView):
    queryset = models.ItemDispatchList.objects.all()
    serializer_class = serializers.ItemDispatchListSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        dispatch_id = self.request.query_params.get('dispatch_id')

        if(dispatch_id):

            return models.ItemDispatchList.objects.filter(dispatch=dispatch_id).order_by('-id')
        else:
            return models.ItemDispatchList.objects.all().order_by('-id')


class ItemDispatchListDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.ItemDispatchList
    serializer_class = serializers.ItemDispatchListSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class ItemDispatchListDetailsWithReceivedItemList(viewsets.ModelViewSet):

    serializer_class = serializers.CustomDispatchItemListSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        dispatch = self.request.query_params.get('dispatch_list_id')
        # purchase = self.request.query_params.get('purchase')
        queryset = models.ItemDispatchList.objects.raw('''
            SELECT
                d.id,
                d.quantity_dispatch,
                d.dispatch_id,
                d.item_id,
                d.purchase_id,
                d.lot_no,
                case when d.brand is null then ''
                     else d.brand end as brand,

                case when d.model_no is null then ''
                     else d.model_no end as model_no,

                case when d.specification is null then ''
                     else d.specification end as specification,

                case when d.warranty_period is null then 0
                     else d.warranty_period end as warranty_period,
                r.item_received_id,
                r.serial_no,
                r.is_in_use,
                r.remarks
            FROM public.inventory_itemdispatchlist as d
            left join (
                SELECT id as item_received_id,
                item_dispatch_list_id,
                serial_no,
                is_in_use,
                remarks

                FROM public.inventory_dispatchitemreceiveddetails
                where item_dispatch_list_id=%s
            ) as r on r.item_dispatch_list_id=d.id
            where id=%s
    ''', [dispatch, dispatch])
        return queryset

    def list(self, request, *arg, **kwargs):

        return super().list(self, request, *arg, **kwargs)


# ==================
