import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasklistService } from '../tasklist.service';

@Component({
  selector: 'app-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.css'],
})
export class SubtasksComponent implements OnInit {
  //init field
  @Input() taskId: any;
  public subtasks: any;
  constructor(private taskService: TasklistService) {}

  ngOnInit(): void {
    this.getAllSubTasks();
  }
  public getAllSubTasks(): any {
    let taskInfo = {
      taskId: this.taskId,
    };
    this.taskService.getSubTasks(taskInfo).subscribe(
      (response) => {
        /**get subtasks */
        console.log('Subtasks Response::', response.message);
        if (response.status === 200) this.subtasks = response.data;
      },
      (error) => {
        console.warn('Error fetching Subtasks:', error.error);
      }
    );
  }
}
