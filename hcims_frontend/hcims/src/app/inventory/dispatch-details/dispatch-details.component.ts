import { Component,OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DispatchDetailsService } from './dispatch-details.service';
import { OfficeService } from 'src/app/configuration/office/office.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dispatch-details',
  templateUrl: './dispatch-details.component.html',
  styleUrls: ['./dispatch-details.component.css']
})
export class DispatchDetailsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();




  entryForm = this.formBuilder.group({
    id : 0,
    dispatch_to_office : "",      
    dispatch_to_address : "",
    dispatch_subject : "",
    dispatch_description : "",
    dispatch_on :"",
    dispatch_remarks : "",

    

  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  dispatch_details_list : any =[];
  office_list: any = [];
  isShowTable:boolean = true;

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private route     : Router,
    private service : DispatchDetailsService,
    private officeService : OfficeService,
    private localStorageService: LocalStorageService,

  ) { }

  async ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
    const that = this;
    this.loadData();
    // this.showTable();
  }
  onShowTable(){
    this.entryForm.reset();
    this.showTable();
  }

  onSubmit(){
    if(this.entryForm.value.id<=0)
    {
      this.insert();
    }
    else
    {
      this.update();
    }

    
  }

  insert()
  {
    
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
  update()
  {

    this.service.put(this.entryForm.value).subscribe({
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

  loadData()
  {
    this.loadDispatchDetails();
    this.loadOffice();
  }

  loadDispatchDetails()
  {
    this.service.get_all().subscribe({
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

  loadOffice()
  {
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

  showTable()
  {
    this.isShowTable = !this.isShowTable;
    // this.loadData();
  }

  onEdit(id : number)
  {
    console.log('id:'+ id);
    this.service.get_sigle(id).subscribe({
      next: data =>{
           console.log(data);
            this.entryForm.setValue({
              id : data.id,
              dispatch_to_office : data.dispatch_to_office,      
              dispatch_to_address : data.dispatch_to_address,
              dispatch_subject : data.dispatch_subject,
              dispatch_description : data.dispatch_description,
              dispatch_on : data.dispatch_on,
              dispatch_remarks : data.dispatch_remarks,
            });
            window.scroll(0,0);
            this.showTable();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onRedirectToDispatchItemList(id : BigInteger)
  {
    console.log('id:'+ id);
    this.localStorageService.setComponentData('dispatch_id',{id:id})
    console.log(this.localStorageService.getComponentData('dispatch_id'));
    this.route.navigate(['/inventory/item/dispatch']);
    
  }

  fetchPrevious()
  {
    console.log('Previous');
    console.log(this.dispatch_details_list.previous);
    this.getPage(this.dispatch_details_list.previous);
  }

  fetchNext()
  {
    console.log('Next');
    console.log(this.dispatch_details_list.next);
    this.getPage(this.dispatch_details_list.next);
  }

  getPage(url : string)
  {
    if(!url)
    {
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

  onChequeChange(event : any)
  {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.get('document_url')?.setValue(file);
    }

  }

  getFormData():FormData
  {
    let formData: FormData= new FormData();
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
