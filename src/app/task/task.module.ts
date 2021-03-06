import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { TasklistComponent } from './tasklist/tasklist.component';
import { TasklistService } from './tasklist.service';
import { SharedModule } from '../shared/shared.module';
import { TasksComponent } from './tasks/tasks.component';
import { SubtasksComponent } from './subtasks/subtasks.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiuserModule } from '../multiuser/multiuser.module';
import { RouterGuardService } from './router-guard.service';
@NgModule({
  declarations: [TasklistComponent, TasksComponent, SubtasksComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    NgbModule,
    MultiuserModule,
    RouterModule.forRoot([
      {
        path: 'taskList',
        component: TasklistComponent,
        pathMatch: 'full',
        canActivate: [RouterGuardService],
      },
    ]),
  ],
  providers: [TasklistService, RouterGuardService],
  exports: [TasksComponent, SubtasksComponent, TasklistComponent],
})
export class TaskModule {}
