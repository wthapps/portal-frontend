import {
  Directive,
  ElementRef
} from '@angular/core';

declare const Payment: any;

@Directive({
  selector: '[wccyear]'
})
export class CCExpiryYearFormatDirective {

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;

    Payment.restrictNumeric(element);

  }

}
