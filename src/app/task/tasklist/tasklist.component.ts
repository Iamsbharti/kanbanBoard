import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TasklistService } from '../tasklist.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router, Route } from '@angular/router';
import { UserService } from '../../user/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
})
export class TasklistComponent implements OnInit {
  //init fields
  public taskLists: [Object];
  public tasks: any;
  public subtasks: any;
  public fetchedAlltaskLists: String;
  public userId: String;
  /**new task info */
  public subTaskName: String;
  public taskListId: String;
  public taskStatus: String;
  public taskId: String;
  public operationName: String;
  public closeResult: string;
  /**edit */
  public name: String;
  /**component will emit event ot update
   * task and subtask array in their respective compoenents
   */
  @Output()
  notifyNewTaskList: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyNewTask: EventEmitter<Object> = new EventEmitter<Object>();
  @Output()
  notifyNewSubTask: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(
    private taskListService: TasklistService,
    private _toast: Toaster,
    private _router: Router,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    this.userId = userService.getAutheticatedUserInfo().userId;
  }

  ngOnInit(): void {
    //load task list on component load
    this.getAllTaskList();
    console.log('taskList', typeof this.taskLists);
  }
  /**open modal */
  open(content, ops, id) {
    console.log('modal open::', ops, id);
    this.operationName = ops;
    console.log(ops == 'New Task');
    if (ops == 'New Task') {
      console.log('new task case');
      this.taskListId = id;
    }
    if (ops == 'New SubTask') {
      console.log('new subtask case');
      this.taskId = id;
    }

    console.log('tasklistid::', this.taskListId);
    console.log('taskid::', this.taskId);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-create' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
    console.log('Modal closed::', this.closeResult);
  }
  /**open edit modal */
  openEdit(content, ops, id, name) {
    console.log('modal edit open::', ops, id);
    this.operationName = ops;
    console.log(ops == 'Edit Task');
    if (ops == 'Edit TaskList') {
      console.log('Edit TaskList case');
      this.taskListId = id;
      this.name = name;
    }
    if (ops == 'Edit SubTask') {
      console.log('edit subtask case');
      this.taskId = id;
      this.name = name;
    }

    console.log('tasklistid::', this.taskListId);
    console.log('taskid::', this.taskId);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-edit' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed`;
        }
      );
    console.log('Modal closed::', this.closeResult);
  }

  /**Create task List */
  public createTaskList(): any {
    let taskListData = {};
    this.taskListService.createTaskList(taskListData).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  /**get all taskLists */
  public getAllTaskList(): any {
    let userdata = {
      userId: this.userId,
    };
    this.taskListService.getTaskLists(userdata).subscribe(
      (response) => {
        console.log('get all task list', response.message);
        this.fetchedAlltaskLists = response.message;
        /**store all tasklists */
        console.log('tasklists return::', response.data);
        this.taskLists = response.data;
        /**toast */
        //this._toast.open({ text: response.message, type: 'success' });
        //console.log('taskList', this.taskLists);
      },
      (error) => {
        console.warn('Error fetching task list', error, error);
        this.fetchedAlltaskLists = error.error.message;
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }

  /**listen for newly created task list and push it to existing array */
  public addNewTaskList(newTaskList: any): any {
    console.log('reloading');
    let { taskListId, subTaskId, taskId } = newTaskList;
    console.log(newTaskList);
    //this.notifyNewTask.emit(newTaskList);
    console.log('tasklist iddd', taskListId);
    console.log('get all list call');
    //this.getAllTaskList();
    return this.taskLists.push(newTaskList);
  }
  /**listen for newly created task  and emitt event to update it */
  public addNewTask(newTask: any): any {
    console.log('addnew task listeners::', newTask);
    console.log(typeof newTask);
    //this.getAllTaskList();
    this.notifyNewTask.emit(newTask);
  }
  /**listen for newly created task list and emit event to update it */
  public addNewSubTask(newSubTask: any): any {
    console.log(typeof newSubTask);
    console.log(newSubTask);
    this.getAllTaskList();
    this.notifyNewSubTask.emit(newSubTask);
  }

  /**toggle create subtask popup */
  public openCreateSubTaskForm(taskId, modal): any {
    console.log('Emit from task component::', taskId);
    //open modal (click)="open(createModal, 'Create New Task', list.taskListId)"
    this.taskId = taskId;
    this.open(modal, 'New SubTask', taskId);
  }
  /**reload task */
  public reloadTask(load): any {
    console.log('reload tasks', load);
    this.getAllTaskList();
  }
  public getAllTask(taskListId): any {
    let taskInfo = {
      taskListId: taskListId,
      userId: this.userId,
    };
    console.log('input-reload task:', taskInfo);
    this.taskListService.getTasks(taskInfo).subscribe(
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
  /**delete task listeners*/
  public deleteTask(values): any {
    console.log('Delete task listeners::', values, this.userId);
    /**call delete service */
    let [taskId, taskListId] = values.split(':');
    console.log(taskListId, taskId);
    let taskInfo = {
      taskListId: taskListId,
      taskId: taskId,
      userId: this.userId,
      operation: 'delete',
    };
    this.taskListService.updateTask(taskInfo).subscribe(
      (response) => {
        console.log('Delete api reponse::', response.message);
        /**success toast  */
        this._toast.open({ text: response.message, type: 'success' });
        this.getAllTaskList();
      },
      (error) => {
        console.log('Error Deleting Task::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**delete tasklist */
  public deleteTaskList(taskListId): any {
    console.log('delete tasklist::', taskListId);
    let taskListInfo = {
      userId: this.userId,
      taskListId: taskListId,
      operation: 'delete',
    };
    this.taskListService.updateTaskList(taskListInfo).subscribe(
      (response) => {
        console.log('Delete task list response::', response.message);
        this._toast.open({ text: response.message, type: 'success' });
        this.getAllTaskList();
      },
      (error) => {
        console.log('Error deleting tasklist::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**edit task list */
  public editTaskList(taskListId, modal): any {
    /**open modal to take edited input */
    this.open(modal, 'Edit TaskList', taskListId);
    console.log('delete tasklist::', taskListId);
    let taskListInfo = {
      userId: this.userId,
      taskListId: taskListId,
      name: name,
      operation: 'edit',
    };
    this.taskListService.updateTaskList(taskListInfo).subscribe(
      (response) => {
        console.log('Delete task list response::', response.message);
        this._toast.open({ text: response.message, type: 'success' });
        this.getAllTaskList();
      },
      (error) => {
        console.log('Error deleting tasklist::', error.error);
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }

  public editTaskLists(value): any {
    console.log('edit tasklist listener');
    this.getAllTaskList();
  }
  public editTask(value): any {}
  public editSubTask(value): any {}
}
//(click)="openCreateTaskListForm()"
