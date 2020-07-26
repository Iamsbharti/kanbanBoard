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
  public equalPwd: Boolean = false;
  public acceptedPwd: Boolean = false;
  constructor(
    private userService: UserService,
    private _router: Router,
    private _toaster: Toaster
  ) {}

  ngOnInit(): void {}
  /**compare password */
  public comparePassword(): Boolean {
    this.equalPwd = this.password === this.cfnpassword;
    return this.equalPwd;
  }
  public validatePassword(): Boolean {
    let pattern = new RegExp('^[A-Za-z0-9]\\w{8,64}$');
    if (this.password === undefined) return true;
    this.acceptedPwd = pattern.test(this.password.toString());
    return this.acceptedPwd;
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
