import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyToValuePipe } from './keyToValue.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { MaxLengthPipe } from './max-length.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeyToValuePipe,
    MaxLengthPipe,
    LinkifyPipe
  ],
  exports: [
    KeyToValuePipe,
    MaxLengthPipe,
    LinkifyPipe
  ],
  providers: []
})

export class PipeModule {
}
