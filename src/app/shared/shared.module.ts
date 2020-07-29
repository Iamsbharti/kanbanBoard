import { NgModule } from '@angular/core';
import { CommonModule, FormatWidth } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TasklistComponent } from '../task/tasklist/tasklist.component';
import { TaskModule } from '../task/task.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule],
  exports: [],
  providers: [TasklistComponent],
})
export class SharedModule {}
