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
  relationships: any;

  // noneFriend: 0,
  // pending: 1,
  // accepted: 2,
  // rejected: 3,
  // unfriend: 4,
  // blocked: 5,

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

        if (this.userService.profile.uuid != params['id']) {
          this.socialService.user.getRelationShips(params['id']).subscribe((res: any) => {
              this.relationships = res.data;
              console.log(res);
            },
          );
        }
      }


    });
  }

  onAddfriend() {

    this.socialService.user.addFriend(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      }
    );
  }

  onUnfriend() {
    this.socialService.user.unfriend(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
        console.log(res);
      },
    );
  }

  onCancelRequest() {
    this.socialService.user.cancelFriendRequest(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
        console.log(res);
      },
    );
  }
}
