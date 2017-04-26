import { Directive, ElementRef, Renderer, OnInit, AfterViewInit, } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class Autofocus implements OnInit, AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
  }
}
