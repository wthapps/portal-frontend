import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyToValuePipe } from './keyToValue.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { MaxLengthPipe } from './max-length.pipe';
import { FileSizePipe } from './file-size.pipe';
import { GroupByMonthYearPipe } from './groupby-month-year.pipe';
import { BytesPipe } from './bytes.pipe';
import { SafeHtmlPipe } from './safeHtml.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    GroupByMonthYearPipe,
    BytesPipe,
    SafeHtmlPipe,
    LinkifyPipe
  ],
  exports: [
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    GroupByMonthYearPipe,
    BytesPipe,
    SafeHtmlPipe,
    LinkifyPipe
  ],
  providers: []
})

export class PipeModule {
}
