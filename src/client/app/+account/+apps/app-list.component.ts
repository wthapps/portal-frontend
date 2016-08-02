import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {
  AppCardMdComponent,
  AppCardSmComponent,
  IAppCard
} from '../../partials/index';


@Component({
  moduleId: module.id,
  templateUrl: 'app-list.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AppCardMdComponent,
    AppCardSmComponent
  ]
})

export class AccountAppsListComponent {
  pageTitle: string = '';

  apps: IAppCard = {
    id: 1,
    img: 'assets/images/apps/icon.png',
    name: 'name name',
    category: 'category category',
    flatform: ['windows', 'apple', 'browser']
  };

  constructor(private router: Router) {
  }

  onAppCardClicked(id: number): void {
    this.router.navigateByUrl(`/account/apps/${id}`);
  }
}
