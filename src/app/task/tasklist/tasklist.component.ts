import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router, Route } from '@angular/router';
import { UserService } from '../../user/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
})
export class TasklistComponent implements OnInit {
  //init fields
  public taskLists: any = [];
  public subtasks: any = [];
  public fetchedAlltaskLists: String;
  public userId: String;
  public usersFriendList: any = [];
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
    private modalService: NgbModal
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
  }

  ngOnInit(): void {
    //load task list on component load
    this.getAllTaskList(this.userId);
  }

  /**set inline users list */
  public setOnlineUsers(users): any {
    //console.log('online users::');
    this.onlineUser = users;
  }
  /**toggle friend list */
  public showFriendList(): any {
    //console.log('Show friend list');
    this.toggleFriendList = !this.toggleFriendList;
    this.toggleOnlineUser = true;
  }
  /**set friend list */
  public setFriendList(friends): any {
    //console.log('Set friend list::', friends);
    this.friendList = friends;
  }
  /**toggle online userlist */
  public showOnlineUsers(): any {
    this.toggleOnlineUser = !this.toggleOnlineUser;
    this.toggleFriendList = true;
  }
  /**open modal */
  open(content, ops, id) {
    //console.log('modal open::', ops, id);
    this.operationName = ops;
    //console.log(ops == 'New Task');
    if (ops == 'New Task') {
      //console.log('new task case');
      this.taskListId = id;
      this.selectedTaskListId = id;
    }
    if (ops == 'New SubTask') {
      //console.log('new subtask case');
      this.taskId = id;
      this.selectedTaskId = id;
    }

    //console.log('tasklistid::', this.taskListId);
    //console.log('taskid::', this.taskId);
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
    //console.log('Modal closed::', this.closeResult);
  }
  /**open edit modal */
  openEdit(content, ops, id, name) {
    console.log('modal edit open::', ops, id);
    this.operationName = ops;
    console.log(ops == 'Edit Task');
    if (ops == 'Edit TaskList') {
      console.log('Edit TaskList case');
      this.taskListId = id;
      this.selectedTaskListId = id;
      this.name = name;
      this.selectedTaskName = name;

      console.log(
        'selecteduser,selectedtasklistid,name::',
        this.selectedUserId,
        this.selectedTaskListId,
        this.selectedTaskName
      );
    }
    if (ops == 'Edit Task') {
      console.log('Edit task option', id);
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
      console.log('edit subtask case');
      /**split the incoming values from task-compnent
       * and send it over to edit-component to complete
       * the edit operation
       */

      const [taskId, name, subTaskId, status, taskListId] = id.split(':');
      //console.log('list if from tasks::', taskListId);
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

    //console.log('tasklistid::', this.taskListId);
    //console.log('taskid::', this.taskId);
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
    //console.log('Modal closed::', this.closeResult);
  }

  /**get all taskLists */
  public getAllTaskList(userId): any {
    let userdata = {
      userId: userId,
    };
    this.taskListService.getTaskLists(userdata).subscribe(
      (response) => {
        console.log('get all task list', response.message);
        this.fetchedAlltaskLists = response.message;
        /**store all tasklists */
        //console.log('tasklists return::', response.data);
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
    //console.log('refresh new taskList::', newTaskList.name);
    //console.log('Adding to current list');
    return this.taskLists.push(newTaskList);
  }
  /**listen for newly created task  and emitt event to update it */
  public addNewTask(newTask: any): any {
    //console.log('addnew task listeners::', newTask);
    //console.log(typeof newTask);
    this.getAllTaskList(this.userId);
    this.notifyNewTask.emit(newTask);
  }
  /**listen for newly created task list and emit event to update it */
  public addNewSubTask(newSubTask: any): any {
    //console.log(typeof newSubTask);
    //console.log(newSubTask);
    this.getAllTaskList(this.userId);
    this.notifyNewSubTask.emit(newSubTask);
  }

  /**toggle create subtask popup */
  public openCreateSubTaskForm(taskId, modal): any {
    //console.log('Emit from task component::', taskId);
    this.taskId = taskId;
    this.open(modal, 'New SubTask', taskId);
  }

  /**delete task listeners from task component*/
  public deleteTask(values): any {
    //console.log('Delete task listeners::', values, this.userId);
    /**call delete service */
    let [taskId, taskListId, userId] = values.split(':');
    //console.log(taskListId, taskId);
    let taskInfo = {
      taskListId: taskListId,
      taskId: taskId,
      userId: userId,
      operation: 'delete',
    };
    console.log('delete taskinfo::', taskInfo);
    this.taskListService.updateTask(taskInfo).subscribe(
      (response) => {
        //console.log('Delete api reponse::', response.message);
        /**success toast  */
        this._toast.open({ text: response.message, type: 'success' });
        this.getAllTaskList(this.userId);
      },
      (error) => {
        console.log('Error Deleting Task::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**edit task listeners from task-component */
  public editTask(values, modal): any {
    console.log('Edit task modal open::', values, modal);
    this.openEdit(modal, 'Edit Task', values, name);
  }
  /**edit subtask listeners from sub-task-> task-component */
  public editSubTask(values, modal): any {
    this.openEdit(modal, 'Edit SubTask', values, name);
  }
  /**delete tasklist */
  public deleteTaskList(taskListId: String): any {
    //console.log('delete tasklist::', taskListId);
    let taskListInfo = {
      userId: this.userId,
      taskListId: taskListId,
      operation: 'delete',
    };
    this.taskListService.updateTaskList(taskListInfo).subscribe(
      (response) => {
        //console.log('Delete task list response::', response.message);
        this._toast.open({ text: response.message, type: 'success' });
        /**delete the entry from current tasklist */
        this.taskLists = this.taskLists.filter(
          (list) => list.taskListId != taskListId
        );
      },
      (error) => {
        console.log('Error deleting tasklist::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**edit task list */
  public editTaskLists(value): any {
    //console.log('edit tasklist listener::', value);
    const [name, taskListId] = value.split(':');
    //console.log('to edit::', name, taskListId);
    /**update tasklist name */
    this.taskLists.filter((list) => {
      if (list.taskListId === taskListId) {
        list.name = name;
        return list;
      }
    });
  }
  public postEditTask(value): any {
    this.getAllTaskList(this.userId);
  }
  public postEditSubTask(value): any {
    this.getAllTaskList(this.userId);
  }
  public getFriendsItems(selectedFriend): any {
    console.log('listen to friend selection::', selectedFriend);
    let [friendName, friendUserId] = selectedFriend.split(':');
    /**hide the friendlist div */
    this.toggleFriendList = true;
    /**fetch taskLists for friend and add to existing taskList array */
    this.selectedUserId = friendUserId;
    this.selectedFriendName = friendName;
    /**display banner */
    this.toggleBannerDisplay = false;
    console.log('get all task tasklist for friends::');
    this.getAllTaskList(friendUserId);
    /**filter the current task list based on current USERID i.e
     * loggedIn user or selected friend
     */
    this.taskLists = this.taskLists.filter((list) => {
      list.userId !== this.userId;
    });
    console.log('tasklist::', this.taskLists);
    /**toast for friend's selection */
    this._toast.open({
      text: `opening tasks for ${friendName}`,
      type: 'info',
    });
  }
  /**reload friendly updates */
  public reloadFriendlyUpdates(value): any {
    console.log('reload listener::', value);
    this.getAllTaskList(value);
  }
  /**refresh page for showLoggedInUsersTask i.e.
   * switch from friend's view to seld
   *
   */
  public showLoggedInUsersTask(userId): any {
    console.log('reload for self');
    this.getAllTaskList(userId);
    /**hide friend's banner */
    this.toggleBannerDisplay = true;
  }
}
