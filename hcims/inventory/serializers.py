from rest_framework import serializers
from django.db import transaction, connection
from inventory import models as inv_models
from configuration import models as config_models
from accounts import models as acc_models
from configuration.serializers import(
    AccountHeadSerializer,
    VendorSerializer,
    UnitSerializer,
    ItemSerializer,
    OfficeSerializer,
)
from accounts.serializers import (
    ResgisteredUserSerializer,
)

# Fund


class FundSerializer(serializers.ModelSerializer):
    purchase_amount = serializers.FloatField(read_only=True)
    balance_amount = serializers.FloatField(read_only=True)
    related_accounthead = AccountHeadSerializer(
        source="account_head", read_only=True)
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)

    class Meta:
        model = inv_models.Fund

        fields = [
            'id',
            'account_head',
            'financial_year',
            'cheque_no',
            'purpose',
            'cheque_amount',
            'cheque_date',
            'date_of_receipt',
            'document_url',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_accounthead',
            'related_create_user',
            'related_update_user',
            'purchase_amount',
            'balance_amount'

        ]


class ManageFundSerializer(serializers.ModelSerializer):
    related_accounthead = AccountHeadSerializer(
        source="account_head", read_only=True)
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)

    class Meta:
        model = inv_models.Fund

        fields = [
            'id',
            'account_head',
            'financial_year',
            'cheque_no',
            'purpose',
            'cheque_amount',
            'cheque_date',
            'date_of_receipt',
            'document_url',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_accounthead',
            'related_create_user',
            'related_update_user',

        ]


class FundUtilizationReportSerializer(serializers.ModelSerializer):
    fund_received = serializers.FloatField(read_only=True)
    fund_utilized = serializers.FloatField(read_only=True)

    class Meta:
        model = config_models.FinancialYear

        fields = [
            'id',
            'financial_year',
            'fund_received',
            'fund_utilized'

        ]


# =====

# Purchase
class PurchaseDetailsSerializer(serializers.ModelSerializer):
    related_fund = FundSerializer(source="fund", read_only=True)
    related_vendor = VendorSerializer(source='vendor', read_only=True)
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)

    class Meta:
        model = inv_models.PurchaseDetails
        fields = [
            'id',
            'fund',
            'vendor',
            'remarks',
            'order_no',
            'invoice_no',
            'purchase_date',
            'is_dispatchable',
            'purchase_order_url',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_fund',
            'related_vendor',
            'related_create_user',
            'related_update_user',

        ]


class MinPurchaseDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = inv_models.PurchaseDetails
        fields = [
            'id',
            'fund',
            'vendor',
            'remarks',
            'order_no',
            'invoice_no',
            'purchase_date',
            'is_dispatchable',
            'purchase_order_url',

        ]


class ManagePurchaseDetailsSerializer(serializers.ModelSerializer):
    related_fund = FundSerializer(source="fund", read_only=True)
    related_vendor = VendorSerializer(source='vendor', read_only=True)
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)

    class Meta:
        model = inv_models.PurchaseDetails
        fields = [
            'id',
            'fund',
            'vendor',
            'remarks',
            'order_no',
            'invoice_no',
            'purchase_date',
            'is_dispatchable',
            'purchase_order_url',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_fund',
            'related_vendor',
            'related_create_user',
            'related_update_user',

        ]
        ordering = ('created_at',)
##

# Purchase Item List


class PurchaseItemListSerializer(serializers.ModelSerializer):
    related_item = ItemSerializer(source="item", read_only=True)

    class Meta:
        model = inv_models.PurchaseItemList
        fields = [
            'id',
            'purchase',
            'item',
            'item_specification',
            'quantity',
            'unit',
            'unit_price',
            'remarks',
            'related_item'

        ]


class PurchaseItemReceivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = inv_models.PurchaseItemReceivedDetails
        fields = [
            'id',
            'purchase_item',
            'purchase',
            'item',
            'quantity_received',
            'received_office',
            'received_on',
            'received_by',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
        ]


class CustomPurchaseItemReceivedSerializer(serializers.ModelSerializer):

    dispatch_id = serializers.IntegerField(read_only=True)
    lot_no = serializers.CharField(read_only=True)
    dispatch_item_id = serializers.IntegerField(read_only=True)
    quantity_dispatch = serializers.IntegerField(read_only=True)
    total_dispatch = serializers.IntegerField(read_only=True)
    related_item = ItemSerializer(source='item', read_only=True)
    related_purchase_item = PurchaseItemListSerializer(
        source='purchase_item', read_only=True)

    class Meta:

        model = inv_models.PurchaseItemReceivedDetails
        fields = [
            'id',
            'purchase_item',
            'dispatch_item_id',
            'purchase',
            'dispatch_id',
            'item',
            'lot_no',
            'quantity_received',
            'quantity_dispatch',
            'received_office',
            'received_on',
            'remarks',
            'total_dispatch',
            'related_item',
            'related_purchase_item',

        ]
        related_fields = [
            'dispatch_items'
        ]

        # rl.id,
        # rl.item_id,
        # rl.quantity_received,
        # rl.received_on,
        # rl.purchase_id,
        # rl.purchase_item_id,
        # dl.id as dispatch_item_id,
        # dl.quantity_dispatch,
        # dl.dispatch_id,
        # dl.remarks


class ManagePurchaseItemListSerializer(serializers.ModelSerializer):
    related_purchase = PurchaseDetailsSerializer(
        source="purchase", read_only=True)
    related_unit = UnitSerializer(source="unit", read_only=True)
    related_item = ItemSerializer(source="item", read_only=True)
    related_received_item = PurchaseItemReceivedSerializer(
        source='received_item', read_only=True)

    class Meta:
        model = inv_models.PurchaseItemList
        fields = [
            'id',
            'purchase',
            'item',
            'item_specification',
            'quantity',
            'unit',
            'unit_price',
            'remarks',
            'related_purchase',
            'related_item',
            'related_unit',
            'related_received_item'


        ]
        related_fields = [
            'received_item'

        ]
        ordering = ('created_at',)


##

# Items Received Details agains a purchase


class ItemDispatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = inv_models.ItemDispatchList

        # dispatch =models.ForeignKey(ItemDispatchDetail,on_delete=models.SET_NULL,null=True)
        # purchase = models.ForeignKey(PurchaseDetails,on_delete=models.SET_NULL,null=True)
        # item = models.ForeignKey(config_models.Item, on_delete=models.SET_NULL, null=True)
        # quantity_dispatch = models.IntegerField(blank=False, default=0)

        fields = [
            'id',
            'purchase_item_received',
            'dispatch',
            'purchase',
            'item',
            'quantity_dispatch',
            'remarks',
            'related_dispatch',
            'related_purchase',
            'related_item',

        ]


class PurchaseItemReceivedDetailsSerializerForUpdate(serializers.ModelSerializer):

    class Meta:
        model = inv_models.PurchaseItemReceivedDetails

        fields = [
            'purchase_item',
            'purchase',
            'item',
            'quantity_received',
            'received_office',
            'received_on',
            'received_by',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',


        ]


class PurchaseItemReceivedDetailsSerializer(serializers.ModelSerializer):
    related_item = ItemSerializer(source='item', read_only=True)
    related_purchase = PurchaseDetailsSerializer(
        source='purchase', read_only=True)
    related_office = OfficeSerializer(source='received_office', read_only=True)
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)
    related_received_by_user = ResgisteredUserSerializer(
        source='received_by', read_only=True)

    related_dispatch_item = ItemDispatchSerializer(
        source='dispatch_item', read_only=True)

    class Meta:
        model = inv_models.PurchaseItemReceivedDetails

        fields = [
            'purchase_item',
            'purchase',
            'item',
            'quantity_received',
            'received_office',
            'received_on',
            'received_by',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_item',
            'related_purchase',
            'related_office',
            'related_create_user',
            'related_update_user',
            'related_received_by_user',
            'related_dispatch_item',
            'dispatch_item'
        ]
        related_fields = [
            'dispatch_item'

        ]


class ManagePurchaseItemReceivedDetailsSerializer(serializers.ModelSerializer):
    related_item = ItemSerializer(source='item', read_only=True)
    related_purchase = PurchaseDetailsSerializer(
        source='purchase', read_only=True)
    related_office = OfficeSerializer(source='received_office', read_only=True)
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)
    related_received_by_user = ResgisteredUserSerializer(
        source='received_by', read_only=True)

    class Meta:
        model = inv_models.PurchaseItemReceivedDetails

        fields = [
            'purchase_item',
            'purchase',
            'item',
            'quantity_received',
            'received_office',
            'received_on',
            'received_by',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_item',
            'related_purchase',
            'related_office',
            'related_create_user',
            'related_update_user',
            'related_received_by_user'


        ]
##


class ItemDispatchDetailSerializer(serializers.ModelSerializer):
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)
    related_dispatch_from_office = OfficeSerializer(
        source='dispatch_from_office', read_only=True)
    related_dispatch_to_office = OfficeSerializer(
        source='dispatch_to_office', read_only=True)

    class Meta:
        model = inv_models.ItemDispatchDetail

        fields = [
            'id',
            'purchase',
            'dispatch_to_office',
            'dispatch_to_address',
            'dispatch_subject',
            'dispatch_description',
            'dispatch_from_office',
            'dispatch_on',
            'dispatch_by',
            'dispatch_remarks',
            'received_on',
            'received_by',
            'handover_doc_url',
            'is_received',
            'acknowledge_to_address',
            'acknowledge_subject',
            'acknowledge_description',
            'acknowledge_remarks',
            'acknowledge_by',
            'acknowledge_on',
            'acknowledge_doc_url',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_create_user',
            'related_update_user',
            'related_dispatch_from_office',
            'related_dispatch_to_office',
        ]


class MinItemDispatchDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = inv_models.ItemDispatchDetail

        fields = [
            'id',
            'purchase',
            'dispatch_to_office',
            'dispatch_to_address',
            'dispatch_subject',
            'dispatch_description',
            'dispatch_from_office',
            'dispatch_on',
            'dispatch_by',
            'dispatch_remarks',
            'received_on',
            'received_by',
            'handover_doc_url',
            'is_received',
            'acknowledge_to_address',
            'acknowledge_subject',
            'acknowledge_description',
            'acknowledge_remarks',
            'acknowledge_by',
            'acknowledge_doc_url',

        ]


class ItemDispatchListSerializer(serializers.ModelSerializer):

    related_dispatch = ItemDispatchDetailSerializer(
        source='dispatch', read_only=True)
    related_purchase = PurchaseDetailsSerializer(
        source='purchase', read_only=True)
    related_item = ItemSerializer(source='item', read_only=True)

    class Meta:
        model = inv_models.ItemDispatchList

        fields = [
            'id',
            'purchase_item_received',
            'dispatch',
            'purchase',
            'item',
            'lot_no',
            'model_no',
            'specification',
            'brand',
            'warranty_period',
            'quantity_dispatch',
            'remarks',
            'related_dispatch',
            'related_purchase',
            'related_item',

        ]


class CustomDispatchItemListSerializer(serializers.ModelSerializer):

    related_dispatch = MinItemDispatchDetailSerializer(
        source='dispatch', read_only=True)
    related_purchase = MinPurchaseDetailsSerializer(
        source='purchase', read_only=True)
    related_item = ItemSerializer(source='item', read_only=True)
    item_received_id = serializers.IntegerField(read_only=True)
    serial_no = serializers.CharField(max_length=256, read_only=True)
    is_in_use = serializers.BooleanField(read_only=True)

    class Meta:
        model = inv_models.ItemDispatchList

        fields = [
            'id',
            'dispatch',
            'purchase',
            'item',
            'lot_no',
            'model_no',
            'specification',
            'brand',
            'warranty_period',
            'quantity_dispatch',
            'item_received_id',
            'serial_no',
            'is_in_use',
            'remarks',
            'related_dispatch',
            'related_purchase',
            'related_item',

        ]


class UpdateDispatchItemReceivedDetailsListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):

        instance_hash = {index: instance for index,
                         instance in enumerate(instances)}

        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        return result


class DispatchItemReceivedDetailsSerializer(serializers.ModelSerializer):
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)
    related_item = ItemSerializer(source="item", read_only=True)
    related_item_dispatch_list = ItemDispatchListSerializer(
        source='item_dispatch_list', read_only=True)

    # dispatch_item_list = ItemDispatchListSerializer(many=True)

    class Meta:
        model = inv_models.DispatchItemReceivedDetails
        fields = [
            'id',
            'item_dispatch_list',
            'dispatch',
            'purchase',
            'item',
            'serial_no',
            'is_in_use',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_item',
            'related_item_dispatch_list',
            'related_create_user',
            'related_update_user',
            # 'dispatch_item_list',
        ]
        list_serializer_class = UpdateDispatchItemReceivedDetailsListSerializer


class ModelObjectidField(serializers.Field):
    """
        We use this when we are doing bulk create/update. Since multiple instances share
        many of the same fk objects we validate and query the objects first, then modify the request data
        with the fk objects. This allows us to pass the objects in to be validated.
    """

    def to_representation(self, value):
        return value.id

    def to_internal_value(self, data):
        return data


class BulkUpdateListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):

        instance_hash = {index: instance for index,
                         instance in enumerate(instances)}

        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        writable_fields = [
            x
            for x in self.child.Meta.fields
            if x not in self.child.Meta.read_only_fields
        ]

        try:
            self.child.Meta.model.objects.bulk_update(result, writable_fields)
        except IntegrityError as e:
            raise ValidationError(e)

        # update_project_last_modified(result)

        print(result)

        return result

    def to_representation(self, instances):

        # start = time.time()
        item_dispatch_list = instances[0].item_dispatch_list.pk
        rep_list = []
        for instance in instances:
            rep_list.append(
                dict(
                    id=instance.pk,
                    item_dispatch_list=item_dispatch_list,
                    serial_no=instance.serial_no,
                    remarks=instance.remarks,
                    updated_by=instance.updated_by,
                    updated_at=instance.updated_at,
                )
            )

        # print("to_rep", time.time() - start)

        return rep_list


class BulkDispatchItemReceivedDetailsSerializer(serializers.ModelSerializer):
    item_dispatch_list = ModelObjectidField()

    def create(self, validated_data):
        instance = inv_models.DispatchItemReceivedDetails(**validated_data)

        if isinstance(self._kwargs["data"], dict):
            instance.save()

        return instance

    def update(self, instance, validated_data):

        instance.serial_no = validated_data["serial_no"]
        instance.remarks = validated_data["remarks"]

        if isinstance(self._kwargs["data"], dict):
            instance.save()

        return instance

    class Meta:
        model = inv_models.DispatchItemReceivedDetails
        fields = ('id',
                  'item_dispatch_list',
                  'serial_no',
                  'remarks',
                  'updated_by',
                  'updated_at',)
        read_only_fields = ("id", "updated_at")
        list_serializer_class = BulkUpdateListSerializer


class ItemAllocationSerializer(serializers.ModelSerializer):
    related_create_user = ResgisteredUserSerializer(
        source='created_by', read_only=True)
    related_update_user = ResgisteredUserSerializer(
        source='updated_by', read_only=True)

    class Meta:
        model = inv_models.ItemAllocation

        fields = [
            'item',
            'body',
            'location',
            'to_user',
            'issued_by',
            'issued_on',
            'remarks',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'related_create_user',
            'related_update_user',

        ]
