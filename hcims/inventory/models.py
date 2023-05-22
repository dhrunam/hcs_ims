
# from tkinter import CASCADE
from django.db import models
from configuration import models as config_models
from django.contrib.auth.models import User

# Create your models here.

# Fund
"""
    Record fund received details. Data inserted to this table
    once cheque is received at HC

"""


class Fund(models.Model):
    account_head = models.ForeignKey(
        config_models.AccountHead, null=True, on_delete=models.SET_NULL, related_name='account_head')
    financial_year = models.ForeignKey(
        config_models.FinancialYear, null=True, on_delete=models.SET_NULL, related_name='fy')
    cheque_no = models.CharField(max_length=12, blank=False, unique=True)
    purpose = models.CharField(max_length=512, blank=False)
    cheque_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=None)
    cheque_date = models.DateField(blank=False)
    date_of_receipt = models.DateField(auto_now=True)
    document_url = models.FileField(upload_to='cheque')
    remarks = models.CharField(max_length=512, blank=False)
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='created_by')
    created_at = models.DateTimeField(auto_now=True, blank=False)
    updated_by = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE, related_name='updated_by')
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    def delete(self, using=None, keep_parents=False):
        self.document_url.storage.delete(self.document_url.name)
        super().delete()

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        try:

            if self.id:
                path = self.__class__.objects.get(id=self.id).document_url.path
                self.document_url.storage.delete(path)
            super().save()

        except:
            print('exception')
            pass

    def __str__(self) -> str:
        return super().__str__()


# Fund Utilization
"""
This will record detail about a purchase order against a sanctioned fund(cheque).
Only HC has the write access to this table
"""


class PurchaseDetails(models.Model):
    fund = models.ForeignKey(Fund, null=True, on_delete=models.SET_NULL)
    vendor = models.ForeignKey(
        config_models.Vendor, null=True, on_delete=models.SET_NULL)
    remarks = models.CharField(max_length=128, blank=True)
    order_no = models.CharField(max_length=128, blank=True)
    invoice_no = models.CharField(max_length=128, blank=True)
    purchase_date = models.DateField(blank=False)
    is_dispatchable = models.BooleanField(default=True, blank=False)
    purchase_order_url = models.FileField(upload_to='purchase_order')
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='purchase_created_by')
    created_at = models.DateTimeField(auto_now=True, blank=False)
    updated_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='purchase_updated_by')
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self) -> str:
        return super().__str__()


"""
 Record list of item purchase against a purchase order
"""


class PurchaseItemList(models.Model):
    purchase = models.ForeignKey(
        PurchaseDetails, null=True, on_delete=models.SET_NULL)
    item = models.ForeignKey(
        config_models.Item, null=True, on_delete=models.SET_NULL)
    unit = models.ForeignKey(
        config_models.Unit, null=True, on_delete=models.SET_NULL)
    item_specification = models.CharField(max_length=1024, blank=True)
    quantity = models.IntegerField(blank=False, default=0)

    unit_price = models.DecimalField(
        max_digits=20, decimal_places=2, default=0, blank=False)
    remarks = models.CharField(max_length=256, blank=True)

    def __str__(self) -> str:
        return super().__str__()


# Item reveived against the order
"""
 Records only lot received against an order.
 Items may or may not be physically come to HC.
 Items might go directly to District court.
 But it is HC resposibiity to record the basic details of item received
"""


class PurchaseItemReceivedDetails(models.Model):
    purchase_item = models.OneToOneField(
        PurchaseItemList, on_delete=models.CASCADE, related_name='received_item')
    purchase = models.ForeignKey(
        PurchaseDetails, null=True, on_delete=models.SET_NULL)
    item = models.ForeignKey(
        config_models.Item, null=True, on_delete=models.SET_NULL)
    quantity_received = models.IntegerField(blank=False, default=0)
    received_office = models.ForeignKey(
        config_models.Office, null=True, on_delete=models.SET_NULL)
    received_on = models.DateField(blank=False)
    received_by = models.ForeignKey(
        User, blank=False, null=True, on_delete=models.CASCADE)
    remarks = models.CharField(max_length=256, blank=True)
    created_by = models.ForeignKey(
        User, null=False, on_delete=models.CASCADE, related_name='purchase_item_created_by')
    created_at = models.DateTimeField(auto_now=True, blank=False)
    updated_by = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE, related_name='purchase_item_updated_by')
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    # class Meta:
    #     unique_together = ('purchase', 'item',)

    def __str__(self) -> str:
        return super().__str__()


"""
  Record item dispatch from HC against a purchase. Complete item details are need to be 
  recrded in receiver end.
  In case item needs to be consumed at HC itself, then also dispatch needs to be created
  from HC to HC only.

"""


class ItemDispatchDetail(models.Model):
    purchase = models.ForeignKey(
        PurchaseDetails, null=True, on_delete=models.SET_NULL)
    dispatch_to_office = models.ForeignKey(
        config_models.Office, null=True, on_delete=models.SET_NULL)
    dispatch_to_address = models.CharField(max_length=2048, blank=False)
    dispatch_subject = models.CharField(max_length=2048, blank=False)
    dispatch_description = models.CharField(max_length=2048, blank=False)
    dispatch_from_office = models.ForeignKey(
        config_models.Office, null=True, related_name='dispatch_from_office', on_delete=models.SET_NULL)
    dispatch_on = models.DateField(blank=False)
    dispatch_by = models.ForeignKey(
        User, blank=False, null=True, on_delete=models.SET_NULL, related_name="dispatch_by")
    dispatch_remarks = models.CharField(max_length=256, blank=True)
    received_on = models.DateField(blank=True, null=True)
    received_by = models.CharField(max_length=256, blank=True, null=True)
    handover_doc_url = models.FileField(
        upload_to='hand_over_document', blank=True, null=True)
    is_received = models.BooleanField(default=False)
    acknowledge_to_address = models.CharField(
        max_length=2048, blank=True, null=True)
    acknowledge_subject = models.CharField(
        max_length=2048, blank=True, null=True)
    acknowledge_description = models.CharField(
        max_length=2048, blank=True, null=True)
    acknowledge_remarks = models.CharField(
        max_length=256, blank=True, null=True)
    acknowledge_on = models.DateTimeField(blank=True, null=True)
    acknowledge_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='acknowledge_by')
    acknowledge_doc_url = models.FileField(
        upload_to='acknowledge_document', blank=True, null=True)
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='item_dispatch_created_by')
    created_at = models.DateTimeField(auto_now=True, blank=False)
    updated_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='item_dispatch_updated_by')
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self) -> str:
        return super().__str__()


class ItemDispatchList(models.Model):
    purchase_item_received = models.ForeignKey(
        PurchaseItemReceivedDetails, on_delete=models.CASCADE, related_name='dispatch_item')
    dispatch = models.ForeignKey(
        ItemDispatchDetail, on_delete=models.SET_NULL, null=True)
    purchase = models.ForeignKey(
        PurchaseDetails, on_delete=models.SET_NULL, null=True)
    item = models.ForeignKey(
        config_models.Item, on_delete=models.SET_NULL, null=True)
    lot_no = models.TextField(max_length=25, blank=False, default="NA")
    model_no = models.CharField(max_length=128, blank=True, null=True)
    specification = models.CharField(max_length=1024, blank=True)
    brand = models.CharField(max_length=64, blank=True)
    warranty_period = models.SmallIntegerField(default=0)
    quantity_dispatch = models.IntegerField(blank=False, default=0)
    remarks = models.CharField(max_length=256, blank=True)

    def __str__(self) -> str:
        return super().__str__()


"""
 Item received details against a dispatch. 
"""


class DispatchItemReceivedDetails(models.Model):
    item_dispatch_list = models.ForeignKey(
        ItemDispatchList, on_delete=models.SET_NULL, null=True)
    dispatch = models.ForeignKey(
        ItemDispatchDetail, on_delete=models.SET_NULL, null=True)
    purchase = models.ForeignKey(
        PurchaseDetails, null=True, on_delete=models.SET_NULL)
    item = models.ForeignKey(
        config_models.Item, on_delete=models.SET_NULL, null=True)

    serial_no = models.CharField(max_length=128, blank=False)

    is_in_use = models.BooleanField(default=False)
    remarks = models.CharField(max_length=256, blank=True, null=True)
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='item_received_created_by')
    created_at = models.DateTimeField(auto_now=True, blank=False)
    updated_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='item_received_updated_by')
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self) -> str:
        return super().__str__()

# Item issued details. This is not related to Utilization of Fund


class ItemAllocation(models.Model):
    item_received_details = models.ForeignKey(
        DispatchItemReceivedDetails, on_delete=models.CASCADE, null=False)
    item = models.ForeignKey(config_models.Item, on_delete=models.SET_NULL,
                             null=True, blank=False, related_name='allocated_item')
    office = models.ForeignKey(
        config_models.Office, on_delete=models.SET_NULL, null=True)
    location = models.ForeignKey(
        config_models.Location, on_delete=models.SET_NULL, null=True)
    to_user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='to_user')
    issued_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='issued_by')
    issued_on = models.DateField(null=False)
    remarks = models.CharField(max_length=1024, blank=True)
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='item_allocation_created_by')
    created_at = models.DateTimeField(auto_now=True, blank=False)
    updated_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='item_allocation_updated_by')
    updated_at = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self) -> str:
        return super().__str__()
