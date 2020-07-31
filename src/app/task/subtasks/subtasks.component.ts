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
  public subtasks: [Object];
  constructor(private taskService: TasklistService) {}
  @Output()
  delete: EventEmitter<String> = new EventEmitter<String>();
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
  public addNewSubTask(newSubTask): any {
    console.log('New sub task in subtask component::', newSubTask);
    this.subtasks.push(newSubTask);
  }
  /**emit subtask deletion */
  public emitSubTaskDeletion(taskId, subTaskId): any {
    console.log('Emit sub task deletetion', taskId, subTaskId);
    this.delete.emit(`${taskId}:${subTaskId}`);
  }
}
