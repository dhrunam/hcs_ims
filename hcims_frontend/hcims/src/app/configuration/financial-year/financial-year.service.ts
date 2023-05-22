import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;



@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'financial_year');
  }

  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: BigInteger) {
    return this.http.get<any>(AUTH_API + 'financial_year/' + id);
  }

  get_fund_utilization_report() {
    return this.http.get<any>(AUTH_API + 'report/fund_received_utilize');
  }

  post(financial_year: string) {
    return this.http.post<any>(AUTH_API + 'financial_year',
      {
        financial_year
      }
    );
  }

  put(id: bigint, financial_year: string) {
    return this.http.put<any>(AUTH_API + 'financial_year/' + id,
      {
        financial_year
      }
    );
  }


}
