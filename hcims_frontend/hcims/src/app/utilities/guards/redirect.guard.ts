import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(private route: Router, private token: LocalStorageService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if (!this.token.getToken()) {
    //   return true;
    // }
    // else {
    //   if (this.token.isTokenExpired()) {
    //     this.token.clearLocalStorage();
    //     this.token.clearSessionStorage();
    //     return false;
    //   }
    //   else {
    //     this.route.navigateByUrl('/dashboard');
    //     return false;
    //   }

    // }
    return false;
  }

}
