
from importlib.resources import path
from django.db import router
from django.urls import include, path
from rest_framework import routers
from durin import views as durin_views
from accounts import views

urlpatterns = [
    
    # path(r'refresh/', durin_views.RefreshView.as_view(), name='durin_refresh'),
    # path(r'logout/', durin_views.LogoutView.as_view(), name='durin_logout'),
    # path(r'logoutall/', durin_views.LogoutAllView.as_view(), name='durin_logoutall'),
    path('api/user/group',views.UserGroupList.as_view()),
    path('api/user/group/<int:pk>', views.UserGroupDetails.as_view()),

    path('api/user/profile',views.UserProfileList.as_view()),
    path('api/user/profile/<int:pk>', views.UserProfileDetails.as_view()),
    path('api/user/reg', views.UserRegisterList.as_view()),
    path('api/user/reg/<int:pk>', views.UserRegisterDetails.as_view()),
    path('api/auth/', include('durin.urls'))
]
