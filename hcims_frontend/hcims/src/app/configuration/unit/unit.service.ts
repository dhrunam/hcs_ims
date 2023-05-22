import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class UnitService {


  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'unit');
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:BigInteger){
    return this.http.get<any>(AUTH_API + 'unit/'+ id);
  }

  post(data : any)
  {
    return this.http.post<any>(AUTH_API + 'unit',
    {
      name : data.name,
      short_name : data.short_name,
    }
    );
  }

  put(data : any)
  {
    return this.http.put<any>(AUTH_API + 'unit/'+data.id,
    {
      name : data.name,
      short_name: data.short_name,
    }
    );
  }


}
