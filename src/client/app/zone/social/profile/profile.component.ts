import { Component, ViewChild, OnInit } from '@angular/core';
import { PostNewComponent } from '../post/index';
import { BaseZoneSocialHomePage } from "../base/base-social-home-page";

import { SocialService } from '../services/social.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile',
  templateUrl: 'profile.component.html'
})

export class ZSocialProfileComponent extends BaseZoneSocialHomePage implements OnInit {
  @ViewChild('postNew') postNew: PostNewComponent;

  userInfo: any = null;
  errorMessage: string = '';
  currentUserInfo: any = [];
  hasFriends: boolean = false;
  showFollow: boolean = false;

  requestStatus:number

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private userService: UserService) {
  }

  ngOnInit() {


    this.route.params.subscribe(params => {

      if (!params['id']) {
        this.router.navigate(['/zone/social/profile', this.userService.profile.uuid]);
      } else {

        this.socialService.user.get(params['id']).subscribe((res: any) => {
            this.userInfo = res.data;

            let uuid = this.userService.profile.uuid;
            this.hasFriends = _.some(res.data.friends, {'uuid': uuid});
          },
          error => {
            this.errorMessage = <any>error;
          }
        );
      }


    });
  }

  onAddfriend() {
    let body = {
      inviter_id: this.userService.profile.uuid,
      accepter_id: this.userInfo.uuid
    };

    this.socialService.user.addFriend(body).subscribe(
      (res: any) => {
        this.showFollow = true;
        console.log(res);
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  onUnfriend() {
    let unfriend = {
      'inviter_id': this.userService.profile.uuid,
      'accepter_id': this.userInfo.uuid
    };
    this.socialService.user.removeFriend(JSON.stringify(unfriend)).subscribe(
      (res: any) => {
        console.log(res);
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  onUnfollow() {
    this.showFollow = false;

    //@todo post to api
  }
}
