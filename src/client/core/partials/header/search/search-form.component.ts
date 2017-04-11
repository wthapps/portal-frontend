import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, ViewChild } from '@angular/core';
import { PhotoSearchFormComponent } from './photo-search-form.component';
import { Constants } from '../../../shared/config/constants';

@Component({
  moduleId: module.id,
  selector: 'search-form',
  templateUrl: 'search-form.component.html',
  entryComponents: [
    PhotoSearchFormComponent,
  ]
})

export class SearchFormComponent implements OnInit, AfterViewInit {
  @ViewChild('searchContainer', { read: ViewContainerRef }) searchContainer: ViewContainerRef;
  constants:any;

  constructor(private resolver: ComponentFactoryResolver) {
    this.constants = Constants;
  }

  ngOnInit() {
    if (this.constants.search.config.globalActive) {
      this.searchContainer.clear();
      let factory:any = this.resolver.resolveComponentFactory(PhotoSearchFormComponent);
      this.searchContainer.createComponent(factory);
    }
  }

  ngAfterViewInit() {
  //
  }
}
