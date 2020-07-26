import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RecoverpasswordComponent } from './recoverpassword/recoverpassword.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [LoginComponent, SignupComponent, RecoverpasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: 'recoverPassword',
        component: RecoverpasswordComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [UserService],
})
export class UserModule {}
