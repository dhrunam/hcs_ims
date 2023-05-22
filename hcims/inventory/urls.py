from django.urls import include, path
from inventory.views import (
    fund_views,
    acknowledge_views,
)


urlpatterns = [

    # path(r'refresh/', durin_views.RefreshView.as_view(), name='durin_refresh'),
    # path(r'logout/', durin_views.LogoutView.as_view(), name='durin_logout'),
    # path(r'logoutall/', durin_views.LogoutAllView.as_view(), name='durin_logoutall'),
    path('api/fund', fund_views.FundList.as_view()),
    path('api/fund/<int:pk>', fund_views.FundDetails.as_view()),

    #     path('api/fund/list', fund_views.CustomFundList.as_view({'get': 'list'})),
    path('api/fund/list', fund_views.CustomFundList.as_view()),
    path('api/purchase_details', fund_views.PurchaseDetailsList.as_view()),
    path('api/purchase_details/<int:pk>', fund_views.PurchaseDetails.as_view()),

    path('api/items/purchase', fund_views.PurchaseItemsList.as_view()),
    path('api/items/purchase/<int:pk>',
         fund_views.PurchaseItemsListDetails.as_view()),
    path('api/items/purchase/order',
         fund_views.PurchaseItemesListOfParticularOrder.as_view()),


    path('api/items/purchase/received',
         fund_views.PurchaseItemReceivedDetailsList.as_view()),
    path('api/items/purchase/received/<int:pk>',
         fund_views.PurchaseItemReceivedDetails.as_view()),
    path('api/items/purchase/received/list',
         fund_views.PurchaseItemReceivedDetailsListOfParticularOrder.as_view()),

    path('api/items/purchase/received_dispatch',
         fund_views.PurchaseItemReceivedByDispatch.as_view({'get': 'list'})
         ),

    path('api/dispatch_details', fund_views.ItemDispatchDetailList.as_view()),
    path('api/dispatch_details/<int:pk>',
         fund_views.ItemDispatchDetail().as_view()),

    path('api/items/dispatch', fund_views.ItemDispatchList.as_view()),
    path('api/items/dispatch/<int:pk>',
         fund_views.ItemDispatchListDetails.as_view()),
    path('api/items/dispatch/received',
         fund_views.ItemDispatchListDetailsWithReceivedItemList.as_view({'get': 'list'})),



    path('api/items/received',
         acknowledge_views.DispatchItemReceivedDetailsList().as_view()),
    path('api/items/received/<int:pk>',
         acknowledge_views.DispatchItemReceivedDetails().as_view()),
    path('api/items/received/bulkupdate/<int:item_dispatch_list>',
         acknowledge_views.BulkDispatchItemReceivedDetailsUpdateView.as_view()),

    path('api/items/allocation', acknowledge_views.ItemAllocationList.as_view()),
    path('api/items/allocation/<int:pk>',
         acknowledge_views.ItemAllocationDetails.as_view()),

    # Reports URLs
    path('api/report/fund_received_utilize',
         fund_views.YearWiseFund.as_view({'get': 'list'}))


    # path('api/auth/', include('durin.urls'))
]
