import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class BodyService {

  
  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'body');
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:BigInteger){
    return this.http.get<any>(AUTH_API + 'body/'+ id);
  }

  post(data : any)
  {
    return this.http.post<any>(AUTH_API + 'body',
    {
      name : data.name,
      
    }
    );
  }

  put(data : any)
  {
    return this.http.put<any>(AUTH_API + 'body/'+data.id,
    {
      name : data.name,
      
    }
    );
  }
}
