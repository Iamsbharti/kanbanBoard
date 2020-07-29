import { NgModule } from '@angular/core';
import { CommonModule, FormatWidth } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TasklistComponent } from '../task/tasklist/tasklist.component';
import { TaskModule } from '../task/task.module';
import { CreateTaskComponent } from './create-task/create-task.component';

@NgModule({
  declarations: [CreateTaskComponent],
  imports: [CommonModule, FormsModule],
  exports: [CreateTaskComponent],
  providers: [TasklistComponent],
})
export class SharedModule {}
