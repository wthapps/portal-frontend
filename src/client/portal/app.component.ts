import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import { UserService } from '../core/shared/services/user.service';
import { Constants } from '../core/shared/config/constants';

declare let $: any;

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  constructor(private router: Router,
              private userService: UserService) {
    console.log('Environment config', Config);
  }

  ngOnInit() {
    if (this.userService.loggedIn && !this.userService.profile.took_a_tour) {
      window.location.href = Constants.baseUrls.myAccount;
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
