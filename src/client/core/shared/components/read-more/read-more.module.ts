import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadMoreComponent }   from './read-more.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ReadMoreComponent],
  exports: [ReadMoreComponent],
  providers: [],
})
export class ReadMoreModule {
}
