import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';

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
  /**task field */
  @Input() taskListId: any;

  /**tasklist field */
  @Input() taskListName: any;
  @Input() taskLists: [];
  /**subtask field */
  @Input() subTaskName: any;
  @Input() taskId: any;

  public createNewtaskResponse: String;
  public errorResponse: Boolean = true;
  public successResponse: Boolean = true;
  public tasklist: any;
  public toggleTaskList: Boolean = false;
  //component will emit tasklist reload

  @Output()
  notifyEditTaskList: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyEditTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyEditSubTask: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(private taskService: TasklistService, private _toast: Toaster) {}

  ngOnInit(): void {
    if (this.operationName === 'Edit TaskList') {
      this.toggleTaskList = true;
    }
  }

  public editTask(): any {
    console.log('editing task');
    /**create a single task */
    console.log('operation::', this.operationName);
    if (this.operationName.endsWith('Edit Task')) {
      console.log('edit task');
      let taskInfo = {
        taskListId: this.taskListId,
        userId: this.userId,
        name: this.name,
        status: 'open',
      };
      console.log('taskinfo::', taskInfo);
      this.taskService.createTask(taskInfo).subscribe(
        (response) => {
          console.log('Create task response::', response.message);

          /**New task Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.createNewtaskResponse = response.message;
            console.log('emitt new task change', response.data);
            this.notifyEditTask.emit(response.data);
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
    if (this.operationName.includes('Edit SubTask')) {
      console.log('create new subtask');
      let taskInfo = {
        taskId: this.taskId,
        name: this.name,
        status: 'open',
      };
      console.log('subtaskinfor::', taskInfo);
      this.taskService.createSubTask(taskInfo).subscribe(
        (response) => {
          console.log('Create task response::', response.message);

          /**New subtask Create success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.createNewtaskResponse = response.message;
            //this.notifyNewTaskList.emit(response.data);
            this.notifyEditSubTask.emit(response.data);
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
    if (this.operationName.includes('Edit TaskList')) {
      console.log('update tasklist');
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
          console.log('update tasklist  response::', response.message);

          /**New subtask update success */
          if (response.status === 200) {
            this._toast.open({ text: response.message, type: 'success' });
            this.errorResponse = false;
            this.successResponse = true;
            this.createNewtaskResponse = response.message;
            console.log('emmit  tasklist edit');
            setTimeout(() => this.notifyEditTaskList.emit(response.data), 130);
          }
        },
        (error) => {
          console.warn('Error::', error.error);
          /**compute any error while update*/
          this.errorResponse = false;
          this.createNewtaskResponse = error.error.message;
          console.log('resposen-taklist::', this.createNewtaskResponse);
          this._toast.open({ text: error.error.message, type: 'danger' });
        }
      );
    }
  }
}
