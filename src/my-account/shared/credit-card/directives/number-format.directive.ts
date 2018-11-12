import {
  Directive,
  ElementRef,
  HostListener, Renderer
} from '@angular/core';

declare const Payment: any;

@Directive({
  selector: '[wccnumber]'
})
export class CCNumberFormatDirective {

  cardType: string;

  constructor(private renderer: Renderer, private el: ElementRef) {

    const element   = this.el.nativeElement;
    this.cardType = '';

    Payment.formatCardNumber(element);
    Payment.restrictNumeric(element);
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {

    const element 	  = this.el.nativeElement;
    const elementValue  = element.value;

    this.cardType = Payment.fns.cardType(elementValue);

    if ( this.cardType !== '' ) {
      this.renderer.setElementClass(element, this.cardType, false);
    } else {
      this.cardType = '';
    }
  }

}

