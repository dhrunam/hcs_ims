import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'state');
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:BigInteger){
    return this.http.get<any>(AUTH_API + 'state/'+ id);
  }

  post(name : string)
  {
    return this.http.post<any>(AUTH_API + 'state',
    {
      name : name
    }
    );
  }

  put(id: bigint, name: string)
  {
    return this.http.put<any>(AUTH_API + 'state/'+id,
    {
      name : name
    }
    );
  }


}
