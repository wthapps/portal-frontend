import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'wth-footer',
  templateUrl: 'footer.component.html'
})
export class FooterComponent implements OnInit {
  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.userService.loggedIn;
  }
}

@Component({
  moduleId: module.id,
  selector: 'wth-footer-promotion',
  templateUrl: 'footer-promotion.component.html'
})
export class FooterPromotionComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
