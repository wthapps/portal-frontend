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
  }

  ngOnDestroy() {
  }
}
