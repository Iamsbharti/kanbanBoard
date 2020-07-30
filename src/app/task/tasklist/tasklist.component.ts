import { Component, OnInit } from '@angular/core';
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
  public taskLists: any;
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
    console.log('taskList', this.taskLists);
  }
  /**open modal */
  open(content, ops, id) {
    console.log('modal open::', ops, id);
    this.operationName = ops;
    switch (ops) {
      case ops === 'New Task':
        this.taskListId = id;
        break;
      case ops === 'New SubTask':
        this.taskId = id;
        break;
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
        this.taskLists = response.data;
        /**toast */
        this._toast.open({ text: response.message, type: 'success' });
        //console.log('taskList', this.taskLists);
      },
      (error) => {
        console.warn('Error fetching task list', error, error);
        this.fetchedAlltaskLists = error.error.message;
        this._toast.open({ text: error.error.message, type: 'danger' });
      }
    );
  }

  /**Reload tasklist post task new create */
  public reloadTaskList(modal): any {
    this.getAllTaskList();
    /**toggle modal */
  }
  /**toggle create subtask popup */
  public openCreateSubTaskForm(taskId, modal): any {
    console.log('Emit from task component::', taskId);
    //open modal (click)="open(createModal, 'Create New Task', list.taskListId)"
    this.taskId = taskId;
    this.open(modal, 'New SubTask', taskId);
  }
  /**reload task */
  public reloadTasks(): any {
    console.log('reload tasks');
    this.getAllTaskList();
  }
}
//(click)="openCreateTaskListForm()"
