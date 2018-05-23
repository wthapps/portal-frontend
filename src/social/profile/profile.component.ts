import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { SocialService } from '../shared/services/social.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ZSocialProfileDataService } from './profile-data.service';
import { AuthService, UserService } from '@wth/shared/services';

@Component({
  selector: 'z-social-profile',
  templateUrl: 'profile.component.html'
})
export class ZSocialProfileComponent implements OnInit {
  uuid: any;
  userInfo: any;
  actions: Array<any>;
  relationships: any;
  items: any;
  loading: boolean = true;

  constructor(
    public authService: AuthService,
    private socialService: SocialService,
    private userService: UserService,
    private route: ActivatedRoute,
    private profileDataService: ZSocialProfileDataService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: any) =>
          forkJoin(
            this.socialService.user.get(params['id']),
            this.getRelationship(params['id'])
          )
        )
      )
      .subscribe(([user, relationship]) => {
        this.loading = false;
        this.userInfo = user.data;
        this.userInfo.canEdit =
          this.userInfo.uuid === this.authService.user.uuid;

        this.actions = _.get(user, 'actions', []);
        this.relationships = relationship.relationships;

        this.profileDataService.addData({
          userInfo: this.userInfo,
          actions: this.actions,
          relationships: this.relationships
        }); // Update userInfo to children in router-outlet
      }, err => this.loading = false);
  }

  getRelationship(uuid: any): Promise<any> {
    if (this.authService.user.uuid !== uuid) {
      return this.socialService.user
        .getRelationShips(uuid)
        .toPromise()
        .then((res: any) => {
          return { relationships: res.data };
        });
    } else {
      return Promise.resolve({ relationships: undefined });
    }
  }
}
