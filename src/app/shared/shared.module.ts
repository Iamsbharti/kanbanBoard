import { NgModule } from '@angular/core';
import { CommonModule, FormatWidth } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TasklistComponent } from '../task/tasklist/tasklist.component';
import { TaskModule } from '../task/task.module';
import { CreateTaskComponent } from './create-task/create-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { MultiuserModule } from '../multiuser/multiuser.module';
@NgModule({
  declarations: [CreateTaskComponent, EditTaskComponent],
  imports: [CommonModule, FormsModule, MultiuserModule],
  exports: [CreateTaskComponent, EditTaskComponent],
  providers: [TasklistComponent],
})
export class SharedModule {}
