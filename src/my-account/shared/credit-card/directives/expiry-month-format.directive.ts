import {
  Directive,
  ElementRef
} from '@angular/core';

declare const Payment: any;

@Directive({
  selector: '[wccmonth]'
})
export class CCExpiryMonthFormatDirective {

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;
    Payment.restrictNumeric(element);
  }

}
