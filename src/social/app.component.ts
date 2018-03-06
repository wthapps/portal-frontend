import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { Config } from '@wth/shared/constant';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { AuthService } from '@wth/shared/services';


/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('introduction') introduction: IntroductionModalComponent;

  routerSubscription: Subscription;

  // confirmInfo$: Observable<ConfirmInfo>;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngAfterViewInit() {
    if (!this.authService.user.introduction || !this.authService.user.introduction.social) {
      this.introduction.open();
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
