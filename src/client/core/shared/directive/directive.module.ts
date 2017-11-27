import { NgModule } from '@angular/core';
import { AutofocusInputDirective } from './autofocus.directive';
import { DisplayAsHtmlDirective } from './display-as-html.directive';
import { ImgFullDirective } from './img-full.directive';
import { TextAreaAutoHeightDirective } from './textarea-autoheight.directive';
import { CommentAutoHeightDirective } from './comment-autoheight.directive';
import { ShiftEnterDirective } from './shiftEnter.directive';
import { ContentEditableDirective } from './contenteditable.directive';
import { ScrollDirectiveModule } from './scroll/scroll.directive.module';


@NgModule({
  imports: [
    ScrollDirectiveModule
  ],
  declarations: [
    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    TextAreaAutoHeightDirective,
    CommentAutoHeightDirective,
    ShiftEnterDirective,
    ContentEditableDirective
  ],
  exports: [
    ScrollDirectiveModule,

    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    TextAreaAutoHeightDirective,
    CommentAutoHeightDirective,
    ShiftEnterDirective,
    ContentEditableDirective
  ]
})
export class DirectiveModule {
}
