import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FundService } from './fund.service';
import { AccountheadService } from 'src/app/configuration/accounthead/accounthead.service';
import { FinancialYearService } from 'src/app/configuration/financial-year/financial-year.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';



// class DataTablesResponse {
//   data : any[];
//   draw : number;
//   recordsFiltered  : number;
//   recordsTotal: number;
// }


@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css']
})
export class FundComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {
    // processing: false,
    lengthChange: true,
    serverSide: true,
    pageLength: 1000000,
    pagingType: "full_numbers",
    destroy: true


  };

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();




  entryForm = this.formBuilder.group({
    id: 0,
    account_head: "",
    financial_year: "",
    cheque_no: "",
    purpose: "",
    cheque_amount: "",
    cheque_date: "",
    date_of_receipt: "",
    document_url: new FormControl('', [Validators.required]),
    remarks: "",
  });
  present_document_url: any = "";
  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage: string = '';
  isCompleted: boolean = true;
  fund_list: any = [];
  account_head_list: any = [];
  financial_year_list: any = [];
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
    private service: FundService,
    private accountHeadservice: AccountheadService,
    private localStorageService: LocalStorageService,
    private financialYearService: FinancialYearService

  ) { }

  async ngOnInit() {

    const that = this;
    this.loadData();
    this.loadFund();
    this.initializeEntryForm();
  }
  onShowTable() {
    this.showTable();
    this.entryForm.reset();
    this.loadFund();


  }
  onSubmit() {
    if (this.entryForm.value.id <= 0) {
      this.insert();
    }
    else {
      this.update();
    }

  }

  initializeEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: 0,
      account_head: 0,
      financial_year: 0,
      cheque_no: "",
      purpose: "",
      cheque_amount: "",
      cheque_date: "",
      date_of_receipt: "",
      document_url: new FormControl('', [Validators.required]),
      remarks: "",
    });
  }

  insert() {
    this.service.post(this.getFormData()).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.switchSuccessFailureStatus(true);
        this.isSignUpFailed = false;
        this.loadData();
        this.showTable();

      },
      error: err => {
        this.switchSuccessFailureStatus(false);
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    window.scroll(0, 0);
  }
  update() {
    this.service.put(this.getFormData()).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');

        this.isSignUpFailed = false;
        this.switchSuccessFailureStatus(true);
        this.loadData();
        this.showTable();

      },
      error: err => {
        this.switchSuccessFailureStatus(false);
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    window.scroll(0, 0);
  }

  loadData() {
    // this.loadFund();
    this.loadAccountHead();
    this.loadFinancialYear();
  }

  loadFund() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10000000,
      processing: true,
      serverSide: false,
      // ajax: (dataTablesParameters: any, callback) => {

      //   this.service.get_all_with_paging_param(dataTablesParameters).subscribe({
      //     next: data => {
      //       //console.log(data);
      //       if (data) {
      //         this.formatted_data.count = data.count
      //         this.formatted_data.next = data.next
      //         this.formatted_data.previous = data.previous
      //         this.formatted_data.results = []
      //         if (data.results.length > 0) {
      //           data.results.forEach((element: any) => {
      //             this.formatted_data.results.push(
      //               {
      //                 id: element.id,
      //                 account_head: element.account_head,
      //                 finacial_year: element.finacial_year,
      //                 cheque_no: element.cheque_no,
      //                 purpose: element.purpose,
      //                 cheque_amount: element.cheque_amount,
      //                 purchase_amount: element.purchase_amount,
      //                 balance_amount: element.balance_amount,
      //                 cheque_date: element.cheque_date,
      //                 date_of_receipt: element.date_of_receipt,
      //                 // document_url: element.document_url,
      //                 remarks: element.remarks,
      //                 related_accounthead_name: element.related_accounthead.name
      //               }
      //             )
      //           });

      //         }


      //       }
      //       callback({
      //         recordsTotal: data.recordsTotal,
      //         recordsFiltered: data.recordsFiltered,
      //         data: this.formatted_data.results,
      //       })
      //         ;

      //       console.log('Calling me...');
      //       this.fund_list = this.formatted_data;

      //       this.dtTrigger.next(this.fund_list);


      //     },

      //     error: err => {
      //       this.errorMessage = err.error.message;
      //       this.isSignUpFailed = true;
      //     }
      //   });

      // }
      // columns: [
      //   { 'data': "cheque_no", 'name': 'cheque_no', 'searchable': true },
      //   { 'data': "related_accounthead_name" }
      //   // { data: "lastName" },
      // ],


    };

    this.service.get_all_with_paging_param().subscribe({
      next: data => {
        if (data) {
          if (data.results.length > 0) {
            this.formatted_data.results=[]
            data.results.forEach((element: any) => {
              this.formatted_data.results.push(
                {
                  id: element.id,
                  account_head: element.account_head,
                  finacial_year: element.finacial_year,
                  cheque_no: element.cheque_no,
                  purpose: element.purpose,
                  cheque_amount: element.cheque_amount,
                  purchase_amount: element.purchase_amount,
                  balance_amount: element.balance_amount,
                  cheque_date: element.cheque_date,
                  date_of_receipt: element.date_of_receipt,
                  // document_url: element.document_url,
                  remarks: element.remarks,
                  related_accounthead_name: element.related_accounthead.name
                }
              )
            });

            this.fund_list = this.formatted_data;

            this.dtTrigger.next(this.fund_list);
          }
        }
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });

  }

  loadAccountHead() {
    this.accountHeadservice.get_all().subscribe({
      next: data => {
        this.account_head_list = data;
        console.log(this.account_head_list);
      },

      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  loadFinancialYear() {
    this.financialYearService.get_all().subscribe({
      next: data => {
        this.financial_year_list = data;
        console.log(this.financial_year_list);
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

  onAddFundClick() {
    this.fund_list = [];
    this.entryForm.reset();
    this.showTable();
  }

  onFormEntryCancelClick() {

    this.showTable();
    this.loadFund();
    this.entryForm.reset();
  }

  onEdit(id: BigInteger) {

    this.fund_list = [];

    console.log('id:' + id);
    this.service.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.entryForm.patchValue({
          id: data.id,
          account_head: data.account_head,
          finacial_year: data.finacial_year,
          cheque_no: data.cheque_no,
          purpose: data.purpose,
          cheque_amount: data.cheque_amount,
          cheque_date: data.cheque_date,
          date_of_receipt: data.date_of_receipt,
          // document_url: data.document_url,
          remarks: data.remarks,

        });
        this.initializeSuccessFailureStatus();
        this.present_document_url = data.document_url
        window.scroll(0, 0);
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
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
      console.log(file)
      this.entryForm.patchValue({
        document_url: file
      });
    }

  }

  getFormData(): FormData {
    let formData: FormData = new FormData();
    formData.append('id', this.entryForm.value.id);
    formData.append('document_url', this.entryForm.get('document_url')?.value);
    formData.append('account_head', this.entryForm.value.account_head);
    formData.append('financial_year', this.entryForm.value.financial_year);
    formData.append('cheque_no', this.entryForm.value.cheque_no);
    formData.append('purpose', this.entryForm.value.purpose);
    formData.append('cheque_amount', this.entryForm.value.cheque_amount);
    formData.append('cheque_date', this.entryForm.value.cheque_date);
    formData.append('date_of_receipt', this.entryForm.value.date_of_receipt);
    formData.append('remarks', this.entryForm.value.remarks);

    return formData;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onRedirectToPurchase(id: number) {
    this.localStorageService.setComponentData(
      'fund_id', { id: id }
    )
    this.localStorageService.setComponentData('purchase_id', { id: 0 })
    console.log(this.localStorageService.getComponentData('purchase_id'));
    // this.route.navigate(['inventory/purchase']);
    this.route.navigate(['inventory/purchase_details']);
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
