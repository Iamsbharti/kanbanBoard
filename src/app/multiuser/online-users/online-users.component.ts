import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultiUserService } from '../multi-user.service';
import { Cookie } from 'ng2-cookies';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
  @Input() userId: any;
  @Input() username: any;
  @Input() usersFriend: any = [];
  @Output()
  onlineUsers: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  private authToken: String;
  public onlineUsersList: any[];
  public isFriend: Boolean = true;
  constructor(
    private multiUserService: MultiUserService,
    private _toaster: Toaster
  ) {
    this.authToken = Cookie.get('authToken');
    /**keep listeners active */
    this.getOnlineUsersList();
    this.recieveFriendRequestByUserId();
  }

  ngOnInit(): void {
    this.handeShakeAuthentication();
    this.getOnlineUsersList();
    this.recieveFriendRequestByUserId();
  }

  public handeShakeAuthentication(): any {
    console.debug('listen to hand shake online compoenent');
    this.multiUserService.autheticateUser().subscribe((data) => {
      this.multiUserService.setUser(this.authToken);
      this.getOnlineUsersList();
    });
  }
  public getOnlineUsersList(): any {
    //console.debug('get online users list');
    this.multiUserService.getOnlineUserList().subscribe((data) => {
      //console.debug('Online users from socket::', data);
      /**filter out the current user */
      let users = [];
      data.map((d) => {
        if (d.userId !== this.userId) {
          users.push(d);
        }
      });
      //console.debug('final list:', users);
      this.onlineUsers.emit(users);
      this.onlineUsersList = users;
    });
  }
  public addFriend(userId, username): any {
    //console.debug('Add friend start', userId);
    /**to and from denotes friend request sent to and from user */
    let friendList = {
      recieverId: userId,
      recieverName: username,
      senderId: this.userId,
      senderName: this.username,
    };
    this.multiUserService.sendFriendRequest(friendList);
    //console.debug('fiendlist::', friendList);
  }
  public recieveFriendRequestByUserId(): any {
    //console.debug('listen to friend request');
    this.multiUserService
      .recieveFriendRequest(this.userId)
      .subscribe((data) => {
        //console.debug('recieved friend request for ', data);
        const { recieverId, recieverName, senderId, senderName } = data;
        this._toaster.open({
          text: `${senderName} sent you an friend request`,
          type: 'success',
        });
      });
  }
}
