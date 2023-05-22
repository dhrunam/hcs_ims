import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY } from 'src/environments/environment';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const EXPIRY_KEY = 'auth-expiry';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    let stringify_user = JSON.stringify(user);
    window.sessionStorage.setItem(USER_KEY, CryptoJS.AES.encrypt(stringify_user, SECRET_KEY).toString());
    //window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    let user = window.sessionStorage.getItem(USER_KEY) != null ? window.sessionStorage.getItem(USER_KEY) : "";
    let decrypt_user = CryptoJS.AES.decrypt(this.getString(user), SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (decrypt_user) {
      return JSON.parse(decrypt_user);
    }
    return {};
  }

  public getString(data: any): string {
    if (data) {
      return data.toString();
    }

    else
      return '';
  }

  public saveTokenExpiry(expiry: string) {
    window.sessionStorage.removeItem(EXPIRY_KEY);
    window.sessionStorage.setItem(EXPIRY_KEY, expiry);
  }
  public isTokenExpired(): boolean {
    console.log('token expiry is cheking...');
    let expiry_string = window.sessionStorage.getItem(EXPIRY_KEY) !== null ? window.sessionStorage.getItem(EXPIRY_KEY) : '';
    let expiry_time = new Date();
    let present_time = new Date();
    if (expiry_string != '') {
      try {

        expiry_time = new Date(expiry_string ?? expiry_time);
        console.log('Expiry Time:');
        console.log(expiry_time);

        console.log('Present Time');
        present_time = new Date();
        console.log(present_time);

        if (expiry_time < present_time) {
          return true;
        }
        else {
          return false
        }

      } catch (error) {
        return true;
      }


    }

    return true;

  }

  public setComponentData(key: string, data: any): void {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, JSON.stringify(data));
    //window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getComponentData(key: string): any {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return {};
  }

  public clearSessionStorage() {
    window.sessionStorage.clear();
  }
  public clearLocalStorage() {
    window.localStorage.clear();
  }

  public clear() {
    this.clearSessionStorage();
    this.clearLocalStorage();
  }
}
