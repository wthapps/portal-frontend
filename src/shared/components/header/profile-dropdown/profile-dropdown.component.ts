import { Component, OnInit, Input } from '@angular/core';
import { Constants } from "@shared/constant";
import { User } from "@shared/shared/models";
import { AuthService } from '@wth/shared/services';

@Component({
  selector: 'profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropDownComponent implements OnInit {
  @Input() user: User;
  tooltip: any = Constants.tooltip;
  urls: any = Constants.baseUrls;
  defaultAvatar: string = Constants.img.avatar;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
  }

}
