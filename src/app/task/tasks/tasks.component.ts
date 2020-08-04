import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { MultiUserService } from '../../multiuser/multi-user.service';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  @Input() taskListId: any;
  @Input() userId: any;
  @Input() name: any;
  @Input() loggedInUser: any;
  @Input() flagOperationForFriend: any;
  //component will emitt
  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  delete: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  edit: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  editSTask: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  notifyForSTaskDelete: EventEmitter<String> = new EventEmitter<String>();

  public tasks: [Object];
  public toggleCreateTaskForm: Boolean = false;
  constructor(
    private taskService: TasklistService,
    private _toast: Toaster,
    private multiUserService: MultiUserService
  ) {}
  ngOnInit(): void {
    this.getAllTask(this.taskListId, this.userId);
  }
  public getAllTask(taskListId, userId): any {
    let taskInfo = {
      taskListId: this.taskListId,
      userId: this.userId,
    };
    //console.log('input:', taskInfo);
    this.taskService.getTasks(taskInfo).subscribe(
      (response) => {
        console.log('get all task res::', response.message);
        /**updated tasks */
        this.tasks = response.data;
        //console.log('All tasks::', this.tasks);
      },
      (error) => {
        console.warn('Error::', error.error);
      }
    );
  }
  /**toggle create task pop up */
  public openCreateTaskForm(taskListId): any {
    this.toggleCreateTaskForm = !this.toggleCreateTaskForm;
    console.log('Tasklist id after popup::', taskListId);
    this.taskListId = taskListId;
  }
  /**Reload tasklist post task new create */
  public addNewTask(newTask): any {
    console.log('newtask in task component::', newTask);
    return this.tasks.push(newTask);
  }
  /**emitt subtask creation */
  public emitSubTaskCreation(taskId): any {
    console.log('Emit creation');
    this.notify.emit(taskId);
  }
  /**emit subtask deletion */
  public emitTaskDeletion(taskId, taskListId, userId): any {
    console.log('Emit deletetion', taskId, taskListId, userId);
    this.delete.emit(`${taskId}:${taskListId}:${userId}`);
  }
  /**emit edit subtask*/
  public editSubTask(values, taskListId): any {
    console.log('Emit edit subtask:', values);
    this.editSTask.emit(`${values}:${taskListId}`);
  }
  /**emit edit task event */
  public emitEditTask(taskId, name, taskListId, status): any {
    console.log('Emit edit task::', taskId, name, taskListId);
    this.edit.emit(`${taskId}:${name}:${taskListId}:${status}`);
  }
  /**delete sub task */
  public deleteSubTask(values): any {
    console.log('Delete task listeners::', values, this.userId);
    /**call delete service */
    let [taskId, subTaskId] = values.split(':');
    console.log(subTaskId, taskId);
    let taskInfo = {
      subTaskId: subTaskId,
      taskId: taskId,
      operation: 'delete',
      userId: this.userId,
    };
    this.taskService.updateSubTask(taskInfo).subscribe(
      (response) => {
        console.log('Delete api reponse::', response);
        /**success toast  */
        this._toast.open({ text: response.message, type: 'success' });
        /**refresh for specific user */
        let refreshUserId;
        if (this.flagOperationForFriend) {
          refreshUserId = this.userId;
        } else {
          refreshUserId = this.loggedInUser;
        }
        console.log('refreshing for::', refreshUserId);
        this.getAllTask(refreshUserId, taskId);
        this.notifyForSTaskDelete.emit();
      },
      (error) => {
        console.log('Error Deleting Task::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
}
