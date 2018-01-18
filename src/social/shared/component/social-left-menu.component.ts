import { Component, OnInit } from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { WTHNavigateService, UserService, CommonEventService, ApiBaseService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'z-social-left-menu',
  templateUrl: 'social-left-menu.component.html'
})

export class ZSocialLeftMenuComponent {
  tooltip: any = Constants.tooltip;
  homeMenuItem: any;
  socialMenu = Constants.socialMenuItems;
  shortcuts$: Observable<any>;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private store: Store<any>,
              private wthConfirmService: WthConfirmService,
              private commonEventService: CommonEventService) {
    this.homeMenuItem = Constants.socialMenuItems[0];
    this.socialMenu = Constants.socialMenuItems.splice(1);
    this.store.dispatch({type: fromRoot.SHORTCUT_LOAD});
    this.shortcuts$ = this.store.select(fromRoot.getShortcuts);
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
