import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private route: Router, private token: LocalStorageService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.token.getToken())
    if (this.token.getToken()) {
      return true;
    }
    else {
      alert('Please login to access..');
      this.token.clearLocalStorage();
      this.token.clearSessionStorage();
      this.route.navigateByUrl('');
    }
    return true;
  }

}
