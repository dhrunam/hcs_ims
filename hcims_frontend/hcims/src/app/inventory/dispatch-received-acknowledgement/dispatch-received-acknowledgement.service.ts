import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;

@Injectable({
  providedIn: 'root'
})
export class DispatchReceivedAcknowledgementService {

  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'dispatch_details');
  }

  get_all_by_search_match(search_text: string){
    return this.http.get<any>(AUTH_API + 'dispatch_details',
    {
      params: {
        search_text:search_text
      }
    });
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:number){
    return this.http.get<any>(AUTH_API + 'dispatch_details/'+ id);
  }


  put(data: any)
  {

    console.log('id:' + data.id);
    console.log(data);
    console.log('Before Put Request');
    return this.http.put<any>(AUTH_API + 'dispatch_details/'+data.id,
    {

      received_on : data.received_on,      
      received_by : data.received_by,
      is_received : data.is_received,
      acknowledge_to_address : data.acknowledge_to_address,
      acknowledge_subject : data.acknowledge_subject,
      acknowledge_description : data.acknowledge_description,
      acknowledge_remarks :data.acknowledge_remarks

    }
    );
  }

}
