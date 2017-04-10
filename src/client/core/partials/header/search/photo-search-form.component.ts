import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ViewChild } from '@angular/core/src/metadata/di';
import { Constants } from '../../../shared/config/constants';

@Component({
  moduleId: module.id,
  templateUrl: 'photo-search-form.component.html',
})

export class PhotoSearchFormComponent {
  text: any;
  active: any;
  constants:any;

  constructor() {
    this.constants = Constants;
    this.active = this.constants.search.config.photoActive;
  }
}
