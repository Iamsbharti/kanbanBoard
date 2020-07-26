import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ToastConfig, Toaster } from 'ngx-toast-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.component.html',
  styleUrls: ['./recoverpassword.component.css'],
})
export class RecoverpasswordComponent implements OnInit {
  /**define fields */
  public email: String;
  public validEmail: Boolean;
  public recoveryMessage: String;
  public showResetPassword: Boolean;
  public hideRecoveryDiv: Boolean = false;
  public code: String;
  public password: String;
  public cfnpassword: String;
  public equalPwd: Boolean = false;
  public acceptedPwd: Boolean = false;
  public resetResponse: String;
  constructor(
    private _userService: UserService,
    private _toaster: Toaster,
    private _router: Router
  ) {}

  ngOnInit(): void {
    /**Validate password */
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
  /**send Recovery code */
  public sendRecoveryCode(): any {
    let user = {
      email: this.email,
    };
    console.log('Send recovery ccode-service call', user);
    this._userService.recoverPassword(user).subscribe(
      (response) => {
        console.log('Recovery response', response);
        /**Toast */
        this._toaster.open({ text: response.message, type: 'success' });
        this.recoveryMessage = response.data.Operation;
        if (response.status === 200) this.showResetPassword = true;
      },
      (error) => {
        console.warn('Error', error.error);
        this._toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
  /**Reset Password */
  public resetPassword(): any {
    console.log('reset Password');
    let resetInfo = {
      email: this.email,
      recoveryCode: this.code,
      password: this.password,
    };
    this._userService.resetPassword(resetInfo).subscribe(
      (response) => {
        console.log('reset api res', response);
        this.resetResponse = response.message;
        this._toaster.open({ text: response.message, type: 'success' });
        if (response.status === 200) this.hideRecoveryDiv = true;
      },
      (error) => {
        console.warn('Error', error.error);
        this.resetResponse = error.error.message;
        this._toaster.open({ text: error.error.message, type: 'danger' });
      }
    );
  }
}
