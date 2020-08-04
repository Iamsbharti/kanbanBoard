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
    this.socket = io(this.socketUrl, {
      'auto connect': true,
      'max reconnection attempts': 10,
      multiplex: false,
      'try multiple transports': true,
    });
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
    //console.log('get online user service');
    return Observable.create((observer) => {
      this.socket.on('online-users', (data) => {
        observer.next(data);
      });
    });
  };
  /**emitt disconnect event with userId */
  public disconnectUser = (userId) => {
    //console.log('Disconnecting user', userId);
    this.socket.emit('disconnected', userId);
    /**delete cookie and  localstorage*/
    //console.log('clearing localstorage and cookie');
    localStorage.clear();
    Cookie.delete('name');
    Cookie.delete('authToken');
    Cookie.delete('email');
    Cookie.delete('userId');
  };
  /**emit friend request */
  public sendFriendRequest = (friendRequest) => {
    //console.log('Send friend Request:');
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
  /**listen for friendsList */
  public getUpdatedFriendList(): any {
    return Observable.create((observable) => {
      this.socket.on('friendlist-updates', (data) => {
        observable.next(data);
      });
    });
  }
  /**emit request approve/rejection FR */
  public updateFriendRequest = (friendRequest) => {
    //console.log('Emit actions on fr request');
    this.socket.emit('update-friend-request', friendRequest);
  };
  /**listen for friend request approval/rejection for appropiate sender */
  public friendRequestAction(): any {
    /**here fr component will update and toast for approval
     * or rejection & fr list updates based appropiate
     * senderId (i.e if senderId is userId)
     */
    return Observable.create((observable) => {
      this.socket.on('friend-request-updates', (data) => {
        observable.next(data);
      });
    });
  }
  /**emit update notification to friends when any edit if
   * performed 'updates' has What was updated by whom
   */
  public notifyFriendsForUpdates(updates, friendlist): any {
    console.log('emit notify friendly updates');
    this.socket.emit('friend-updated-tasks', updates, friendlist);
  }
  /**listen for updates from friends and show notificationa
   * and reload tasklist if userId is in Friend's list
   */
  public friendlyTaskUpdates(): any {
    console.log('friendly task updates');
    return Observable.create((observable) => {
      this.socket.on('updates-from-friend', (updates, friendList) => {
        observable.next(updates);
        observable.next(friendList);
        observable.complete();
      });
    });
  }
}
