import {Component} from '@angular/core';

import {
  UserService
} from '../../shared/index';

/**
 * This class represents the footer component.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-footer',
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
  constructor(private _userService:UserService) {
  }

  isLoggedIn() {
    // Check if there's an unexpired JWT
    return this._userService.loggedIn;
  }
}

/**
 * This class represents the footer promotion.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-footer-promotion',
  templateUrl: 'footer-promotion.component.html'
})
export class FooterPromotionComponent {
}

