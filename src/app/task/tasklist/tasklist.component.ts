import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewContainerRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router, Route } from '@angular/router';
import { UserService } from '../../user/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MultiUserService } from '../../multiuser/multi-user.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
})
export class TasklistComponent implements OnInit {
  //scroll postion
  @ViewChild('scrollBar', { read: ElementRef })
  public scrollMe: ElementRef;
  //init fields
  public taskLists: any = [];
  public subtasks: any = [];
  public fetchedAlltaskLists: String;
  public userId: String;
  public usersFriendList: any = [];
  public page: any;
  public toggleLoadMoreTasks: Boolean = false;
  /**new task info */
  public subTaskName: String;
  public taskListId: String;
  public taskStatus: String;
  public taskId: String;
  public operationName: String;
  public closeResult: string;

  /**edit */
  public name: String;
  public selectTasks: any = [];
  public selectTasksList: any = [];
  public subTaskId: String;
  public tasks: any = [];
  public status: String;
  /**multiusers */
  public toggleOnlineUser: Boolean = true;
  public toggleFriendList: Boolean = true;
  public onlineUser: any;
  public friendList: any;
  public username: String;
  public onlineUsersList: any[];
  public authToken = String;
  public selectedFriendName = String;
  public toggleBannerDisplay: Boolean = true;
  public flagDisplayingFriendsItem: Boolean = false;
  /**-----------Modifications------- */
  public selectedUserId: String;
  public selectedTaskListId: String;
  public selectedTaskId: String;
  public selectedTaskName: String;
  public selectedTaskStatus: String;
  public selectedSubTaskId: String;
  /**component will emit event ot update
   * task and subtask array in their respective compoenents
   */

  @Output()
  notifyNewTaskList: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyNewTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyNewSubTask: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(
    private taskListService: TasklistService,
    private _toast: Toaster,
    private _router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private multiUserService: MultiUserService
  ) {
    const {
      authToken,
      firstName,
      lastName,
      friends,
    } = userService.getAutheticatedUserInfo();
    this.userId = userService.getAutheticatedUserInfo().userId;
    this.username = firstName + ' ' + lastName;
    this.authToken = authToken;
    this.selectedUserId = this.userId;
    this.usersFriendList = friends;
    this.page = 0;
  }
  /**document listener for undo process */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.metaKey || (ev.ctrlKey && ev.key === 'z')) {
      console.debug('undo start');
      this.startUndoProcess();
    }
  }
  ngOnInit(): void {
    console.debug('NGONIT RELOAD_______________TASKLIST');
    this.handeShakeAuthentication();
    //load task list on component load
    this.getAllTaskList(this.userId);
  }
  public userLogout(): any {
    console.debug('user logout');
    this.multiUserService.disconnectUser(this.userId);
    /**redirect to login page */
    setTimeout(() => this._router.navigate(['/login']), 130);
  }
  public handeShakeAuthentication(): any {
    console.debug('listen to hand shake from task-list');
    this.taskListService.autheticateUser().subscribe((data) => {
      this.taskListService.setUser(this.authToken);
    });
  }
  /**set inline users list */
  public setOnlineUsers(users): any {
    //console.debug('online users::');
    this.onlineUser = users;
  }
  /**toggle friend list */
  public showFriendList(): any {
    //console.debug('Show friend list');
    this.toggleFriendList = !this.toggleFriendList;
    this.toggleOnlineUser = true;
  }
  /**set friend list */
  public setFriendList(friends): any {
    //console.debug('Set friend list::', friends);
    this.friendList = friends;
  }
  /**toggle online userlist */
  public showOnlineUsers(): any {
    this.toggleOnlineUser = !this.toggleOnlineUser;
    this.toggleFriendList = true;
  }
  /**open modal */
  open(content, ops, id) {
    //console.debug('modal open::', ops, id);
    this.operationName = ops;
    //console.debug(ops == 'New Task');
    if (ops == 'New Task') {
      //console.debug('new task case');
      this.taskListId = id;
      this.selectedTaskListId = id;
    }
    if (ops == 'New SubTask') {
      //console.debug('new subtask case');
      this.taskId = id;
      this.selectedTaskId = id;
    }

    //console.debug('tasklistid::', this.taskListId);
    //console.debug('taskid::', this.taskId);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-create' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
    //console.debug('Modal closed::', this.closeResult);
  }
  /**open edit modal */
  openEdit(content, ops, id, name) {
    console.debug('modal edit open::', ops, id);
    this.operationName = ops;
    console.debug(ops == 'Edit Task');
    if (ops == 'Edit TaskList') {
      console.debug('Edit TaskList case');
      this.taskListId = id;
      this.selectedTaskListId = id;
      this.name = name;
      this.selectedTaskName = name;

      console.debug(
        'selecteduser,selectedtasklistid,name::',
        this.selectedUserId,
        this.selectedTaskListId,
        this.selectedTaskName
      );
    }
    if (ops == 'Edit Task') {
      console.debug('Edit task option', id);
      /**split the incoming values from task-compnent
       * and send it over to edit-component to complete
       * the edit operation
       */
      const [taskId, name, taskListId, status] = id.split(':');
      this.taskId = taskId;
      this.selectedTaskId = taskId;
      this.selectedTaskName = name;
      this.selectedTaskListId = taskListId;
      this.selectedTaskStatus = status;
      this.selectTasksList = this.taskLists;
    }
    if (ops == 'Edit SubTask') {
      console.debug('edit subtask case');
      /**split the incoming values from task-compnent
       * and send it over to edit-component to complete
       * the edit operation
       */

      const [taskId, name, subTaskId, status, taskListId] = id.split(':');
      //console.debug('list if from tasks::', taskListId);
      this.taskId = taskId;
      this.selectedTaskId = taskId;
      this.name = name;
      this.selectedTaskName = name;
      this.subTaskId = subTaskId;
      this.selectedSubTaskId = subTaskId;
      this.taskListId = taskListId;
      this.selectedTaskListId = taskListId;
      this.status = status;
      this.selectedTaskStatus = status;
      this.selectTasks = [];
    }

    //console.debug('tasklistid::', this.taskListId);
    //console.debug('taskid::', this.taskId);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-edit' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
    //console.debug('Modal closed::', this.closeResult);
  }

  /**get all taskLists */
  public getAllTaskList(userId): any {
    let userdata = {
      userId: userId,
    };
    this.page = 5;
    this.taskListService.getTaskLists(userdata, this.page).subscribe(
      (response) => {
        console.debug('get all task list', response.message);
        this.fetchedAlltaskLists = response.message;
        /**store all tasklists */
        //console.debug('tasklists return::', response.data);
        //this.taskLists.push(...response.data);
        this.taskLists = response.data;
      },
      (error) => {
        console.warn('Error fetching task list', error, error);
        this.fetchedAlltaskLists = error.error.message;
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }

  /**listen for newly created task list and push it to existing array */
  public addNewTaskList(newTaskList: any): any {
    console.debug('refresh new taskList::', newTaskList.name);
    //console.debug('Adding to current list');
    /**notification for delete items for friends */
    console.debug('notify friends for updates');
    /**emit update notifiation to friends if any*/
    let notification = `${this.username} Created a Task`;
    this.notifyFriends(notification);
    return this.taskLists.push(newTaskList);
  }
  /**listen for newly created task  and emitt event to update it */
  public addNewTask(userId: any): any {
    //console.debug('addnew task listeners::', newTask);
    //console.debug(typeof newTask);
    this.getAllTaskList(userId);
    //this.notifyNewTask.emit(newTask);
  }
  /**listen for newly created task list and emit event to update it */
  public addNewSubTask(userId: any): any {
    //console.debug(typeof newSubTask);
    //console.debug(newSubTask);
    this.getAllTaskList(userId);
    //this.notifyNewSubTask.emit(newSubTask);
  }

  /**toggle create subtask popup */
  public openCreateSubTaskForm(taskId, modal): any {
    //console.debug('Emit from task component::', taskId);
    this.taskId = taskId;
    this.open(modal, 'New SubTask', taskId);
  }

  /**delete task listeners from task component*/
  public deleteTask(values): any {
    //console.debug('Delete task listeners::', values, this.userId);
    /**call delete service */
    let [taskId, taskListId, userId] = values.split(':');
    //console.debug(taskListId, taskId);
    let taskInfo = {
      taskListId: taskListId,
      taskId: taskId,
      userId: userId,
      operation: 'delete',
    };
    console.debug('delete taskinfo::', taskInfo);
    this.taskListService.updateTask(taskInfo).subscribe(
      (response) => {
        //console.debug('Delete api reponse::', response.message);
        /**success toast  */
        this._toast.open({ text: response.message, type: 'success' });
        /**notify tasklist component for task updates */
        let refreshUserId;
        if (this.flagDisplayingFriendsItem) {
          refreshUserId = this.selectedUserId;
        } else {
          refreshUserId = this.userId;
        }
        console.debug('refreshing for::', refreshUserId);
        this.getAllTaskList(refreshUserId);
      },
      (error) => {
        console.debug('Error Deleting Task::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
    /**notification for delete items for friends */
    console.debug('notify friends for updates');
    /**emit update notifiation to friends if any*/
    let notification = `${this.username} deleted a Task`;
    this.notifyFriends(notification);
  }
  /**edit task listeners from task-component */
  public editTask(values, modal): any {
    console.debug('Edit task modal open::', values, modal);
    this.openEdit(modal, 'Edit Task', values, name);
  }
  /**edit subtask listeners from sub-task-> task-component */
  public editSubTask(values, modal): any {
    this.openEdit(modal, 'Edit SubTask', values, name);
  }
  /**delete tasklist */
  public deleteTaskList(taskListId: String): any {
    //console.debug('delete tasklist::', taskListId);
    /**compute input params based on loggedIn user or friend's selection */
    let userId = this.flagDisplayingFriendsItem
      ? this.selectedUserId
      : this.userId;
    console.debug('deleting task list for ::', userId);
    let taskListInfo = {
      userId: userId,
      taskListId: taskListId,
      operation: 'delete',
    };
    this.taskListService.updateTaskList(taskListInfo).subscribe(
      (response) => {
        //console.debug('Delete task list response::', response.message);
        this._toast.open({ text: response.message, type: 'success' });
        /**delete the entry from current tasklist */
        this.taskLists = this.taskLists.filter(
          (list) => list.taskListId != taskListId
        );
        /**notification for delete items for friends */
        console.debug('notify friends for updates');
        /**emit update notifiation to friends if any*/
        let notification = `${this.username} deleted a TaskList`;
        this.notifyFriends(notification);
      },
      (error) => {
        console.debug('Error deleting tasklist::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**edit task list */
  public editTaskLists(value): any {
    //console.debug('edit tasklist listener::', value);
    const [name, taskListId] = value.split(':');
    //console.debug('to edit::', name, taskListId);
    /**update tasklist name */
    this.taskLists.filter((list) => {
      if (list.taskListId === taskListId) {
        list.name = name;
        return list;
      }
    });
  }
  public postEditTask(value): any {
    this.getAllTaskList(value);
  }
  public postEditSubTask(value): any {
    this.getAllTaskList(value);
  }
  public getFriendsItems(selectedFriend): any {
    console.debug('listen to friend selection::', selectedFriend);
    let [friendName, friendUserId] = selectedFriend.split(':');
    /**hide the friendlist div */
    this.toggleFriendList = true;
    /**switch flag to friend's view */
    this.flagDisplayingFriendsItem = true;
    /**fetch taskLists for friend and add to existing taskList array */
    this.selectedUserId = friendUserId;
    this.selectedFriendName = friendName;
    /**display banner */
    this.toggleBannerDisplay = false;
    console.debug('get all task tasklist for friends::');
    this.getAllTaskList(friendUserId);
    /**filter the current task list based on current USERID i.e
     * loggedIn user or selected friend
     */
    this.taskLists = this.taskLists.filter((list) => {
      list.userId !== this.userId;
    });
    console.debug('tasklist::', this.taskLists);
    /**toast for friend's selection */
    this._toast.open({
      text: `opening tasks for ${friendName}`,
      type: 'info',
    });
  }
  /**reload friendly updates */
  public reloadFriendlyUpdates(value): any {
    console.debug('reload listener::', value);
    this.getAllTaskList(value);
  }
  /**refresh page for showLoggedInUsersTask i.e.
   * switch from friend's view to seld
   *
   */
  public showLoggedInUsersTask(userId): any {
    console.debug('reload for self');
    this.getAllTaskList(userId);
    /**hide friend's banner */
    this.toggleBannerDisplay = true;
  }
  /**utitlity method for realtime update notification  */
  public notifyFriends(notification): any {
    console.debug('notify friends for updates');
    /**emit update notifiation to friends if any*/
    if (this.usersFriendList.length !== 0) {
      console.debug('updates string::', notification, this.usersFriendList);
      this.multiUserService.notifyFriendsForUpdates(
        notification,
        this.usersFriendList
      );
    }
  }
  /**notification for sub task deeltion */
  public notifyFriendsSTaskDelete(value): any {
    console.debug('notification for sub task deletion');
    let notification = `${this.username} deleted a SubTask`;
    this.notifyFriends(notification);
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
            this._toast.open({ text: toastString, type: 'dark' });
            //emit reload tasklist event
            console.debug("reloading task for  ,since it's a friend");
            this.getAllTaskList(this.userId);
          }
        });
      }
    });
  }
  public startUndoProcess(): any {
    console.debug(
      'Start undo process::by the current user forthe current user'
    );
    console.debug('loggedIn USER:', this.userId);
    console.debug('selected/friendID::', this.selectedUserId);
    /**read the latest  updates done for the selctedUser
     * which will be either current user or if he is viewing task for
     * a friend
     * -->call fetchhistoric data api
     * -->on success response reload the tasklist for the selected user
     */
    let userInfo = {
      userId: this.selectedUserId,
    };
    this.taskListService.revertLatestChange(userInfo).subscribe(
      (response) => {
        console.debug('revert changes api response:', response);
        if (response.status === 200) {
          console.debug('Revert-Success::', response.message);
          console.debug('Reloading the current tasklist');
          /**timeout to fetch the updated db data */
          setTimeout(() => {
            this.getAllTaskList(this.selectedUserId);
            this._toast.open({ text: response.message, type: 'success' });
          }, 1000);
          /**notify friends about changes */
          let notification = `${this.username} Reverted a Change`;
          this.notifyFriends(notification);
        } else {
          this._toast.open({ text: response.message, type: 'danger' });
        }
      },
      (error) => {
        console.debug('Revert Change API Error::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**load more tasks */
  public loadMoreTaskList(): any {
    console.debug('load more tasks');
    if (this.page === 0 || this.page < 0) {
      this.page = 3;
    } else {
      this.page = --this.page;
    }

    let currentTaskList = this.taskLists;
    console.debug('current task::', currentTaskList);
    console.debug('task lists length::', this.taskLists.length);

    let user = {
      userId: this.selectedUserId,
    };
    this.taskListService.getTaskLists(user, this.page).subscribe(
      (response) => {
        console.debug('resposne laod more tasks::', response.data);
        let result = response.data;
        this.taskLists = response.data;
        console.debug('final tasks::', this.taskLists);
      },
      (error) => {
        console.debug('error load::', error.error);
      }
    );
  }
}
