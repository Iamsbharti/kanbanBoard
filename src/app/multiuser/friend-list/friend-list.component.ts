import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultiUserService } from '../multi-user.service';
import { UserService } from 'src/app/user/user.service';
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
  constructor(
    private multiUserService: MultiUserService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authToken = this.userService.getAutheticatedUserInfo().authToken;
    this.handeShakeAuthentication();
  }

  public handeShakeAuthentication(): any {
    console.log('listen to hand shake');
    this.multiUserService.autheticateUser().subscribe((data) => {
      this.multiUserService.setUser(this.authToken);
      this.getOnlineUsersList();
    });
  }
  public getOnlineUsersList(): any {
    console.log('get online users list');
    this.multiUserService.getOnlineUserList().subscribe((data) => {
      console.log('Online users from socket::', data);
      this.onlineUsers.emit(data);
      this.onlineUsersList = data;
    });
  }
}
