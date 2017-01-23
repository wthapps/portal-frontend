import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Config } from './shared/config/env.config';

import { Subscription } from 'rxjs/Rx';
import './operators';
import 'rxjs/add/operator/filter';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  constructor(private router: Router) {
    console.log('Environment config', Config);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
