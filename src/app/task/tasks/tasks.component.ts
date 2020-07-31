import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  @Input() taskListId: any;
  @Input() userId: any;
  @Input() name: any;

  //component will emitt
  @Output()
  notify: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  delete: EventEmitter<String> = new EventEmitter<String>();

  public tasks: [Object];
  public toggleCreateTaskForm: Boolean = false;
  constructor(private taskService: TasklistService, private _toast: Toaster) {}
  ngOnInit(): void {
    this.getAllTask();
  }
  public getAllTask(): any {
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
  public emitTaskDeletion(taskId, taskListId): any {
    console.log('Emit deletetion', taskId, taskListId);
    this.delete.emit(`${taskId}:${taskListId}`);
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
    };
    this.taskService.updateSubTask(taskInfo).subscribe(
      (response) => {
        console.log('Delete api reponse::', response.message);
        /**success toast  */
        this._toast.open({ text: response.message, type: 'success' });
        this.getAllTask();
      },
      (error) => {
        console.log('Error Deleting Task::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
}
