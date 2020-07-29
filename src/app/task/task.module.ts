import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { TasklistComponent } from './tasklist/tasklist.component';
import { TasklistService } from './tasklist.service';
import { SharedModule } from '../shared/shared.module';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
  declarations: [TasklistComponent, TasksComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot([
      { path: 'taskList', component: TasklistComponent, pathMatch: 'full' },
    ]),
  ],
  providers: [TasklistService],
  exports: [TasksComponent],
})
export class TaskModule {}
