import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MultiUserService } from '../multi-user.service';
import { Cookie } from 'ng2-cookies';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit, OnDestroy {
  @Input() userId: any;
  @Input() username: any;
  @Output()
  friends: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  selectedFriend: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  reloadTaskList: EventEmitter<any> = new EventEmitter<any>();

  private authToken: String;
  public resultList: any = [];
  public friendsList: any = []; //status -accepted
  public friendListObj: any = []; //for selection purpose
  public pendingFriendLists: any = []; //status --pending
  public toApproveRequest: any = []; //status --pending && recieverId==this.userId
  public rejectedLists: any = []; //status --rejected

  constructor(
    private multiUserService: MultiUserService,
    private _toaster: Toaster
  ) {
    this.authToken = Cookie.get('authToken');
  }

  ngOnInit(): void {
    console.debug('NGINIT_______FRIENDLIST');
    /**get friend list on user's login */
    this.getFriends();
    /**listen for any friend request made */
    this.getFriendRequestList();
    /**listen for any approval/rejection for this user */
    this.fRequestUpdateListener();
    /**listen for any updates made by friends */
    this.friendlyUpdatesListener();
  }
  ngOnDestroy(): void {}
  public handeShakeAuthentication(): any {
    console.debug('listen to hand shake');
    this.multiUserService.autheticateUser().subscribe((data) => {
      this.multiUserService.setUser(this.authToken);
      this.getFriends();
    });
  }
  /**get friend list by API end point */
  public getFriends(): any {
    //console.debug('get online users list', this.userId);
    let user = {
      senderId: this.userId,
    };
    this.multiUserService.getFriendRequests(user).subscribe(
      (response) => {
        //console.debug('friend reques::', response.message);
        //console.debug('friend reques::', typeof response.data);

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
  /**compute different type of friend list */
  public refineLists(friends): any {
    //console.debug('refining list:: for different groups', friends);
    friends.map((req) => {
      switch (req.status) {
        case 'pending':
          /**compute pending list based when user id the sender and include onle once */
          if (
            req.senderId == this.userId &&
            !this.pendingFriendLists.includes(req.senderId)
          ) {
            this.pendingFriendLists.push(req);
          }
          /**compute the approval list for pending req and later filter
           * based on when the user is the reciever of the request Line NO(101)
           */
          this.toApproveRequest.push(req);
          break;
        case 'accepted':
          /**include id for openFriendsItem */
          if (req.senderId === this.userId) {
            this.friendsList.push(`${req.recieverName}:${req.recieverId}`);
          }
          if (
            req.recieverId === this.userId &&
            !this.friendsList.includes(req.senderName)
          ) {
            this.friendsList.push(`${req.senderName}:${req.senderId}`);
            this.friendListObj.push(req);
          }
      }
    });
    /**filter approval list
     * based on when the user is the reciever of the request Line NO
     */
    this.toApproveRequest = this.toApproveRequest.filter(
      (usr) => usr.recieverId == this.userId
    );
    //console.debug('to approve list::', this.toApproveRequest);
    //console.debug('friend list::', this.friendsList);
  }
  /**listen for any friend request made for this user and update the friend list */
  public getFriendRequestList(): any {
    this.multiUserService.getUpdatedFriendList().subscribe((data) => {
      /**updated the existing friend's list after any request is added or approved*/
      this.getFriends();
    });
  }
  /**approve/reject friend request */
  public updateFRequest(request, action): any {
    //console.debug('Clicked updateFRequest:', action);
    let updatedFriendRequest = { ...request, status: action };
    /**emit the updated request */
    this.multiUserService.updateFriendRequest(updatedFriendRequest);
    /**call for updated friend list API */
    setTimeout(() => this.getFriends(), 1200);
  }

  /**listen for updated approval & rejection if it's for this userID */
  public fRequestUpdateListener(): any {
    this.multiUserService.friendRequestAction().subscribe((updatedRequest) => {
      const {
        recieverId,
        recieverName,
        senderId,
        senderName,
        status,
        uniqueCombination,
      } = updatedRequest;
      /**if senderId is this userId , this request is meant for self
       * take action accordingly
       */
      if (senderId === this.userId) {
        /**toast approval/rejection */
        this._toaster.open({
          text: `${recieverName} ${status} your request`,
          type: status === 'accepted' ? 'success' : 'dark',
        });
        /**refine current pendinglist based on current action(accepted/rejected) */
        if (status === 'accepted') {
          this.pendingFriendLists = this.pendingFriendLists.filter((req) => {
            req.senderId === senderId;
          });
        }
      }
      if (recieverId === this.userId && status === 'accepted') {
        /**toast approver for success */
        this._toaster.open({
          text: `${senderName} is now your friend`,
          type: 'success',
        });
        /**clean up approval list for this request on client side*/
        this.toApproveRequest = this.toApproveRequest.filter((req) => {
          req.senderId === senderId;
        });
      }
      /**get the updated friendlist from server*/
      this.getFriends();
    });
  }
  /**Invoke addition to friendsItem  */
  public openFriendsItem(friend): any {
    console.debug('friend::', friend);
    this.selectedFriend.emit(friend);
  }
  /**listener for friendly task updates */
  public friendlyUpdatesListener(): any {
    let toastString;
    let friendList = [];
    console.debug('Friendly task updates');
    this.multiUserService.friendlyTaskUpdates().subscribe((updates) => {
      console.debug('updates listener::', updates);
      if (typeof updates === 'string') {
        toastString = updates;
        console.debug('toast string::', toastString);
      } else {
        friendList = updates;
        console.debug('friendlist::', updates);
      }
      console.debug('is friend::', friendList, this.userId);
      if (friendList.length !== 0) {
        friendList.map((fr) => {
          if (fr !== null && fr === this.userId) {
            console.debug('Found friend');
            this._toaster.open({ text: toastString, type: 'dark' });
            //emit reload tasklist event
            console.debug("reloading task for  ,since it's a friend");
            setTimeout(() => this.reloadTaskList.emit(this.userId), 1400);
          }
        });
      }
    });
  }
}
