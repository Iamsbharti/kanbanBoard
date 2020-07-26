import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router } from '@angular/router';
import lookup from 'country-code-lookup';
let n = require('country-js');
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
  public signUpResponse: String;
  public countries = [];
  public country: any;
  public countrycode: any;
  constructor(
    private userService: UserService,
    private _router: Router,
    private _toaster: Toaster
  ) {}

  ngOnInit(): void {
    /**Compute list of countries */
    Object.entries(lookup.countries).map((entry) =>
      this.countries.push(entry[1].country)
    );
    console.log(this.countries);
  }
  public selectCountryCode(value): any {
    //console.log('select code:', `+${n.search(value)[0].phone}`);
    this.countrycode = `+${n.search(value)[0].phone}`;
    //console.log('cc::', this.countrycode);
    this.mobile = this.countrycode;
  }
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
    this.userService.signUpService(newuser).subscribe(
      (response) => {
        console.log('Sign up response', response);
        this.signUpResponse = `${response.message}, Redirecting to Login`;

        /**Toast sucess */
        this._toaster.open({ text: response.message, type: 'success' });

        /**Route to Login page */
        setTimeout(() => this._router.navigate(['/login']), 2000);
      },
      (error) => {
        console.warn('SignUpError', error.error);
        console.log('error_msg', error.error.message);
        this.signUpResponse = error.error.message;
        this._toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
}
