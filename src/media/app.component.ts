import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { Constants, Config } from '@wth/shared/constant';
import { ConfirmDialogModel } from '@wth/shared/shared/models/confirm-dialog.model';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
// import { AppSandbox } from './app.sandbox';
import { State } from './shared/store';
import { Store } from '@ngrx/store';
import { AuthService } from '@wth/shared/services';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('introduction') introduction: IntroductionModalComponent;

  routerSubscription: Subscription;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  constructor(
    public authService: AuthService,
    private router: Router,
    private wthConfirmService: WthConfirmService,
    mediaStore: Store<State>
  ) {

    this.wthConfirmService.confirmDialog$.subscribe(
      (res: any) => {
        this.confirmDialog = res;
      }
    );
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngAfterViewInit() {
    if (!this.authService.user.introduction || !this.authService.user.introduction.media) {
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
