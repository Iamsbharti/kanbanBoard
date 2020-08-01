import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import '@angular/compiler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserModule } from './user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { TaskModule } from './task/task.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiuserModule } from './multiuser/multiuser.module';
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    TaskModule,
    SharedModule,
    NgbModule,
    FormsModule,
    MultiuserModule,
    BrowserAnimationsModule,
    ToastNotificationsModule.forRoot({
      duration: 2000,
      type: 'primary',
      autoClose: true,
      position: 'top-right',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
