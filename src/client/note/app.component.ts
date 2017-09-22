import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import { ZNoteAddFolderModalComponent } from './shared/modals/add-folder/add-folder-modal.component';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../core/shared/services/apibase.service';


/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  @ViewChild('addFolder') addFolder: ZNoteAddFolderModalComponent;

  constructor(private router: Router, private commonEventService: CommonEventService, private apiBaseService: ApiBaseService) {
    console.log('Environment config', Config);
    this.commonEventService.filter((event: any) => event.channel == 'menuCommonEvent').subscribe((event: any) => {
      this.addFolder.open();
    })
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
    this.apiBaseService.get('note/folders').subscribe((res: any) => {
      this.commonEventService.broadcast({channel: "noteCommonEvent", action: "updateFolders", payload: res.data})
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
