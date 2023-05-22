import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class PurchaseDetailsService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'purchase_details');
  }

  get_all_by_search_match(search_text: string) {
    return this.http.get<any>(AUTH_API + 'purchase_details',
      {
        params: {
          search_text: search_text
        }
      });
  }

  get_all_by_fund(id: number) {
    return this.http.get<any>(AUTH_API + 'purchase_details',
      {
        params: {
          fund: id
        }
      });
  }

  get_all_by_fund_and_paging_parameter(param: any, fund_id: number) {
    if (param.length > 0) {
      param.page = (param.start + param.length) / param.length
    }
    param.fund = fund_id
    return this.http.get<any>(AUTH_API + 'purchase_details',
      {
        params: param
      });
  }


  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: number) {
    return this.http.get<any>(AUTH_API + 'purchase_details/' + id);
  }

  post(data: any) {
    return this.http.post<any>(AUTH_API + 'purchase_details', data
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
    console.log(data);
    return this.http.put<any>(AUTH_API + 'purchase_details/' + data.get('id'),
      data
    );
  }


}
