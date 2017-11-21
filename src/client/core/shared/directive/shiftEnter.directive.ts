import { Directive, ElementRef, Input, AfterContentChecked, HostListener } from '@angular/core';

@Directive({
  selector: '[shiftEnter]'
})
export class ShiftEnterDirective implements AfterContentChecked {
  @HostListener('keyup', ['$event.target'])
  onKeyup(event: any) {
    console.log(event);

    if (event.keyCode == 13 && event.shiftKey) {
      console.log(event);
      event.stopPropagation();
    }
  }

  constructor(public element: ElementRef) {

  }

  ngAfterContentChecked(): void {
    // this.adjust();
  }

}
