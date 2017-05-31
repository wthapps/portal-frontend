import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { keyToValuePipe } from './keyToValue.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    keyToValuePipe
  ],
  exports: [
    keyToValuePipe
  ],
  providers: []
})

export class PipeModule {
}
