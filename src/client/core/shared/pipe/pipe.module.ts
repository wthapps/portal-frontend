import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyToValuePipe } from './keyToValue.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { MaxLengthPipe } from './max-length.pipe';
import { FileSizePipe } from './file-size.pipe';
import { GroupByMonthYearPipe } from './groupby-month-year.pipe';
import { BytesPipe } from './bytes.pipe';
import { SafeHtmlPipe } from './safeHtml.pipe';
import { TimeFormatPipe } from './time-format.pipe';
import { PhoneCodeCountriesPipe, PhoneCodeFlagPipe, PhoneCodeToDisplayCodePipe } from './phone-to-flag.pipe';

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
    TimeFormatPipe,
    LinkifyPipe,
    PhoneCodeCountriesPipe,
    PhoneCodeToDisplayCodePipe,
    PhoneCodeFlagPipe
  ],
  exports: [
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    GroupByMonthYearPipe,
    BytesPipe,
    SafeHtmlPipe,
    TimeFormatPipe,
    LinkifyPipe,
    PhoneCodeCountriesPipe,
    PhoneCodeToDisplayCodePipe,
    PhoneCodeFlagPipe
  ],
  providers: []
})

export class PipeModule {
}
