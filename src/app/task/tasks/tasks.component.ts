import { Component, OnInit, Input } from '@angular/core';
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
  public tasks: any;
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
        console.log('get all task res::', response);
        /**updated tasks */
        this.tasks = response.data;
        console.log('All tasks::', this.tasks);
      },
      (error) => {
        console.warn('Error::', error.error);
      }
    );
  }
}
