import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'user/reg');
  }

  get_all_by_search_match(search_text: string){
    return this.http.get<any>(AUTH_API + 'user/reg',
    {
      params: {
        search_text:search_text
      }
    });
  }

  get_user_group()
  {
    return this.http.get<any>(AUTH_API + 'user/group');
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:number){
    return this.http.get<any>(AUTH_API + 'user/reg/'+ id);
  }

  post(data : any)
  {
    return this.http.post<any>(AUTH_API + 'user/reg',
    {
      username : data.username,      
      email : data.email,
      first_name : data.first_name,
      last_name : data.last_name,
      office : data.office,
      designation : data.designation,
      password :data.password,
      password2: data.password2,
      contact_number:  data.contact_number,
      group: data.group,
    }

    );
  }

  put(data: any)
  {

    console.log('id:' + data.id);
    return this.http.put<any>(AUTH_API + 'user/reg/'+data.id,
    {
      username : data.username,      
      email : data.email,
      first_name : data.first_name,
      last_name : data.last_name,
      office : data.office,
      designation : data.designation,
      password :data.password,
      password2: data.password2,
      contact_number:  data.contact_number,
      group:data.group,
    }
    );
  }

}
