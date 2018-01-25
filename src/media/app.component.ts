import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { Constants, Config } from '@wth/shared/constant';
import { ConfirmDialogModel } from '@wth/shared/shared/models/confirm-dialog.model';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { AppSandbox } from './app.sandbox';
import { State } from './shared/store/index';
import { Store } from '@ngrx/store';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [AppSandbox]
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  constructor(
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

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  onAction(e: any) {
    console.log(e);
  }
}
