import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { ZSocialProfileService } from '../profile.service';
import { ZSocialProfileFormAboutComponent } from '../form/about.component';
import { ZSocialProfileFormContactComponent } from '../form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from '../form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from '../form/interest.component';
import { Constants } from '../../../../shared/config/constants';
import { ZSocialPrivacyComponent } from './components/privacy.component';

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

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private socialProfileService: ZSocialProfileService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.socialService.user.get(this.uuid).subscribe(
        (res: any) => {
          console.log(res);
          this.userInfo = res.data;
          this.actions = res.actions;
        }
      );
      // this.socialProfileService.getInfo().subscribe(
      //  (res: any) => {
      //  console.log(res);
      //  this.userInfo = res;
      //  }
      //  )
    });

  }

  onUpdated(userInfo:any) {
    this.userInfo = userInfo;
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
