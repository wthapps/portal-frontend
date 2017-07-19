import { Component, OnInit, Input } from '@angular/core';
import { RouterLinkActive, Router } from '@angular/router';
import { ZContactService } from '../../services/contact.service';
import { Config } from '../../../../core/shared/config/env.config';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-actions-bar',
  templateUrl: 'actions-bar.component.html'
})
export class ZContactSharedActionsBarComponent {
  @Input() data: any;

  linkSocial: string = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  linkChat: string = `${Config.SUB_DOMAIN.CHAT}/conversations/`;

  constructor(private contactService: ZContactService, private router: Router) {

  }

  toggleFavourite() {
    // edit labels favourite instead of favourite attribute here

    // this.contactService.update(this.data, {favourite: !this.data.favourite}).then((res: any) => {
    //   this.data = res.data;
    // })
  }

  gotoSocial() {
    window.location.href = `${Config.SUB_DOMAIN.SOCIAL}/profile/${this.data.wthapps_user.uuid}`;
  }

  gotoChat() {
    window.location.href = `${Config.SUB_DOMAIN.CHAT}/conversations/${this.data.wthapps_user.id}`;
  }
}
