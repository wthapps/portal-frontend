import { Component } from '@angular/core';
import { UserService } from '../../../core/shared/services/user.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'portal-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})
export class PortalSharedHeaderComponent {
  isLoggedIn:boolean = false;

  constructor(private userService: UserService) {
    this.isLoggedIn = this.userService.loggedIn;
  }
}
