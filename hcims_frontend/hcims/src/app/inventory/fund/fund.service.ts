import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';
import { data } from 'jquery';

const AUTH_API = APP_URL;



@Injectable({
  providedIn: 'root'
})
export class FundService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'fund');
  }
  get_all_list() {
    return this.http.get<any>(AUTH_API + 'fund/list');
  }


  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: BigInteger) {
    return this.http.get<any>(AUTH_API + 'fund/' + id);
  }


  // "id": 4,
  // "account_head": 2,
  // "cheque_no": "50055959",
  // "purpose": "Test",
  // "cheque_amount": "40000000.00",
  // "cheque_date": "2022-09-09",
  // "date_of_receipt": "2022-06-08",
  // "document_url": "http://localhost:8000/media/cheque/Dhurbajyoti_borah_MPR_May_2022_Ymwlzjd.pdf",
  // "remarks": "Test",
  // "created_by": 1,
  // "created_at": "2022-06-08T05:43:39.737340Z",
  // "updated_by": null,
  // "updated_at": "2022-06-08T05:43:39.737396Z",
  // "related_accounthead": {
  //   "id": 2,
  //   "name": "Extra Aided Funds 2022-2023"
  // },

  get_all_with_paging_param() {
    // if (param.length > 0) {
    //   param.page = (param.start + param.length) / param.length
    // }
    // console.log('At service..');
    // console.log(param);
    // return this.http.get<any>(AUTH_API + 'fund/list', {
    //   params: param
    // });

    return this.http.get<any>(AUTH_API + 'fund/list');

  }

  post(data: any) {
    return this.http.post<any>(AUTH_API + 'fund', data
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
    console.log('id:' + data.get('id'));
    console.log('financial_year:' + data.get('financial_year'));
    return this.http.put<any>(AUTH_API + 'fund/' + data.get('id'), data
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


}
