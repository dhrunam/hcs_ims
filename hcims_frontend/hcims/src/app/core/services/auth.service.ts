import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_URL } from 'src/environments/environment.prod';

const AUTH_API = APP_URL;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(AUTH_API + 'user/reg', {
      username: username,
      email: email,
      password: password
    });
  }

  login(username: string, password: string, client: string) {
    return this.http.post<any>(AUTH_API + 'auth/login/', {
      username,
      password,
      client
    });
  }

  logout() {
    const data = {};
    return this.http.post<any>(AUTH_API + 'auth/logout/', data);
  }


}
