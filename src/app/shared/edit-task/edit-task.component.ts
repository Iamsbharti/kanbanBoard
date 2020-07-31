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
  /**subtask field */
  @Input() subTaskName: any;
  @Input() taskId: any;

  public createNewtaskResponse: String;
  public errorResponse: Boolean = true;
  public successResponse: Boolean = true;

  //component will emit tasklist reload

  @Output()
  notifyEditTaskList: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyEditTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyEditSubTask: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(private taskService: TasklistService, private _toast: Toaster) {}

  ngOnInit(): void {}
  public editTask(): any {}
}
