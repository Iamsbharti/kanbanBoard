import { Component } from '@angular/core';
import { MultiUserService } from './multiuser/multi-user.service';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'kanbanBoard';
  constructor(
    private multiUserService: MultiUserService,
    private _router: Router
  ) {}
  public userLogout(): any {
    console.log('user logout');
    this.multiUserService.disconnectUser(Cookie.get('userId'));
    /**redirect to login page */
    setTimeout(() => this._router.navigate(['/login']), 130);
  }
}
