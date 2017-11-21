import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupByPipe } from './groupby.pipe';
import { GroupByObjectTypePipe } from './groupby-object-type.pipe';
import { GroupByMonthYearPipe } from './groupby-month-year.pipe';
import { NewlinePipe } from './newline.pipe';
import { UrlTransformPipe } from './url.pipe';
import { ShowLengthTransformPipe } from './show-length.pipe';
import { ConvertByPatternPipe } from './convert.pipe';
import { WthFilterByPipe } from './wthFilterBy.pipe';
import { ArrayLengthPipe } from './array-length.pipe';
import { TitleCasePipe } from './titlecase.pipe';
import { KeyToValuePipe } from './keyToValue.pipe';
import { MaxLengthPipe } from './max-length.pipe';
import { FileSizePipe } from './file-size.pipe';
import { BytesPipe } from './bytes.pipe';
import { SafeHtmlPipe } from './safeHtml.pipe';
import { TimeFormatPipe } from './time-format.pipe';
import { LinkifyPipe } from './linkify.pipe';
import { PhoneCodeCountriesPipe, PhoneCodeFlagPipe, PhoneCodeToDisplayCodePipe } from './phone-to-flag.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GroupByPipe,
    GroupByObjectTypePipe,
    GroupByMonthYearPipe,
    NewlinePipe,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    ConvertByPatternPipe,
    WthFilterByPipe,
    ArrayLengthPipe,
    TitleCasePipe,
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    BytesPipe,
    SafeHtmlPipe,
    TimeFormatPipe,
    LinkifyPipe,
    PhoneCodeCountriesPipe,
    PhoneCodeFlagPipe,
    PhoneCodeToDisplayCodePipe
  ],
  exports: [
    GroupByPipe,
    GroupByObjectTypePipe,
    GroupByMonthYearPipe,
    NewlinePipe,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    ConvertByPatternPipe,
    WthFilterByPipe,
    ArrayLengthPipe,
    TitleCasePipe,
    KeyToValuePipe,
    MaxLengthPipe,
    FileSizePipe,
    BytesPipe,
    SafeHtmlPipe,
    TimeFormatPipe,
    LinkifyPipe,
    PhoneCodeCountriesPipe,
    PhoneCodeFlagPipe,
    PhoneCodeToDisplayCodePipe
  ],
  providers: []
})

export class PipeModule {
}
