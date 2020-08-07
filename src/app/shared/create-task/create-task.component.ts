import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { MultiUserService } from '../../multiuser/multi-user.service';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  /**common input fields */
  @Input() userId: any;
  @Input() operationName: String;
  @Input() loggedInUser: any;
  @Input() username: any;
  @Input() flagOperationForFriend: any;
  @Input() usersFriend: any;
  /**task field */
  @Input() taskListId: any;
  @Input() taskName: any;
  /**tasklist field */
  @Input() taskListName: any;
  /**subtask field */
  @Input() subTaskName: any;
  @Input() taskId: any;

  public createNewtaskResponse: String;
  public errorResponse: Boolean = true;
  public successResponse: Boolean = true;

  //component will emit tasklist reload
  @Output()
  notifyNewTaskList: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyNewTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyNewSubTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  closeModal: EventEmitter<String> = new EventEmitter<String>();

  constructor(
    private taskService: TasklistService,
    private _toast: Toaster,
    private multiUserService: MultiUserService
  ) {}

  ngOnInit(): void {}
  /**create a single task */
  public createTask(): any {
    console.debug('operation::', this.operationName);
    if (this.operationName.endsWith('New Task')) {
      console.debug('create new task');
      let taskInfo = {
        taskListId: this.taskListId,
        userId: this.userId,
        name: this.taskName,
        status: 'open',
      };
      console.debug('taskinfo::', taskInfo);
      this.taskService.createTask(taskInfo).subscribe(
        (response) => {
          console.debug('Create task response::', response.message);
          console.debug('error::', response);
          /**New task Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.createNewtaskResponse = response.message;
            console.debug('emitt new task change', response.data);
            //this.notifyNewTask.emit(response.data);
            /**notify tasklist component for task updates */
            let refreshUserId;
            if (this.flagOperationForFriend) {
              refreshUserId = this.userId;
            } else {
              refreshUserId = this.loggedInUser;
            }
            console.debug('refreshing for::', refreshUserId);
            //this.notifyEditTask.emit(refreshUserId);
            this.notifyNewTask.emit(refreshUserId);
            /**emit update notifiation to friends if any*/
            let notification = `${this.username} created a Task`;
            this.notifyFriends(notification);

            /**emit close modal event */
            this.closeModal.emit();
          }
          if (response.error === true && response.status === 400) {
            this._toast.open({ text: `${response.data}`, type: 'danger' });
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.debug('resposen::', this.createNewtaskResponse);

          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
    if (this.operationName.includes('New SubTask')) {
      console.debug('create new subtask');
      let taskInfo = {
        taskId: this.taskId,
        name: this.taskName,
        status: 'open',
        userId: this.userId,
      };
      console.debug('subtaskinfor::', taskInfo);
      this.taskService.createSubTask(taskInfo).subscribe(
        (response) => {
          console.debug('Create task response::', response.message);

          /**New subtask Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.createNewtaskResponse = response.message;
            /**notify tasklist component for task updates */
            let refreshUserId;
            if (this.flagOperationForFriend) {
              refreshUserId = this.userId;
            } else {
              refreshUserId = this.loggedInUser;
            }
            console.debug('refreshing for::', refreshUserId);
            this.notifyNewSubTask.emit(refreshUserId);
            /**emit update notifiation to friends if any*/
            let notification = `${this.username} created a SubTask`;
            this.notifyFriends(notification);

            /**emit modal close event */
            this.closeModal.emit();
          }
          if (response.error === true && response.status === 400) {
            this._toast.open({ text: `${response.data}`, type: 'danger' });
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.debug('resposen-subtask::', this.createNewtaskResponse);
          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
    if (this.operationName.includes('New TaskList')) {
      console.debug('create new tasklist');
      let taskListInfo = {
        userId: this.userId,
        name: this.taskName,
      };
      this.taskService.createTaskList(taskListInfo).subscribe(
        (response) => {
          console.debug('Create tasklist  response::', response.message);

          /**New subtask Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.createNewtaskResponse = response.message;
            console.debug('emmit new tasklist create', response.data);
            this.notifyNewTaskList.emit(response.data);
            /**emit modal close event */
            this.closeModal.emit();
            /**emit create notifiation to friends if any*/
            let notification = `${this.username} created a TaskList`;
            this.notifyFriends(notification);
          }
          if (response.error === true && response.status === 400) {
            this._toast.open({ text: `${response.data}`, type: 'danger' });
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.debug('resposen-taklist::', this.createNewtaskResponse);
          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
  }

  public notifyFriends(notification): any {
    console.debug('notify friends for updates');
    /**emit update notifiation to friends if any*/
    if (this.usersFriend.length !== 0) {
      console.debug('updates string::', notification, this.usersFriend);
      this.multiUserService.notifyFriendsForUpdates(
        notification,
        this.usersFriend
      );
    }
  }
}
