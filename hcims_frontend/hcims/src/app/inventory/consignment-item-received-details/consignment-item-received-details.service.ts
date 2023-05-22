import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class ConsignmentItemReceivedDetailsService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'items/received');
  }
  get_all_by_dispatch(dispatch_id: number) {
    return this.http.get<any>(AUTH_API + 'items/received',
      {
        params: {
          dispatch_id: dispatch_id
        }
      }
    );
  }

  get_all_by_search_match(search_text: string) {
    return this.http.get<any>(AUTH_API + 'items/received',
      {
        params: {
          search_text: search_text
        }
      });
  }

  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: number) {
    return this.http.get<any>(AUTH_API + 'items/received/' + id);
  }

  post(data: any) {
    return this.http.post<any>(AUTH_API + 'items/received',
      {
        // item_dispatch_list: data.item_dispatch_list,
        // dispatch: data.dispatch,
        // purchase: data.purchase,
        // item: data.item,
        // serial_no: data.serial_no,
        // model_no: data.model_no,
        // specification: data.specification,
        // brand: data.brand,
        // warranty_period: data.warranty_period,
        // is_in_use: data.is_in_use,
        // remarks: data.remarks,
        data: data
      }

    );
  }

  put(data: any) {

    console.log('id:' + data.id);
    console.log(data);
    console.log('Before Put Request');
    return this.http.put<any>(AUTH_API + 'items/received/bulkupdate/' + data[0].item_dispatch_list,
      {
        data: data

      }
    );
  }

}
