import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

import { Config } from '../core/shared/config/env.config';
import { Constants } from '../core/shared/config/constants';
import { ConfirmDialogModel } from '../core/shared/models/confirm-dialog.model';
import { WTHConfirmService, ConfirmInfo } from '../core/shared/services/wth-confirm.service';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';



/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  confirmInfo$: Observable<ConfirmInfo>;

  constructor(private router: Router,
              private wthConfirmService: WTHConfirmService) {
    console.log('Environment config', Config);

    this.confirmInfo$ = this.wthConfirmService.confirmDialog$
      .do((res: any) => console.debug('confirmInfo$ : ', res));
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
