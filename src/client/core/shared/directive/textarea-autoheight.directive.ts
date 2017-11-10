import {
  Directive, ElementRef, Renderer, OnInit, AfterViewInit, HostListener, HostBinding,
  Input, AfterContentChecked
} from '@angular/core';

declare var $: any;
declare var _: any;

@Directive({
  selector: '[textAreaAutoHeight]'
})
export class TextAreaAutoHeightDirective implements AfterContentChecked {
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  constructor(public element: ElementRef) {

  }

  ngAfterContentChecked(): void {
    this.adjust();
  }

  adjust(): void {
    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.style.height = 'auto';
    this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + 'px';
  }
}

