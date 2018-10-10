import {
  Directive,
  ElementRef
} from '@angular/core';

import * as Payment from 'payment';

@Directive({
  selector: '[wccmonth]'
})
export class CCExpiryMonthFormatDirective {

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;
    Payment.restrictNumeric(element);
  }

}
