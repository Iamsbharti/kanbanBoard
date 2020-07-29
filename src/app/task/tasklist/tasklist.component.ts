import { Component, OnInit } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router, Route } from '@angular/router';
import { UserService } from '../../user/user.service';
@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
})
export class TasklistComponent implements OnInit {
  //init fields
  public taskLists: any;
  public tasks: any;
  public subtasks: any;
  public fetchedAlltaskLists: String;
  public userId: String;
  public toggleCreateTaskForm: Boolean = false;
  constructor(
    private taskListService: TasklistService,
    private _toast: Toaster,
    private _router: Router,
    private userService: UserService
  ) {
    this.userId = userService.getAutheticatedUserInfo().userId;
  }

  ngOnInit(): void {
    //load task list on component load
    this.getAllTaskList();
    console.log('taskList', this.taskLists);
  }

  /**Create task List */
  public createTaskList(): any {
    let taskListData = {};
    this.taskListService.createTaskList(taskListData).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  /**get all taskLists */
  public getAllTaskList(): any {
    let userdata = {
      userId: this.userId,
    };
    this.taskListService.getTaskLists(userdata).subscribe(
      (response) => {
        console.log('get all task list', response.message);
        this.fetchedAlltaskLists = response.message;
        /**store all tasklists */
        this.taskLists = response.data;
        /**toast */
        this._toast.open({ text: response.message, type: 'success' });
        console.log('taskList', this.taskLists);
      },
      (error) => {
        console.warn('Error fetching task list', error, error);
        this.fetchedAlltaskLists = error.error.message;
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**open create task pop up */
  public openCreateTaskForm(taskListId, userId): any {
    this.toggleCreateTaskForm = !this.toggleCreateTaskForm;
  }
  /**create a single task */
  public createTask(taskDetails): any {
    let taskInfo = {
      taskListData: taskDetails.taskListId,
      userId: taskDetails.userId,
    };
    this.taskListService.createTask(taskInfo).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  /**create subtask for a task */
  public createSubTask(): any {
    let subTaskInfo = {};
    this.taskListService.createSubTask(subTaskInfo).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  /**get all subtasks for a task */
  public getAllSubTasks(): any {
    let subTaskInfo = {};
    this.taskListService.getSubTasks(subTaskInfo).subscribe(
      (response) => {},
      (error) => {}
    );
  }
}
