import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, onErrorResumeNext } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //initiliaze
  public baseurl = 'http://localhost:4201/api/v1';
  constructor(private _http: HttpClient) {}

  //handle exceptions
  public handleError(error: HttpErrorResponse) {
    console.log('http Error', error.message);
    return Observable.throw(error.message);
  }

  //signup
  public signUpService(newUser): any {
    console.log('Signup api call', newUser);
    let signUpRes = this._http.post(`${this.baseurl}/signup`, newUser);
    return signUpRes;
  }

  //login
  public loginService(userData): any {
    console.log('login api call', userData);
    let loginres = this._http.post(`${this.baseurl}/login`, userData);
    return loginres;
  }

  //store authenticated user info
  public setAuthenticatedUser(data): any {
    console.log('Set auth user info', data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  //get authenticated user info
  public getAutheticatedUserInfo(): any {
    console.log('get autheticated user info');
    let lc = JSON.parse(localStorage.getItem('userInfo'));
    console.log('lc::', lc);
    return lc === null ? '' : lc;
  }

  //recover password
  public recoverPassword(user): any {
    console.log('Recover password for', user);
    let recoverPwdRes = this._http.post(
      `${this.baseurl}/recoverPassword`,
      user
    );
    return recoverPwdRes;
  }

  //reset Password
  public resetPassword(user): any {
    console.log('reset password', user);
    let resetPwdRes = this._http.post(`${this.baseurl}/resetPassword`, user);
    return resetPwdRes;
  }
  //get country
  public getCountry(): any {
    console.log('get country');
    let countries = this._http.get('http://country.io/names.json');
    return countries;
  }
  //get country phone code
  public getCode(): any {
    console.log('get code');
    let code = this._http.get('http://country.io/phone.json');
    return code;
  }
}
