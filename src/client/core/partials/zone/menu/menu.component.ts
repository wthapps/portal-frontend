import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../shared/services/user.service';
import { Constants } from '../../../shared/config/constants';
import { WTHNavigateService } from '../../../shared/services/wth-navigate.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-shared-menu',
  templateUrl: 'menu.component.html'
})

export class ZSharedMenuComponent {

  uuid: string;
  urls: any = [];
  mediaMenu = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;

  constructor(private userService: UserService,
              private navigateService: WTHNavigateService) {
    this.uuid = this.userService.getProfileUuid();
  }

  onMenu(event: string) {

    this.navigateService.navigateOrRedirect('', event);
    // $(event.target.nextElementSibling).toggleClass('hidden');
  }


}
