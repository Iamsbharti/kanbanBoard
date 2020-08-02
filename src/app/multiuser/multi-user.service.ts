import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, onErrorResumeNext, observable } from 'rxjs';
import * as io from 'socket.io-client';
import { UserService } from '../user/user.service';

import { Cookie } from 'ng2-cookies';
@Injectable({
  providedIn: 'root',
})
export class MultiUserService {
  private socketUrl = 'http://localhost:4201/multiusers';
  private apiBaseUrl = 'http://localhost:4201/api/v1';
  private authToken: any;
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
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.userService.getAutheticatedUserInfo().authToken,
    }),
  };
  /**define listeners and emitters */
  /**1: Listen to authentication handshake */
  public autheticateUser = () => {
    console.log('Auth user listener');
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
    console.log('get online user service');
    return Observable.create((observer) => {
      this.socket.on('online-users', (data) => {
        observer.next(data);
      });
    });
  };
  /**emitt disconnect event with userId */
  public disconnectUser = (userId) => {
    console.log('Disconnecting user', userId);
    this.socket.emit('disconnected', userId);
    /**delete cookie and  localstorage*/
    console.log('clearing localstorage and cookie');
    localStorage.clear();
    Cookie.delete('name');
    Cookie.delete('authToken');
    Cookie.delete('email');
    Cookie.delete('userId');
  };
  /**emit friend request */
  public sendFrendRequest = (friendRequest) => {
    console.log('Send friend Request:');
    this.socket.emit('sentFriendRequest', friendRequest);
  };
  /**listen for friend request */
  public recieveFriendRequest = (recieverId) => {
    return Observable.create((observable) => {
      this.socket.on(recieverId, (data) => {
        observable.next(data);
      });
    });
  };
  /**fetch friend requests */
  public getFriendRequests(senderId): any {
    return this._http.post(
      `${this.apiBaseUrl}/getFriendRequests`,
      senderId,
      this.httpHeaderOptions
    );
  }
}
