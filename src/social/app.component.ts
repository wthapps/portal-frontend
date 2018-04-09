import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from '@angular/core';
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
  currentRoute: string = 'primary';
  primaryFirstLoad: boolean = false;
  readonly PRIMARY: string = 'primary';

  // confirmInfo$: Observable<ConfirmInfo>;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
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

  onActivate(event) {
    if(!event || !event.route) {
      this.primaryFirstLoad ? this.router.navigate([{ outlets: { modal: null, detail: null } }]) : this.primaryFirstLoad = true;
      return;
    }
    this.currentRoute = event.route.outlet;

    if(this.currentRoute === this.PRIMARY)
      this.router.navigate([{ outlets: { modal: null, detail: null } }]);
  }

  onDeactivate(event) {
    this.currentRoute = this.PRIMARY;
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
