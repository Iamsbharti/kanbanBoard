import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MultiUserService } from '../multi-user.service';
import { Cookie } from 'ng2-cookies';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit {
  @Input() userId: any;
  @Input() username: any;
  @Output()
  friends: EventEmitter<any> = new EventEmitter<any>();
  private authToken: String;
  public resultList: any = [];
  public friendsList: any = []; //status -accepted
  public pendingFriendLists: any = []; //status --pending
  public toApproveRequest: any = []; //status --pending && recieverId==this.userId
  public rejectedLists: any = []; //status --rejected

  constructor(private multiUserService: MultiUserService) {
    this.authToken = Cookie.get('authToken');
  }

  ngOnInit(): void {
    //this.handeShakeAuthentication();
    this.getFriends();
  }

  public handeShakeAuthentication(): any {
    console.log('listen to hand shake', this.authToken.length);
    this.multiUserService.autheticateUser().subscribe((data) => {
      this.multiUserService.setUser(this.authToken);
      this.getFriends();
    });
  }
  public getFriends(): any {
    console.log('get online users list', this.userId);
    let user = {
      senderId: this.userId,
    };
    this.multiUserService.getFriendRequests(user).subscribe(
      (response) => {
        console.log('friend reques::', response.message);
        console.log('friend reques::', typeof response.data);

        if (response.status === 200) {
          this.resultList = response.data;
          this.friends.emit(response.data);
          this.refineLists(this.resultList);
        }
      },
      (error) => {
        console.error('Error::', error.error);
      }
    );
  }
  public refineLists(resultList): any {
    console.log('refining list', resultList.length);
    resultList.map((req) => {
      console.log(req.status);
      switch (req.status) {
        case 'pending':
          if (req.senderId == this.userId) {
            this.pendingFriendLists.push(req);
          }
          this.toApproveRequest.push(req);
          break;
        case 'accepted':
          this.friendsList.push(req);
          break;
        case 'rejected':
          this.rejectedLists.push(req);
          break;
      }
    });
    this.toApproveRequest = this.toApproveRequest.filter(
      (usr) => usr.recieverId == this.userId
    );

    console.log('pendingFriendLists::', this.pendingFriendLists);
    console.log('toApproveRequest::', this.toApproveRequest);
    console.log('friendsList::', this.friendsList);
  }
}
