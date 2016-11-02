import { Component, ViewChild } from '@angular/core';
import { SoPhotoSelectionComponent } from './post/index';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-temp',
  templateUrl: 'social-temp.component.html'
})

export class ZSocialTempComponent {
  @ViewChild('photoselection') photoSelection: SoPhotoSelectionComponent;
  constructor() {
  }
}
