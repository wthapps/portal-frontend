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
  // currentRoute: string = 'primary';
  activeOutlets: {[id: string]: boolean} = {'primary': true};
  primaryFirstLoad: boolean = false;
  readonly PRIMARY: string = 'primary';

  // confirmInfo$: Observable<ConfirmInfo>;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
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
    if(!event || !event.route || event.route.outlet === this.PRIMARY) {
      this.primaryFirstLoad ? this.router.navigate([{ outlets: { modal: null, detail: null } }]) : this.primaryFirstLoad = true;
      return;
    }
    // this.currentRoute = event.route.outlet;
    this.activeOutlets[event.route.outlet] = true;
  }

  onDeactivate(event) {
    if(!event || !event.route) {
      return;
    }
    this.activeOutlets[event.route.outlet] = false;
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
