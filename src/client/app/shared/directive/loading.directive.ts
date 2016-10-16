import {Renderer, ElementRef, Directive, Input, OnInit, OnChanges} from "@angular/core";

@Directive({
  selector:	`[loading]`
})

export	class	LoadingDirective implements OnInit, OnChanges {
  @Input() loading: boolean;
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
    this.renderer.setElementClass(this.el.nativeElement, "inside-loading", this.loading);
  }
}
