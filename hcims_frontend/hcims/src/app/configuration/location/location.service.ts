import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http : HttpClient) { }

  get_all(){
    return this.http.get<any>(AUTH_API + 'location');
  }


  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:BigInteger){
    return this.http.get<any>(AUTH_API + 'location/'+ id);
  }

  post(data : any)
  {
    console.log(data);
    return this.http.post<any>(AUTH_API + 'location',
    {

      office : data.office, 
      name : data.name,
      type : data.type,
      parents_location : data.parents_location,

      
    }
    );
  }

  put(data : any)
  {
    return this.http.put<any>(AUTH_API + 'location/'+data.id,
    {

      office : data.office, 
      name : data.name,
      type : data.type,
      parents_location : data.parents_location,
      
    }
    );
  }

}
