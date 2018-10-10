import { Directive, ElementRef } from '@angular/core';

import * as Payment from 'payment';

@Directive({
  selector: '[wcccvc]'
})
export class CCCvcFormatDirective {

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;

    Payment.formatCardCVC(element);
    Payment.restrictNumeric(element);
  }

}
