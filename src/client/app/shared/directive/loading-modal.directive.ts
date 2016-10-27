import { Renderer, ElementRef, Directive, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: `[loadingModal]`
})

// TODO add more class
export class LoadingModalDirective implements OnInit, OnChanges {
  @Input() loadingModal: boolean;
  el: ElementRef;
  renderer: Renderer;

  constructor(el: ElementRef, renderer: Renderer) {
    this.el = el;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(changes: any) {
    this.render();
  }

  render() {
    this.renderer.setElementClass(this.el.nativeElement, 'modal-backdrop', this.loadingModal);
    this.renderer.setElementClass(this.el.nativeElement, 'in', this.loadingModal);
  }
}
