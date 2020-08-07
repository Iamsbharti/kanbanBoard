import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { MultiUserService } from '../../multiuser/multi-user.service';
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  /**common input fields */
  @Input() userId: any;
  @Input() operationName: String;
  @Input() name: String;
  @Input() status: String;
  @Input() loggedInUser: String;
  @Input() usersFriend: any;
  @Input() username: any;
  /**task field */
  @Input() taskListId: any;

  /**tasklist field */
  @Input() taskListName: any;
  @Input() selectTasksList: any[];
  /**subtask field */
  @Input() subTaskName: any;
  @Input() taskId: any;
  @Input() subTaskId: any;
  @Input() selectedFriendName: any;
  @Input() selectTasks: any[];
  @Input() flagOperationForFriend: any[];
  public editTaskResponse: String;
  public errorResponse: Boolean = true;
  public successResponse: Boolean = true;
  public tasklist: any;
  public toggleTaskList: Boolean = false;
  public toggleTasks: Boolean = false;
  public toggleStatusSelection: Boolean = false;
  public selected: String;
  public selectedTask: String;
  public selectedTaskList: any = [];
  public statusOptions: String[];

  //component will emit tasklist reload

  @Output()
  notifyEditTaskList: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  notifyEditTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyEditSubTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  closeModal: EventEmitter<String> = new EventEmitter<String>();

  constructor(
    private taskService: TasklistService,
    private _toast: Toaster,
    private multiUserService: MultiUserService
  ) {}

  ngOnInit(): void {
    this.statusOptions = ['open', 'done'];
    //this.selected = this.selectTasks[0];
    /**toggle selection item based on task ops */
    if (this.operationName === 'Edit TaskList') {
      console.debug('ops edit tasklist::', this.selectTasks);
      this.toggleTaskList = true;
      this.toggleTasks = true;
      this.toggleStatusSelection = true;
    }
    if (this.operationName === 'Edit Task') {
      console.debug('ops edit task::', this.selectTasksList);
      console.debug('ops edit task');
      /*this.selectTasksList.map((list) => {
        if (list.taskListId === this.taskListId) {
          console.debug('taskname::', list.name);
          this.selectedTask = list.name;
        }
      });*/
      this.toggleTaskList = false;
      this.toggleTasks = true;
      //console.debug('selected value::', this.selectedTask);
    }
    if (this.operationName === 'Edit SubTask') {
      console.debug('ops edit subtask::', this.selectTasks);
      console.debug('ops edit subtasks');
      this.toggleTaskList = true;
      this.toggleTasks = false;
      this.getAllTask();
    }
  }
  /**fetch all tasks for selection use while updating subtasks */
  public getAllTask(): any {
    let taskInfo = {
      taskListId: this.taskListId,
      userId: this.userId,
    };
    console.debug('input:', taskInfo);
    this.taskService.getTasks(taskInfo).subscribe(
      (response) => {
        console.debug('get all task res::', response.message);
        /**updated tasks */
        this.selectTasks = response.data;
        console.debug('All tasks::', this.selectTasks);
        this.selectTasks.map((list) => {
          if (list.taskId === this.taskId) {
            console.debug('taskfor subtask::', list.taskId);
            this.selected = list.taskId;
          }
        });
        console.debug('selected task::', this.selected);
      },
      (error) => {
        console.warn('Error::', error.error);
      }
    );
  }
  public editTask(): any {
    console.debug('editing task');
    /**create a single task */
    console.debug('operation::', this.operationName);
    if (this.operationName.endsWith('Edit Task')) {
      console.debug('edit task');
      let taskInfo = {
        taskListId: this.taskListId,
        taskId: this.taskId,
        userId: this.userId,
        operation: 'edit',
        update: {
          name: this.name,
          status: this.status,
          taskListId: this.selectedTask,
        },
      };
      console.debug('update taskinfo::', taskInfo);
      this.taskService.updateTask(taskInfo).subscribe(
        (response) => {
          console.debug('update task response::', response.message);

          /**New task Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.editTaskResponse = response.message;
            console.debug('emitt new task change', response.data);
            /**notify tasklist component for task updates */
            let refreshUserId;
            if (this.flagOperationForFriend) {
              refreshUserId = this.userId;
            } else {
              refreshUserId = this.loggedInUser;
            }
            console.debug('refreshing for::', refreshUserId);
            this.notifyEditTask.emit(refreshUserId);
            /**emit update notifiation to friends if any*/
            let notification = `${this.username} updated a Task`;
            this.notifyFriends(notification);
            /**emit close modal event */
            this.closeModal.emit();
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.editTaskResponse = error.error.message;
          console.debug('resposen::', this.editTaskResponse);

          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
    if (this.operationName.includes('Edit SubTask')) {
      console.debug('edit new subtask');
      let taskInfo = {
        taskId: this.taskId,
        subTaskId: this.subTaskId,
        operation: 'edit',
        userId: this.userId,
        update: {
          name: this.name,
          status: this.status,
          taskId: this.selected,
        },
      };
      console.debug('subtaskinfor::', taskInfo);
      this.taskService.updateSubTask(taskInfo).subscribe(
        (response) => {
          console.debug('update task response::', response.message);
          /**subtask update success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.editTaskResponse = response.message;
            let refreshUserId;
            if (this.flagOperationForFriend) {
              refreshUserId = this.userId;
            } else {
              refreshUserId = this.loggedInUser;
            }
            this.notifyEditSubTask.emit(refreshUserId);
            /**emit update notifiation to friends if any*/
            let notification = `${this.username} updated a SubTask`;
            this.notifyFriends(notification);
            /**emit close modal event */
            this.closeModal.emit();
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.editTaskResponse = error.error.message;
          console.debug('resposen-subtask::', this.editTaskResponse);
          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
    if (this.operationName.includes('Edit TaskList')) {
      console.debug('update tasklist');
      let taskListInfo = {
        userId: this.userId,
        taskListId: this.taskListId,
        operation: 'edit',
        update: {
          name: this.name,
        },
      };
      this.taskService.updateTaskList(taskListInfo).subscribe(
        (response) => {
          console.debug('update tasklist  response::', response.message);

          /**New subtask update success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.editTaskResponse = response.message;
            console.debug('emmit  tasklist edit');
            this.notifyEditTaskList.emit(
              `${this.name + ':' + this.taskListId}`
            );
            /**emit update notifiation to friends if any*/
            let notification = `${this.username} updated a TaskList`;
            this.notifyFriends(notification);

            /**emit close modal event */
            this.closeModal.emit();
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while update*/
          this.errorResponse = false;
          this.editTaskResponse = error.error.message;
          console.debug('resposen-taklist::', this.editTaskResponse);
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
