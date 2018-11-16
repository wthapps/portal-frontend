import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '@wth/shared/services';
import { PromptUpdateService } from '@shared/services/service-worker/prompt-update.service';

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

  constructor(public authService: AuthService, private router: Router,
    private prompUpdate: PromptUpdateService) {}

  ngOnInit() {
    // if (this.authService.loggedIn && this.authService.user && !this.authService.user.took_a_tour) {
    //   window.location.href = Constants.baseUrls.myAccount;
    // }

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        document.body.scrollTop = 0;

        // auto close menu on mobile
        $('#wth-navbar-collapse-1').collapse('hide');
      });

    // fix scroll to top after changing route
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
