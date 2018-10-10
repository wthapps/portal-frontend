import {
  Directive,
  ElementRef
} from '@angular/core';

import * as Payment from 'payment';

@Directive({
  selector: '[wccdate]'
})
export class CCExpiryDateFormatDirective {

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;

    Payment.formatCardExpiry(element);
    Payment.restrictNumeric(element);
  }

  // @HostListener('keypress', ['$event']) onKeypress(e) {
  //
  //   const element 	  = this.el.nativeElement;
  //   const elementValue  = element.value;
  //   const elementInt  = +element.value;
  //
  //   if (elementInt === 0 || elementInt > 12) {
  //     element.value = elementValue[0];
  //   }
  //
  // }

}
