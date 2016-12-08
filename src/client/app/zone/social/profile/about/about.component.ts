import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { ZSocialProfileService } from '../profile.service';
import { ZSocialProfileFormAboutComponent } from '../form/about.component';
import { ZSocialProfileFormContactComponent } from '../form/contact.component';
import { ZSocialProfileFormWorkEduComponent } from '../form/work-edu.component';
import { ZSocialProfileFormInterestComponent } from '../form/interest.component';

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

  uuid: any;
  userInfo: any = {};

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseServiceV2,
              private socialProfileService: ZSocialProfileService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      /*this.socialService.user.get(this.uuid).subscribe(
       (res: any) => {
       console.log(res);
       this.userInfo = res.data;
       }
       )*/
      this.socialProfileService.getInfo().subscribe(
        (res: any) => {
          console.log(res);
          this.userInfo = res;
        }
      )
    });
  }

  onEditAbout() {
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
