import { Directive, ElementRef, Optional } from '@angular/core';
import { HdModalComponent } from '../components/modal';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  constructor(private el: ElementRef, @Optional() private modal: HdModalComponent) {
    if (modal) {
      this.modal.onOpen.subscribe(() => {
        this.el.nativeElement.focus();
      });
    }
  }
}
