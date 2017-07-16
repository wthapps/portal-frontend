import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { UserContact } from '../../../core/shared/models/user/user-contact.model';
import { PartialsProfileContactComponent } from '../../../core/partials/profile/contact/contact.component';
import { PartialsProfileAvatarInfoComponent } from '../../../core/partials/profile/avatar-info/avatar-info.component';
import { PartialsProfileEmailComponent } from '../../../core/partials/profile/email/email.component';
import { PartialsProfilePhoneComponent } from '../../../core/partials/profile/phone/phone.component';
import { PartialsProfileAddressComponent } from '../../../core/partials/profile/address/address.component';
import { PartialsProfileMediaComponent } from '../../../core/partials/profile/media/media.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-new-contact',
  templateUrl: 'new-contact.component.html',
  styleUrls: ['new-contact.component.css']
})
export class ZNewContactComponent implements OnInit {
  profileConfig: any = {getCurrentUser: false, createNew: true, callApiAfterChange: false};
  data: UserContact = new UserContact();
  @ViewChild('avatar') avatar: PartialsProfileAvatarInfoComponent;
  @ViewChild('contact') contact: PartialsProfileContactComponent;
  @ViewChild('email') email: PartialsProfileEmailComponent;
  @ViewChild('phone') phone: PartialsProfilePhoneComponent;
  @ViewChild('address') address: PartialsProfileAddressComponent;
  @ViewChild('media') media: PartialsProfileMediaComponent;

  constructor(private route: ActivatedRoute, private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {

  }

  done() {
    this.apiBaseService.post(`contact/contacts`, this.avatar.data).subscribe((res: any) => {
      console.log(res);
    });
  }

  doEvent(e: any) {
    // console.log(">>>>>", this.data);
  }
}
