import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { takeUntil, switchMap, tap } from 'rxjs/operators';

import { SocialService } from '../../shared/services/social.service';

@Component({
  selector: 'z-social-profile-friend',
  templateUrl: 'friend.component.html'
})

export class ZSocialProfileFriendComponent implements OnInit, OnDestroy {
  userInfo:any;
  list:any;
  loading: boolean = true;
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private socialService: SocialService,
              private route: ActivatedRoute) {
    this.route.params
      .pipe(
        tap(_ => this.loading = true),
        switchMap((params: any) => this.socialService.user.getFriends(params['id'])),
        takeUntil(this.destroySubject.asObservable())
      )
      .subscribe(
        (res: any) => {
          console.log(res);
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
}
