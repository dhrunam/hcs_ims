import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';
import { PURCHASE_RECEIVED_OFFICE_ID } from 'src/environments/environment';
const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class PurchaseItemReceivedDetailsService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'items/purchase/received');
  }

  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: BigInteger) {
    return this.http.get<any>(AUTH_API + 'items/purchase/received/' + id);
  }

  post(data: any) {
    console.log("Purchase:" + data.purchase);
    return this.http.post<any>(AUTH_API + 'items/purchase/received',
      data
    );
  }


  put(data: any) {
    console.log('id:' + data.id);
    return this.http.put<any>(AUTH_API + 'items/purchase/received/' + data.id,
      {

        purchase: data.purchase,
        item: data.item,
        purchase_item: data.purchase_item,
        quantity_received: data.quantity_received,
        received_office: PURCHASE_RECEIVED_OFFICE_ID,
        received_on: data.received_on,
        remarks: data.remarks,

      }
    );
  }

  get_purchase_item(purchase_order_no: string) {


    console.log('id:' + purchase_order_no);
    return this.http.get<any>(AUTH_API + 'items/purchase/order',
      {

        params: {
          order_no: purchase_order_no
        }
      },
    );
  }
  // /items/purchase/received/list
  get_received_item(data: any) {
    let param: any = '';
    if (data.purchase && data.item) {
      param = {
        purchase: data.purchase,
        item: data.item
      }
    }
    else if (data.purchase) {
      param = {
        purchase: data.purchase
      }
    }


    return this.http.get<any>(AUTH_API + 'items/purchase/received/list',
      {
        params: param

      },
    );
  }

  get_received_dispatch(data: any) {

    return this.http.get<any>(AUTH_API + 'items/purchase/received_dispatch',
      {
        params: {
          purchase: data.purchase,
          dispatch: data.dispatch
        }

      },
    );
  }



}
