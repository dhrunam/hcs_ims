from dataclasses import fields
#import imp
from pyexpat import model
from rest_framework import serializers
from configuration  import models


#  State
class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.State
        fields = ['id','name']

# District
class DistrictSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.District
        fields = [ 'id', 'state','name'] 

class ManageDistrictSerializer(serializers.ModelSerializer):
    related_state=StateSerializer(source="state",read_only=True)
    class Meta:
        model = models.District
        fields = [
                    'id',
                    'name',
                    'state',
                    'related_state',

        ]

# Designation
class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Designation
        fields = ['id','name']

# Body

# class BodySerializer(serializers.ModelSerializer):
#     class Meta:
#         model =  models.Body
#         fields = [
#                     'id',
#                     'name',
#                 ]

# Office
class OfficeSerializer(serializers.ModelSerializer):
    related_state = StateSerializer(source="state",read_only=True)
    related_district = DistrictSerializer(source="district",read_only=True)
    class Meta:
        model = models.Office
        fields = [
                    'id', 
                    'state', 
                    'district',
                    # 'body',
                    'name',
                    'address_line1',
                    'address_line2', 
                    'address_line3',
                    'pin',
                    'related_state',
                    'related_district',

                ]

class ManageOfficeSerializer(serializers.ModelSerializer):
    
    related_state = StateSerializer(source="state",read_only=True)
    related_district = DistrictSerializer(source="district",read_only=True)
    # related_body = BodySerializer(source="body",read_only=True)
    class Meta:
        model = models.Office
        fields = [
                    'id',
                    'state', 
                    'district',
                    # 'body',
                    'name',
                    'address_line1',
                    'address_line2', 
                    'address_line3',
                    'pin',
                    'related_state',
                    'related_district',
                    # 'related_body',

                ]



# Division
class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Division
        fields = [
            'id',
            'office',
            'name'
            ]
class ManageDivisionSerializer(serializers.ModelSerializer):
    related_office = OfficeSerializer(source="office",read_only=True)
    class Meta:
        model = models.Division
        fields = [
            'id',
            'office',
            'name',
            'related_office',
            ]

# Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
    
        fields = [
                    'id',
                    'office',
                    'name',
                    'type',
                    'parents_location',

                ]   


class ManageLocationSerializer(serializers.ModelSerializer):
    related_office = OfficeSerializer(source="office",read_only=True)
    related_location = LocationSerializer(source='parents_location', read_only=True)
    type_choices = serializers.ChoiceField(choices=(('office','Office'),('building','Building'),('floor','Floor'),('section','Section')),read_only=True)
    class Meta:
        model = models.Location
    
        fields = [
                    'id',
                    'office',
                    'name',
                    'type',
                    'parents_location',
                    'related_office',
                    'related_location',
                    'type_choices'

                ]   


## Financial Year
class FinancialYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FinancialYear

        fields = [
                    'id',
                    'financial_year',
                    

        ]     

# Account Head

class AccountHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AccountHead

        fields = [
                    'id',
                    'name',

        ]   
## =====
## ItemType
class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ItemType

        fields = [
                    'id',
                    'name',

        ]   

## =====
## Item
class ItemSerializer(serializers.ModelSerializer):
    related_item_type=ItemTypeSerializer(source='item_type', read_only=True)
    class Meta:
        model = models.Item
        fields = [
                    'id',
                    'name',
                    'item_type',
                    'related_item_type'

        ]

class ManageItemSerializer(serializers.ModelSerializer):
    related_type=ItemTypeSerializer(source="item_type",read_only=True)
    class Meta:
        model = models.Item
        fields = [
                    'id',
                    'name',
                    'item_type',
                    'related_type',

        ]


        
## Unit
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Unit

        fields = [
                    'id',
                    'name',
                    'short_name',

        ] 

## Vendor
class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vendor

        fields = [
                    'id',
                    'name',
                    'address',
                    'contact_no',
                    'gst_no',
                    'bank_account_no',
                    'ifsc',
                    'description',
                    'remarks'

        ]  





