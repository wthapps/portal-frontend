import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../shared/services/user.service';
import { Constants } from '../../../shared/config/constants';

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
  baseUrl:any =  Constants.baseUrls;

  constructor(private userService: UserService) {
    this.uuid = this.userService.getProfileUuid();
  }

  onMenu(event: string) {
    switch (event) {
      case 'media':
        if(!this.inSameModule(Constants.baseUrls.media))
          window.location.href = Constants.baseUrls.media;
        break;
      case 'social':
        if(!this.inSameModule(Constants.baseUrls.social))
          window.location.href = Constants.baseUrls.social;
        break;
      case 'chat':
        if(!this.inSameModule(Constants.baseUrls.chat))
          window.location.href = Constants.baseUrls.chat;
        break;
      default:
        break;
    }

    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  inSameModule(moduleFullName: string) {
    return window.location.origin === moduleFullName;
  }

}
