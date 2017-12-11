import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { UserService } from '../shared/shared/services/user.service';
import { Config } from '../shared/constant/config/env.config';

declare let $: any;

/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    if (this.userService.loggedIn && !this.userService.profile.took_a_tour) {
      // window.location.href = Constants.baseUrls.myAccount;
    }

    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;

        // auto close menu on mobile
        $('#wth-navbar-collapse-1').collapse('hide');
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
