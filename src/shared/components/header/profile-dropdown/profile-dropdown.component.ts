import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Constants } from '@shared/constant';
import { User } from '@shared/shared/models';
import { AuthService } from '@wth/shared/services';
import { SubscriptionService } from '@shared/common/subscription';

declare var $: any;

@Component({
  selector: 'profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropDownComponent implements AfterViewInit {
  @Input() user: User;
  subscription: any;

  readonly tooltip: any = Constants.tooltip;
  readonly urls: any = Constants.baseUrls;
  readonly defaultAvatar: string = Constants.img.avatar;

  constructor(private authService: AuthService, private subscriptionService: SubscriptionService) {
  }

  ngAfterViewInit (): void {
    // $('#dropdown-menu-profile').on('shown.bs.dropdown', () => {
      if (this.authService.isAuthenticated()) {
        this.subscriptionService.getCurrent().subscribe(response => {
          this.subscription = response.data.attributes;
        });
      }
    // });
  }

  logout() {
    this.authService.logout();
  }

}
