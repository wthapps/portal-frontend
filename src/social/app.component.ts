import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { Config } from '@wth/shared/constant';


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

  // confirmInfo$: Observable<ConfirmInfo>;

  constructor(private router: Router) {
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
