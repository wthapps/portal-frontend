import { NgModule } from '@angular/core';
import { HrefDirective } from '@shared/shared/directive/href.directive';
import { ImgAlignDirective } from '@shared/shared/directive/img-align.directive';
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
    ImgAlignDirective,
    TextAreaAutoHeightDirective,
    CommentAutoHeightDirective,
    ShiftEnterDirective,
    ContentEditableDirective,
    HrefDirective
  ],
  exports: [
    ScrollDirectiveModule,

    AutofocusInputDirective,
    DisplayAsHtmlDirective,
    ImgFullDirective,
    ImgAlignDirective,
    TextAreaAutoHeightDirective,
    CommentAutoHeightDirective,
    ShiftEnterDirective,
    ContentEditableDirective,
    HrefDirective
  ]
})
export class DirectiveModule {
}
