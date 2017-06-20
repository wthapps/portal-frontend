import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyToValuePipe } from './keyToValue.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { MaxLengthPipe } from './max-length.pipe';
import { FileSizePipe } from './file-size.pipe';
import { GroupByMonthYearPipe } from './groupby-month-year.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    GroupByMonthYearPipe,
    LinkifyPipe
  ],
  exports: [
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    GroupByMonthYearPipe,
    LinkifyPipe
  ],
  providers: []
})

export class PipeModule {
}
