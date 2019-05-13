import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Constants } from '@wth/shared/constant';
import { ConfirmDialogModel } from '@wth/shared/shared/models/confirm-dialog.model';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
// import { AppSandbox } from './app.sandbox';
import { AuthService } from '@wth/shared/services';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { PageVisibilityService } from './../shared/services/page-visibility.service';

declare let ga: Function;

const CURRENT_MODULE = 'photos';
/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    'app.component.scss',
    'app-new.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('introduction') introduction: IntroductionModalComponent;

  routerSubscription: Subscription;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  constructor(
    public authService: AuthService,
    private router: Router,
    private visibilityService: PageVisibilityService,
    private wthConfirmService: WthConfirmService
  ) {
    this.wthConfirmService.confirmDialog$.subscribe((res: any) => {
      this.confirmDialog = res;
    });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        document.body.scrollTop = 0;

        ga('set', 'page', `/${CURRENT_MODULE}${event.urlAfterRedirects}`);
        ga('send', 'pageview');
      });
    // fix scroll to top after changing route
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.visibilityService.reloadIfProfileInvalid();
  }

  ngAfterViewInit() {
    if (
      !this.authService.user.introduction ||
      !this.authService.user.introduction.media
    ) {
      this.introduction.open();
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  onAction(e: any) {
    console.log(e);
  }
}
