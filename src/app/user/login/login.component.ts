import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { UserService } from '../user.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public email: String;
  public password: String;
  public loginResponse: String;

  constructor(
    private userService: UserService,
    private _router: Router,
    private toaster: Toaster
  ) {}

  ngOnInit(): void {}

  //login
  public loginUser(): any {
    let userData = {
      email: this.email,
      password: this.password,
    };
    this.userService.loginService(userData).subscribe(
      /**Handle sucess */
      (response) => {
        console.log('Login service res', response);
        this.loginResponse = response.message;

        /**get user info from response and store as cookie for auth*/
        const { firstName, lastName, email, userId, authToken } = response.data;
        Cookie.set('name', firstName + ' ' + lastName);
        Cookie.set('authToken', authToken);
        Cookie.set('email', email);
        Cookie.set('userId', userId);

        /**Set to localstorage */
        this.userService.setAuthenticatedUser(response.data);

        /**toast sucess */
        this.toaster.open({ text: response.message, type: 'success' });

        /**Redirect to TASK View */
        setTimeout(() => this._router.navigate(['/taskList']), 3000);
      },
      /**handle errors */
      (error) => {
        console.warn('Error Login', error);
        this.loginResponse = error.error.message;
        this.toaster.open({ text: 'Login error', type: 'danger' });
      }
    );
  }
}
