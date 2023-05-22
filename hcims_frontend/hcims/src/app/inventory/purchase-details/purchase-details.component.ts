import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FundService } from '../fund/fund.service';
import { VendorService } from 'src/app/configuration/vendor/vendor.service';
import { PurchaseDetailsService } from './purchase-details.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class PurchaseDetailsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();




  entryForm = this.formBuilder.group({
    id: 0,
    fund: "",
    vendor: "",
    remarks: "",
    order_no: "",
    invoice_no: "",
    purchase_date: "",

  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  purchase_details_list: any = [];
  fund_list: any = [];
  vendor_list: any = [];
  isShowTable: boolean = true;

  formatted_data: any = {
    count: 0,
    next: "",
    previous: null,
    results: []

  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private fundService: FundService,
    private vendorService: VendorService,
    private service: PurchaseDetailsService,
    private localStorageService: LocalStorageService,

  ) { }

  async ngOnInit() {
    console.log('purchase_details...')
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
    const that = this;
    this.loadData();
    // this.showTable();
  }
  onShowTable() {
    this.entryForm.reset();
    this.showTable();
  }

  onSubmit() {
    if (this.entryForm.value.id <= 0) {
      this.insert();
    }
    else {
      this.update();
    }

    this.loadData();
  }

  insert() {
    this.service.post(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    console.warn('Your order has been submitted', this.entryForm.value.name);
    this.entryForm.reset();
  }
  update() {
    this.service.put(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    console.warn('Your order has been submitted', this.entryForm.value.name);
    this.entryForm.reset();
  }

  loadData() {
    //this.loadFund();
    this.loadVendor();
    this.loadPurchaseDetails();
  }

  loadPurchaseDetails() {


    let fund_id = this.localStorageService.getComponentData('fund_id').id;
    // if (fund_id.id) {
    //   this.service.get_all_by_fund(fund_id.id).subscribe({
    //     next: data => {
    //       this.purchase_details_list = data;
    //       console.log(this.purchase_details_list);
    //       this.dtTrigger.next(this.purchase_details_list);
    //     },

    //     error: err => {
    //       this.errorMessage = err.error.message;
    //       this.isSignUpFailed = true;
    //     }
    //   });
    // }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {

        this.service.get_all_by_fund_and_paging_parameter(dataTablesParameters, fund_id).subscribe({
          next: data => {
            if (data) {
              this.formatted_data.count = data.count
              this.formatted_data.next = data.next
              this.formatted_data.previous = data.previous
              this.formatted_data.results = []
              if (data.results.length > 0) {
                data.results.forEach((element: any) => {
                  this.formatted_data.results.push(
                    {
                      id: element.id,
                      cheque_no: element.related_fund.cheque_no,
                      vendor_name: element.related_vendor.name,
                      order_no: element.order_no,
                      invoice_no: element.invoice_no,
                      purchase_date: element.purchase_date,

                    }
                  )
                });

              }


            }
            callback({
              recordsTotal: data.count,
              recordsFiltered: data.count,
              data: [],
            });

            console.log('Calling me...');
            this.purchase_details_list = this.formatted_data;

            this.dtTrigger.next(this.purchase_details_list);


          },

          error: err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
          }
        });

      },
      columns: [
        { data: "cheque_no" },
        { data: "related_accounthead_name" }
        // { data: "lastName" },
      ],


    };


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


  showTable() {
    this.isShowTable = !this.isShowTable;
    // this.loadData();
  }

  onEdit(id: BigInteger) {
    this.purchase_details_list = [];
    this.localStorageService.setComponentData('purchase_id', { id: id })
    console.log(this.localStorageService.getComponentData('purchase_id'));
    this.route.navigate(['inventory/purchase']);

    // this.service.get_sigle(id).subscribe({
    //   next: data =>{
    //        console.log(data);
    //         this.entryForm.setValue({
    //           id : data.id,
    //           fund :data.fund,      
    //           vendor : data.vendor,
    //           remarks : data.remarks,
    //           order_no : data.order_no,
    //           invoice_no :data.invoice_no,
    //           purchase_date : data.purchase_date,
    //         });
    //         window.scroll(0,0);
    //         this.showTable();

    //   },
    //   error: err => {
    //     this.errorMessage = err.error.message;
    //     this.isSignUpFailed = true;
    //   }
    // });

  }

  fetchPrevious() {
    console.log('Previous');
    console.log(this.fund_list.previous);
    this.getPage(this.fund_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.fund_list.next);
    this.getPage(this.fund_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
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

  onChequeChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.get('document_url')?.setValue(file);
    }

  }

  getFormData(): FormData {
    let formData: FormData = new FormData();
    formData.append('id', this.entryForm.value.id);
    formData.append('fund', this.entryForm.value.fund);
    formData.append('vendor', this.entryForm.value.vendor);
    formData.append('remarks', this.entryForm.value.remarks);
    formData.append('order_no', this.entryForm.value.order_no);
    formData.append('invoice_no', this.entryForm.value.invoice_no);
    formData.append('purchase_date', this.entryForm.value.purchase_date);

    return formData;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onRedirectToPurchaseUser() {
    this.localStorageService.setComponentData('purchase_id', { id: 0 })
    console.log(this.localStorageService.getComponentData('purchase_id'));
    this.route.navigate(['inventory/purchase']);
  }

  onBackToFundClick() {
    this.route.navigate(['inventory/fund']);
  }

}
