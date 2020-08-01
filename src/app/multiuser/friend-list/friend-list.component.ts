import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultiUserService } from '../multi-user.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit {
  @Input() userId: any;
  @Input() username: any;
  @Output()
  onlineUsers: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  private authToken: String;
  public onlineUsersList: any[];

  constructor(private multiUserService: MultiUserService) {
    this.authToken = Cookie.get('authToken');
    //console.log('authtoken::', this.authToken);
  }

  ngOnInit(): void {
    this.handeShakeAuthentication();
    this.getOnlineUsersList();
  }

  public handeShakeAuthentication(): any {
    console.log('listen to hand shake', this.authToken.length);
    this.multiUserService.autheticateUser().subscribe((data) => {
      this.multiUserService.setUser(this.authToken);
      this.getOnlineUsersList();
    });
  }
  public getOnlineUsersList(): any {
    console.log('get online users list');
    this.multiUserService.getOnlineUserList().subscribe((data) => {
      console.log('Online users from socket::', data);
      /**filter out the current user */
      let users = [];
      data.map((d) => {
        if (d.userId !== this.userId) {
          users.push(d);
        }
      });
      console.log('final list:', users);
      this.onlineUsers.emit(users);
      this.onlineUsersList = users;
    });
  }
}
