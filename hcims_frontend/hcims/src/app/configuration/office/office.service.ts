import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  constructor(private http : HttpClient) { }

  get_all(){
    return this.http.get<any>(AUTH_API + 'office');
  }


  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:BigInteger){
    return this.http.get<any>(AUTH_API + 'office/'+ id);
  }

  post(data : any)
  {
    console.log(data);
    return this.http.post<any>(AUTH_API + 'office',
    {

      state : data.state, 
      district : data.district,
      // body : data.body,
      name : data.name,
      address_line1: data.address_line1,
      address_line2: data.address_line2, 
      address_line3: data.address_line3,
      pin: data.pin,
      
    }
    );
  }

  put(data : any)
  {
    return this.http.put<any>(AUTH_API + 'office/'+data.id,
    {
      state : data.state, 
      district : data.district,
      // body : data.body,
      name : data.name,
      address_line1: data.address_line1,
      address_line2: data.address_line2, 
      address_line3: data.address_line3,
      pin: data.pin,
      
    }
    );
  }

}
