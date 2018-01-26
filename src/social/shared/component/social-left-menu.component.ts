import { Component } from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { Router } from '@angular/router';
import { WTHNavigateService, UserService } from '@wth/shared/services';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'z-social-left-menu',
  templateUrl: 'social-left-menu.component.html',
  styleUrls: ['social-left-menu.component.scss']
})

export class ZSocialLeftMenuComponent {
  tooltip: any = Constants.tooltip;
  homeMenuItem: any;
  socialMenu = Constants.socialMenuItems;
  shortcuts$: Observable<any>;
  uuid: string;

  shortcutsExpand: boolean = false;
  readonly COUNT_DISPLAY: any = {
    '0': ' ',
    '10': '10+'
  }

  constructor(private userService: UserService,
              private router: Router,
              private navigateService: WTHNavigateService,
              private store: Store<any> ) {
    [this.homeMenuItem, ...this.socialMenu] = Constants.socialMenuItems;
    this.store.dispatch({type: fromRoot.SHORTCUT_LOAD});
    this.store.dispatch({type: fromRoot.SO_PROFILE_LOAD});
    this.shortcuts$ = this.store.select(fromRoot.getShortcuts);
    this.uuid = this.userService.getSyncProfile().uuid;
  }

  onSubMenu(link: string) {
    if (this.router.url.indexOf('communities') == -1) {
      this.clearOutlets().then(() => this.navigateService.navigateOrRedirect(link));
    }
  }

  clearOutlets(): Promise<any> {
    return this.router.navigate([{outlets: {modal: null, detail: null}}]);
  }
}
