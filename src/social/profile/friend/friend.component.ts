import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { takeUntil, switchMap, tap, combineLatest } from 'rxjs/operators';

import { SocialService } from '../../shared/services/social.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { UserService } from '@wth/shared/services';

export interface FTAB {
  friends: boolean,
  follower: boolean,
  following: boolean
}
const DEFAULT_TABS: FTAB = {
    friends: false,
    follower: false,
    following: false
}

@Component({
  selector: 'z-social-profile-friend',
  templateUrl: 'friend.component.html'
})
export class ZSocialProfileFriendComponent implements OnInit, OnDestroy {
  userInfo:any;
  list:any;
  loading: boolean = true;
  activeTab: FTAB = DEFAULT_TABS;
  readonly FRIEND = 'friends';
  readonly FOLLOWER = 'follower';
  readonly FOLLOWING = 'following';
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    public userService: UserService,
    private socialService: SocialService,
              private route: ActivatedRoute) {
    this.route.paramMap
      .pipe(
        tap(_ => this.loading = true),
        combineLatest(this.route.parent.paramMap, (paramMap, parentParamMap) => [paramMap.get('id') || parentParamMap.get('id'), paramMap.get('connection')]),
        switchMap(([uuid, connection]) => this.getDataList(connection, uuid)),
        takeUntil(this.destroySubject.asObservable())
      )
      .subscribe(
        (res: any) => {
          this.list = res.data;
          this.loading = false;
          // this.userInfo = res.data;
        }, err => this.loading = false);
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  ngOnInit() {
  }

  onLoadMore() {
  //
  }

  getDataList(connection: string, uuid: string): Observable<any> {
    this.activeTab = {...DEFAULT_TABS, [connection]: true};
    switch (connection) {
      case this.FRIEND:
        return this.socialService.user.getFriends(uuid);
      case this.FOLLOWER:
        return this.socialService.user.getFollowerList(uuid);
      case this.FOLLOWING:
        return this.socialService.user.getFollowingList(uuid);
      default:
        console.warn('Unhandled connection type: ', connection);
        return of([]);
    }
  }
}
