import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'item_type');
  }

  get_all_by_search_key(search_text: string) {
    return this.http.get<any>(AUTH_API + 'item_type',
      {
        params: {
          search_text: search_text
        }
      });
  }

  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: BigInteger) {
    return this.http.get<any>(AUTH_API + 'item_type/' + id);
  }

  post(item_type: string) {
    return this.http.post<any>(AUTH_API + 'item_type',
      {
        name: item_type
      }
    );
  }

  put(id: bigint, item_type: string) {
    return this.http.put<any>(AUTH_API + 'item_type/' + id,
      {
        name: item_type
      }
    );
  }


}
