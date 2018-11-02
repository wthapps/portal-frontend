import { Directive, ElementRef } from '@angular/core';

declare const Payment: any;

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
