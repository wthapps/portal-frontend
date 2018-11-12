import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[href="#"]'
})
export class HrefDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.preventDefault();
  }
}
