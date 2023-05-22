import { Component,OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { PurchaseItemReceivedDetailsService } from './purchase-item-received-details.service';
import { PurchaseDetailsService } from '../purchase-details/purchase-details.service';
import { ItemMasterService } from 'src/app/configuration/item-master/item-master.service'; 
import { PurchaseItmesService } from '../purchase-items/purchase-itmes.service';
import { PURCHASE_RECEIVED_OFFICE_ID } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-purchase-item-received-details',
  templateUrl: './purchase-item-received-details.component.html',
  styleUrls: ['./purchase-item-received-details.component.css']
})
export class PurchaseItemReceivedDetailsComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  entryForm = this.formBuilder.group({
    id : 0,
    purchase : new FormControl('',[Validators.required]) ,      
    item : "",
    quantity_received:0,
    received_office : PURCHASE_RECEIVED_OFFICE_ID,
    received_on:new FormControl('', [Validators.required]),
    remarks : new FormControl('',[Validators.required]),

  });

  searchForm =this.formBuilder.group({
    purchase : "",

  });
  showDateErr: boolean = false;
  isSuccessful: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  purchase_item_list : any = [];
  purchase_list: any = [];
  received_item_list: any=[];
  received_item: any =[];
  item_list : any = [];
  unit_list : any = [];
  isShowTable:boolean = true;
  item_name:string ='';
  max_quantity:number=0;
  purchase_quantity:number=0;
  received_quantity:number=0;
  valid_quantity:boolean=true;

  keyword = 'name';
  purchase_orders:any = [
    // {
    //   id: 1,
    //   name: 'Georgia'
    // },
    //  {
    //    id: 2,
    //    name: 'Usa'
    //  },
    //  {
    //    id: 3,
    //    name: 'England'
    //  }
  ];


  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private route     : Router,
    private purchaseDetailService : PurchaseDetailsService,
    private itmeMasterservice : ItemMasterService,
    private purchaseItemsService: PurchaseItmesService,
    private service : PurchaseItemReceivedDetailsService,
    private datePipe: DatePipe,

  ) { }

  get received_on() { return this.entryForm.get('received_on'); }

  get remarks(){ return this.entryForm.get('remarks');}

  async ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,

    }
    const that = this;
    this.loadData();
    this.onSearchFormPurchaseOrderChange();
    this.onReceivedQuantityChange();
    // this.showTable();
  }
  onShowTable(){
    this.entryForm.reset();
    this.showTable();
  }

  onSubmit(){
    

    if(this.entryForm.value.id<=0)
    {
      console.log('Entry From data:');
      console.log(this.entryForm.value);
      this.insert();
    }
    else
    {
      this.update();
    }

    
  }

  onSearchSubmit()
  {

  }

  insert()
  {
    this.service.post(this.entryForm.value).subscribe({
      next: data => {
        
          //this.route.navigateByUrl('/config/fy');
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.entryForm.reset();
          //this.loadData();
          this.entryForm.reset();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
    console.warn('Your order has been submitted', this.entryForm.value.name);
    
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
   // this.loadPurchaseItems();
    this.loadItemMaster();
    
  }

  loadPurchaseItems()
  {
    this.purchase_item_list=[]
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

  showTable()
  {
    this.isShowTable = !this.isShowTable;
    // this.loadData();
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
    this.purchase_item_list=[]
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

  onReceivedQuantityChange(){
    this.entryForm.get('quantity_received')?.valueChanges.subscribe(val => {
      
    });
  }

  getFormData():FormData
  {

    let formData: FormData= new FormData();
    formData.append('id', this.entryForm.value.id);
    formData.append('purchase', this.entryForm.value.purchase);
    formData.append('item', this.entryForm.value.item);
    formData.append('quantity_received', this.entryForm.value.quantity_received);
    formData.append('received_on', this.entryForm.value.received_on);
    formData.append('remarks', this.entryForm.value.remarks);
    return formData;

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onSearchFormPurchaseOrderChange(): void {

    console.log('event fired');
    this.searchForm.get('purchase')?.valueChanges.subscribe(val => {

      try {
        
        this.laodPurchaseList(val);
        
      } catch (error) {
        
      }
    });
  }

  laodPurchaseList(val:any){
    
    if(val){
      this.purchase_item_list=[];
      this.service.get_purchase_item(val).subscribe({
        next: data => {   
          console.log(data);
          this.entryForm.setValue({
            id : 0,
            purchase :data.results[0].purchase,      
            item : [],
            quantity_received : 0,
            received_office : PURCHASE_RECEIVED_OFFICE_ID,
            received_on: '',
            remarks : "",
          });

          this.purchase_item_list = data;

        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      });
    }
  }

  onItemSelect(data:any){

    this.loadReceivedItem(data);
    this.purchase_quantity=data.quantity;
    this.item_name=data.related_item.name;
    this.max_quantity=data.quantity;
    this.entryForm.reset();
    this.entryForm.setValue({
        id : 0,
        purchase :data.purchase,      
        item : data.item,
        quantity_received : data.quantity,
        received_office : PURCHASE_RECEIVED_OFFICE_ID,
        received_on: '',
        remarks : "",
    });

  }

  loadReceivedItem(data:any){
    this.received_item=[];
    this.service.get_received_item(data).subscribe({
      next: data => {  
        console.log(data);
        this.received_item = data;
        this.setTotalItemRreceived(data.results);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  setTotalItemRreceived(data:any){
    if(data)
    {
      this.received_quantity=0
      data.forEach((e:any)=> {
        this.received_quantity+=e.quantity_received;
      });
    }
  }

  loadReceivedItemList(data:any){
    this.received_item_list=[];
    this.service.get_received_item(data).subscribe({
      next: data => {  
        console.log(data);
        this.received_item_list = data;

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }


  selectEvent(item:any) {
    //console.log(item);
    this.laodPurchaseList(item.name);
    this.loadReceivedItemList({purchase:item.id});
    // do something with selected item
  }

  onChangeSearch(val: string) {
    console.log('Change search:');
    console.log(val);
    if (val && val.length>=3)
    {
      this.purchaseDetailService.get_all_by_search_match(val).subscribe({
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
}
