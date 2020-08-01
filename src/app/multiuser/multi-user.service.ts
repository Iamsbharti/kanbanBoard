import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, onErrorResumeNext } from 'rxjs';
import * as io from 'socket.io-client';
import { UserService } from '../user/user.service';
import { Cookie } from 'ng2-cookies';
@Injectable({
  providedIn: 'root',
})
export class MultiUserService {
  private socketUrl = 'http://localhost:4201/multiuser';
  private apiBaseUrl = 'http://localhost:4201/api/v1';
  private authToken: any;
  private socket;
  constructor(private _http: HttpClient, private userService: UserService) {
    /**init client socket */
    this.socket = io(this.socketUrl);
    if (this.userService.getAutheticatedUserInfo().authToken !== undefined) {
      this.authToken = this.userService.getAutheticatedUserInfo().authToken;
    }
  }
  //handle exceptions
  public handleError(error: HttpErrorResponse) {
    console.log('Http Error:', error.message);
    return Observable.throw(error.message);
  }

  //define header for api authentication
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.authToken,
    }),
  };

  /**define listeners and emitters */
  /**1: Listen to authentication handshake */
  public autheticateUser = () => {
    return Observable.create((observer) => {
      this.socket.on('authenticate', (data) => {
        observer.next(data);
      });
    });
  };
  /**2 send/emit authToken for authentication */
  public setUser = (authToken) => {
    console.log('Emmit user authentication');
    this.socket.emit('set-user', authToken);
  };
  /**3 Get Online Userlist by listning to online-users broadcase */
  public getOnlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-users', (data) => {
        observer.next(data);
      });
    });
  };
  /**emitt disconnect event with userId */
  public disconnectUser = (userId) => {
    console.log('Disconnecting user', userId);
    this.socket.emit('disconnect', userId);
    /**delete cookie and  localstorage*/
    console.log('clearing localstorage and cookie');
    localStorage.clear();
    Cookie.delete('name');
    Cookie.delete('authToken');
    Cookie.delete('email');
    Cookie.delete('userId');
  };
}