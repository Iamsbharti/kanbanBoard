import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import {} from '../../multiuser/multiuser.module';
@Component({
  selector: 'app-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.css'],
})
export class SubtasksComponent implements OnInit {
  //init field
  @Input() taskId: any;
  @Input() userId: any;
  public subtasks: [Object];
  constructor(private taskService: TasklistService) {}
  @Output()
  delete: EventEmitter<String> = new EventEmitter<String>();
  @Output()
  edit: EventEmitter<String> = new EventEmitter<String>();
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
        //console.debug('Subtasks Response::', response.message);
        if (response.status === 200) this.subtasks = response.data;
      },
      (error) => {
        console.warn('Error fetching Subtasks:', error.error);
      }
    );
  }
  public addNewSubTask(newSubTask): any {
    //console.debug('New sub task in subtask component::', newSubTask);
    this.subtasks.push(newSubTask);
  }
  /**emit subtask deletion */
  public emitSubTaskDeletion(taskId, subTaskId): any {
    //console.debug('Emit sub task deletetion', taskId, subTaskId);
    this.delete.emit(`${taskId}:${subTaskId}`);
  }
  /**emit subtask edit */
  public emitEditSubTask(taskId, name, subTaskId, status): any {
    //console.debug('Emit edit sub task::', taskId, name, subTaskId);
    this.edit.emit(`${taskId}:${name}:${subTaskId}:${status}`);
  }
}
