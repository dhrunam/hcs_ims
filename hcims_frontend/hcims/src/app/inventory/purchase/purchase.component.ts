import { Renderer2, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FundService } from '../fund/fund.service';
import { VendorService } from 'src/app/configuration/vendor/vendor.service';
import { PurchaseItemReceivedDetailsService } from '../purchase-item-received-details/purchase-item-received-details.service';
import { PurchaseDetailsService } from '../purchase-details/purchase-details.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ItemMasterService } from 'src/app/configuration/item-master/item-master.service';
import { UnitService } from 'src/app/configuration/unit/unit.service';
import { PurchaseItmesService } from '../purchase-items/purchase-itmes.service';
import { DispatchDetailsService } from '../dispatch-details/dispatch-details.service';
import { OfficeService } from 'src/app/configuration/office/office.service';
import { DispatchItemsService } from '../dispatch-items/dispatch-items.service';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


import { PURCHASE_RECEIVED_OFFICE_ID } from 'src/environments/environment.prod';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

//const url = "src/assets/js/stepper.js";

declare var bindStepper: any;


@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  @ViewChild('item_auto_complete') item_auto_complete: any;
  //loadAPI: any = [];
  dtOptions: DataTables.Settings = {};

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();




  //=== Purchase Details=====
  purchaseEntryFrom = this.formBuilder.group({
    id: 0,
    fund: "",
    vendor: "",
    remarks: "",
    order_no: "",
    invoice_no: "",
    purchase_date: "",
    is_dispatchable: ['true', [Validators.required]],
    purchase_order_url: new FormControl('', [Validators.required]),


  });
  current_purchase_order_url: any = ""
  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  purchase_details_list: any = [];
  fund_list: any = [];
  vendor_list: any = [];
  is_dispatchable: boolean = true;

  isFail: boolean = false;
  purchase_id: number = 0;
  //==== End ============

  //==== Purchase Items ======

  purchaseItemEntryForm = this.formBuilder.group({
    id: 0,
    purchase: 0,
    item: 0,
    item_specification: "",
    quantity: "",
    unit: "",
    unit_price: "",
    // remarks: " ",

  });

  isPurchaseItemsShowTable: boolean = true;
  purchase_item_list: any = [];
  purchase_list: any = [];
  item_list: any = [];
  default_item: any = {};
  unit_list: any = [];
  keyword = 'name';

  //==== End ============


  //==== Received Items ====

  receivedItemEntryForm: any = [];

  isReceivedItemShowTable: boolean = false;


  //==== End ====

  // ===== Dispatch Details ====

  dispatchDetailsEntryForm = this.formBuilder.group({
    id: 0,
    purchase: this.localStorageService.getComponentData('purchase_id').id,
    dispatch_to_office: "",
    dispatch_to_address: "",
    dispatch_subject: "",
    dispatch_description: "",
    dispatch_on: "",
    dispatch_remarks: "",
    received_by: "",
    handover_doc_url: ""


  });

  dispatch_details_list: any = [];
  office_list: any = [];
  dispatchStepShowStage: any = {
    isDispatchDetailTable: true,
    isDispatchDetailForm: false,
    isDispatchItemTable: false,
    isDispatchItemForm: false
  }
  isDispatchDetailNextButtonActive: boolean = true;


  // ====== End ======

  // ===== Dispatch Items ===

  dispatchItemEntryForm: any = []
  dispatch_id: number = 0;
  purchase_dispatch_item_list: any = []
  purchase_dispatch_item: any = []

  // ===== End =====

  // ==== Acknoledgement ===

  acknowledgmentDetails: any;
  isAcknowledge: boolean = false

  // ==== End ==== 

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private fundService: FundService,
    private vendorService: VendorService,
    private service: PurchaseDetailsService,
    private localStorageService: LocalStorageService,
    private itmeMasterService: ItemMasterService,
    private purchaseItemService: PurchaseItmesService,
    private unitService: UnitService,
    private purchaseItemReceivedDetailsService: PurchaseItemReceivedDetailsService,
    private dispatchDetailsService: DispatchDetailsService,
    private officeService: OfficeService,
    private dispatchItemsService: DispatchItemsService

  ) { }

  ngOnInit(): void {

    bindStepper();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
    this.laodPurchaseDetiailsData();
    //this.loadItemMaster();
    //this.onQuantityDispatchChange(0, 0);

  }

  laodPurchaseDetiailsData() {
    this.loadVendor();
    this.loadFund();
    this.loadPurchaseDetails();
  }


  loadVendor() {
    this.vendorService.get_all().subscribe({
      next: data => {
        this.vendor_list = data;
        console.log(this.vendor_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  loadFund() {
    this.fundService.get_all().subscribe({
      next: data => {
        this.fund_list = data;
        console.log(this.fund_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  loadPurchaseDetails() {
    let fund_id = this.localStorageService.getComponentData('fund_id');
    this.purchaseEntryFrom.patchValue({
      fund: fund_id.id != null ? fund_id.id : 0
    });

    this.purchase_id = this.localStorageService.getComponentData('purchase_id').id;
    if (this.purchase_id > 0) {
      this.service.get_sigle(this.purchase_id).subscribe(
        {
          next: data => {

            this.is_dispatchable = data.is_dispatchable
            this.purchaseEntryFrom.patchValue({
              id: data.id,
              fund: data.fund,
              vendor: data.vendor,
              remarks: data.remarks,
              order_no: data.order_no,
              invoice_no: data.invoice_no,
              purchase_date: data.purchase_date,
              is_dispatchable: [data.is_dispatchable.toString()]
            });

            this.current_purchase_order_url = data.purchase_order_url


            window.scroll(0, 0);
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
          }
        }
      );
    }


  }


  // setLoadAPI() {
  //   this.loadAPI = new Promise((resolve) => {
  //     console.log('resolving promise...');
  //      this.loadScript();
  //   });
  // }
  // loadScript() {
  //   console.log('preparing to load...')
  //   let node = document.createElement('script');
  //   node.src = url;
  //   node.type = 'module';
  //   node.async = true;
  //   document.getElementsByTagName('body')[0].appendChild(node);
  // }

  onPurchaseDetailsCancel() {
    this.route.navigateByUrl('inventory/purchase_details');
  }

  onPurchaseDetaislSubmit() {
    if (this.purchaseEntryFrom.value.id <= 0) {
      this.insert();
    }
    else {
      this.update();
    }
  }

  insert() {
    this.service.post(this.getPurchaseDetailsFormData()).subscribe({
      next: data => {
        this.purchaseEntryFrom.patchValue({
          id: data.id
        });
        this.localStorageService.setComponentData('purchase_id', { id: data.id })
        this.switchSuccessFailureStatus(true);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });

  }
  update() {

    this.service.put(this.getPurchaseDetailsFormData()).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true);
        this.isSignUpFailed = false;
        //this.purchaseEntryFrom.reset();
        //this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });

  }

  onPurchaseOrderChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.purchaseEntryFrom.patchValue({
        purchase_order_url: file
      });
    }
  }

  getPurchaseDetailsFormData(): FormData {

    let formData: FormData = new FormData();
    formData.append('id', this.purchaseEntryFrom.value.id);
    formData.append('fund', this.purchaseEntryFrom.value.fund);
    formData.append('vendor', this.purchaseEntryFrom.value.vendor);
    formData.append('remarks', this.purchaseEntryFrom.value.remarks);
    formData.append('order_no', this.purchaseEntryFrom.value.order_no);
    formData.append('invoice_no', this.purchaseEntryFrom.value.invoice_no);
    formData.append('purchase_date', this.purchaseEntryFrom.value.purchase_date);
    formData.append('is_dispatchable', this.purchaseEntryFrom.value.is_dispatchable);
    formData.append('purchase_order_url', this.purchaseEntryFrom.get('purchase_order_url')?.value);

    return formData;
  }


  //=== Purchase Items ====

  onPurchaseItemTabLoad() {
    console.log('PurchaseItemTabLoad method called...');
    this.loadPurchaseItems();
    this.loadUnit();
    this.loadVendor();

    this.isPurchaseItemsShowTable = true;
  }

  onPurchaseItemEdit(id: number) {
    console.log('id:' + id);
    this.purchaseItemService.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.default_item = {
          id: data.related_item.id,
          name: data.related_item.name

        }
        this.purchaseItemEntryForm.setValue({
          id: data.id,
          purchase: data.purchase,
          item: data.item,
          item_specification: data.item_specification,
          quantity: data.quantity,
          unit: data.unit,
          unit_price: data.unit_price,
          // remarks: data.remarks,
        });
        window.scroll(0, 0);
        this.onPurchaseItemsShowTable(false);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onPurchaseItemsShowTable(need_form_initializstion: boolean) {
    this.loadItemMaster();
    if (need_form_initializstion) {
      this.initializePurchaseItemEntryForm();
    }
    this.purchaseItemsShowTable();
    this.initializeSuccessFailureStatus();

  }

  purchaseItemsShowTable() {
    this.isPurchaseItemsShowTable = !this.isPurchaseItemsShowTable;
    this.purchaseItemEntryForm.patchValue(
      {
        purchase: this.purchase_id
      }
    );
  }

  loadPurchaseItems() {

    this.purchaseItemService.get_all_by_purchase(this.purchase_id).subscribe({
      next: data => {
        this.purchase_item_list = data;
        console.log(this.purchase_item_list);
        this.dtTrigger.next(this.purchase_item_list);
        this.initializeReceivedItemEntryForm(data.results);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  loadItemMaster() {

    this.itmeMasterService.get_all().subscribe({
      next: data => {
        //this.item_list = data;
        this.item_list = []

        data.results.forEach((e: any) => {
          this.item_list.push({ id: e.id, name: e.name });
        });

        console.log(this.item_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  loadUnit() {
    this.unitService.get_all().subscribe({
      next: data => {
        this.unit_list = data;
        console.log(this.unit_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onPurchaseItemSubmit() {
    if (this.purchaseItemEntryForm.value.id <= 0) {
      this.purchaseItemInsert();
    }
    else {
      this.purchaseItemUpdate();
    }

  }

  purchaseItemInsert() {
    this.purchaseItemService.post(this.purchaseItemEntryForm.value).subscribe({
      next: data => {
        this.purchaseItemEntryForm.patchValue({
          id: data.id
        });
        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true);
        this.isSignUpFailed = false;
        this.initializePurchaseItemEntryForm();
        this.loadPurchaseItems();
        //this.onPurchaseItemsShowTable();
        this.purchaseItemsShowTable();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });
  }

  purchaseItemUpdate() {
    this.purchaseItemService.put(this.purchaseItemEntryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.initializePurchaseItemEntryForm();
        this.loadPurchaseItems();
        this.switchSuccessFailureStatus(true);
        this.purchaseItemsShowTable();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });
  }

  initializePurchaseItemEntryForm() {

    this.purchaseItemEntryForm.reset();
    this.purchaseItemEntryForm.setValue(
      {
        id: 0,
        purchase: this.localStorageService.getComponentData('purchase_id').id,
        item: "",
        item_specification: "",
        quantity: "",
        unit: "",
        unit_price: "",
        // remarks: " ",
      }
    );
  }

  selectEvent(event: any) {
    this.purchaseItemEntryForm.patchValue({
      item: event.id

    });
  }

  onInputCleared(event: any) {
    if (this.item_auto_complete !== undefined) {

      this.item_auto_complete.data = this.item_list;

    }

  }

  onChangeSearch(val: string) {

    this.item_auto_complete.initialValue = {};
    this.item_auto_complete.isLoading = true;
    let temp_item_list: any = [];
    // if (val && val.length >= 3) {
    this.itmeMasterService.get_all_by_search_key(val).subscribe({
      next: data => {


        data.results.forEach((e: any) => {
          temp_item_list.push({ id: e.id, name: e.name });

        });

        this.item_auto_complete.data = temp_item_list;
        this.item_auto_complete.isLoading = false;
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    //}
  }

  onFocused(event: any) {
    console.log(this.item_list);
    event.stopPropagation();
    this.item_auto_complete.open();
    console.log(this.item_auto_complete);

  }

  // ====== End ==========


  // ====== Item Received Detaila ====
  get receivedEntryFormItems() {

    return this.receivedItemEntryForm.controls["items"] as FormArray;

  }

  onReceivedItemSave(index: number) {

  }

  onReceivedItemTabLoad() {
    this.loadPurchaseItems();
    this.isReceivedItemShowTable = true;
  }

  initializeReceivedItemEntryForm(purchase_item: any) {

    this.receivedItemEntryForm = this.formBuilder.group({
      //id : 0,
      purchase: new FormControl('', [Validators.required]),
      //item : "",
      //quantity_received:0,
      received_office: PURCHASE_RECEIVED_OFFICE_ID,
      received_on: new FormControl('', [Validators.required]),
      //remarks : new FormControl('',[Validators.required]),
      items: this.formBuilder.array([]),



    });

    if (purchase_item.length > 0) {
      console.log(purchase_item[0].received_on);
      this.receivedItemEntryForm.patchValue(
        {
          purchase: purchase_item[0].purchase,
          received_office: PURCHASE_RECEIVED_OFFICE_ID,
          received_on: purchase_item[0].related_received_item != null ? purchase_item[0].related_received_item.received_on : ""
        }
      );
      purchase_item.forEach((element: any) => {
        const item_form = this.formBuilder.group(
          {
            // For view only fields
            name: element.related_item.name,
            item_specification: element.item_specification,
            quantity: element.quantity,
            // For data entry fields
            id: element.related_received_item != null ? element.related_received_item.id : 0,
            purchase_item: element.id,
            item: element.item,
            quantity_received: element.related_received_item != null ? element.related_received_item.quantity_received : 0,
            remarks: element.related_received_item != null ? element.related_received_item.remarks : " "

          }
        );
        this.receivedEntryFormItems.push(item_form);
      });

      console.log(this.receivedEntryFormItems.controls);
    }
  }

  onReceivedItemsSubmit() {
    this.receivedEntryFormItems.controls.forEach(data => {
      console.log('id:' + data.value.id);
      console.log('name:' + data.value.name);
      console.log('item:' + data.value.item);
      if (data.value.id <= 0) {
        this.insertReceivedItem(data);
      }
      else {
        this.updateReceivedItem(data);
      }
    });
  }

  onQuantityReceivedChange(index: number) {

    let input_value = this.receivedEntryFormItems.at(index).value.quantity_received;
    let quantity_ordered = this.receivedEntryFormItems.at(index).value.quantity;

    if (input_value) {
      if (input_value > quantity_ordered) {
        this.receivedEntryFormItems.at(index).patchValue({
          quantity_received: 0
        })

        alert('Received quantity cannot greater than Ordered Quantity!');
      }

    }

  }

  insertReceivedItem(data: AbstractControl) {
    let inseratable_data: any = {
      id: data.value.id,
      purchase_item: data.value.purchase_item,
      purchase: this.receivedItemEntryForm.value.purchase,
      item: data.value.item,
      quantity_received: data.value.quantity_received,
      received_office: PURCHASE_RECEIVED_OFFICE_ID,
      received_on: this.receivedItemEntryForm.value.received_on,
      remarks: data.value.remarks,
    }
    this.purchaseItemReceivedDetailsService.post(inseratable_data).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true);
        //this.isSignUpFailed = false;
        //this.purchaseItemEntryForm.reset();
        //this.loadPurchaseItems();
        //this.onPurchaseItemsShowTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });
  }

  updateReceivedItem(data: AbstractControl) {
    let updatable_data: any = {
      id: data.value.id,
      purchase_item: data.value.purchase_item,
      purchase: this.receivedItemEntryForm.value.purchase,
      item: data.value.item,
      quantity_received: data.value.quantity_received,
      received_office: PURCHASE_RECEIVED_OFFICE_ID,
      received_on: this.receivedItemEntryForm.value.received_on,
      remarks: data.value.remarks,
    }
    this.purchaseItemReceivedDetailsService.put(updatable_data).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        // this.isSignUpFailed = false;
        // this.purchaseItemEntryForm.reset();
        // this.loadPurchaseItems();
        this.switchSuccessFailureStatus(true);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });
  }

  // ======= End  ======


  // ======== Dispatch Details =====
  onDispatchLoad() {
    this.loadDispatchDetails();
    this.loadOffice();
    this.isDispatchDetailNextButtonActive = true;
  }

  onAddDispatch() {
    this.dispatchDetailsEntryForm.patchValue({
      id: 0
    })
    this.manageDispathcStepShow('isDispatchDetailForm');
  }

  onDispatchDetailsCancel() {
    this.manageDispathcStepShow('isDispatchDetailTable');
    this.isDispatchDetailNextButtonActive = true;
  }

  manageDispathcStepShow(target: string) {
    this.hideAllDispatchStep();
    this.dispatchStepShowStage[target] = true;
  }
  hideAllDispatchStep() {

    this.dispatchStepShowStage.isDispatchDetailTable = false;
    this.dispatchStepShowStage.isDispatchDetailForm = false;
    this.dispatchStepShowStage.isDispatchItemTable = false;
    this.dispatchStepShowStage.isDispatchItemForm = false;
  }

  loadDispatchDetails() {
    this.purchase_id = this.localStorageService.getComponentData('purchase_id').id;
    this.dispatchDetailsService.get_all_by_purchase(this.purchase_id).subscribe({
      next: data => {
        this.dispatch_details_list = data;
        console.log(this.dispatch_details_list);
        this.dtTrigger.next(this.dispatch_details_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  loadOffice() {
    this.officeService.get_all().subscribe({
      next: data => {
        this.office_list = data;
        console.log(this.office_list);
        this.dtTrigger.next(this.office_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }


  onDispatchDetailsSubmit() {
    if (this.dispatchDetailsEntryForm.value.id <= 0) {
      this.dispatchInsert();
    }
    else {
      this.dispatchUpdate();
    }
  }

  dispatchInsert() {

    this.purchase_id = this.localStorageService.getComponentData('purchase_id').id;
    this.dispatchDetailsEntryForm.patchValue(
      {
        purchase: this.purchase_id
      }
    )
    this.dispatchDetailsService.post(this.dispatchDetailsEntryForm.value).subscribe({
      next: data => {
        console.log(data);
        //this.route.navigateByUrl('/config/fy');
        this.dispatchDetailsEntryForm.patchValue({
          id: data.id
        });
        this.loadDispatchDetails();
        this.switchSuccessFailureStatus(true);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.switchSuccessFailureStatus(false);
      }
    });

  }
  dispatchUpdate() {

    this.dispatchDetailsService.put(this.dispatchDetailsEntryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');ƒ
        console.log(data);
        this.isSuccessful = true;
        this.loadDispatchDetails();
        this.switchSuccessFailureStatus(true);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.switchSuccessFailureStatus(false);
      }
    });

  }

  loadDispatchDetailsSingle(id: number) {
    this.dispatchDetailsService.get_sigle(id).subscribe({
      next: data => {
        this.printDispatchLetter(data);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onDispatchDetailsEdit(id: number) {
    console.log('id:' + id);
    this.dispatchDetailsService.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.dispatchDetailsEntryForm.setValue({
          id: data.id,
          purchase: this.purchase_id,
          dispatch_to_office: data.dispatch_to_office,
          dispatch_to_address: data.dispatch_to_address,
          dispatch_subject: data.dispatch_subject,
          dispatch_description: data.dispatch_description,
          dispatch_on: data.dispatch_on,
          dispatch_remarks: data.dispatch_remarks,
          received_by: data.received_by,
          handover_doc_url: data.handover_doc_url
        });
        window.scroll(0, 0);

        this.manageDispathcStepShow('isDispatchDetailForm');
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }


  onRedirectToDispatchItemList(dispatch_id: number) {
    console.log(dispatch_id);
    this.localStorageService.setComponentData('dispatch_id', { id: dispatch_id })
    this.dispatch_id = dispatch_id;
    this.isDispatchDetailNextButtonActive = false;
    this.loadPurchaseDispatchItems();

  }

  onPrintDispatchLetter(dispatch_id: number) {

    console.log(dispatch_id);
    this.loadDispatchDetailsSingle(dispatch_id);
    this.localStorageService.setComponentData('dispatch_id', { id: dispatch_id })
    this.dispatch_id = dispatch_id;
    this.isDispatchDetailNextButtonActive = false;
    this.loadPurchaseDispatchItems();

  }

  printDispatchLetter(data: any) {
    let login_user = this.localStorageService.getUser();
    console.log('Print..');
    console.log(login_user);
    console.log(data);

    let docDefinition: any = {
      content: [
        // Previous configuration  
        {
          text: ' ',
          style: 'sectionHeader'
        },
        {
          text: ' ',
          style: 'sectionHeader'
        },
        {
          text: ' ',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: 'Ref No: ..........................................',
                style: 'ref_section'
              },
              {
                text: ' ',
                style: 'ref_section'
              },
              {
                text: 'Date: ..............................................',
                style: 'ref_section'
              },

            ],
            [
              // {
              //   text: `Date: ${new Date().toLocaleString()}`,
              //   alignment: 'right'
              // },
              // {
              //   text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
              //   alignment: 'right'
              // }
            ]
          ]
        },
        {
          text: 'To,',
          margin: [15, 20, 0, 0]
        },
        {
          text: data.dispatch_to_address,
          margin: [30, 20, 0, 0]
        },
        {
          text: data.related_dispatch_to_office.address_line1,
          margin: [30, 0, 0, 0]
        },
        {
          text: data.related_dispatch_to_office.address_line2,
          margin: [30, 0, 0, 0]
        },
        {
          columns:
            [

              {
                text: 'Sub:',
                margin: [15, 20, 0, 0],
                width: '20%',

              },
              {
                text: data.dispatch_subject,
                margin: [1, 20, 0, 0],
                bold: true,
                width: '80%',

              }

            ]

        },
        {
          text: 'Sir/Madam,',
          margin: [15, 20, 0, 0]
        },
        {
          text: data.dispatch_description,
          margin: [15, 20, 0, 0],
          alignment: 'justify'
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', '100%', 'auto'],

            body: [
              ['Sl. No', 'Item', 'Qty',],
              //['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              ...this.purchase_dispatch_item_list.results.map((p: any, index: number) => ([index + 1, (p.related_item.name + ":" +
                p.related_purchase_item.item_specification).toString(),
              p.quantity_dispatch

              ])),
              ['', { text: 'Total Number of Items', bold: true, colspan: 2, alignment: 'center' },
                this.purchase_dispatch_item_list.results.map((p: any, total: number = 0) => {
                  return total + p.quantity_dispatch;
                }
                )
              ]
            ]
          }
        },
        {
          text: 'This is for your kind information please.',
          margin: [15, 20, 0, 0],
          alignment: 'justify'
        },

        {
          text: '       ',

        },
        {
          text: '       ',

        },
        {
          text: '       ',

        },

        {
          columns: [
            [
              {
                text: '       '

              },


            ],
            [
              {
                text: '        '

              },

            ],
            [
              {
                text: 'Sd/-',
                alignment: 'center',
                bold: true,

              },

            ]
          ]
        },
        {
          columns: [
            [
              {
                text: '       '

              },


            ],
            [
              {
                text: '        '

              },

            ],
            [
              {
                text: login_user.first_name + ' ' + login_user.last_name,
                alignment: 'center',
                bold: true,

              },

            ]
          ]
        },
        {
          columns: [
            [
              {
                text: '       '

              },


            ],
            [
              {
                text: '        '

              },

            ],
            [
              {
                text: login_user.related_profile[0].related_designation.name,
                alignment: 'center',
                bold: true,

              },

            ]
          ]
        },


      ],
      styles: {
        sectionHeader: {
          bold: true,
          // decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        },
        ref_section: {
          italics: true
        }
      }
    }

    pdfMake.createPdf(docDefinition).open();
  }
  // ===== End ======


  //==== Dispatch Items =======

  loadPurchaseDispatchItems() {
    this.dispatchItemsService.get_all_by_purchase_dispatch(this.purchase_id, this.dispatch_id).subscribe({
      next: data => {
        this.purchase_dispatch_item_list = data;
        console.log(this.purchase_dispatch_item_list);
        this.dtTrigger.next(this.purchase_dispatch_item_list);
        this.initializeDispatchItemEntryForm(data.results);

        this.manageDispathcStepShow('isDispatchItemTable');



      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  get dispatchEntryFormItems() {

    return this.dispatchItemEntryForm.controls["items"] as FormArray;

  }

  onDispatchItemShow(dispatch_id: number) {

  }

  initializeDispatchItemEntryForm(purchase_item: any) {

    this.dispatchItemEntryForm = this.formBuilder.group({
      purchase: new FormControl('', [Validators.required]),
      dispatch: new FormControl('', [Validators.required]),
      lot_no: new FormControl('', [Validators.required]),
      items: this.formBuilder.array([]),
    });

    if (purchase_item.length > 0) {
      console.log(purchase_item[0].received_on);
      this.dispatchItemEntryForm.patchValue(
        {
          purchase: this.purchase_id,
          dispatch: this.dispatch_id,
          lot_no: purchase_item[0].lot_no,
        }
      );
      purchase_item.forEach((element: any) => {
        const item_form = this.formBuilder.group(
          {
            // For view only fields

            name: element.related_item.name,
            item_specification: element.related_purchase_item.item_specification,
            quantity_purchase: element.related_purchase_item.quantity,
            quantity_received: element.quantity_received,
            total_dispatch: element.total_dispatch,
            // For data entry fields
            id: element.dispatch_item_id != null ? element.dispatch_item_id : 0,
            purchase_item_received: element.id,
            item: element.item,
            quantity_dispatch: element.quantity_dispatch != null ? element.quantity_dispatch : 0,
            remarks: element.remarks != null ? element.remarks : " "

          }
        );
        this.dispatchEntryFormItems.push(item_form);
      });

      console.log(this.dispatchEntryFormItems.controls);
    }
  }

  OnCancelDespatchItemTable() {
    this.manageDispathcStepShow('isDispatchDetailTable');
    this.isDispatchDetailNextButtonActive = true;
  }


  onDispatchItemsSubmit() {
    this.dispatchEntryFormItems.controls.forEach(data => {
      console.log('id:' + data.value.id);
      console.log('name:' + data.value.name);
      console.log('item:' + data.value.item);
      if (data.value.quantity_dispatch > 0) {
        if (data.value.id <= 0) {
          this.insertDispatchItem(data);
        }
        else {
          this.updateDispatchItem(data);
        }
      }

    });
  }



  insertDispatchItem(data: AbstractControl) {
    let inseratable_data: any = {
      id: data.value.id,
      purchase_item_received: data.value.purchase_item_received,
      purchase: this.dispatchItemEntryForm.value.purchase,
      dispatch: this.dispatchItemEntryForm.value.dispatch,
      lot_no: this.dispatchItemEntryForm.value.lot_no,
      item: data.value.item,
      quantity_dispatch: data.value.quantity_dispatch,
      remarks: data.value.remarks,
    }
    this.dispatchItemsService.post(inseratable_data).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true);
        //this.isSignUpFailed = false;
        //this.purchaseItemEntryForm.reset();
        //this.loadPurchaseItems();
        //this.onPurchaseItemsShowTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });
  }

  updateDispatchItem(data: AbstractControl) {
    let updatable_data: any = {
      id: data.value.id,
      purchase_item_received: data.value.purchase_item_received,
      purchase: this.dispatchItemEntryForm.value.purchase,
      dispatch: this.dispatchItemEntryForm.value.dispatch,
      lot_no: this.dispatchItemEntryForm.value.lot_no,
      item: data.value.item,
      quantity_dispatch: data.value.quantity_dispatch,
      remarks: data.value.remarks,
    }
    this.dispatchItemsService.put(updatable_data).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        // this.isSignUpFailed = false;
        // this.purchaseItemEntryForm.reset();
        // this.loadPurchaseItems();
        this.switchSuccessFailureStatus(true);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.switchSuccessFailureStatus(false);
      }
    });
  }
  onQuantityDispatchChange(index: number, quantity_dispatch: number): void {
    console.log(index + '_' + quantity_dispatch)
    let input_value = this.dispatchEntryFormItems.at(index).value.quantity_dispatch
    let quantity_received = this.dispatchEntryFormItems.at(index).value.quantity_received
    let id = this.dispatchEntryFormItems.at(index).value.id
    let total_dispatch = this.dispatchEntryFormItems.at(index).value.total_dispatch
    if (input_value) {
      if (id <= 0) {
        if (input_value > (quantity_received - total_dispatch)) {
          this.dispatchEntryFormItems.at(index).patchValue({
            quantity_dispatch: 0
          })

          alert('Total quantity available to dispatch: ' + (quantity_received - total_dispatch) + ' only!');
        }
      }
      else {
        if (input_value > (quantity_received - (total_dispatch - quantity_dispatch))) {
          this.dispatchEntryFormItems.at(index).patchValue({
            quantity_dispatch: 0
          })

          alert('Total quantity available to dispatch: ' + (quantity_received) + ' only!');
        }
      }


    }

    // this.dispatchEntryFormItems.at(index).get('quantity_dispatch')?.valueChanges.subscribe(val => {
    //   console.log(val);
    // })
    // this.entryForm.get('financial_year')?.valueChanges.subscribe(val => {

    //   try {
    //     let fragments = val.split('-');
    //     if (!this.isNumber(fragments[0])) {
    //       this.entryForm.setValue({
    //         id: 0,
    //         financial_year: '',

    //       });
    //     }
    //     if (fragments.length >= 2 && (!this.isNumber(fragments[1]))) {
    //       this.entryForm.setValue({
    //         id: 0,
    //         financial_year: '',

    //       });
    //     }
    //     if (val != null && val.length == 4) {
    //       let last_two_digit = parseInt(val.substring(2, 4)) + 1;
    //       this.entryForm.setValue({
    //         id: 0,
    //         financial_year: val + '-' + last_two_digit.toString(),

    //       });
    //     }

    //   } catch (error) {

    //     this.entryForm.setValue({
    //       id: 0,
    //       financial_year: '',

    //     });

    //   }


    // });
  }

  // ======= End =========

  // ======= Acknoledgement =====

  onAcknowledgementTabLoad() {
    this.loadAcknowledgement();
  }

  loadAcknowledgement() {

    this.acknowledgmentDetails = [];
    console.log(this.dispatch_id);
    this.dispatchDetailsService.get_sigle(this.dispatch_id).subscribe(
      {
        next: data => {
          this.isAcknowledge = data.is_received;
          this.acknowledgmentDetails = data;
          console.log(this.acknowledgmentDetails.length);
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
          //this.switchSuccessFailureStatus(false);
        }
      }

    )
  }
  //

  // Helper Methods

  switchSuccessFailureStatus(status: boolean) {
    this.isSuccessful = status;
    this.isFail = !status;
  }

  initializeSuccessFailureStatus() {
    this.isSuccessful = false;
    this.isFail = false;
  }

  OnPreviousButtonClick() {
    this.initializeSuccessFailureStatus();
    this.manageDispathcStepShow('isDispatchDetailTable');
  }


}
