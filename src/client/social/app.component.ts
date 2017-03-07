import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Config } from '../core/shared/config/env.config';

import { Subscription } from 'rxjs/Rx';
import './operators';
import 'rxjs/add/operator/filter';
import { SocialDataService } from './shared/services/social-data.service';

declare let $ : any;
declare let _ : any;
/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  constructor(private router: Router,
              private socialDataService: SocialDataService) {
    console.log('Environment config', Config);
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

  debounceOnScroll = _.debounce((event:any) => this.onScroll(event), 500, {});

  onScroll(event: any) {
    let elem = $('.page-body-content');

    if ( !this.isLoadingDone() && elem[0].scrollHeight  - elem.scrollTop() - 10 <= elem.outerHeight() ) {
      this.loadMoreItems();
      console.log('Load more items');
    }
  }

  isLoadingDone() {
    return this.socialDataService.loadingDone;
  }

  loadMoreItems() {
    this.socialDataService.loadItem();
  }
}
