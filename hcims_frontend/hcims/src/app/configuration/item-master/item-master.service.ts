import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class ItemMasterService {

  constructor(private http: HttpClient) { }

  get_all() {
    return this.http.get<any>(AUTH_API + 'item');
  }


  get_page(url: string) {
    return this.http.get<any>(url);
  }

  get_sigle(id: BigInteger) {
    return this.http.get<any>(AUTH_API + 'item/' + id);
  }

  get_all_by_search_key(search_text: string) {
    return this.http.get<any>(AUTH_API + 'item',
      {
        params: {
          search_text: search_text
        }
      });
  }

  post(data: any) {
    return this.http.post<any>(AUTH_API + 'item',
      {
        name: data.name,
        item_type: data.item_type,
      }
    );
  }

  put(data: any) {
    return this.http.put<any>(AUTH_API + 'item/' + data.id,
      {
        name: data.name,
        item_type: data.item_type,

      }
    );
  }



}
