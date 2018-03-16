import { Component, OnDestroy } from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { WTHNavigateService, UserService } from '@wth/shared/services';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../reducers/index';
import { interval } from 'rxjs/observable/interval';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { POSTS_COUNT_LOAD } from '../reducers/index';
import { POSTS_COUNT_LOAD_DONE } from '../reducers/index';
import { SHORTCUT_LOAD } from '@social/shared/reducers';
import { SHORTCUT_ACCESSED } from '@social/shared/reducers';

@Component({
  selector: 'z-social-left-menu',
  templateUrl: 'social-left-menu.component.html',
  styleUrls: ['social-left-menu.component.scss']
})

export class ZSocialLeftMenuComponent implements OnDestroy {
  tooltip: any = Constants.tooltip;
  homeMenuItem: any;
  communitiesMenuItem: any;
  socialMenu = Constants.socialMenuItems;
  shortcuts$: Observable<any>;
  newPostsCount$: Observable<any>;
  uuid: string;

  shortcutsExpand: boolean = false;
  readonly COUNT_DISPLAY: any = {
    '0': ' ',
    '10': '10+'
  };
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private navigateService: WTHNavigateService,
              private store: Store<any> ) {
    [this.homeMenuItem, this.communitiesMenuItem, ...this.socialMenu] = Constants.socialMenuItems;
    this.store.dispatch({type: fromRoot.SHORTCUT_LOAD});
    this.shortcuts$ = this.store.select(fromRoot.getShortcuts);
    this.newPostsCount$ = this.store.select(fromRoot.getNewPostsCount);
    this.uuid = this.userService.getSyncProfile().uuid;
    this.countNewPostsEvery1min();
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  onSubMenu(link: string) {
    if (this.router.url.indexOf('communities') == -1) {
      this.clearOutlets().then(() => this.navigateService.navigateOrRedirect(link));
    }
  }

  onShortcutAccessed(shortcut: any) {
    this.store.dispatch({type: SHORTCUT_ACCESSED, payload: shortcut.id});
  }

  reloadHome() {
    let time = new Date().getTime();
    this.store.dispatch({type: POSTS_COUNT_LOAD_DONE, payload: 0});
    this.router.navigate(['/home'], {queryParams: {r: time}, relativeTo: this.route});
  }

  countNewPostsEvery1min() {
    interval(60000).pipe(
      takeUntil(this.destroySubject)
      )
      .subscribe(() => {
      console.debug('counting ...');
      this.store.dispatch({type: POSTS_COUNT_LOAD});
      this.store.dispatch({type: SHORTCUT_LOAD});
      });
  }

  clearOutlets(): Promise<any> {
    return this.router.navigate([{outlets: {modal: null, detail: null}}]);
  }
}
