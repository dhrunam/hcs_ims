import { Injectable } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private route: Router, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Error intercepting...')
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.authService.logout();
        //location.reload();
        this.route.navigateByUrl('');
      }
      const error = err.error.message || err.statusText;
      throw error;
    }
    ));

  }
}


export const errorInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];
