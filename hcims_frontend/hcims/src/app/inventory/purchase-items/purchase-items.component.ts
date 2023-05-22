import { Component,OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { PurchaseItmesService } from './purchase-itmes.service';
import { PurchaseDetailsService } from '../purchase-details/purchase-details.service';
import { ItemMasterService } from 'src/app/configuration/item-master/item-master.service';
import { UnitService } from 'src/app/configuration/unit/unit.service';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-purchase-items',
  templateUrl: './purchase-items.component.html',
  styleUrls: ['./purchase-items.component.css']
})
export class PurchaseItemsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  entryForm = this.formBuilder.group({
    id : 0,
    purchase : "",      
    item : "",
    item_specification : "",
    quantity : "",
    unit : "",
    unit_price : "",
    remarks : "",

  });

  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  purchase_item_list : any = [];
  purchase_list: any = [];
  item_list : any = [];
  unit_list : any = [];
  isShowTable:boolean = true;

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private route     : Router,
    private purchaseDetailService : PurchaseDetailsService,
    private itmeMasterservice : ItemMasterService,
    private service : PurchaseItmesService,
    private unitService : UnitService,

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
    this.loadPurchase();
    this.loadPurchaseItems();
    this.loadItemMaster();
    this.loadUnit();
  }

  loadPurchaseItems()
  {
    this.service.get_all().subscribe({
      next: data => {
        this.purchase_item_list = data;
        console.log(this.purchase_item_list);
        this.dtTrigger.next(this.purchase_item_list);
      },
    
    error: err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
    }
    });

  }

  loadPurchase()
  {
    this.purchaseDetailService.get_all().subscribe({
      next: data => {
        this.purchase_list = data;
        console.log(this.purchase_list);
      },
    
    error: err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
    }
    });
  }

  loadItemMaster()
  {
    this.itmeMasterservice.get_all().subscribe({
      next: data => {
        this.item_list = data;
        console.log(this.item_list);
      },
    
    error: err => {
      this.errorMessage = err.error.message;
      this.isSignUpFailed = true;
    }
    });
  }

  loadUnit()
  {
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
              purchase :data.purchase,      
              item : data.item,
              item_specification : data.item_specification,
              quantity: data.quantity,
              unit : data.unit,
              unit_price :data.unit_price,
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

  fetchPrevious()
  {
    console.log('Previous');
    console.log(this.purchase_item_list.previous);
    this.getPage(this.purchase_item_list.previous);
  }

  fetchNext()
  {
    console.log('Next');
    console.log(this.purchase_item_list.next);
    this.getPage(this.purchase_item_list.next);
  }

  getPage(url : string)
  {
    if(!url)
    {
      return;
    }
    this.service.get_page(url).subscribe({
      next: data => {
        this.purchase_item_list = data;
        console.log(this.purchase_item_list);
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


}
