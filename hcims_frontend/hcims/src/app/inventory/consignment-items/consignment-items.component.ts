import { Component,OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DispatchDetailsService } from '../dispatch-details/dispatch-details.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { DispatchItemsService } from '../dispatch-items/dispatch-items.service';
import { PurchaseDetailsService } from '../purchase-details/purchase-details.service';
import { PurchaseItemReceivedDetailsService } from '../purchase-item-received-details/purchase-item-received-details.service';
import { ConsignmentItemReceivedDetailsService } from '../consignment-item-received-details/consignment-item-received-details.service';
import { PurchaseItmesService } from '../purchase-items/purchase-itmes.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-consignment-items',
  templateUrl: './consignment-items.component.html',
  styleUrls: ['./consignment-items.component.css']
})
export class ConsignmentItemsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();


  entryForm = this.formBuilder.group({
    id : 0,
    dispatch : "",      
    purchase : "",
    item : "",
    item_dropdown:"",
    serial_no: "",
    model_no : "",
    specification:"",
    brand:"",
    warranty_period:"",
    is_in_use:false,
    remarks:"",

  });

  list_type: any ={
    summary: 'summary',
    details : 'details'

  }

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  dispatch_details : any =[];
  item_dispatch_list:any = [];
  item_received_list: any=[];
  isShowTable:boolean = true;
  switchTable:boolean=true;
  dispatch_id: number=0;
  keyword = 'name';
  purchase_orders: any =[];
  purchase_item_list: any=[];
  

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private route     : Router,
    private service : DispatchItemsService,
    private dispatchDetailsService : DispatchDetailsService,
    private purchaseDetailsService : PurchaseDetailsService,
    private itemReceivedDetailsService : PurchaseItemReceivedDetailsService,
    private localStorageService: LocalStorageService,
    private consignmentItemReceivedDetailsService:ConsignmentItemReceivedDetailsService,
    private purchaseItmesService:PurchaseItmesService,

  ) { }

  async ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
    const that = this;
    this.dispatch_id=this.localStorageService.getComponentData('dispatch_id').id;
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
    console.log('Form data:');
    console.log(this.entryForm.value);
    this.consignmentItemReceivedDetailsService.post(this.entryForm.value).subscribe({
      next: data => {
        
          //this.route.navigateByUrl('/config/fy');
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.entryForm.reset();
          this.showTable();
          this.loadData();
        
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
    this.consignmentItemReceivedDetailsService.put(this.entryForm.value).subscribe({
      next: data => {
        
          //this.route.navigateByUrl('/config/fy');
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.entryForm.reset();
          this.showTable();
          this.loadData();
        
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
   // this.loadDespatchDetails(this.dispatch_id);
    this.loadItemDispatchDetails(this.dispatch_id);
    
  }

  loadItemDispatchDetails(dispatch_id:number)
  {
    this.item_dispatch_list=[];
    this.service.get_all_by_dispatch_id(dispatch_id).subscribe({
      next: data => {
        this.item_dispatch_list = data;
        console.log(this.item_dispatch_list);
        this.dtTrigger.next(this.item_dispatch_list);
      },
    
    error: err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
    }
    });

  }

  loadReceivedItem(dispatch_id:number)
  {
    this.item_received_list=[];
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

  loadDespatchDetails(dispatch_id:number)
  {
    this.dispatch_details=[];
    this.dispatchDetailsService.get_sigle(dispatch_id).subscribe({
      next: data => {
        this.dispatch_details = data;
        console.log(this.dispatch_details);
        this.dtTrigger.next(this.dispatch_details);
      },
    
    error: err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
    }
    });
  }

  loadPurchaseItems(dispatch:any, purchase:any, item:any)
  {
    console.log('dispatch:'+dispatch)
    this.purchaseItmesService.get_all_by_pursase_and_item(purchase,item).subscribe({
      next: data => {
        this.purchase_item_list = data;
        console.log(this.purchase_item_list);
        
          this.entryForm.patchValue(
            {
              dispatch : dispatch,      
              purchase : purchase,
              item:item,
              is_in_use : false,
              specification: this.purchase_item_list.results.length>=1 ? this.purchase_item_list.results[0].item_specification:"",
  
            }
  
          );
        
        
        
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

  onEdit(id : BigInteger)
  {
    console.log('id:'+ id);
    this.service.get_sigle(id).subscribe({
      next: data =>{
           console.log(data);
            this.entryForm.setValue({
              id : data.id,
              dispatch : data.dispatch,      
              purchase : data.purchase,
              item : data.item,
              quantity_dispatch : data.quantity_dispatch,
              remarks : data.remarks,
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

  onDelete(id : BigInteger)
  {
    this.service.delete(id).subscribe({
      next: data =>{
           console.log(data);
            window.scroll(0,0);
            this.loadData();

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
    
  }

  fetchPrevious()
  {
    console.log('Previous');
    console.log(this.item_dispatch_list.previous);
    this.getPage(this.item_dispatch_list.previous);
  }

  fetchNext()
  {
    console.log('Next');
    console.log(this.item_dispatch_list.next);
    this.getPage(this.item_dispatch_list.next);
  }

  getPage(url : string)
  {
    if(!url)
    {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.item_dispatch_list = data;
        console.log(this.item_dispatch_list);
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
    formData.append('id', this.entryForm.value.id);
    formData.append('to_office', this.entryForm.value.fund);
    formData.append('to_address', this.entryForm.value.vendor);
    formData.append('remarks', this.entryForm.value.remarks);
    formData.append('subject', this.entryForm.value.order_no);
    formData.append('dispatch_on', this.entryForm.value.invoice_no);
    formData.append('description', this.entryForm.value.invoice_no);
    
    return formData;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  

  

  onChangeSearch(val: string) {
    console.log('Change search:');
    console.log(val);
    if (val && val.length>=3)
    {
      this.purchaseDetailsService.get_all_by_search_match(val).subscribe({
        next: data => {
          this.purchase_orders=[];
          data.results.forEach((e:any) => {
            this.purchase_orders.push({id : e.id, name : e.order_no});
          });
        },
      
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
      });
    }

    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e:any){
    console.log(e);
    // do something when input is focused
  }

  onListTypeCheckChange(e:any){
    

    if(e.target.value=='summary')
    {
      this.switchTable = true;
    }

    if(e.target.value=='details')
    {
      this.loadReceivedItem(this.dispatch_id);
      this.switchTable = false;

    }

    
  }

  onItemSelectChange(e:any)
  {
    console.log(e);
     if(e.target.value){
       let values=e.target.value.split(':')[1].split('|');
       console.log(values);
       this.loadPurchaseItems(values[0].trim(),values[1].trim(),values[2].trim());

     }
  }


}
