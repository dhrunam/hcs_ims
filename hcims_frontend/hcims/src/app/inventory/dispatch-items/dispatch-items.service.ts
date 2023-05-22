import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class DispatchItemsService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'items/dispatch');
  }

  get_all_by_dispatch_id(dispatch_id: number) {
    return this.http.get<any>(AUTH_API + 'items/dispatch',
      {
        params: {
          dispatch_id: dispatch_id
        }
      });
  }

  get_all_by_purchase_dispatch(purchase: number, dispatch: number) {
    return this.http.get<any>(AUTH_API + 'items/purchase/received_dispatch',
      {
        params: {
          purchase: purchase,
          dispatch: dispatch
        }
      });
  }

  get_all_received_items_by_dispatch_list_id(item_dispatch_list_id: number) {
    return this.http.get<any>(AUTH_API + 'items/dispatch/received',
      {
        params: {
          dispatch_list_id: item_dispatch_list_id
        }
      });
  }



  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: BigInteger) {
    return this.http.get<any>(AUTH_API + 'items/dispatch/' + id);
  }

  post(data: any) {
    return this.http.post<any>(AUTH_API + 'items/dispatch', data
      // {
      //   account_head : data.account_head,      
      //   cheque_no : data.cheque_no,
      //   purpose : data.purpose,
      //   cheque_amount : data.cheque_amount,
      //   cheque_date : data.cheque_date,
      //   date_of_receipt : data.date_of_receipt,
      //   document_url : data.document_url,
      //   remarks : data.remarks,
      // }

    );
  }

  put(data: any) {
    console.log('dispatch items..');
    console.log(data);
    return this.http.put<any>(AUTH_API + 'items/dispatch/' + data.id,
      data
    );
  }

  delete(id: any) {
    return this.http.delete<any>(AUTH_API + 'items/dispatch/' + id);
  }

}
