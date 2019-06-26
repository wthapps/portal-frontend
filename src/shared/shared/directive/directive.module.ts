import { NgModule } from '@angular/core';
import { HrefDirective } from './href.directive';
import { ImgAlignDirective } from './img-align.directive';
import { AutofocusInputDirective } from './autofocus.directive';
import { DisplayAsHtmlDirective } from './display-as-html.directive';
import { ImgFullDirective } from './img-full.directive';
import { TextAreaAutoHeightDirective } from './textarea-autoheight.directive';
import { CommentAutoHeightDirective } from './comment-autoheight.directive';
import { ShiftEnterDirective } from './shiftEnter.directive';
import { ContentEditableDirective } from './contenteditable.directive';
import { ScrollDirectiveModule } from './scroll/scroll.directive.module';
import { ClickElseWhereDirective } from './click-else-where.directive';


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
    HrefDirective,
    ClickElseWhereDirective
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
    HrefDirective,
    ClickElseWhereDirective
  ]
})
export class DirectiveModule {
}
