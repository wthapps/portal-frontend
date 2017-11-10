import { NgModule } from '@angular/core';
import { AutofocusInputDirective } from './autofocus.directive';
import { DisplayAsHtmlDirective } from './display-as-html.directive';
import { ImgFullDirective } from './img-full.directive';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { TextAreaAutoHeightDirective } from './textarea-autoheight.directive';
import { ShiftEnterDirective } from './shiftEnter.directive';


@NgModule({
  declarations: [
    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    ScrollToBottomDirective,
    TextAreaAutoHeightDirective,
    ShiftEnterDirective
  ],
  exports: [
    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    ScrollToBottomDirective,
    TextAreaAutoHeightDirective,
    ShiftEnterDirective
  ]
})
export class DirectiveModule {
}
