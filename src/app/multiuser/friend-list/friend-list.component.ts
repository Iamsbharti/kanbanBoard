import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit {
  /**
   * [userId]="userId"
        [username]="username"
        (onlineUsers)="setOnlineUsers($event)"
   */
  @Input() userId: any;
  @Input() username: any;
  @Output()
  onlineUsers: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();
  constructor() {}

  ngOnInit(): void {}
}
