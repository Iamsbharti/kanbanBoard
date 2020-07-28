import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class TasklistService {
  //initialize
  public baseurl = 'http://localhost:4201/api/v1';
  public authToken: String;
  constructor(private _http: HttpClient, private userService: UserService) {}

  //handle exceptions
  public handleError(error: HttpErrorResponse) {
    console.log('Http Error:', error.message);
    return Observable.throw(error.message);
  }
  public httpHeaderOptions = {
    headers: new HttpHeaders({
      authToken: this.userService.getAutheticatedUserInfo().authToken,
    }),
  };

  //create taskList
  public createTaskList(taskListData): any {
    console.log('https header:', this.httpHeaderOptions);
    let createTaskListRes = this._http.post(
      `${this.baseurl}/createTaskList`,
      taskListData,
      this.httpHeaderOptions
    );
    return createTaskListRes;
  }
  //get taskLists for a userId
  public getTaskLists(userId): any {
    let allTaskLists = this._http.post(
      `${this.baseurl}/getAllTaskList`,
      userId,
      this.httpHeaderOptions
    );
    return allTaskLists;
  }
  //created task
  public createTask(taskDetails): any {
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
}
