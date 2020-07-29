import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasklistService } from '../../task/tasklist.service';

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

  public tasks: any;
  public toggleCreateTaskForm: Boolean = false;
  constructor(private taskService: TasklistService) {}
  ngOnInit(): void {
    this.getAllTask();
  }
  public getAllTask(): any {
    let taskInfo = {
      taskListId: this.taskListId,
      userId: this.userId,
    };
    console.log('input:', taskInfo);
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
  public reloadTaskList(): any {
    this.getAllTask();
    /**toggle pop up */
    this.toggleCreateTaskForm = !this.toggleCreateTaskForm;
  }
  /**emitt subtask creation */
  public emitSubTaskCreation(taskId): any {
    this.notify.emit(taskId);
  }
}
