import { Component, OnInit, Input } from '@angular/core';
import { ZContactService } from '../services/contact.service';

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

  toogleFavorite() {
    this.contactService.updateContact(this.data, {favorite: !this.data.favorite}).subscribe((res: any) => {
      this.data = res.data;
      console.log(res);
    })
  }
}
