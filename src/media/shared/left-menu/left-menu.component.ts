import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Constants } from '@shared/constant/config/constants';

@Component({
  selector: 'z-media-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZMediaSharedLeftMenuComponent implements OnInit, OnDestroy {
  mediaMenu = Constants.pictureMenuItems;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  doEvent(event: any) {

  }


  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }
}
