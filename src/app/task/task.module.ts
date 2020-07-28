import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { TasklistComponent } from './tasklist/tasklist.component';
import { TasklistService } from './tasklist.service';

@NgModule({
  declarations: [TasklistComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'taskList', component: TasklistComponent, pathMatch: 'full' },
    ]),
  ],
  providers: [TasklistService],
})
export class TaskModule {}
