import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyToValuePipe } from './keyToValue.pipe';
import { LinkifyPipe } from './linkify.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeyToValuePipe,
    LinkifyPipe
  ],
  exports: [
    KeyToValuePipe,
    LinkifyPipe
  ],
  providers: []
})

export class PipeModule {
}
