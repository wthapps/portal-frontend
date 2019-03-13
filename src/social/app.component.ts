import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Config } from '@wth/shared/constant';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { AuthService } from '@wth/shared/services';
import { routeAnimation } from '@wth/shared/shared/animations/route.animation';
import { PageVisibilityService } from './../shared/services/page-visibility.service';

/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [ routeAnimation ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('introduction') introduction: IntroductionModalComponent;

  routerSubscription: Subscription;
  activeOutlets: {[id: string]: boolean} = {'primary': true, 'detail': false, 'modal': false};
  readonly PRIMARY: string = 'primary';

  constructor(public authService: AuthService,
    private visibilityService: PageVisibilityService,
    private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

      this.visibilityService.reloadIfProfileInvalid();
  }

  ngAfterViewInit() {
    if (
      !this.authService.user.introduction ||
      !this.authService.user.introduction.social
    ) {
      this.introduction.open();
    }
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  onActivate(event) {
    const outlet = (!event || !event.route) ? this.PRIMARY : event.route.outlet;
    this.activeOutlets[outlet] = true;
    if ( outlet === this.PRIMARY && (this.activeOutlets['modal'] || this.activeOutlets['detail']) ) {
      this.router.navigate([{ outlets: { modal: null, detail: null } }]);
      return;
    }
  }

  onDeactivate(event) {
    const outlet = (!event || !event.route) ? this.PRIMARY : event.route.outlet;
    this.activeOutlets[outlet] = false;
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
