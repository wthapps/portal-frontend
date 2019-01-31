/**
 *
 <div class="dropdown" (click)="openDropdown()" (clickElseWhere)="closeDropdown()">
   <!-- child dropdown elements here -->
 </div>

 <div class="dropdown" (click)="openDropdown()" clickElseWhere (clickOff)="closeDropdown()">
   <!-- child dropdown elements here -->
 </div>
 */

import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[clickElseWhere]' })
export class ClickElseWhereDirective {
  @Output() clickElseWhere = new EventEmitter<MouseEvent>();

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Check if the click was outside the element
    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {

      this.clickElseWhere.emit(event);
    }
  }
}
