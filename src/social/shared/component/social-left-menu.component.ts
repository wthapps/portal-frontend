import { Component, OnInit } from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { WTHNavigateService, UserService, CommonEventService, ApiBaseService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

declare let _: any;

@Component({
  selector: 'z-social-left-menu',
  templateUrl: 'social-left-menu.component.html'
})

export class ZSocialLeftMenuComponent {
  tooltip: any = Constants.tooltip;
  socialMenu = Constants.socialMenuItems;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private apiBaseService: ApiBaseService,
              private wthConfirmService: WthConfirmService,
              private commonEventService: CommonEventService) {

  }

  onSubMenu(link: string) {
    this.clearOutlets().then(() => this.navigateService.navigateOrRedirect(link));
  }

  clearOutlets(): Promise<any> {
    return this.router.navigate([{outlets: {modal: null, detail: null}}]);
  }
}
