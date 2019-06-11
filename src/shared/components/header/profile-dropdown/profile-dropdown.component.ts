import { Component, Input } from '@angular/core';
import { Constants } from '@shared/constant';
import { User } from '@shared/shared/models';
import { AuthService } from '@wth/shared/services';


@Component({
  selector: 'profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropDownComponent {
  @Input() user: User;
  @Input() subscription: any;

  readonly tooltip: any = Constants.tooltip;
  readonly urls: any = Constants.baseUrls;
  readonly defaultAvatar: string = Constants.img.avatar;

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }

}
