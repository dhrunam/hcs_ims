from ctypes.wintypes import PINT
from unicodedata import name
from django.db import models


# Create your models here.

class State(models.Model):
    name=models.CharField(max_length=64,blank=False, unique=True)
    def __str__(self) -> str:
        return super().__str__()



class District(models.Model):

    state=models.ForeignKey(State, related_name='state', null=True, on_delete=models.SET_NULL, default=1)
    name=models.CharField(max_length=64,blank=False, unique=True)
    def __str__(self) -> str:
        return super().__str__()

class Designation(models.Model):
    name = models.CharField(max_length=64,blank=False, unique=True)
    def __str__(self) -> str:
        return super().__str__()


# class Body(models.Model):
#     name = models.CharField(max_length=64,blank=False, unique=True)
#     def __str__(self) -> str:
#         return super().__str__()


class Office(models.Model):
    state=models.ForeignKey(State,on_delete=models.SET_NULL, null=True, related_name='office_state')
    district=models.ForeignKey(District,on_delete=models.SET_NULL, null=True, related_name='office_district')
    # body = models.ForeignKey(Body, on_delete=models.SET_NULL, null=True, related_name='office_body')
    name=models.CharField(max_length=128,blank=False)
    address_line1=models.CharField(max_length=128, blank=False)
    address_line2=models.CharField(max_length=128,blank=True, default='')
    address_line3=models.CharField(max_length=128,blank=True, default='')
    pin=models.CharField(max_length=6)
    def __str__(self) -> str:
        return super().__str__()

class Division(models.Model):
    office=models.ForeignKey(Office,on_delete=models.SET_NULL, null=True)
    name=models.CharField(max_length=128,blank=False)
    def __str__(self) -> str:
        return super().__str__()

# Location Master
"""
id                      offcie                  name                type            parenets_location    
--                      -----                   -----               ----            -----------------
1                       1                       CJ Bunglow          Building        2
2                       1                       Head Office         Office          null
3                       1                       Tower-A             Building        2              
"""
class Location(models.Model):
    office = models.ForeignKey(Office, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32) # office, building, floor, section
    parents_location=models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    def __str__(self) -> str:
        return super().__str__()


# Financial Year

class FinancialYear(models.Model):
    financial_year = models.CharField(max_length=7, blank=False, unique=True)
    def __str__(self) -> str:
        return super().__str__()

# Account Head Master

class AccountHead(models.Model):
    name = models.CharField(max_length=128, blank=False, unique=True)
    def __str__(self) -> str:
        return super().__str__()

# Item Type Master

class ItemType(models.Model):
    name = models.CharField(max_length=128, unique=True)
    def __str__(self) -> str:
        return super().__str__()

# Item Master

class Item(models.Model):
    name = models.CharField(max_length=128, blank=False, unique=True)
    item_type = models.ForeignKey(ItemType, related_name="item_type",  on_delete=models.SET_NULL, null=True)
    def __str__(self) -> str:
        return super().__str__()

# Unit Master
class Unit(models.Model):
    name = models.CharField(max_length=128,blank=False, unique=True) # like set, unit, piece, bundle, kilo gram
    short_name = models.CharField(max_length=10) # let pc, kg 
    def __str__(self) -> str:
        return super().__str__()

# Vendor Master

class Vendor(models.Model):
    name = models.CharField(max_length=256, blank=False, unique=True)
    address = models.CharField(max_length=512, blank=False)
    contact_no = models.CharField(max_length=15, blank=False)
    gst_no = models.CharField(max_length=15, blank=False)
    bank_account_no = models.CharField(max_length=20, blank=False)
    ifsc = models.CharField(max_length=20, blank=False)
    description = models.CharField( max_length=2048, blank=True)
    remarks = models.CharField(max_length=2048 ,blank=True)








    



