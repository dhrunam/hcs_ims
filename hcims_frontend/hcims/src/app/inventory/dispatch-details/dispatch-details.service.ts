import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';
import { PURCHASE_RECEIVED_OFFICE_ID } from 'src/environments/environment';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class DispatchDetailsService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'dispatch_details');
  }

  get_all_by_search_match(search_text: string) {
    return this.http.get<any>(AUTH_API + 'dispatch_details',
      {
        params: {
          search_text: search_text
        }
      });
  }

  get_all_by_purchase(id: number) {
    return this.http.get<any>(AUTH_API + 'dispatch_details',
      {
        params: {
          purchase: id
        }
      });
  }

  get_all_by_office(id: number) {
    return this.http.get<any>(AUTH_API + 'dispatch_details',
      {
        params: {
          office: id
        }
      });
  }
  get_all_with_paging_param(param: any, office: number) {
    if (param.length > 0) {
      param.page = (param.start + param.length) / param.length
    }
    param.office = office
    console.log(
      param
    )
    return this.http.get<any>(AUTH_API + 'dispatch_details',
      {
        params: param
      }
    );
  }

  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: number) {
    return this.http.get<any>(AUTH_API + 'dispatch_details/' + id);
  }

  post(data: any) {
    return this.http.post<any>(AUTH_API + 'dispatch_details',
      {
        purchase: data.purchase,
        dispatch_from_office: PURCHASE_RECEIVED_OFFICE_ID,
        dispatch_to_office: data.dispatch_to_office,
        dispatch_to_address: data.dispatch_to_address,
        dispatch_subject: data.dispatch_subject,
        dispatch_description: data.dispatch_description,
        dispatch_on: data.dispatch_on,
        dispatch_remarks: data.dispatch_remarks,
        received_by: data.received_by,
      }

    );
  }

  put(data: any) {
    // 'id',
    // 'dispatch_to_office',
    // 'dispatch_to_address',
    // 'dispatch_subject',
    // 'dispatch_description',
    // 'dispatch_from_office',
    // 'dispatch_on',
    // 'dispatch_by',
    // 'dispatch_remarks',
    // 'received_on',
    // 'received_by',
    // 'is_received',
    // 'acknowledge_to_office',
    // 'acknowledge_to_address',
    // 'acknowledge_subject',
    // 'acknowledge_description',
    // 'acknowledge_remarks',
    // 'created_by',
    // 'created_at',
    // 'updated_by',
    // 'updated_at',
    // 'related_create_user',
    // 'related_update_user',
    // 'related_to_office',
    // 'related_acknowledge_to_office',
    // 'related_received_by',
    console.log('id:' + data.id);
    return this.http.put<any>(AUTH_API + 'dispatch_details/' + data.id,
      {
        purchase: data.purchase,
        dispatch_from_office: PURCHASE_RECEIVED_OFFICE_ID,
        dispatch_to_office: data.dispatch_to_office,
        dispatch_to_address: data.dispatch_to_address,
        dispatch_subject: data.dispatch_subject,
        dispatch_description: data.dispatch_description,
        dispatch_on: data.dispatch_on,
        dispatch_remarks: data.dispatch_remarks,
        received_by: data.received_by,

      }
    );
  }

}
