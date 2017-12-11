import { Component } from '@angular/core';
import { UserService } from '../../../shared/shared/services/user.service';
import { Constants } from '../../../shared/constant/config/constants';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'portal-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class PortalHeaderComponent {
  logoUrl: string = Constants.baseUrls.cdn + '/logo/logo.png';
  isLoggedIn:boolean = false;

  constructor(private userService: UserService) {
    console.log('cdn link:::', Constants.baseUrls.cdn);
    this.isLoggedIn = this.userService.loggedIn;
  }
}
