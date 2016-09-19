import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {
  UserService,
} from '../../shared/index';

/**
 * This class represents the footer component.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-footer',
  templateUrl: 'footer.component.html',
  directives: [ROUTER_DIRECTIVES]
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
  templateUrl: 'footer-promotion.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class FooterPromotionComponent {
}

