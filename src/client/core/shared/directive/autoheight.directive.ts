import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: 'autoheight'
})

export class AutoHeightDirective {

  constructor(private element: ElementRef) {
    console.log('inside AutoHeight Directive:::', element);
  }
  // ngAfterContentChecked(): void{
  //   this.adjust();
  // }
  // adjust(): void{
  //   this.element.nativeElement.style.overflow = 'hidden';
  //   this.element.nativeElement.style.height = 'auto';
  //   this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
  // }
}
