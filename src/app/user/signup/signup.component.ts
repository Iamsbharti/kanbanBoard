import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router } from '@angular/router';
import lookup from 'country-code-lookup';
import n from 'country-js';
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
  public countriesArray = [];
  public countries = [];
  public country: String;
  public countrycode: any;
  public ctr: String = 'country';
  public passwordError: String;
  constructor(
    private userService: UserService,
    private _router: Router,
    private _toaster: Toaster
  ) {
    this.passwordError = `Password should have at least 1 Lowercase,Uppercase,Special
    Character & of min length 8 `;
  }

  ngOnInit(): void {
    /**Compute list of countries */
    Object.entries(lookup.countries).map((entry) =>
      this.countriesArray.push(entry[1])
    );
    this.countriesArray.map((ctr) => {
      this.countries.push(ctr.country);
    });
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
    let pattern = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
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
        if (
          response.status === 400 &&
          response.data[0] === 'Invalid Password'
        ) {
          this.signUpResponse = this.passwordError;
        }
        if (response.status === 200) {
          this.signUpResponse = `${response.message}, Redirecting to Login`;
          /**Toast sucess */
          this._toaster.open({ text: response.message, type: 'success' });
          /**Route to Login page */
          setTimeout(() => this._router.navigate(['/login']), 2000);
        }
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
