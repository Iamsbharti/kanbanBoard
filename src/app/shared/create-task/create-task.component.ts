import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  /**common input fields */
  @Input() userId: any;
  @Input() operationName: String;
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

  //component will emit tasklist reload
  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();
  constructor(private taskService: TasklistService, private _toast: Toaster) {}

  ngOnInit(): void {}
  /**create a single task */
  public createTask(): any {
    if (this.operationName.includes('Create New task')) {
      console.log('create new task');
      let taskInfo = {
        taskListId: this.taskListId,
        userId: this.userId,
        name: this.taskName,
        status: 'open',
      };
      console.log('taskinfor::', taskInfo);
      this.taskService.createTask(taskInfo).subscribe(
        (response) => {
          console.log('Create task response::', response.message);

          /**New task Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            setTimeout(() => this.notify.emit(), 1300);
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.log('resposen::', this.createNewtaskResponse);

          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
    if (this.operationName.includes('Create New SubTask')) {
      console.log('create new subtask');
      let taskInfo = {
        taskId: this.taskId,
        name: this.taskName,
        status: 'open',
      };
      console.log('subtaskinfor::', taskInfo);
      this.taskService.createSubTask(taskInfo).subscribe(
        (response) => {
          console.log('Create task response::', response.message);

          /**New subtask Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            setTimeout(() => this.notify.emit(), 1300);
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.log('resposen-subtask::', this.createNewtaskResponse);
          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
    if (this.operationName.includes('Create New TaskList')) {
      console.log('create new tasklist');
      let taskListInfo = {
        userId: this.userId,
        name: this.taskName,
      };
      this.taskService.createTaskList(taskListInfo).subscribe(
        (response) => {
          console.log('Create tasklist  response::', response.message);

          /**New subtask Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            setTimeout(() => this.notify.emit(), 1300);
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while */
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.log('resposen-taklist::', this.createNewtaskResponse);
          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
  }
  /**get all taskLists */
  public getAllTaskList(): any {
    let userdata = {
      userId: this.userId,
    };
    this.taskService.getTaskLists(userdata).subscribe(
      (response) => {
        console.log('get all task list', response.message);
        //this.fetchedAlltaskLists = response.message;
        /**store all tasklists */
        this.taskService = response.data;
        /**toast */
        this._toast.open({ text: response.message, type: 'success' });
        console.log('taskList', this.taskService);
      },
      (error) => {
        console.warn('Error fetching task list', error, error);
        //this.fetchedAlltaskLists = error.error.message;
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
}
