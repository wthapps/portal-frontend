import { Component, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Constants } from '@shared/constant';

@Component({
  selector: 'w-left-menu',
  templateUrl: 'w-left-menu.component.html',
  styleUrls: ['w-left-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WLeftMenuComponent implements OnInit {
  @Input() hideFooter: boolean;

  currentVersion: string = Constants.currentVersion;
  constants: any;

  constructor(private renderer: Renderer2) {
    this.constants = Constants;
  }

  ngOnInit() {
  }

  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }
}

