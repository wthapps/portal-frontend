import { NgModule } from '@angular/core';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';


@NgModule({
  declarations: [
    ScrollToBottomDirective
  ],
  exports: [
    ScrollToBottomDirective
  ]
})
export class ScrollDirectiveModule {
}
