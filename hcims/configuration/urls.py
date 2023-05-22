
from importlib.resources import path
from django.db import router
from django.urls import include, path
from rest_framework import routers
from durin import views as durin_views
from configuration import views

urlpatterns = [
    
    # path(r'refresh/', durin_views.RefreshView.as_view(), name='durin_refresh'),
    # path(r'logout/', durin_views.LogoutView.as_view(), name='durin_logout'),
    # path(r'logoutall/', durin_views.LogoutAllView.as_view(), name='durin_logoutall'),
    path('api/state', views.StateList.as_view()),
    path('api/state/<int:pk>', views.StateDetails.as_view()),
    
    path('api/district', views.DistrictList.as_view()),
    path('api/district/<int:pk>', views.DistrictDetails.as_view()),
    
    path('api/designation', views.DesignationList.as_view()),
    path('api/designation/<int:pk>', views.DesignationDetails.as_view()),

    # path('api/body', views.BodyList.as_view()),
    # path('api/body/<int:pk>', views.BodyDetails.as_view()),

    path('api/office', views.OfficeList.as_view()),
    path('api/office/<int:pk>', views.OfficeDetails.as_view()),

    path('api/division', views.DivisionList.as_view()),
    path('api/division/<int:pk>', views.DivisionDetails.as_view()),

    path('api/location', views.LocationList.as_view()),
    path('api/location/<int:pk>', views.LocationDetails.as_view()),

    path('api/financial_year', views.FinanacialYearList.as_view()),
    path('api/financial_year/<int:pk>', views.FinancialYearDetails.as_view()),


    path('api/account_head', views.AccountHeadList.as_view()),
    path('api/account_head/<int:pk>', views.AccountHeadDetails.as_view()),

    path('api/item_type', views.ItemTypeList.as_view()),
    path('api/item_type/<int:pk>', views.ItemTypeDetails.as_view()),

    path('api/item', views.ItemList.as_view()),
    path('api/item/<int:pk>', views.ItemDetails.as_view()),

    path('api/unit', views.UnitList.as_view()),
    path('api/unit/<int:pk>', views.UnitDetails.as_view()),

    path('api/vendor', views.VendorList.as_view()),
    path('api/vendor/<int:pk>', views.VendorDetails.as_view()),


    



    
    # path('api/auth/', include('durin.urls'))
]
