import { Component, OnDestroy, OnInit } from '@angular/core';
import { Constants } from '@shared/constant/config/constants';

@Component({
  selector: 'z-media-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZMediaSharedLeftMenuComponent implements OnInit, OnDestroy {
  mediaMenu = Constants.pictureMenuItems;

  constructor() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  doEvent(event: any) {

  }
}
