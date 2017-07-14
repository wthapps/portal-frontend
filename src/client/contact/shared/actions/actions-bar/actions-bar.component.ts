import { Component, Input } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { Router } from '@angular/router';
import { Config } from '../../../../core/shared/config/env.config';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-actions-bar',
  templateUrl: 'actions-bar.component.html'
})
export class ZContactSharedActionsBarComponent {

  constructor(private contactService: ZContactService) {

  }

  @Input() data: any;

  toogleFavourite() {
    this.contactService.updateContact(this.data, {favourite: !this.data.favourite}).subscribe((res: any) => {
      this.data = res.data;
    })
  }

  gotoSocial() {
    window.location.href = Config.SUB_DOMAIN.SOCIAL;
  }

  gotoChat() {
    window.location.href = Config.SUB_DOMAIN.CHAT;
  }
}
