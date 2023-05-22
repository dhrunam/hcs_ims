import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }
  
  get_all(){
    return this.http.get<any>(AUTH_API + 'vendor');
  }

  get_page(url : string){
    return this.http.get<any>(url);
  }

  get_sigle(id:BigInteger){
    return this.http.get<any>(AUTH_API + 'vendor/'+ id);
  }



  post(data : any)
  {
    return this.http.post<any>(AUTH_API + 'vendor',
    {
      name : data.name,
      address : data.address,
      contact_no : data.contact_no,
      gst_no : data.gst_no,
      bank_account_no : data.bank_account_no,
      ifsc : data.ifsc,
      description : data.description,
      remarks : data.remarks,

    }
    );
  }

  put(data : any)
  {
    return this.http.put<any>(AUTH_API + 'vendor/'+data.id,
    {
      name : data.name,
      address : data.address,
      contact_no : data.contact_no,
      gst_no : data.gst_no,
      bank_account_no : data.bank_account_no,
      ifsc : data.ifsc,
      description : data.description,
      remarks : data.remarks,

    }
    );
  }


}
