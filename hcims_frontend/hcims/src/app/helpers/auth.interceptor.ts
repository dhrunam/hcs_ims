import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../core/services/local-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: LocalStorageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    console.log('Intercepting...');
    console.log(authReq);
    const token = this.token.getToken();

    if (token != null) {
      // if (this.token.isTokenExpired()) {
      //   this.token.clearLocalStorage();
      //   this.token.clearLocalStorage();
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Token ' + token) });
      // } else {
      //   authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Token ' + token) });
      //   console.log(authReq);

      // }



    }

    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
