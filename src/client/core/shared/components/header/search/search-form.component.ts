import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { PhotoSearchFormComponent } from './photo-search-form.component';
import { SocialSearchFormComponent } from './social-search-form.component';
import { ChatSearchFormComponent } from './chat-search-form.component';
import { ServiceManager } from '../../../services/service-manager';
import { ContactSearchFormComponent } from './contact-search-form.component';

@Component({
  moduleId: module.id,
  selector: 'search-form',
  templateUrl: 'search-form.component.html',
  entryComponents: [
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    ContactSearchFormComponent,
    ChatSearchFormComponent
  ]
})

export class SearchFormComponent implements OnInit {
  @ViewChild('searchContainer', {read: ViewContainerRef}) searchContainer: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver,
              private serviceManager: ServiceManager) {
  }

  ngOnInit() {
    if (this.serviceManager.getConstants().search.config.globalActive) {
      if (this.serviceManager.getConfig().SUB_DOMAIN.APP != document.location.origin) {
        this.searchContainer.clear();
        let factory: any;
        if (this.serviceManager.getConfig().SUB_DOMAIN.MEDIA == document.location.origin) {
          factory = this.resolver.resolveComponentFactory(PhotoSearchFormComponent);
          this.searchContainer.createComponent(factory);
        }
        if (this.serviceManager.getConfig().SUB_DOMAIN.SOCIAL == document.location.origin) {
          factory = this.resolver.resolveComponentFactory(SocialSearchFormComponent);
          this.searchContainer.createComponent(factory);
        }
        if (this.serviceManager.getConfig().SUB_DOMAIN.CHAT == document.location.origin) {
          factory = this.resolver.resolveComponentFactory(ChatSearchFormComponent);
          this.searchContainer.createComponent(factory);
        }
        if (this.serviceManager.getConfig().SUB_DOMAIN.CONTACT == document.location.origin) {
          factory = this.resolver.resolveComponentFactory(ContactSearchFormComponent);
          this.searchContainer.createComponent(factory);
        }
      }
    }
  }
}
