# from turtle import update
from unicodedata import name
from django.db import models
from django.contrib.auth.models import User
from configuration.models import (
    Designation, Office
)


# Create your models here.


class UserProfile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='related_profile')
    designation = models.ForeignKey(
        Designation, on_delete=models.SET_NULL, null=True, related_name='designation')
    office = models.ForeignKey(
        Office, on_delete=models.SET_NULL, null=True, related_name='office')
    contact_number = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
