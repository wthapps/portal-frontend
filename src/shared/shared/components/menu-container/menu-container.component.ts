import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-menu-container',
  template: `<ng-content></ng-content>`,
  styleUrls: ['menu-container.component.scss']
})

export class MenuContainerComponent implements OnInit {

  constructor(public elementRef: ElementRef, public renderer: Renderer2) { }

  ngOnInit() { }
}
