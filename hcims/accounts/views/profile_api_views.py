
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User, Group

from accounts import serializers, models
from durin.auth import TokenAuthentication

class UserProfileList(generics.ListCreateAPIView):
    queryset = models.UserProfile.objects.all()
    serializer_class= serializers.UserProfileSerializer

class UserProfileDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.UserProfile
    serializer_class= serializers.UserProfileSerializer


class UserRegisterList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = serializers.RegisterSerializer

    


class UserRegisterDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = User
    serializer_class = serializers.RegisterSerializer


class UserGroupList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()
    serializer_class = serializers.UserGroupSerializer

class UserGroupDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = Group
    serializer_class = serializers.UserGroupSerializer

