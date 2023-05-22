import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class PurchaseItmesService {

  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'items/purchase');
  }

  get_all_by_pursase_and_item(purchase:any, item:any)
  {
    return this.http.get<any>(AUTH_API + 'items/purchase',
    {
      params:{
        item_id:item,
        purchase_id:purchase

      }

    });
  }

  get_all_by_purchase(purchase_id:number)
  {
    return this.http.get<any>(AUTH_API + 'items/purchase',
    {
      params : {
        purchase_id : purchase_id,
      }
    }
    );
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:number){
    return this.http.get<any>(AUTH_API + 'items/purchase/'+ id);
  }

  post(data : any)
  {
    console.log(data);
    return this.http.post<any>(AUTH_API + 'items/purchase',
    {
      purchase : data.purchase,      
      item : data.item,
      item_specification : data.item_specification,
      quantity : data.quantity,
      unit : data.unit,
      unit_price : data.unit_price,
      remarks : data.remarks,
    }

    );
  }

  put(data: any)
  {
    console.log('id:' + data.id);
    return this.http.put<any>(AUTH_API + 'items/purchase/'+data.id,
    {
      purchase : data.purchase,      
      item : data.item,
      item_specification : data.item_specification,
      quantity : data.quantity,
      unit : data.unit,
      unit_price : data.unit_price,
      remarks : data.remarks,
    }
    );
  }

}
