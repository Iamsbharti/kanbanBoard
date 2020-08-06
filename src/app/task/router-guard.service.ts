import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router/';
import { Cookie } from 'ng2-cookies';
@Injectable({
  providedIn: 'root',
})
export class RouterGuardService {
  constructor(private router: Router) {}
  canActivate(router: ActivatedRouteSnapshot): boolean {
    console.log('Guard Route');
    let authToken = Cookie.get('authToken');
    if (authToken == null || authToken == undefined || authToken == '') {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
