from inventory import models
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction, connection
from inventory import serializers
from durin.auth import TokenAuthentication
from rest_framework.exceptions import ValidationError
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


def update_item_dispatch_list(self, data):
    print('item_dispatch_list:')
    print(data[0]['item_dispatch_list'])
    item_dispatch_list = models.ItemDispatchList.objects.get(
        id=data[0]['item_dispatch_list'])
    if(item_dispatch_list):
        item_dispatch_list.brand = data[0]['brand']
        item_dispatch_list.model_no = data[0]['model_no']
        item_dispatch_list.warranty_period = data[0]['warranty_period']
        item_dispatch_list.specification = data[0]['specification']
        item_dispatch_list.save()


def validate_ids(data, field="id", unique=True):

    if isinstance(data, list):
        print('inside  if')
        id_list = [int(x[field]) for x in data]

        if unique and len(id_list) != len(set(id_list)):
            raise ValidationError(
                "Multiple updates to a single {} found".format(field))

        return id_list

    print('outside if')
    return [data]


class DispatchItemReceivedDetailsList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.DispatchItemReceivedDetails.objects.all()
    serializer_class = serializers.DispatchItemReceivedDetailsSerializer
    dispatch_id = False

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        if(self.request.query_params.get('dispatch_id')):
            self.dispatch_id = self.request.query_params.get('dispatch_id')

        if(self.dispatch_id):

            return models.DispatchItemReceivedDetails.objects.filter(dispatch=self.dispatch_id)
        else:
            return models.DispatchItemReceivedDetails.objects.all()

    @transaction.atomic
    def post(self, request, *args, **kwargs):

        data = request.data['data']
        result = Response()
        if(data):
            for element in data:
                print(element)
                request.data['id'] = element['id']
                request.data['item_dispatch_list'] = element['item_dispatch_list']
                request.data['dispatch'] = element['dispatch']
                request.data['purchase'] = element['purchase']
                request.data['item'] = element['item']
                request.data['serial_no'] = element['serial_no']
                request.data['model_no'] = element['model_no']
                request.data['specification'] = element['specification']
                request.data['brand'] = element['brand']
                request.data['warranty_period'] = element['warranty_period']
                request.data['is_in_use'] = element['is_in_use']
                request.data['remarks'] = element['remarks']
                if(request.data['id'] is None or request.data['id'] <= 0):
                    result = self.create(request, *args, **kwargs)

            update_item_dispatch_list(self, data)
        # self.request.query_params['dispatch_id'] = data[0]['dispatch']
        self.dispatch_id = data[0]['dispatch']
        return self.get(request, *args, **kwargs)


class DispatchItemReceivedDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.DispatchItemReceivedDetails
    serializer_class = serializers.DispatchItemReceivedDetailsSerializer


class BulkDispatchItemReceivedDetailsUpdateView(generics.ListCreateAPIView):
    """
    # List/Create/Update the relationships between Labels and CaptureSamples

    Required permissions: *Authenticated*, *CaptureLabelValue add*
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.BulkDispatchItemReceivedDetailsSerializer

    def get_serializer(self, *args, **kwargs):
        print(kwargs.get("data", {}))

        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(BulkDispatchItemReceivedDetailsUpdateView, self).get_serializer(
            *args, **kwargs
        )

    def get_queryset(self, ids=None):
        if ids:
            return models.DispatchItemReceivedDetails.objects.filter(
                item_dispatch_list=self.kwargs["item_dispatch_list"], id__in=ids,
            )

        return models.DispatchItemReceivedDetails.objects.filter(item_dispatch_list=self.kwargs["item_dispatch_list"],)

    # def post(self, request, *args, **kwargs):

    #     item_dispatch_list = models.ItemDispatchList.objects.get(
    #         id=kwargs["item_dispatch_list"])

    #     if isinstance(request.data, list):
    #         for item in request.data:
    #             item["item_dispatch_list"] = item_dispatch_list
    #     else:
    #         raise ValidationError("Invalid Input")

    #     return super(TaskBulkListCreatetUpdateView, self).post(request, *args, **kwargs)
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        data = request.data['data']
        update_item_dispatch_list(self, data)
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):

        item_dispatch_list = models.ItemDispatchList.objects.get(
            id=kwargs["item_dispatch_list"])

        ids = validate_ids(request.data['data'])

        # print(item_dispatch_list)

        if isinstance(request.data['data'], list):
            for item in request.data['data']:
                # print(item)
                item["item_dispatch_list"] = item_dispatch_list
                # print(item["item_dispatch_list"])

        else:
            raise ValidationError("Invalid Input")

        instances = self.get_queryset(ids=ids)

        serializer = self.get_serializer(
            instances, data=request.data['data'], partial=False, many=True
        )

        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)

        data = serializer.data
        return Response(data)

    def perform_update(self, serializer):
        serializer.save()

# ===================


class ItemAllocationList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.ItemAllocation.objects.all()
    serializer_class = serializers.ItemAllocationSerializer


class ItemAllocationDetails(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = models.ItemAllocation
    serializer_class = serializers.ItemAllocationSerializer

# ===================
