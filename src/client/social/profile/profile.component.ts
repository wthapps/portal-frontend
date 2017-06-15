import { Component, OnInit, ViewChild } from '@angular/core';
import { SocialService } from '../shared/services/social.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/shared/services/user.service';
import { ZSocialProfileDataService } from './profile-data.service';

declare var _: any;
export let PROFILE_TAB = {
  posts: 'posts',
  about: 'about',
  friend: 'friends'
};

@Component({
  moduleId: module.id,
  selector: 'z-social-profile',
  templateUrl: 'profile.component.html'
})

export class ZSocialProfileComponent implements OnInit {

  uuid: any;
  userInfo: any;
  actions: Array<any>;
  selectedTab: string;
  items: any;

  constructor(private socialService: SocialService,
              private userService: UserService,
              private route: ActivatedRoute,
              private profileDataService: ZSocialProfileDataService) {
    // this.selectedTab = PROFILE_TAB.posts;
  }

  ngOnInit() {

    // // this.loadingService.start('.zone-social-cover');
    this.route.params.switchMap((params: any) =>
      this.socialService.user.get(params['id'])
    )
      .subscribe((res: any) => {
        this.userInfo = res.data;
        this.userInfo.canEdit = (this.userInfo.uuid === this.userService.profile.uuid);

        this.actions = _.get(res, 'actions', []);

        this.profileDataService.addData({'userInfo': this.userInfo, 'actions' : this.actions} ); // Update userInfo to children in router-outlet
      });

  }
}
