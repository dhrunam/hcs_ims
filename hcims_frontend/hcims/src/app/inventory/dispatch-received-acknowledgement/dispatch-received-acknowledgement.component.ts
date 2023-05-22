import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DispatchDetailsService } from '../dispatch-details/dispatch-details.service';
import { OfficeService } from 'src/app/configuration/office/office.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DispatchReceivedAcknowledgementService } from './dispatch-received-acknowledgement.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dispatch-received-acknowledgement',
  templateUrl: './dispatch-received-acknowledgement.component.html',
  styleUrls: ['./dispatch-received-acknowledgement.component.css']
})
export class DispatchReceivedAcknowledgementComponent implements OnInit {

  dtOptions: DataTables.Settings = {
    lengthChange: true,
    serverSide: true,
    pageLength: 10,
    pagingType: "full_numbers",
    destroy: true

  };

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  // received_on : data.received_on,      
  // received_by : data.received_by,
  // is_received : data.is_received,
  // acknowledge_to_office : data.acknowledge_to_office,
  // acknowledge_to_address : data.acknowledge_to_address,
  // acknowledge_subject : data.acknowledge_subject,
  // acknowledge_description : data.acknowledge_description,
  // acknowledge_remarks :data.acknowledge_remarks


  entryForm = this.formBuilder.group({
    id: 0,
    received_on: "",
    is_received: false,
    acknowledge_to_address: "",
    acknowledge_subject: "",
    acknowledge_description: "",
    acknowledge_remarks: "",

  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  dispatch_details_list: any = [];
  office_list: any = [];
  isShowTable: boolean = true;
  user: any = [];

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
    private service: DispatchDetailsService,
    private officeService: OfficeService,
    private localStorageService: LocalStorageService,
    private dispatchReceivedAcknowledgementService: DispatchReceivedAcknowledgementService,
  ) { }

  async ngOnInit() {
    this.user = this.localStorageService.getUser();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
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


  }

  insert() {
    this.service.post(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.loadData();
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
    this.dispatchReceivedAcknowledgementService.put(this.entryForm.value).subscribe({
      next: data => {

        //this.route.navigateByUrl('/config/fy');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.entryForm.reset();
        this.loadData();
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
    this.loadDispatchDetails();
    this.loadOffice();
  }

  loadDispatchDetails() {
    console.log('Dis...')
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.get_all_with_paging_param(dataTablesParameters, this.user.related_profile[0].related_office.id).subscribe({
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
                      dispatch_from_office: element.related_dispatch_from_office.name,
                      dispatch_to_office: element.related_dispatch_to_office.name,
                      dispatch_to_address: element.dispatch_to_address,
                      dispatch_on: element.dispatch_on,
                      is_received: element.is_received,

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
            this.dispatch_details_list = this.formatted_data;

            this.dtTrigger.next(this.dispatch_details_list);


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


    // this.service.get_all_by_office(user.related_profile[0].related_office.id).subscribe({
    //   next: data => {
    //     this.dispatch_details_list = data;
    //     console.log(this.dispatch_details_list);
    //     this.dtTrigger.next(this.dispatch_details_list);
    //   },

    //   error: err => {
    //     this.errorMessage = err.error.message;
    //     this.isSignUpFailed = true;
    //   }
    // });

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

  showTable() {
    this.isShowTable = !this.isShowTable;
    // this.loadData();
  }

  onEdit(id: number) {
    console.log('id:' + id);
    this.localStorageService.setComponentData('dispatch_id', { id: id })
    console.log(this.localStorageService.getComponentData('dispatch_id'));
    this.route.navigate(['/inventory/consignment/ack/workflow']);

    this.service.get_sigle(id).subscribe({
      next: data => {
        console.log(data);
        this.entryForm.setValue({
          id: data.id,
          received_on: data.received_on,
          is_received: data.is_received,
          acknowledge_to_address: data.acknowledge_to_address,
          acknowledge_subject: data.acknowledge_subject,
          acknowledge_description: data.acknowledge_description,
          acknowledge_remarks: data.acknowledge_remarks,
        });
        window.scroll(0, 0);
        this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onRedirectToDispatchItemList(id: BigInteger) {
    console.log('id:' + id);
    this.localStorageService.setComponentData('dispatch_id', { id: id })
    console.log(this.localStorageService.getComponentData('dispatch_id'));
    this.route.navigate(['/inventory/consignment/items']);

  }

  fetchPrevious() {
    console.log('Previous');
    console.log(this.dispatch_details_list.previous);
    this.getPage(this.dispatch_details_list.previous);
  }

  fetchNext() {
    console.log('Next');
    console.log(this.dispatch_details_list.next);
    this.getPage(this.dispatch_details_list.next);
  }

  getPage(url: string) {
    if (!url) {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.dispatch_details_list = data;
        console.log(this.dispatch_details_list);
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
    // formData.append('id', this.entryForm.value.id);
    // formData.append('to_office', this.entryForm.value.fund);
    // formData.append('to_address', this.entryForm.value.vendor);
    // formData.append('remarks', this.entryForm.value.remarks);
    // formData.append('subject', this.entryForm.value.order_no);
    // formData.append('dispatch_on', this.entryForm.value.invoice_no);
    // formData.append('description', this.entryForm.value.invoice_no);

    return formData;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
