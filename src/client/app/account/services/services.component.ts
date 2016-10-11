import {
  Component,
  OnInit
}                       from '@angular/core';
import {
  ServicesService
}                       from './services.service';

import {
  Action
}                       from './services.model';

import {
  AddOnItemComponent
}                       from './addon-item.component';
import {
  DnsItemComponent
}                       from './dns-item.component';

@Component({
  moduleId: module.id,
  templateUrl: 'services.component.html',
  directives: [
    AddOnItemComponent,
    DnsItemComponent
  ]
})

export class AccountServicesListComponent implements OnInit {
  panelTitle: string = 'Find Services or Add-ons';
  apps: any = [];
  original_apps: any = [];
  categories: any = [];
  selected_category: any = 0;
  actions: Action[] = [];

  constructor( private appsService: ServicesService) {
  }

  ngOnInit():void {
    this.actions.push(new Action(0, 'Manage', '/account/dns', true));
    this.actions.push(new Action(2, 'Add', '', true));
    this.actions.push(new Action(3, 'Create', '', true));
    this.actions.push(new Action(4, 'Cancel', '', true));
    this.actions.push(new Action(5, 'Manage', '/account/dns', true));

    this.appsService.getCategories().subscribe(
      response => {
        this.categories = response;
      },
      error => {
        console.log(error);
      }
    );

    this.appsService.getAddonServices().subscribe(
      response => {
        this.apps = response;
        this.original_apps = response;
      },
      error => {
        console.log(error);
      }
    );

  }

  onAction(action: Action) {
    console.log('action:', action);
  }

  onCategoryChanged(category_id: number) {
    this.apps = this.original_apps;
  }
}
