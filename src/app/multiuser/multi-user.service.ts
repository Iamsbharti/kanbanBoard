import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, onErrorResumeNext } from 'rxjs';
import * as io from 'socket.io-client';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class MultiUserService {
  private socketUrl = 'http://localhost:4201/multiuser';
  private apiBaseUrl = 'http://localhost:4201/api/v1';
  private authToken: String;
  private socket;
  constructor(private _http: HttpClient, private userService: UserService) {
    /**init client socket */
    this.socket = io(this.socketUrl);
  }
  //handle exceptions
  public handleError(error: HttpErrorResponse) {
    console.log('Http Error:', error.message);
    return Observable.throw(error.message);
  }
  //define header for api authentication
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.userService.getAutheticatedUserInfo().authToken,
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
}
