import { NgModule } from '@angular/core';
import { AutofocusInputDirective } from './autofocus.directive';
import { DisplayAsHtmlDirective } from './display-as-html.directive';
import { ImgFullDirective } from './img-full.directive';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { TextAreaAutoHeightDirective } from './textarea-autoheight.directive';
import { ShiftEnterDirective } from './shiftEnter.directive';
import { ContentEditableDirective } from './contenteditable.directive';


@NgModule({
  declarations: [
    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    ScrollToBottomDirective,
    TextAreaAutoHeightDirective,
    ShiftEnterDirective,
    ContentEditableDirective
  ],
  exports: [
    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    ScrollToBottomDirective,
    TextAreaAutoHeightDirective,
    ShiftEnterDirective,
    ContentEditableDirective
  ]
})
export class DirectiveModule {
}
