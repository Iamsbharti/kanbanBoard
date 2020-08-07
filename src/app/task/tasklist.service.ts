import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class TasklistService {
  //initialize
  public baseurl = 'http://localhost:4201/api/v1';
  private socket;
  private socketUrl = 'http://localhost:4201/multiusers';
  constructor(private _http: HttpClient, private userService: UserService) {
    /**init client socket */
    this.socket = io(this.socketUrl, {
      'auto connect': true,
      multiplex: false,
      'try multiple transports': true,
    });
  }
  /**define listeners and emitters */
  /**1: Listen to authentication handshake */
  public autheticateUser = () => {
    console.debug('Auth user listener');
    return Observable.create((observer) => {
      this.socket.on('authenticate', (data) => {
        observer.next(data);
      });
    });
  };
  /**2 send/emit authToken for authentication */
  public setUser = (authToken) => {
    console.debug('Emmit user authentication');
    this.socket.emit('set-user', authToken);
  };
  /**3 Get Online Userlist by listning to online-users broadcase */
  public getOnlineUserList = () => {
    //console.debug('get online user service');
    return Observable.create((observer) => {
      this.socket.on('online-users', (data) => {
        observer.next(data);
      });
    });
  };
  //handle exceptions
  public handleError(error: HttpErrorResponse) {
    console.debug('Http Error:', error.message);
    return Observable.throw(error.message);
  }
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.userService.getAutheticatedUserInfo().authToken,
    }),
  };

  //create taskList
  public createTaskList(taskListData): any {
    console.debug('https header:', this.httpHeaderOptions);
    let createTaskListRes = this._http.post(
      `${this.baseurl}/createTaskList`,
      taskListData,
      this.httpHeaderOptions
    );
    return createTaskListRes;
  }
  //get taskLists for a userId
  public getTaskLists(userId, skip): any {
    let allTaskLists = this._http.post(
      `${this.baseurl}/getAllTaskList/?skip=${skip}`,
      userId,
      this.httpHeaderOptions
    );
    return allTaskLists;
  }
  //created task
  public createTask(taskDetails): any {
    //console.debug('create task service:', taskDetails);
    let createTaskRes = this._http.post(
      `${this.baseurl}/createTask`,
      taskDetails,
      this.httpHeaderOptions
    );
    return createTaskRes;
  }
  //get tasks for a tasklist and userid
  public getTasks(taskData): any {
    let allTasks = this._http.post(
      `${this.baseurl}/getTasks`,
      taskData,
      this.httpHeaderOptions
    );
    return allTasks;
  }
  //create subtask for a taskid
  public createSubTask(subTaskDetails): any {
    let createSubTaskRes = this._http.post(
      `${this.baseurl}/createSubTask`,
      subTaskDetails,
      this.httpHeaderOptions
    );
    return createSubTaskRes;
  }
  //get subtask for a taskid
  public getSubTasks(subTaskDetails): any {
    let allSubTasks = this._http.post(
      `${this.baseurl}/getSubTasks`,
      subTaskDetails,
      this.httpHeaderOptions
    );
    return allSubTasks;
  }
  /**update task */
  public updateTask(taskInfo): any {
    //console.debug('update task sevice::', taskInfo);
    let udpatedTask = this._http.post(
      `${this.baseurl}/updateTask`,
      taskInfo,
      this.httpHeaderOptions
    );
    return udpatedTask;
  }
  /**update/delete tasklist */
  public updateTaskList(taskListInfo): any {
    console.debug('update tasklist service:');
    return this._http.post(
      `${this.baseurl}/updatetaskList`,
      taskListInfo,
      this.httpHeaderOptions
    );
  }
  /**update/delete subtask */
  public updateSubTask(subTaskInfo): any {
    console.debug('update subtask  servcie');
    return this._http.post(
      `${this.baseurl}/updateSubTask`,
      subTaskInfo,
      this.httpHeaderOptions
    );
  }
  /**revert changes */
  public revertLatestChange(userId): any {
    console.debug('reverting changes::for', userId);
    return this._http.post(
      `${this.baseurl}/revertChanges`,
      userId,
      this.httpHeaderOptions
    );
  }
}
