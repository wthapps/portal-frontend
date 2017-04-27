import { Directive, ElementRef, Renderer, OnInit, AfterViewInit, HostListener } from '@angular/core';

@Directive({
  selector: '[imgFull]'
})
export class ImgFullDirective implements OnInit, AfterViewInit {

  aspectRatioWindow: number = 1;
  aspectRatioImg: number = 1;


  @HostListener('window:resize', ['$event']) onResize(event: any) {
    console.log(event.target.innerWidth);
    console.log(event.target.innerHeight);

    this.aspectRatioWindow = this.getAspectRatio(window.innerWidth, window.innerHeight);
    this.setClass(this.aspectRatioWindow, this.aspectRatioImg);
  }

  @HostListener('load', ['$event.target']) onLoad(event: any) {
    this.aspectRatioImg = this.getAspectRatio(event.naturalWidth, event.naturalHeight);
    this.setClass(this.aspectRatioWindow, this.aspectRatioImg);
  }

  constructor(private el: ElementRef, private renderer: Renderer) {
    this.aspectRatioWindow = this.getAspectRatio(window.innerWidth, window.innerHeight);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  private getAspectRatio(w: any, h: any) {
    return w / h;
  }

  private setClass(win: any, img: any) {
    if (win >= img) {
      this.renderer.setElementClass(this.el.nativeElement, 'img-full-height', true);
      this.renderer.setElementClass(this.el.nativeElement, 'img-full-width', false);
    } else {
      this.renderer.setElementClass(this.el.nativeElement, 'img-full-height', false);
      this.renderer.setElementClass(this.el.nativeElement, 'img-full-width', true);
    }
  }
}
