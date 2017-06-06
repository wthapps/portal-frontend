import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyToValuePipe } from './keyToValue.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeyToValuePipe
  ],
  exports: [
    KeyToValuePipe
  ],
  providers: []
})

export class PipeModule {
}
