import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  /**Define fields */
  public firstName: String;
  public lastName: String;
  public email: String;
  public mobile: String;
  public password: String;
  public cfnpassword: String;
  constructor(
    private userService: UserService,
    private _router: Router,
    private _toaster: Toaster
  ) {}

  ngOnInit(): void {}
  /**compare password */
  public comparePassword(): Boolean {
    return this.password === this.cfnpassword;
  }
  /**Signup function */
  public signUpUser(): any {
    console.log('Signup user');
    let newuser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobile: this.mobile,
      password: this.password,
    };
  }
}
