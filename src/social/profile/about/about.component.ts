import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZSocialProfileService } from '../profile.service';
import { ZSocialProfileFormAboutComponent } from '../form/about.component';
import { ZSocialProfileFormContactComponent } from '../form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from '../form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from '../form/interest.component';
import { ZSocialPrivacyComponent } from './components/privacy.component';
import { ZSocialProfileDataService } from '../profile-data.service';
import { Constants } from '@wth/shared/constant';

declare let _: any;

@Component({

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
  data:any;

  constructor(private profileDataService: ZSocialProfileDataService,
              ) {
  }

  ngOnInit() {
    this.profileDataService.profileData$.subscribe((res: any) => {
      this.data = res.userInfo;
      this.actions = res.actions;
    });
  }

  onUpdateProfile(event: any) {
    this.profileDataService.updateData({userInfo: event});
  }
}
