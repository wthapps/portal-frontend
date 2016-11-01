import { Component, ViewChild } from '@angular/core';
import { SoPhotoSelectionComponent } from './post/index';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-social',
  templateUrl: 'social.component.html'
})

export class ZSocialComponent {
  @ViewChild('photoselection') photoSelection: SoPhotoSelectionComponent;
  constructor() {
  }
}
