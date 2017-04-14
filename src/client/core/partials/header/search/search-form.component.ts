import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, ViewChild } from '@angular/core';
import { PhotoSearchFormComponent } from './photo-search-form.component';
import { ServiceManager } from '../../../shared/services/service-manager';

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

  constructor(private resolver: ComponentFactoryResolver, private serviceManager: ServiceManager) {
  }

  ngOnInit() {
    if (this.serviceManager.getConstants().search.config.globalActive) {
      if (this.serviceManager.getConfig().SUB_DOMAIN.APP != document.location.origin) {
        this.searchContainer.clear();
        let factory:any = this.resolver.resolveComponentFactory(PhotoSearchFormComponent);
        this.searchContainer.createComponent(factory);
      }
    }
  }

  ngAfterViewInit() {
  //
  }
}
