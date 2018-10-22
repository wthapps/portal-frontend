import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[imgAlign]'
})
export class ImgAlignDirective {

  @HostListener('load', ['$event.target']) onLoad(event: any) {
    this.setClass(event.naturalWidth, event.naturalHeight);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  private setClass(w: any, h: any) {
    if (w / h >= 1) {
      this.renderer.removeClass(this.el.nativeElement, 'img-vertical');
      this.renderer.addClass(this.el.nativeElement, 'img-horizontal');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'img-vertical');
      this.renderer.removeClass(this.el.nativeElement, 'img-horizontal');
    }
  }
}
