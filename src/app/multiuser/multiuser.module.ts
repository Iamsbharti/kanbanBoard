import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendListComponent } from './friend-list/friend-list.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { MultiUserService } from './multi-user.service';

@NgModule({
  declarations: [FriendListComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'friendlist', component: FriendListComponent, pathMatch: 'full' },
    ]),
  ],
  exports: [FriendListComponent],
  providers: [MultiUserService],
})
export class MultiuserModule {}
