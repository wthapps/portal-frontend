import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

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
  relationships: any;
  selectedTab: string;
  items: any;

  constructor(private socialService: SocialService,
              private userService: UserService,
              private route: ActivatedRoute,
              private profileDataService: ZSocialProfileDataService) {
    // this.selectedTab = PROFILE_TAB.posts;
  }

  ngOnInit() {

    this.route.params.switchMap((params: any) =>
      Observable.forkJoin(
        this.socialService.user.get(params['id']),
        this.getRelationship(params['id'])
      )
    )
    .subscribe((res: any) => {
      this.userInfo = res[0].data;
      this.userInfo.canEdit = (this.userInfo.uuid === this.userService.profile.uuid);

      this.actions = _.get(res[0], 'actions', []);
      this.relationships = res[1].relationships;

      this.profileDataService.addData({'userInfo': this.userInfo, 'actions' : this.actions, 'relationships': this.relationships} ); // Update userInfo to children in router-outlet
    });
  }

  getRelationship(uuid: any): Promise<any> {
      if (this.userService.profile.uuid != uuid) {
        return this.socialService.user.getRelationShips(uuid)
          .toPromise()
          .then((res: any) => {
              return { relationships: res.data };
            },
          );
      } else {
        return Promise.resolve({relationships: undefined});
      }
  }
}

