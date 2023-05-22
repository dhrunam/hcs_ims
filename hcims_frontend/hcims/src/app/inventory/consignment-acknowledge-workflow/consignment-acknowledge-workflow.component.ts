import { Renderer2, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DispatchDetailsService } from '../dispatch-details/dispatch-details.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DispatchItemsService } from '../dispatch-items/dispatch-items.service';
import { PurchaseDetailsService } from '../purchase-details/purchase-details.service';
import { PurchaseItemReceivedDetailsService } from '../purchase-item-received-details/purchase-item-received-details.service';
import { ConsignmentItemReceivedDetailsService } from '../consignment-item-received-details/consignment-item-received-details.service';
import { PurchaseItmesService } from '../purchase-items/purchase-itmes.service';
import { OfficeService } from 'src/app/configuration/office/office.service';
import { DispatchReceivedAcknowledgementService } from '../dispatch-received-acknowledgement/dispatch-received-acknowledgement.service';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

declare var bindStepper: any;
@Component({
  selector: 'app-consignment-acknowledge-workflow',
  templateUrl: './consignment-acknowledge-workflow.component.html',
  styleUrls: ['./consignment-acknowledge-workflow.component.css']
})
export class ConsignmentAcknowledgeWorkflowComponent implements OnInit {


  dtOptions: DataTables.Settings = {};

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  receivedItemEntryForm: any = [];
  entryForm = this.formBuilder.group({
    id: 0,
    dispatch: "",
    purchase: "",
    item: "",
    item_dropdown: "",
    serial_no: "",
    model_no: "",
    specification: "",
    brand: "",
    warranty_period: "",
    is_in_use: false,
    remarks: "",

  });

  list_type: any = {
    summary: 'summary',
    details: 'details'

  }

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  dispatch_details: any = [];
  item_dispatch_list: any = [];
  item_received_list: any = [];
  isShowReceivedItemsEntry: boolean = true;
  switchTable: boolean = true;
  dispatch_id: number = 0;
  keyword = 'name';
  purchase_orders: any = [];
  purchase_item_list: any = [];
  isFail: boolean = false;
  purchase_dispatch_item_list: any=[]
  purchase_id: number=0;
  // Acknowledgement

  acknowledgementEntryForm = this.formBuilder.group({
    id: 0,
    received_on: "",
    is_received: false,
    acknowledge_to_address: "",
    acknowledge_subject: "",
    acknowledge_description: "",
    acknowledge_remarks: "",

  });

  acknowledgementUploadEntryForm = this.formBuilder.group({
    id: 0,
    acknowledge_doc_url: "",


  });


  dispatch_details_list: any = [];
  office_list: any = [];
  isShowTable: boolean = true;


  //

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private service: DispatchItemsService,
    private dispatchDetailsService: DispatchDetailsService,
    private purchaseDetailsService: PurchaseDetailsService,
    private itemReceivedDetailsService: PurchaseItemReceivedDetailsService,
    private localStorageService: LocalStorageService,
    private consignmentItemReceivedDetailsService: ConsignmentItemReceivedDetailsService,
    private purchaseItmesService: PurchaseItmesService,
    private officeService: OfficeService,
    private dispatchReceivedAcknowledgementService: DispatchReceivedAcknowledgementService

  ) { }

  ngOnInit(): void {
    bindStepper();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
    const that = this;
    this.dispatch_id = this.localStorageService.getComponentData('dispatch_id').id;
    this.loadData();
  }

  loadData() {
    // this.loadDespatchDetails(this.dispatch_id);
    this.loadItemDispatchDetails(this.dispatch_id);

  }

  loadItemDispatchDetails(dispatch_id: number) {
    this.item_dispatch_list = [];
    this.service.get_all_by_dispatch_id(dispatch_id).subscribe({
      next: data => {
        this.item_dispatch_list = data;
        this.purchase_id=data.results[0].purchase
        console.log('Item Dispatch List:');
        console.log(this.item_dispatch_list);
        this.dtTrigger.next(this.item_dispatch_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  loadReceivedItem(dispatch_id: number) {
    this.item_received_list = [];
    this.consignmentItemReceivedDetailsService.get_all_by_dispatch(dispatch_id).subscribe({
      next: data => {
        this.item_received_list = data;
        console.log(this.item_received_list);
        this.dtTrigger.next(this.item_received_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onListTypeCheckChange(e: any) {


    if (e.target.value == 'summary') {
      this.switchTable = true;
    }

    if (e.target.value == 'details') {
      this.loadReceivedItem(this.dispatch_id);
      this.switchTable = false;

    }


  }

  onItemSelectChange(e: any) {
    console.log(e);
    if (e.target.value) {
      let values = e.target.value.split(':')[1].split('|');
      console.log(values);
      this.loadPurchaseItems(values[0].trim(), values[1].trim(), values[2].trim());

    }
  }

  loadPurchaseItems(dispatch: any, purchase: any, item: any) {
    console.log('dispatch:' + dispatch)
    this.purchaseItmesService.get_all_by_pursase_and_item(purchase, item).subscribe({
      next: data => {
        this.purchase_item_list = data;
        console.log(this.purchase_item_list);

        this.entryForm.patchValue(
          {
            dispatch: dispatch,
            purchase: purchase,
            item: item,
            is_in_use: false,
            specification: this.purchase_item_list.results.length >= 1 ? this.purchase_item_list.results[0].item_specification : "",

          }

        );



      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onEnableItemEntry(id: number, item: number, item_quantity: number) {

    console.log(id)
    console.log(item)
    console.log(item_quantity)

    this.loadItemsByItemDispatchListId(id);

  }

  loadItemsByItemDispatchListId(id: number) {

    this.service.get_all_received_items_by_dispatch_list_id(id).subscribe({
      next: data => {
        console.log(data.results);
        this.initializeReceivedItemEntryForm(data.results);
        this.isShowReceivedItemsEntry = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    })
  }

  initializeReceivedItemEntryForm(data: any) {
    this.receivedItemEntryForm = this.formBuilder.group({
      item_dispatch_list: 0,
      specification: "",
      brand: "",
      warranty_period: "",
      model_no: "",
      quantity_dispatch: 0,
      items: this.formBuilder.array([]),

    });

    if (data.length > 0) {
      console.log(data[0].received_on);
      this.receivedItemEntryForm.patchValue(
        {
          item_dispatch_list: data[0].id,
          specification: data[0].specification,
          brand: data[0].brand,
          warranty_period: data[0].warranty_period,
          model_no: data[0].model_no,
        }
      );
      for (let index = 0; index < data[0].quantity_dispatch; index++) {
        const item_form = this.formBuilder.group(
          {
            id: 0,
            dispatch: data[0].dispatch,
            purchase: data[0].purchase,
            item: data[0].item,
            serial_no: "",
            remarks: "",
            is_in_use: false,
          }
        );
        this.receivedEntryFormItems.push(item_form);
      }
      data.forEach((element: any, index: number) => {

        console.log(index);
        this.receivedEntryFormItems.at(index).patchValue(
          {
            id: element.item_received_id,
            dispatch: element.dispatch,
            purchase: element.purchase,
            item: element.item,
            serial_no: element.serial_no,
            remarks: element.remarks,
          }
        );
        // const item_form = this.formBuilder.group(
        //   {
        //     id: element.item_received_id,
        //     dispatch: element.dispatch,
        //     purchase: element.purchase,
        //     item: element.item,
        //     serial_no: element.serial_no,
        //     remarks: element.remarks,
        //   }
        // );
        //this.receivedEntryFormItems.push(item_form);
      });

      console.log(this.receivedEntryFormItems.controls);
    }

  }

  get receivedEntryFormItems() {

    return this.receivedItemEntryForm.controls["items"] as FormArray;

  }

  onItemEntryCancel() {
    this.isShowReceivedItemsEntry = true;
    this.initializeSuccessFailureStatus();
  }

  onItemEntryFormSubmit() {
    let insert_data_arry: any = []
    let update_data_arry: any = []
    this.receivedEntryFormItems.controls.forEach(data => {
      if (data.value.id <= 0)
        insert_data_arry.push(
          {
            id: data.value.id,
            item_dispatch_list: this.receivedItemEntryForm.value.item_dispatch_list,
            dispatch: data.value.dispatch,
            purchase: data.value.purchase,
            item: data.value.item,
            serial_no: data.value.serial_no,
            model_no: this.receivedItemEntryForm.value.model_no,
            specification: this.receivedItemEntryForm.value.specification,
            brand: this.receivedItemEntryForm.value.brand,
            warranty_period: this.receivedItemEntryForm.value.warranty_period,
            is_in_use: data.value.is_in_use,
            remarks: data.value.remarks,
          }
        );
      else {
        update_data_arry.push(
          {
            id: data.value.id,
            item_dispatch_list: this.receivedItemEntryForm.value.item_dispatch_list,
            dispatch: data.value.dispatch,
            purchase: data.value.purchase,
            item: data.value.item,
            serial_no: data.value.serial_no,
            model_no: this.receivedItemEntryForm.value.model_no,
            specification: this.receivedItemEntryForm.value.specification,
            brand: this.receivedItemEntryForm.value.brand,
            warranty_period: this.receivedItemEntryForm.value.warranty_period,
            is_in_use: data.value.is_in_use,
            remarks: data.value.remarks,
          }
        );
      }



    });

    if (insert_data_arry.length > 0)
      this.insertItemReceived(insert_data_arry);

    if (update_data_arry.length > 0)
      this.updateItemReceived(update_data_arry);

  }

  insertItemReceived(data: any) {
    // let inseratable_data: any = {
    //   item_dispatch_list: this.receivedItemEntryForm.value.item_dispatch_list,
    //   dispatch: data.value.dispatch,
    //   purchase: data.value.purchase,
    //   item: data.value.item,
    //   serial_no: data.value.serial_no,
    //   model_no: this.receivedItemEntryForm.value.model_no,
    //   specification: this.receivedItemEntryForm.value.specification,
    //   brand: this.receivedItemEntryForm.value.brand,
    //   warranty_period: this.receivedItemEntryForm.value.warranty_period,
    //   is_in_use: data.value.is_in_use,
    //   remarks: data.value.remarks,
    // }
    this.consignmentItemReceivedDetailsService.post(data).subscribe({
      next: data => {
        this.switchSuccessFailureStatus(true);
      },
      error: err => {
        this.switchSuccessFailureStatus(false);
      }

    })
  }

  updateItemReceived(data: any) {
    // let updatable_data: any = {
    //   id: data.value.id,
    //   item_dispatch_list: this.receivedItemEntryForm.value.item_dispatch_list,
    //   dispatch: data.value.dispatch,
    //   purchase: data.value.purchase,
    //   item: data.value.item,
    //   serial_no: data.value.serial_no,
    //   model_no: this.receivedItemEntryForm.value.model_no,
    //   specification: this.receivedItemEntryForm.value.specification,
    //   brand: this.receivedItemEntryForm.value.brand,
    //   warranty_period: this.receivedItemEntryForm.value.warranty_period,
    //   is_in_use: data.value.is_in_use,
    //   remarks: data.value.remarks,
    // }

    this.consignmentItemReceivedDetailsService.put(data).subscribe({
      next: data => {
        this.switchSuccessFailureStatus(true);
      },
      error: err => {
        this.switchSuccessFailureStatus(false);
      }

    })
  }

  onStep1PreviousClick() {
    this.route.navigate(['inventory/dispatch/acknowledge'])

  }
  onStep2PreviousClick() {
    this.initializeSuccessFailureStatus();
  }
  onStep3PreviousClick(){
    this.initializeSuccessFailureStatus();
  }

  // Acknowledgement 


  loadOffice() {
    this.officeService.get_all().subscribe({
      next: data => {
        this.office_list = data;
        console.log(this.office_list);
        // this.dtTrigger.next(this.office_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  onAcknowledgementTabLoad() {
    this.initializeSuccessFailureStatus();
    let id = this.localStorageService.getComponentData('dispatch_id').id;
    this.dispatchDetailsService.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.acknowledgementEntryForm.setValue({
          id: data.id,
          received_on: data.received_on,
          is_received: data.is_received,
          acknowledge_to_address: data.acknowledge_to_address,
          acknowledge_subject: data.acknowledge_subject,
          acknowledge_description: data.acknowledge_description,
          acknowledge_remarks: data.acknowledge_remarks,
        });
        window.scroll(0, 0);
        //this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }


  onAcknowledgementSubmit() {
    if (this.acknowledgementEntryForm.value.id <= 0) {
      //this.insert();
    }
    else {
      this.updateAcknowledgement();
    }
  }


  updateAcknowledgement() {
    this.dispatchReceivedAcknowledgementService.put(this.acknowledgementEntryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        //this.entryForm.reset();
        //this.loadData();
        //this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

onPrintDispatchLetter(){
  
  this.loadDispatchDetailsSingle(this.dispatch_id);
  this.localStorageService.setComponentData('dispatch_id', { id: this.dispatch_id })
  
  
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
        text: data.acknowledge_to_address,
        margin: [30, 20, 0, 0]
      },
      {
        text: data.related_dispatch_from_office.address_line1,
        margin: [30, 0, 0, 0]
      },
      {
        text: data.related_dispatch_from_office.address_line2,
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
              text: data.acknowledge_subject,
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
        text: data.acknowledge_description,
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
            ...this.item_dispatch_list.results.map((p: any, index: number) => ([index + 1, (p.related_item.name + ":" +
              p.specification).toString(),
            p.quantity_dispatch

            ])),
            ['', { text: 'Total Number of Items', bold: true, colspan: 2, alignment: 'center' },
              this.item_dispatch_list.results.map((p: any, total: number = 0) => {
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

loadPurchaseDispatchItems() {
  this.service.get_all_by_purchase_dispatch(this.purchase_id, this.dispatch_id).subscribe({
    next: data => {
      this.purchase_dispatch_item_list = data;
      console.log('purchase_dispatch_item_list:');
      console.log(this.purchase_dispatch_item_list);
      this.dtTrigger.next(this.purchase_dispatch_item_list);


    },

    error: err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
    }
  });
}

  // Helper Methods

  switchSuccessFailureStatus(status: boolean) {
    this.isSuccessful = status;
    this.isFail = !status;
  }

  initializeSuccessFailureStatus() {
    this.isSuccessful = false;
    this.isFail = false;
  }

}
