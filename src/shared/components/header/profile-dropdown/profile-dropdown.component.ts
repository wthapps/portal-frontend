import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Constants } from '@shared/constant';
import { User } from '@shared/shared/models';
import { AuthService } from '@wth/shared/services';
import { SubscriptionService } from '@shared/common/subscription';

@Component({
  selector: 'profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropDownComponent implements OnInit {
  @Input() user: User;
  subscription: any;

  readonly tooltip: any = Constants.tooltip;
  readonly urls: any = Constants.baseUrls;
  readonly defaultAvatar: string = Constants.img.avatar;

  constructor(private authService: AuthService, private subscriptionService: SubscriptionService) {
  }

  ngOnInit(): void {

    if (this.authService.isAuthenticated()) {
      this.subscriptionService.getCurrent().subscribe(response => {
        console.log('this.auService::::', response.data.attributes);
        this.subscription = response.data.attributes;
      });
    }
  }

  logout() {
    this.authService.logout();
  }

}
