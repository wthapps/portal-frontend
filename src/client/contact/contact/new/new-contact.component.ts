import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserContact } from '../../../core/shared/models/user/user-contact.model';
import { PartialsProfileAvatarInfoNameOnlyComponent } from '../../../core/shared/components/profile/avatar-info/avatar-info-name-only.component';
import { PartialsProfileContactComponent } from '../../../core/shared/components/profile/contact/contact.component';
import { PartialsProfileEmailComponent } from '../../../core/shared/components/profile/email/email.component';
import { PartialsProfilePhoneComponent } from '../../../core/shared/components/profile/phone/phone.component';
import { PartialsProfileAddressComponent } from '../../../core/shared/components/profile/address/address.component';
import { PartialsProfileMediaComponent } from '../../../core/shared/components/profile/media/media.component';
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
  @ViewChild('avatar') avatar: PartialsProfileAvatarInfoNameOnlyComponent;
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
    //
    console.log(this.avatar.data);
    this.apiBaseService.post(`contact/contacts`, this.avatar.data).subscribe((res: any) => {
      console.log(res);
    });
    // console.log(this.email.data);
    // console.log(this.phone.data);
    // console.log(this.address.data);
    // console.log(this.media.data);
  }
}
