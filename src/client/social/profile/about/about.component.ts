import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZSocialProfileService } from '../profile.service';
import { ZSocialProfileFormAboutComponent } from '../form/about.component';
import { ZSocialProfileFormContactComponent } from '../form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from '../form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from '../form/interest.component';
import { ZSocialPrivacyComponent } from './components/privacy.component';
import { Constants } from '../../../core/shared/config/constants';
import { SocialService } from '../../shared/services/social.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ZSocialProfileDataService } from '../profile-data.service';
declare let _ : any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-about',
  templateUrl: 'about.component.html'
})

export class ZSocialProfileAboutComponent implements OnInit {

  @ViewChild('modalAbout') modalAbout: ZSocialProfileFormAboutComponent;
  @ViewChild('modalContact') modalContact: ZSocialProfileFormContactComponent;
  @ViewChild('modalWorkEdu') modalWorkEdu: ZSocialProfileFormWorkEduComponent;
  @ViewChild('modalInterest') modalInterest: ZSocialProfileFormInterestComponent;

  @ViewChild('privacyUser') privacyUser: ZSocialPrivacyComponent;

  uuid: any;
  userInfo: any;
  constants = Constants;
  actions:any;

  constructor(private profileDataService: ZSocialProfileDataService
              ) {
  }

  ngOnInit() {
    this.profileDataService.profileData$.take(2).subscribe((res: any) => {
      this.userInfo = _.get(res, 'userInfo', '');
      this.actions = _.get(res, 'actions', []);
    });
  }

  onUpdated(userInfo:any) {
    this.userInfo = userInfo;
    this.profileDataService.addData({'userInfo': userInfo, 'actions' : this.actions} );
  }

  onEditAbout() {
    console.log(this.privacyUser);
    this.modalAbout.modal.open();
    return false;
  }

  onEditContact() {
    this.modalContact.modal.open();
    return false;
  }

  onEditWorkEdu() {
    this.modalWorkEdu.modal.open();
    return false;
  }

  onEditInterest() {
    this.modalInterest.modal.open();
    return false;
  }
}
